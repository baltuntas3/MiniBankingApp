package com.mini.MiniBankingApp.infrastructure.web;

import com.mini.MiniBankingApp.application.dto.AccountBalanceResponse;
import com.mini.MiniBankingApp.application.dto.MoneyTransferRequest;
import com.mini.MiniBankingApp.application.dto.MoneyTransferResponse;
import com.mini.MiniBankingApp.application.dto.TransactionHistoryResponse;
import com.mini.MiniBankingApp.application.mapper.TransferMapper;
import com.mini.MiniBankingApp.application.service.MoneyTransferService;
import com.mini.MiniBankingApp.exception.AccountNotFoundException;
import com.mini.MiniBankingApp.domain.transaction.Transaction;
import com.mini.MiniBankingApp.exception.InsufficientFundsException;
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

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/transfers")
@RequiredArgsConstructor
@Tag(name = "Money Transfer", description = "APIs for money transfer operations between accounts")
public class TransferController {
    
    private final MoneyTransferService moneyTransferService;
    private final TransferMapper transferMapper;
    
    @PostMapping
    @PreAuthorize("@accountAccess.hasTransferAccess(#request.fromAccountId)")
    @Operation(summary = "Transfer money between accounts", description = "Transfers money from one account to another")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Transfer completed successfully"),
        @ApiResponse(responseCode = "400", description = "Invalid transfer request"),
        @ApiResponse(responseCode = "401", description = "User not authenticated"),
        @ApiResponse(responseCode = "403", description = "Access denied - not source account owner"),
        @ApiResponse(responseCode = "404", description = "Account not found"),
        @ApiResponse(responseCode = "422", description = "Insufficient funds or validation failed")
    })
    public ResponseEntity<MoneyTransferResponse> transferMoney(
            @Valid @RequestBody MoneyTransferRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        
        Transaction transaction = moneyTransferService.transfer(
            username,
            request.getFromAccountId(),
            request.getToAccountId(),
            request.getAmount()
        );
        
        MoneyTransferResponse response = transferMapper.toResponse(transaction);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/accounts/{accountId}/balance")
    @Operation(summary = "Get account balance", description = "Returns the current balance of the specified account")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Balance retrieved successfully"),
        @ApiResponse(responseCode = "404", description = "Account not found")
    })
    public ResponseEntity<AccountBalanceResponse> getAccountBalance(@PathVariable UUID accountId) {
        try {
            BigDecimal balance = moneyTransferService.getAccountBalance(accountId);
            AccountBalanceResponse response = new AccountBalanceResponse(accountId, balance);
            return ResponseEntity.ok(response);
            
        } catch (AccountNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/transactions/account/{accountId}")
    @PreAuthorize("@accountAccess.hasAccountAccess(#accountId)")
    @Operation(summary = "View transaction history", 
               description = "Retrieves transaction history for a specified account. Access restricted to account owner.")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Transaction history retrieved successfully"),
        @ApiResponse(responseCode = "401", description = "User not authenticated"),
        @ApiResponse(responseCode = "403", description = "Access denied - not account owner"),
        @ApiResponse(responseCode = "404", description = "Account not found")
    })
    public ResponseEntity<List<TransactionHistoryResponse>> getTransactionHistory(
            @PathVariable UUID accountId,
            Authentication authentication) {
        String username = authentication.getName();
        List<TransactionHistoryResponse> history = moneyTransferService.getTransactionHistory(username, accountId);
        return ResponseEntity.ok(history);
    }
}