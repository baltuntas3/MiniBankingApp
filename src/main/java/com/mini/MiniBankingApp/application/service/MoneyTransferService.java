package com.mini.MiniBankingApp.application.service;

import com.mini.MiniBankingApp.domain.account.Account;
import com.mini.MiniBankingApp.domain.account.AccountNotFoundException;
import com.mini.MiniBankingApp.domain.transaction.Transaction;
import com.mini.MiniBankingApp.infrastructure.projection.AccountBalanceProjection;
import com.mini.MiniBankingApp.infrastructure.repository.AccountRepository;
import com.mini.MiniBankingApp.infrastructure.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class MoneyTransferService {
    
    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    
    /**
     * Transfers money between two accounts
     * @param fromAccountId source account ID
     * @param toAccountId target account ID  
     * @param amount transfer amount
     * @return created transaction
     */
    public Transaction transfer(UUID fromAccountId, UUID toAccountId, BigDecimal amount) {
        
        // Validation
        if (fromAccountId.equals(toAccountId)) {
            throw new IllegalArgumentException("Cannot transfer to the same account");
        }
        
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Transfer amount must be positive");
        }
        
        // Get accounts
        Account fromAccount = accountRepository.findById(fromAccountId)
            .orElseThrow(() -> new AccountNotFoundException("Source account not found: " + fromAccountId));
            
        Account toAccount = accountRepository.findById(toAccountId)
            .orElseThrow(() -> new AccountNotFoundException("Target account not found: " + toAccountId));
        
        try {
            // Perform money transfer
            fromAccount.withdraw(amount);  // Balance check is done here
            toAccount.deposit(amount);
            
            // Save accounts
            accountRepository.save(fromAccount);
            accountRepository.save(toAccount);
            
            // Create transaction record
            Transaction transaction = new Transaction(fromAccountId, toAccountId, amount);
            
            return transactionRepository.save(transaction);
            
        } catch (Exception e) {
            // Create failed transaction record
            Transaction failedTransaction = new Transaction(fromAccountId, toAccountId, amount);
            failedTransaction.markAsFailed("Failed Transfer: " + e.getMessage());
            transactionRepository.save(failedTransaction);
            
            throw e; // Re-throw for transaction rollback
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
}