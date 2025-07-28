package com.mini.MiniBankingApp.domain.account;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@DiscriminatorValue("DOLLAR")
@NoArgsConstructor
public class DollarAccount extends Account {
    
    public DollarAccount(UUID userId, String number, String name, BigDecimal initialBalance) {
        super(userId, number, name, initialBalance);
    }
}