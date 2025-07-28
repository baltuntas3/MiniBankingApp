package com.mini.MiniBankingApp.infrastructure.security;

import com.mini.MiniBankingApp.domain.user.User;
import com.mini.MiniBankingApp.exception.UserNotFoundException;
import com.mini.MiniBankingApp.infrastructure.repository.AccountRepository;
import com.mini.MiniBankingApp.infrastructure.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * Service for Spring Security expression-based access control
 */
@Service("accountAccess")
@RequiredArgsConstructor
public class AccountAccessService {
    
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    
    /**
     * Checks if the current authenticated user owns the specified account
     */
    public boolean hasAccountAccess(UUID accountId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return false;
        }
        
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        
        return accountRepository.findByIdAndUserId(accountId, user.getId()).isPresent();
    }
    
    /**
     * Checks if the current authenticated user owns the source account in a transfer request
     */
    public boolean hasTransferAccess(UUID fromAccountId) {
        return hasAccountAccess(fromAccountId);
    }
}