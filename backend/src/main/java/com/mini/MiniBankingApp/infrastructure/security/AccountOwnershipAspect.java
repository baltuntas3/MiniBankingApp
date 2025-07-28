package com.mini.MiniBankingApp.infrastructure.security;

import com.mini.MiniBankingApp.domain.user.User;
import com.mini.MiniBankingApp.exception.UserNotFoundException;
import com.mini.MiniBankingApp.infrastructure.repository.AccountRepository;
import com.mini.MiniBankingApp.infrastructure.repository.UserRepository;
import com.mini.MiniBankingApp.infrastructure.security.annotation.AccountId;
import com.mini.MiniBankingApp.infrastructure.security.annotation.RequireAccountOwnership;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.lang.annotation.Annotation;
import java.lang.reflect.Method;
import java.util.UUID;

@Aspect
@Component
@RequiredArgsConstructor
@Slf4j
public class AccountOwnershipAspect {
    
    private final AccountRepository accountRepository;
    private final UserRepository userRepository;
    
    @Before("@annotation(requireAccountOwnership)")
    public void checkAccountOwnership(JoinPoint joinPoint, RequireAccountOwnership requireAccountOwnership) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || 
            "anonymousUser".equals(authentication.getPrincipal())) {
            throw new AccessDeniedException("User not authenticated");
        }
        
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        
        UUID accountId = extractAccountId(joinPoint);
        if (accountId == null) {
            log.warn("Account ID not found in method parameters for ownership check");
            throw new AccessDeniedException("Account ID not provided");
        }
        
        boolean isOwner = accountRepository.findByIdAndUserId(accountId, user.getId()).isPresent();
        if (!isOwner) {
            log.warn("User {} attempted to access account {} without ownership", username, accountId);
            throw new AccessDeniedException("You don't have permission to access this account");
        }
        
        log.debug("Account ownership verified for user {} and account {}", username, accountId);
    }
    
    private UUID extractAccountId(JoinPoint joinPoint) {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        Object[] args = joinPoint.getArgs();
        Annotation[][] parameterAnnotations = method.getParameterAnnotations();
        
        for (int i = 0; i < parameterAnnotations.length; i++) {
            for (Annotation annotation : parameterAnnotations[i]) {
                if (annotation instanceof AccountId) {
                    Object arg = args[i];
                    if (arg instanceof UUID) {
                        return (UUID) arg;
                    } else if (arg != null) {
                        // Try to extract UUID from request objects
                        try {
                            if (arg.getClass().getMethod("getFromAccountId") != null) {
                                return (UUID) arg.getClass().getMethod("getFromAccountId").invoke(arg);
                            }
                        } catch (Exception ignored) {
                            // Fall through to other extraction methods
                        }
                    }
                }
            }
        }
        return null;
    }
}