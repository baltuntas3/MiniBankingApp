package com.mini.MiniBankingApp.application.mapper;

import com.mini.MiniBankingApp.application.dto.AccountResponse;
import com.mini.MiniBankingApp.domain.account.Account;
import com.mini.MiniBankingApp.domain.account.DollarAccount;
import com.mini.MiniBankingApp.domain.account.GoldAccount;
import com.mini.MiniBankingApp.domain.account.TurkishLiraAccount;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AccountMapper {
    
    /**
     * Maps Account domain entity to AccountResponse DTO
     */
    @Mapping(target = "id", source = "id")
    @Mapping(target = "number", source = "number")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "balance", source = "balance")
    @Mapping(target = "createdAt", source = "createdAt")
    @Mapping(target = "updatedAt", source = "updatedAt")
    @Mapping(target = "accountType", expression = "java(getAccountType(account))")
    AccountResponse toResponse(Account account);
    
    /**
     * Determines account type based on account instance
     */
    default String getAccountType(Account account) {
        return switch (account) {
            case TurkishLiraAccount ignored -> "TRY";
            case DollarAccount ignored -> "USD";
            case GoldAccount ignored -> "GOLD";
            default -> "UNKNOWN";
        };
    }
}