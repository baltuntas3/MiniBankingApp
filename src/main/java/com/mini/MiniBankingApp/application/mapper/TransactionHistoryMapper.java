package com.mini.MiniBankingApp.application.mapper;

import com.mini.MiniBankingApp.application.dto.TransactionHistoryResponse;
import com.mini.MiniBankingApp.domain.transaction.Transaction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.UUID;

@Mapper(componentModel = "spring")
public interface TransactionHistoryMapper {
    
    /**
     * Maps Transaction entity to TransactionHistoryResponse DTO
     * @param transaction the transaction entity
     * @param accountId the account ID to determine transaction type
     * @return mapped response
     */
    @Mapping(target = "id", source = "transaction.id")
    @Mapping(target = "fromAccountId", source = "transaction.fromAccountId")
    @Mapping(target = "toAccountId", source = "transaction.toAccountId")
    @Mapping(target = "amount", source = "transaction.amount")
    @Mapping(target = "status", source = "transaction.status")
    @Mapping(target = "transactionDate", source = "transaction.createdAt")
    @Mapping(target = "transactionType", expression = "java(getTransactionType(transaction, accountId))")
    @Mapping(target = "otherAccountId", expression = "java(getOtherAccountId(transaction, accountId))")
    TransactionHistoryResponse toHistoryResponse(Transaction transaction, UUID accountId);
    
    /**
     * Determines transaction type based on account perspective
     */
    default String getTransactionType(Transaction transaction, UUID accountId) {
        if (transaction.getFromAccountId().equals(accountId)) {
            return "OUTGOING";
        } else {
            return "INCOMING";
        }
    }
    
    /**
     * Gets the other party account ID
     */
    default UUID getOtherAccountId(Transaction transaction, UUID accountId) {
        if (transaction.getFromAccountId().equals(accountId)) {
            return transaction.getToAccountId();
        } else {
            return transaction.getFromAccountId();
        }
    }
}