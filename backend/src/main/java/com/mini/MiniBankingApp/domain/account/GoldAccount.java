package com.mini.MiniBankingApp.domain.account;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@DiscriminatorValue("GOLD")
@NoArgsConstructor
public class GoldAccount extends Account {
    
    public GoldAccount(UUID userId, String number, String name, BigDecimal initialBalance) {
        super(userId, number, name, initialBalance);
    }
}