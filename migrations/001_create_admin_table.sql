-- Migration: 001_create_admin_table
-- Description: Creates the admins table and seeds an initial admin account.

CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(255) DEFAULT '/upload/admin/default-avatar.png',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Seed initial admin: Ashwani Mishra (Password: Admin@123)
-- Note: Replace this in production immediately.
INSERT INTO admins (name, email, phone, password) 
VALUES ('Ashwani Mishra', 'admin@hinduvahini.online', '9911991199', '$2b$10$j9.ASVHiWcxxlyPP1Hih.O5aAYrRz5RIfSL/J4RFGBsz/NbmtuQ2.')
ON DUPLICATE KEY UPDATE name=name;
