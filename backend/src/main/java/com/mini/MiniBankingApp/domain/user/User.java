package com.mini.MiniBankingApp.domain.user;

import com.mini.MiniBankingApp.domain.common.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users", schema = "minibanking_schema")
@Getter
@Setter
@NoArgsConstructor
public class User extends BaseEntity {
    
    @Column(name = "username", unique = true, nullable = false)
    private String username;
    
    @Column(name = "password", nullable = false)
    private String password;
    
    @Column(name = "email", unique = true, nullable = false)
    private String email;
    
    public User(String username, String password, String email) {
        super();
        this.username = username;
        this.password = password;
        this.email = email;
    }
    
    public void changePassword(String newPassword) {
        if (newPassword == null || newPassword.trim().length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters long");
        }
        this.password = newPassword;
    }
    
    public void updateProfile(String newUsername, String newEmail) {
        if (newUsername == null || newUsername.trim().isEmpty()) {
            throw new IllegalArgumentException("Username cannot be empty");
        }
        if (newEmail == null || !isValidEmail(newEmail)) {
            throw new IllegalArgumentException("Please enter a valid email address");
        }
        this.username = newUsername.trim();
        this.email = newEmail.trim();
    }
    
    private boolean isValidEmail(String email) {
        return email.contains("@") && email.contains(".");
    }
}