-- Update gallery_images table for social media feed features
ALTER TABLE gallery_images
ADD COLUMN title VARCHAR(255) NULL,
ADD COLUMN description TEXT NULL,
ADD COLUMN likes INT DEFAULT 0,
ADD COLUMN is_promoted BOOLEAN DEFAULT FALSE;
