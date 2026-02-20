-- SMC-Borrow Database Schema
-- MySQL Database Setup

-- Create Database
CREATE DATABASE IF NOT EXISTS smc_borrow;
USE smc_borrow;

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
    category ENUM('Computer Equipments', 'Equipments', 'Furniture and Fixture', 'Sacred Images and Chapel') NOT NULL DEFAULT 'Equipments',
    location VARCHAR(200),
    quantity INT NOT NULL DEFAULT 1,
    available_qty INT NOT NULL DEFAULT 1,
    `condition` ENUM('Good Condition', 'Needs Repair', 'Lost', 'Damaged') DEFAULT 'Good Condition',
    year_acquired DATE,
    asset_code VARCHAR(50) UNIQUE,
    previous_qty INT DEFAULT 0,
    action_since_prev ENUM('Newly Acquired', 'Removed', 'Transferred', 'Disposed') NULL,
    qr_code VARCHAR(255),
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_category (category),
    INDEX idx_location (location),
    INDEX idx_condition (`condition`),
    INDEX idx_asset_code (asset_code)
);

-- Tool Movements Table (tracks additions and pull-outs with date/time)
CREATE TABLE IF NOT EXISTS tool_movements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tool_id INT NOT NULL,
    tool_name VARCHAR(150) NOT NULL,
    movement_type ENUM('Added', 'Pulled Out', 'Removed') NOT NULL,
    quantity_changed INT NOT NULL DEFAULT 1,
    reason VARCHAR(255),
    remarks TEXT,
    performed_by INT,
    movement_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tool_id) REFERENCES tools(id) ON DELETE CASCADE,
    FOREIGN KEY (performed_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_tool_id (tool_id),
    INDEX idx_movement_type (movement_type),
    INDEX idx_movement_date (movement_date)
);

-- Damage Reports Table (standalone section for damage reporting)
CREATE TABLE IF NOT EXISTS damage_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tool_id INT NOT NULL,
    tool_name VARCHAR(150) NOT NULL,
    reported_by VARCHAR(150) NOT NULL,
    damage_type ENUM('Damaged', 'For Repair', 'Lost') NOT NULL,
    severity ENUM('Minor', 'Moderate', 'Severe') DEFAULT 'Minor',
    description TEXT NOT NULL,
    date_reported TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Pending', 'Under Review', 'Repaired', 'Replaced', 'Written Off') DEFAULT 'Pending',
    resolution_notes TEXT,
    resolved_date TIMESTAMP NULL,
    FOREIGN KEY (tool_id) REFERENCES tools(id) ON DELETE CASCADE,
    INDEX idx_tool_id (tool_id),
    INDEX idx_damage_type (damage_type),
    INDEX idx_status (status),
    INDEX idx_date_reported (date_reported)
);

-- Borrowers Table (Borrowing Records)
CREATE TABLE IF NOT EXISTS borrowers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tool_id INT NOT NULL,
    borrower_name VARCHAR(150) NOT NULL,
    student_id VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    course VARCHAR(100) NOT NULL,
    year VARCHAR(50) NOT NULL,
    reason TEXT NOT NULL,
    borrowed_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expected_return_date DATE NOT NULL,
    returned_date TIMESTAMP NULL,
    return_remarks TEXT,
    overdue_notified BOOLEAN DEFAULT FALSE,
    created_by INT,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (tool_id) REFERENCES tools(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_tool_id (tool_id),
    INDEX idx_borrower_name (borrower_name),
    INDEX idx_student_id (student_id),
    INDEX idx_email (email),
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
VALUES ('admin', '$2b$12$...(hashed admin123)', 'admin@smc-borrow.local', 'Administrator', 'admin');

-- Create some sample tools
INSERT IGNORE INTO tools (name, brand, description, category, location, quantity, available_qty, `condition`, year_acquired, asset_code, previous_qty, action_since_prev)
VALUES 
    ('KEYBOARD', 'A4TECH', 'KEYBOARD A4TECH USB A-SHAPE', 'Computer Equipments', 'CALL LAB RM. 116', 41, 41, 'Good Condition', '2023-06-15', 'SMC-CE-001', 41, NULL),
    ('MOUSE', 'A4TECH', 'MOUSE A4TECH USB A-SHAPE', 'Computer Equipments', 'CALL LAB RM. 116', 41, 41, 'Good Condition', '2023-06-15', 'SMC-CE-002', 41, NULL),
    ('MONITOR', 'ACER', '21.5" LED VGA+HDMI 75hz MONITOR ACER', 'Computer Equipments', 'CALL LAB RM. 116', 32, 32, 'Good Condition', '2023-08-20', 'SMC-CE-003', 32, NULL),
    ('SYSTEM UNIT', 'CIVO', 'CIVO CASE H002 MICRO ATX', 'Computer Equipments', 'CALL LAB RM. 116', 41, 41, 'Good Condition', '2023-09-01', 'SMC-CE-007', 41, NULL),
    ('CHAIR', 'N/A', 'MONOBLOC WHITE', 'Furniture and Fixture', 'CALL LAB RM. 116', 36, 36, 'Needs Repair', '2019-05-15', 'SMC-FF-011', 36, 'Transferred'),
    ('CRUCIFIX', 'N/A', 'CRUCIFIX', 'Sacred Images and Chapel', 'CALL LAB RM. 116', 1, 1, 'Good Condition', '2019-01-20', 'SMC-SC-015', 1, NULL);

-- Create indexes for better query performance
CREATE INDEX idx_tools_created ON tools(created_date);
CREATE INDEX idx_borrowers_status ON borrowers(returned_date, expected_return_date);
CREATE INDEX idx_tool_movements_date ON tool_movements(movement_date);
CREATE INDEX idx_damage_reports_date ON damage_reports(date_reported);
