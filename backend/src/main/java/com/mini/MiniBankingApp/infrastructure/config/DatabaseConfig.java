package com.mini.MiniBankingApp.infrastructure.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class DatabaseConfig {

    @Value("${spring.jpa.properties.hibernate.default_schema:minibanking_schema}")
    private String schemaName;

    @Bean
    public CommandLineRunner createSchemaIfNotExists(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                // Create schema if it doesn't exist
                String createSchemaSql = "CREATE SCHEMA IF NOT EXISTS " + schemaName;
                jdbcTemplate.execute(createSchemaSql);
                
                // Set search path for current session
                String setSearchPathSql = "SET search_path TO " + schemaName + ", public";
                jdbcTemplate.execute(setSearchPathSql);
                
                System.out.println("Schema '" + schemaName + "' created/verified successfully");
            } catch (Exception e) {
                System.err.println("Error creating schema: " + e.getMessage());
                // Don't throw exception to prevent application startup failure
            }
        };
    }
}