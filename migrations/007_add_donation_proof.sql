-- Add proof_image_url column to campaign_donations table
ALTER TABLE campaign_donations ADD COLUMN proof_image_url VARCHAR(255) DEFAULT NULL;
