package com.mini.MiniBankingApp.application.service;

import com.mini.MiniBankingApp.domain.transaction.Transaction;
import com.mini.MiniBankingApp.infrastructure.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class TransactionLogService {
    
    private final TransactionRepository transactionRepository;
    
    /**
     * Logs failed transaction in its own transaction
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logFailedTransaction(UUID fromAccountId, UUID toAccountId, BigDecimal amount, String errorMessage) {
        try {
            Transaction failedTransaction = Transaction.createFailedTransaction(fromAccountId, toAccountId, amount);
            transactionRepository.save(failedTransaction);

            log.debug("Failed transaction logged successfully. From: {}, To: {}, Amount: {}", 
                    fromAccountId, toAccountId, amount);
        } catch (Exception e) {
            log.error("Failed to log failed transaction: {}", e.getMessage());
            e.printStackTrace();
        }
    }
}