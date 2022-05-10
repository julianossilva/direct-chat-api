-- up.sql

CREATE TABLE sessions (
    id uuid PRIMARY KEY,
    user_id uuid NOT NULL,
    expiration TIMESTAMP NOT NULL
);