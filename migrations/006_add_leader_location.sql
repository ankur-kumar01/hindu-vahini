-- Add state and district columns to leaders table
ALTER TABLE leaders 
ADD COLUMN state VARCHAR(100) DEFAULT 'National',
ADD COLUMN district VARCHAR(255);
