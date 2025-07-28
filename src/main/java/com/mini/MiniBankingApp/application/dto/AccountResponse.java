package com.mini.MiniBankingApp.application.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Schema(description = "Account response with details")
public class AccountResponse {
    
    @Schema(description = "Account ID", example = "550e8400-e29b-41d4-a716-446655440000")
    private UUID id;
    
    @Schema(description = "Account number", example = "ACC123456")
    private String number;
    
    @Schema(description = "Account name", example = "My Savings Account")
    private String name;
    
    @Schema(description = "Account type", example = "TRY")
    private String accountType;
    
    @Schema(description = "Current balance", example = "1500.50")
    private BigDecimal balance;
    
    @Schema(description = "Creation date")
    private LocalDateTime createdAt;
    
    @Schema(description = "Last update date")
    private LocalDateTime updatedAt;
}