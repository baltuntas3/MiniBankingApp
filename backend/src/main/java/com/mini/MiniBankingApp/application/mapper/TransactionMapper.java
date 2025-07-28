package com.mini.MiniBankingApp.application.mapper;

import com.mini.MiniBankingApp.domain.transaction.Transaction;
import com.mini.MiniBankingApp.domain.transaction.TransactionStatus;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Mapper(componentModel = "spring")
public interface TransactionMapper {
    
    /**
     * Maps Transaction domain entity to TransactionResponse DTO
     */
    @Mapping(target = "id", source = "id")
    @Mapping(target = "fromAccountId", source = "fromAccountId")
    @Mapping(target = "toAccountId", source = "toAccountId")
    @Mapping(target = "amount", source = "amount")
    @Mapping(target = "transactionDate", source = "createdAt")
    @Mapping(target = "status", source = "status")
    TransactionResponse toResponse(Transaction transaction);
    
    /**
     * TransactionResponse DTO class (will be created when needed)
     */
    record TransactionResponse(
        Long id,
        UUID fromAccountId,
        UUID toAccountId,
        BigDecimal amount,
        LocalDateTime transactionDate,
        TransactionStatus status
    ) {}
}