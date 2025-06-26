-- supabase/migrations/011_create_user_role.sql
-- Create the 'user' role that seems to be referenced somewhere in the system

-- Create the user role if it doesn't exist
DO $$
BEGIN
    -- Check if role exists
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'user') THEN
        -- Create the role
        CREATE ROLE "user";
        
        -- Grant necessary permissions
        GRANT USAGE ON SCHEMA public TO "user";
        GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO "user";
        GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO "user";
        
        -- Grant permissions for future tables
        ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO "user";
        ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO "user";
    END IF;
END
$$;
