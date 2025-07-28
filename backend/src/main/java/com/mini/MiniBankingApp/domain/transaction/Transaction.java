package com.mini.MiniBankingApp.domain.transaction;

import com.mini.MiniBankingApp.domain.common.LongBaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "transactions")
@Getter
@NoArgsConstructor
public class Transaction extends LongBaseEntity {
    
    @Column(name = "from_account_id", nullable = false)
    private UUID fromAccountId;
    
    @Column(name = "to_account_id", nullable = false)
    private UUID toAccountId;
    
    @Column(name = "amount", nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TransactionStatus status;
    
    public Transaction(UUID fromAccountId, UUID toAccountId, BigDecimal amount) {
        super();
        if (fromAccountId == null || toAccountId == null) {
            throw new IllegalArgumentException("Account IDs cannot be null");
        }
        if (fromAccountId.equals(toAccountId)) {
            throw new IllegalArgumentException("Cannot transfer to the same account");
        }
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Transfer amount must be positive");
        }
        
        this.fromAccountId = fromAccountId;
        this.toAccountId = toAccountId;
        this.amount = amount;
        this.status = TransactionStatus.SUCCESS;
    }

    private Transaction(UUID fromAccountId, UUID toAccountId, BigDecimal amount, TransactionStatus status) {
        super();
        this.fromAccountId = fromAccountId;
        this.toAccountId = toAccountId;
        this.amount = amount;
        this.status = status;
    }

    public static Transaction createFailedTransaction(UUID fromAccountId, UUID toAccountId, BigDecimal amount) {
        return new Transaction(fromAccountId, toAccountId, amount, TransactionStatus.FAILED);
    }

    public void markAsFailed(String reason) {
        this.status = TransactionStatus.FAILED;
    }
    
    public void markAsSuccess() {
        this.status = TransactionStatus.SUCCESS;
    }
    
    public boolean isSuccessful() {
        return TransactionStatus.SUCCESS.equals(this.status);
    }
    
    public boolean isFailed() {
        return TransactionStatus.FAILED.equals(this.status);
    }
}