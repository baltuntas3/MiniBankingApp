package com.mini.MiniBankingApp.application.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Schema(description = "Request to create a new account")
public class AccountCreateRequest {
    
    @NotBlank(message = "Account name is required")
    @Schema(description = "Account name", example = "My Savings Account")
    private String name;
    
    @NotNull(message = "Account type is required")
    @Schema(description = "Account type", example = "TRY", allowableValues = {"TRY", "USD", "GOLD"})
    private String accountType;
    
    @PositiveOrZero(message = "Initial balance must be positive or zero")
    @Schema(description = "Initial balance", example = "1000.00")
    private BigDecimal initialBalance = BigDecimal.ZERO;
}