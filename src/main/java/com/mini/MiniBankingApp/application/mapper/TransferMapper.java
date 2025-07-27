package com.mini.MiniBankingApp.application.mapper;

import com.mini.MiniBankingApp.application.dto.MoneyTransferResponse;
import com.mini.MiniBankingApp.domain.transaction.Transaction;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TransferMapper {
    
    /**
     * Maps Transaction entity to MoneyTransferResponse DTO
     */
    @Mapping(target = "transactionId", source = "id")
    @Mapping(target = "fromAccountId", source = "fromAccountId")
    @Mapping(target = "toAccountId", source = "toAccountId")
    @Mapping(target = "amount", source = "amount")
    @Mapping(target = "status", source = "status")
    @Mapping(target = "transactionDate", source = "createdAt")
    @Mapping(target = "message", expression = "java(getTransactionMessage(transaction))")
    MoneyTransferResponse toResponse(Transaction transaction);
    
    /**
     * Gets appropriate message based on transaction status
     */
    default String getTransactionMessage(Transaction transaction) {
        if (transaction.isSuccessful()) {
            return "Transfer completed successfully";
        } else {
            return "Transfer failed";
        }
    }
}