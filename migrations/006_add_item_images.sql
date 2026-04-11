-- Migration 006: Add image_url to campaign_items table
-- Allows each sponsorship item to have a dedicated logo or icon

ALTER TABLE campaign_items 
ADD COLUMN image_url VARCHAR(255) DEFAULT NULL;
