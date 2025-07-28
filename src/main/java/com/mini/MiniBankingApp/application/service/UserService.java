package com.mini.MiniBankingApp.application.service;

import com.mini.MiniBankingApp.application.dto.*;
import com.mini.MiniBankingApp.application.mapper.UserMapper;
import com.mini.MiniBankingApp.domain.user.User;
import com.mini.MiniBankingApp.exception.UserAlreadyExistsException;
import com.mini.MiniBankingApp.exception.UserNotFoundException;
import com.mini.MiniBankingApp.infrastructure.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserMapper userMapper;
    
    public UserResponse registerUser(UserRegistrationRequest request) {
        // Check if username already exists
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new UserAlreadyExistsException("Username already exists");
        }
        
        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("Email already exists");
        }
        
        // Map DTO to entity using MapStruct
        User user = userMapper.toEntity(request);
        // Encode password manually as it requires special handling
        user.changePassword(passwordEncoder.encode(request.getPassword()));
        
        User savedUser = userRepository.save(user);
        
        return userMapper.toResponse(savedUser);
    }
    
    public LoginResponse authenticateUser(UserLoginRequest request) {
        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getUsername(),
                request.getPassword()
            )
        );
        
        // Get user details
        User user = userRepository.findByUsername(request.getUsername())
            .orElseThrow(() -> new UserNotFoundException("User not found"));
        
        // Generate JWT token
        String token = jwtService.generateToken(user.getUsername());
        
        return new LoginResponse(token, userMapper.toResponse(user));
    }
    
    @Transactional(readOnly = true)
    public UserResponse getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new UserNotFoundException("User not found"));
        
        return userMapper.toResponse(user);
    }
}