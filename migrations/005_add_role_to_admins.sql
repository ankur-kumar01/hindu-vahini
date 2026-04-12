-- Migration: 005_add_role_to_admins
-- Description: Adds role column to admins table and seeds a sub-admin account.

-- 1. Add the role column if it doesn't exist
ALTER TABLE admins 
ADD COLUMN role ENUM('admin', 'sub-admin') DEFAULT 'admin' AFTER password;

-- 2. Update existing admin to ensure they have 'admin' role (should be default anyway)
UPDATE admins SET role = 'admin' WHERE email = 'admin@hinduvahini.online';

-- 3. Seed the new Sub-Admin account
-- Password is the same as requested, already hashed: $2b$10$j9.ASVHiWcxxlyPP1Hih.O5aAYrRz5RIfSL/J4RFGBsz/NbmtuQ2.
INSERT INTO admins (name, email, phone, password, role) 
VALUES ('Sub Admin Ashwani', 'subadmin@hinduvahini.online', '9911991199', '$2b$10$j9.ASVHiWcxxlyPP1Hih.O5aAYrRz5RIfSL/J4RFGBsz/NbmtuQ2.', 'sub-admin')
ON DUPLICATE KEY UPDATE role='sub-admin';
