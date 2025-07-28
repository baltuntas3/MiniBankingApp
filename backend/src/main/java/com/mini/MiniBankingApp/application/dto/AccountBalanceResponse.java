package com.mini.MiniBankingApp.application.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

@Getter
@Setter
@AllArgsConstructor
@Schema(description = "Account balance response")
public class AccountBalanceResponse {
    
    @Schema(description = "Account ID", example = "550e8400-e29b-41d4-a716-446655440000")
    private UUID accountId;
    
    @Schema(description = "Current account balance", example = "1500.75")
    private BigDecimal balance;
}