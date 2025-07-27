package com.mini.MiniBankingApp.infrastructure.projection;

import java.math.BigDecimal;

/**
 * Spring Data JPA Projection for Account Balance
 * Only fetches balance field from database for performance optimization
 */
public interface AccountBalanceProjection {
    
    BigDecimal getBalance();
}