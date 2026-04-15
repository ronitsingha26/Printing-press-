-- Printing Press Pricing Automation System schema

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password_hash VARCHAR(255),
  role ENUM('admin','operator') DEFAULT 'operator',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  address TEXT
);

CREATE TABLE pricing_rules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  gsm INT,
  paper_rate_per_sqm DECIMAL(10,2),
  bw_rate DECIMAL(10,2),
  color_rate DECIMAL(10,2),
  wastage_pct DECIMAL(5,2) DEFAULT 5,
  profit_pct DECIMAL(5,2) DEFAULT 15,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE finishing_options (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50),
  rate DECIMAL(10,2)
);

CREATE TABLE jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT,
  gsm INT,
  sheet_width DECIMAL(8,2),
  sheet_height DECIMAL(8,2),
  num_sheets INT,
  print_type ENUM('single','double'),
  color_type ENUM('bw','color'),
  quantity INT,
  wastage_pct DECIMAL(5,2),
  finishing_ids JSON,
  paper_cost DECIMAL(10,2),
  print_cost DECIMAL(10,2),
  wastage_cost DECIMAL(10,2),
  finishing_cost DECIMAL(10,2),
  profit DECIMAL(10,2),
  gst DECIMAL(10,2),
  final_price DECIMAL(10,2),
  status ENUM('draft','quoted','invoiced','paid') DEFAULT 'draft',
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id)
);

CREATE TABLE invoices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id INT,
  invoice_number VARCHAR(20),
  gst_applied BOOLEAN DEFAULT false,
  total DECIMAL(10,2),
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES jobs(id)
);

