-- TechwithLC Database Schema for Zeabur PostgreSQL
-- Create subscribers table

CREATE TABLE IF NOT EXISTS subscribers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    subscribed BOOLEAN DEFAULT true,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_email_sent TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);

-- Create index on subscribed status for filtering active subscribers
CREATE INDEX IF NOT EXISTS idx_subscribers_subscribed ON subscribers(subscribed);

-- Insert a test subscriber (optional - remove if not needed)
-- INSERT INTO subscribers (email) VALUES ('test@example.com') ON CONFLICT (email) DO NOTHING;

-- Query to check all subscribers
-- SELECT * FROM subscribers;

-- Query to check active subscribers count
-- SELECT COUNT(*) FROM subscribers WHERE subscribed = true;

