-- Initial database setup for Mini Banking App
-- This script runs automatically when the PostgreSQL container starts

-- Create database if it doesn't exist (handled by POSTGRES_DB environment variable)

-- Create user if it doesn't exist (handled by POSTGRES_USER environment variable)

-- Create custom schema for the application
CREATE SCHEMA IF NOT EXISTS minibanking_schema;

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE minibanking TO minibanking;
GRANT ALL PRIVILEGES ON SCHEMA minibanking_schema TO minibanking;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA minibanking_schema TO minibanking;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA minibanking_schema TO minibanking;

-- Set default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA minibanking_schema GRANT ALL PRIVILEGES ON TABLES TO minibanking;
ALTER DEFAULT PRIVILEGES IN SCHEMA minibanking_schema GRANT ALL PRIVILEGES ON SEQUENCES TO minibanking;

-- Set search path to include the custom schema
ALTER DATABASE minibanking SET search_path TO minibanking_schema, public;