package com.mini.MiniBankingApp.application.mapper;

import com.mini.MiniBankingApp.domain.account.Account;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Mapper(componentModel = "spring")
public interface AccountMapper {
    
    /**
     * Maps Account domain entity to AccountResponse DTO
     */
    @Mapping(target = "id", source = "id")
    @Mapping(target = "userId", source = "userId")
    @Mapping(target = "number", source = "number")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "balance", source = "balance")
    @Mapping(target = "createdAt", source = "createdAt")
    @Mapping(target = "updatedAt", source = "updatedAt")
    AccountResponse toResponse(Account account);
    
    /**
     * AccountResponse DTO class (will be created when needed)
     */
    record AccountResponse(
        UUID id,
        UUID userId,
        String number,
        String name,
        BigDecimal balance,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
    ) {}
}