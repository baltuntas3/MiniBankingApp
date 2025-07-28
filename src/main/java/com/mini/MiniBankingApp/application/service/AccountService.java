package com.mini.MiniBankingApp.application.service;

import com.mini.MiniBankingApp.application.dto.*;
import com.mini.MiniBankingApp.application.mapper.AccountMapper;
import com.mini.MiniBankingApp.domain.account.*;
import com.mini.MiniBankingApp.domain.user.User;
import com.mini.MiniBankingApp.exception.AccountNotFoundException;
import com.mini.MiniBankingApp.exception.UnauthorizedAccountAccessException;
import com.mini.MiniBankingApp.exception.UserNotFoundException;
import com.mini.MiniBankingApp.infrastructure.repository.AccountRepository;
import com.mini.MiniBankingApp.infrastructure.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class AccountService {
    
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    private final AccountMapper accountMapper;
    
    public AccountResponse createAccount(String username, AccountCreateRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        
        String accountNumber = generateAccountNumber();
        
        Account account = createAccountByType(
                request.getAccountType(),
                user.getId(),
                accountNumber,
                request.getName(),
                request.getInitialBalance()
        );
        
        Account savedAccount = accountRepository.save(account);
        return accountMapper.toResponse(savedAccount);
    }
    
    @Transactional(readOnly = true)
    public List<AccountResponse> searchAccounts(String username, AccountSearchRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        
        List<Account> accounts = accountRepository.searchAccounts(
                user.getId(),
                request.getNumber(),
                request.getName()
        );
        
        return accounts.stream()
                .map(accountMapper::toResponse)
                .toList();
    }
    
    public AccountResponse updateAccount(String username, UUID accountId, AccountUpdateRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        
        Account account = accountRepository.findByIdAndUserId(accountId, user.getId())
                .orElseThrow(() -> new AccountNotFoundException("Account not found or access denied"));
        
        account.changeName(request.getName());
        Account savedAccount = accountRepository.save(account);
        
        return accountMapper.toResponse(savedAccount);
    }
    
    public void deleteAccount(String username, UUID accountId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        
        Account account = accountRepository.findByIdAndUserId(accountId, user.getId())
                .orElseThrow(() -> new AccountNotFoundException("Account not found or access denied"));
        
        if (account.getBalance().compareTo(BigDecimal.ZERO) != 0) {
            throw new IllegalStateException("Cannot delete account with non-zero balance");
        }
        
        accountRepository.delete(account);
    }
    
    @Transactional(readOnly = true)
    public AccountResponse getAccountDetails(String username, UUID accountId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        
        Account account = accountRepository.findByIdAndUserId(accountId, user.getId())
                .orElseThrow(() -> new AccountNotFoundException("Account not found or access denied"));
        
        return accountMapper.toResponse(account);
    }
    
    private Account createAccountByType(String accountType, UUID userId, String number, String name, BigDecimal initialBalance) {
        return switch (accountType.toUpperCase()) {
            case "TRY" -> new TurkishLiraAccount(userId, number, name, initialBalance);
            case "USD" -> new DollarAccount(userId, number, name, initialBalance);
            case "GOLD" -> new GoldAccount(userId, number, name, initialBalance);
            default -> throw new IllegalArgumentException("Invalid account type: " + accountType);
        };
    }
    
    private String generateAccountNumber() {
        return "ACC" + System.currentTimeMillis();
    }
    
}