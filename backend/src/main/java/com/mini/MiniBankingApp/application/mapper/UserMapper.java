package com.mini.MiniBankingApp.application.mapper;

import com.mini.MiniBankingApp.application.dto.UserRegistrationRequest;
import com.mini.MiniBankingApp.application.dto.UserResponse;
import com.mini.MiniBankingApp.domain.user.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {
    
    /**
     * Maps UserRegistrationRequest to User domain entity
     * Explicitly maps all required fields
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    User toEntity(UserRegistrationRequest request);
    
    /**
     * Maps User domain entity to UserResponse DTO
     */
    UserResponse toResponse(User user);
}