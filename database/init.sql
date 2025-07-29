-- Initial database setup for Mini Banking App
-- This script runs automatically when the PostgreSQL container starts

-- Create database if it doesn't exist (handled by POSTGRES_DB environment variable)

-- Create user if it doesn't exist (handled by POSTGRES_USER environment variable)

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE minibanking TO minibanking;

-- Optional: Create some initial data or schema if needed
-- The Spring Boot application will handle table creation via JPA/Hibernate