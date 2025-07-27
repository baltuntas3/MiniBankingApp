package com.mini.MiniBankingApp.infrastructure.repository;

import com.mini.MiniBankingApp.domain.account.Account;
import com.mini.MiniBankingApp.infrastructure.projection.AccountBalanceProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AccountRepository extends JpaRepository<Account, UUID> {
    Optional<Account> findByNumber(String number);
    Optional<Account> findByName(String name);
    List<Account> findByUserId(UUID userId);
    
    /**
     * Finds account balance projection by account ID
     * Spring Data JPA automatically generates query to fetch only balance field
     */
    Optional<AccountBalanceProjection> findProjectedById(UUID accountId);
}