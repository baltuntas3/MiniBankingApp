package com.mini.MiniBankingApp.infrastructure.web;

import com.mini.MiniBankingApp.application.dto.LoginResponse;
import com.mini.MiniBankingApp.application.dto.UserLoginRequest;
import com.mini.MiniBankingApp.application.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication endpoints for frontend compatibility")
public class AuthController {
    
    private final UserService userService;
    
    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticates a user and returns a JWT token")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "User authenticated successfully"),
        @ApiResponse(responseCode = "401", description = "Invalid credentials"),
        @ApiResponse(responseCode = "422", description = "Validation failed")
    })
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody UserLoginRequest request) {
        LoginResponse loginResponse = userService.authenticateUser(request);
        return ResponseEntity.ok(loginResponse);
    }
}