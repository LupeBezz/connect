DROP TABLE users IF EXISTS;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first VARCHAR NOT NULL CHECK (first != ''),
    last VARCHAR NOT NULL CHECK (last != ''),
    email VARCHAR UNIQUE NOT NULL CHECK (email != ''),
    password VARCHAR NOT NULL,
    time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);