package com.mini.MiniBankingApp.application.service;

import com.mini.MiniBankingApp.application.dto.MoneyTransferResponse;
import com.mini.MiniBankingApp.application.dto.TransactionHistoryResponse;
import com.mini.MiniBankingApp.application.mapper.TransactionHistoryMapper;
import com.mini.MiniBankingApp.domain.account.Account;
import com.mini.MiniBankingApp.domain.user.User;
import com.mini.MiniBankingApp.exception.AccountNotFoundException;
import com.mini.MiniBankingApp.domain.transaction.Transaction;
import com.mini.MiniBankingApp.domain.transaction.TransactionStatus;
import com.mini.MiniBankingApp.exception.UserNotFoundException;
import com.mini.MiniBankingApp.exception.CurrencyMismatchException;
import com.mini.MiniBankingApp.infrastructure.projection.AccountBalanceProjection;
import com.mini.MiniBankingApp.infrastructure.repository.AccountRepository;
import com.mini.MiniBankingApp.infrastructure.repository.TransactionRepository;
import com.mini.MiniBankingApp.infrastructure.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class MoneyTransferService {
    
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final TransactionHistoryMapper transactionHistoryMapper;
    private final TransactionLogService transactionLogService;
    
    @Transactional
    public Transaction transfer(String username, UUID fromAccountId, UUID toAccountId, BigDecimal amount) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        
        if (fromAccountId.equals(toAccountId)) {
            throw new IllegalArgumentException("Cannot transfer to the same account");
        }
        
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Transfer amount must be positive");
        }
        
        // Verify user owns the source account
        Account fromAccount = accountRepository.findByIdAndUserId(fromAccountId, user.getId())
            .orElseThrow(() -> new AccountNotFoundException("Source account not found or access denied"));
            
        Account toAccount = accountRepository.findById(toAccountId)
            .orElseThrow(() -> new AccountNotFoundException("Target account not found: " + toAccountId));
        
        try {
            // Check if both accounts have the same currency type
            if (!fromAccount.getClass().equals(toAccount.getClass())) {
                throw new CurrencyMismatchException("Cannot transfer between different currency types. Source: " + 
                    fromAccount.getClass().getSimpleName() + ", Target: " + toAccount.getClass().getSimpleName());
            }
            
            fromAccount.withdraw(amount);
            toAccount.deposit(amount);
            
            accountRepository.save(fromAccount);
            accountRepository.save(toAccount);
            
            Transaction transaction = new Transaction(fromAccountId, toAccountId, amount);
            Transaction savedTransaction = transactionRepository.save(transaction);
            
            log.info("Money transfer completed successfully. Transaction ID: {}, From: {}, To: {}, Amount: {}", 
                    savedTransaction.getId(), fromAccountId, toAccountId, amount);
            
            return savedTransaction;
            
        } catch (Exception e) {
            transactionLogService.logFailedTransaction(fromAccountId, toAccountId, amount, e.getMessage());

            log.warn("Money transfer failed. From: {}, To: {}, Amount: {}, Error: {}",
                    fromAccountId, toAccountId, amount, e.getMessage());
            
            throw e;
        }
    }
    
    /**
     * Gets account balance using projection for performance optimization
     * @param accountId account ID
     * @return current balance
     */
    @Transactional(readOnly = true)
    public BigDecimal getAccountBalance(UUID accountId) {
        return accountRepository.findProjectedById(accountId)
            .map(AccountBalanceProjection::getBalance)
            .orElseThrow(() -> new AccountNotFoundException("Account not found: " + accountId));
    }
    
    /**
     * Gets transaction history for a specific account
     * @param username authenticated user
     * @param accountId account ID
     * @return list of transactions
     */
    @Transactional(readOnly = true)
    public List<TransactionHistoryResponse> getTransactionHistory(String username, UUID accountId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        
        // Verify account ownership
        accountRepository.findByIdAndUserId(accountId, user.getId())
                .orElseThrow(() -> new AccountNotFoundException("Account not found or access denied"));
        
        List<Transaction> transactions = transactionRepository.findByAccountIdOrderByCreatedAtDesc(accountId);

        return transactions.stream()
                .map(transaction -> transactionHistoryMapper.toHistoryResponse(transaction, accountId))
                .toList();
    }
}