-- HulamKo Database Schema
-- MySQL Database Setup

-- Create Database
CREATE DATABASE IF NOT EXISTS hulam_ko;
USE hulam_ko;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'teacher', 'assistant') DEFAULT 'teacher',
    is_active BOOLEAN DEFAULT TRUE,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- Tools Table
CREATE TABLE IF NOT EXISTS tools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    brand VARCHAR(100),
    description TEXT,
    category VARCHAR(100),
    quantity INT NOT NULL DEFAULT 1,
    available_qty INT NOT NULL DEFAULT 1,
    qr_code VARCHAR(255),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_category (category)
);

-- Borrowers Table (Borrowing Records)
CREATE TABLE IF NOT EXISTS borrowers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tool_id INT NOT NULL,
    borrower_name VARCHAR(150) NOT NULL,
    course VARCHAR(100) NOT NULL,
    year VARCHAR(50) NOT NULL,
    reason TEXT NOT NULL,
    borrowed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expected_return_date DATE NOT NULL,
    returned_date TIMESTAMP NULL,
    created_by INT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tool_id) REFERENCES tools(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_tool_id (tool_id),
    INDEX idx_borrower_name (borrower_name),
    INDEX idx_borrowed_date (borrowed_date),
    INDEX idx_returned_date (returned_date)
);

-- Activity Log Table
CREATE TABLE IF NOT EXISTS activity_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id INT,
    details TEXT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_created_date (created_date)
);

-- Create default admin user (username: admin, password: admin123)
INSERT IGNORE INTO users (username, password, email, full_name, role)
VALUES ('admin', '$2b$12$...(hashed admin123)', 'admin@hulam-ko.local', 'Administrator', 'admin');

-- Create some sample tools
INSERT IGNORE INTO tools (name, brand, description, category, quantity, available_qty)
VALUES 
    ('Hammer', 'Stanley', 'Claw hammer 16oz', 'Hand Tools', 5, 5),
    ('Screwdriver Set', 'DeWalt', 'Set of 6 screwdrivers', 'Hand Tools', 8, 8),
    ('Wrench Set', 'Craftsman', 'Set of 10 wrenches', 'Hand Tools', 3, 3),
    ('Drill Machine', 'Makita', 'Cordless drill driver', 'Power Tools', 2, 2),
    ('Measuring Tape', 'Lufkin', '25ft measuring tape', 'Measurement', 10, 10);

-- Create indexes for better query performance
CREATE INDEX idx_tools_created ON tools(created_date);
CREATE INDEX idx_borrowers_status ON borrowers(returned_date, expected_return_date);
