package com.mini.MiniBankingApp.domain.account;

import com.mini.MiniBankingApp.domain.common.BaseEntity;
import com.mini.MiniBankingApp.exception.InsufficientFundsException;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "accounts")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "account_type", discriminatorType = DiscriminatorType.STRING)
@Getter
@NoArgsConstructor
public abstract class Account extends BaseEntity {
    
    @Column(name = "user_id", nullable = false)
    private UUID userId;
    
    @Column(name = "account_number", unique = true, nullable = false)
    private String number;
    
    @Column(name = "account_name", nullable = false)
    private String name;
    
    @Column(name = "balance", precision = 19, scale = 2, nullable = false)
    private BigDecimal balance;
    
    public Account(UUID userId, String number, String name, BigDecimal initialBalance) {
        super();
        this.userId = userId;
        this.number = number;
        this.name = name;
        this.balance = initialBalance != null ? initialBalance : BigDecimal.ZERO;
    }
    
    public void deposit(BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Deposit amount must be positive");
        }
        this.balance = this.balance.add(amount);
    }
    
    public void withdraw(BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Withdrawal amount must be positive");
        }
        if (this.balance.compareTo(amount) < 0) {
            throw new InsufficientFundsException("Insufficient balance. Current balance: " + this.balance);
        }
        this.balance = this.balance.subtract(amount);
    }
    
    public void changeName(String newName) {
        if (newName == null || newName.trim().isEmpty()) {
            throw new IllegalArgumentException("Account name cannot be empty");
        }
        this.name = newName.trim();
    }
}