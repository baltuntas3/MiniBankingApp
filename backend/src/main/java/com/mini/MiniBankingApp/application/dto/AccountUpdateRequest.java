package com.mini.MiniBankingApp.application.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Schema(description = "Request to update an account")
public class AccountUpdateRequest {
    
    @NotBlank(message = "Account name is required")
    @Schema(description = "Account name", example = "Updated Account Name")
    private String name;
}