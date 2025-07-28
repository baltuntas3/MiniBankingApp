package com.mini.MiniBankingApp.application.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "Request to search accounts")
public class AccountSearchRequest {
    
    @Schema(description = "Account number to filter by", example = "ACC123456")
    private String number;
    
    @Schema(description = "Account name to filter by", example = "Savings")
    private String name;
}