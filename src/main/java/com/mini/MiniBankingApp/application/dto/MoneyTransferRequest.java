package com.mini.MiniBankingApp.application.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@Schema(description = "Money transfer request")
public class MoneyTransferRequest {
    
    @NotNull(message = "Source account ID is required")
    @Schema(description = "Source account ID", example = "550e8400-e29b-41d4-a716-446655440000")
    private UUID fromAccountId;
    
    @NotNull(message = "Target account ID is required")
    @Schema(description = "Target account ID", example = "550e8400-e29b-41d4-a716-446655440001")
    private UUID toAccountId;
    
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    @Schema(description = "Transfer amount", example = "100.50")
    private BigDecimal amount;
}