package com.mini.MiniBankingApp.infrastructure.web;

import com.mini.MiniBankingApp.application.dto.AccountCreateRequest;
import com.mini.MiniBankingApp.application.dto.AccountResponse;
import com.mini.MiniBankingApp.application.dto.AccountSearchRequest;
import com.mini.MiniBankingApp.application.dto.AccountUpdateRequest;
import com.mini.MiniBankingApp.application.service.AccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
@Tag(name = "Account Management", description = "APIs for account operations")
public class AccountController {
    
    private final AccountService accountService;
    
    @PostMapping
    @Operation(summary = "Create a new account", description = "Creates a new account for the authenticated user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Account created successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input"),
        @ApiResponse(responseCode = "401", description = "User not authenticated"),
        @ApiResponse(responseCode = "422", description = "Validation failed")
    })
    public ResponseEntity<AccountResponse> createAccount(
            @Valid @RequestBody AccountCreateRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        AccountResponse response = accountService.createAccount(username, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
    
    @PostMapping("/search")
    @Operation(summary = "Search accounts", description = "Search accounts for the authenticated user with filters")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Accounts retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "User not authenticated")
    })
    public ResponseEntity<List<AccountResponse>> searchAccounts(
            @RequestBody AccountSearchRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        List<AccountResponse> accounts = accountService.searchAccounts(username, request);
        return ResponseEntity.ok(accounts);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("@accountAccess.hasAccountAccess(#id)")
    @Operation(summary = "Update account", description = "Updates the selected account for the authenticated user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Account updated successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid input"),
        @ApiResponse(responseCode = "401", description = "User not authenticated"),
        @ApiResponse(responseCode = "403", description = "Access denied - not account owner"),
        @ApiResponse(responseCode = "404", description = "Account not found"),
        @ApiResponse(responseCode = "422", description = "Validation failed")
    })
    public ResponseEntity<AccountResponse> updateAccount(
            @PathVariable UUID id,
            @Valid @RequestBody AccountUpdateRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        AccountResponse response = accountService.updateAccount(username, id, request);
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("@accountAccess.hasAccountAccess(#id)")
    @Operation(summary = "Delete account", description = "Deletes the selected account for the authenticated user")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Account deleted successfully"),
        @ApiResponse(responseCode = "400", description = "Cannot delete account with non-zero balance"),
        @ApiResponse(responseCode = "401", description = "User not authenticated"),
        @ApiResponse(responseCode = "403", description = "Access denied - not account owner"),
        @ApiResponse(responseCode = "404", description = "Account not found")
    })
    public ResponseEntity<Void> deleteAccount(
            @PathVariable UUID id,
            Authentication authentication) {
        String username = authentication.getName();
        accountService.deleteAccount(username, id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("@accountAccess.hasAccountAccess(#id)")
    @Operation(summary = "Get account details", description = "Retrieves details of a specific account including balance")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Account details retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "User not authenticated"),
        @ApiResponse(responseCode = "403", description = "Access denied - not account owner"),
        @ApiResponse(responseCode = "404", description = "Account not found")
    })
    public ResponseEntity<AccountResponse> getAccountDetails(
            @PathVariable UUID id,
            Authentication authentication) {
        String username = authentication.getName();
        AccountResponse response = accountService.getAccountDetails(username, id);
        return ResponseEntity.ok(response);
    }
}