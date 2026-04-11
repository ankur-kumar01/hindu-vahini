CREATE TABLE IF NOT EXISTS campaigns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    short_description VARCHAR(500),
    description TEXT,
    image_url VARCHAR(255),
    goal_amount DECIMAL(15, 2) DEFAULT 0.00,
    current_amount DECIMAL(15, 2) DEFAULT 0.00,
    status ENUM('active', 'completed', 'paused') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS campaign_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    campaign_id INT,
    item_name VARCHAR(255) NOT NULL,
    price_per_unit DECIMAL(15, 2) NOT NULL,
    unit_name VARCHAR(50) DEFAULT 'unit',
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS campaign_donations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    campaign_id INT,
    donor_name VARCHAR(255) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    transaction_id VARCHAR(100),
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE SET NULL
);
