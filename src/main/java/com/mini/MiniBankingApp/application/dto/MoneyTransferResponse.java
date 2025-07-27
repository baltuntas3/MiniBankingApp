package com.mini.MiniBankingApp.application.dto;

import com.mini.MiniBankingApp.domain.transaction.TransactionStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@Schema(description = "Money transfer response")
public class MoneyTransferResponse {
    
    @Schema(description = "Transaction ID", example = "1")
    private Long transactionId;
    
    @Schema(description = "Source account ID", example = "550e8400-e29b-41d4-a716-446655440000")
    private UUID fromAccountId;
    
    @Schema(description = "Target account ID", example = "550e8400-e29b-41d4-a716-446655440001")
    private UUID toAccountId;
    
    @Schema(description = "Transfer amount", example = "100.50")
    private BigDecimal amount;
    
    @Schema(description = "Transaction status", example = "SUCCESS")
    private TransactionStatus status;
    
    @Schema(description = "Transaction date and time")
    private LocalDateTime transactionDate;
    
    @Schema(description = "Transaction message", example = "Transfer completed successfully")
    private String message;
}