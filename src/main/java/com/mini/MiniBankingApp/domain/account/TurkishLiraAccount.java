package com.mini.MiniBankingApp.domain.account;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@DiscriminatorValue("TRY")
@NoArgsConstructor
public class TurkishLiraAccount extends Account {
    
    public TurkishLiraAccount(UUID userId, String number, String name, BigDecimal initialBalance) {
        super(userId, number, name, initialBalance);
    }
}