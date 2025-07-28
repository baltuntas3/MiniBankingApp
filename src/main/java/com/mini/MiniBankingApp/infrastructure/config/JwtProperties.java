package com.mini.MiniBankingApp.infrastructure.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
@ConfigurationProperties(prefix = "jwt")
@Getter
@Setter
public class JwtProperties {
    
    private String secret = "mySecretKey";
    
    private Duration expiration = Duration.ofHours(24);
    
    private Refresh refresh = new Refresh();
    
    @Getter
    @Setter
    public static class Refresh {
        private Duration expiration = Duration.ofDays(7);
    }
}