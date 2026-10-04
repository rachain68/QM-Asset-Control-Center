import { usersDb, assetsDb } from './config/db';

const runMigrations = async () => {
  try {
    console.log('Running migrations for qm_users_db...');

    await usersDb.query(`
      CREATE TABLE IF NOT EXISTS roles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE
      ) ENGINE=InnoDB;
    `);

    await usersDb.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        employee_id VARCHAR(50) NOT NULL UNIQUE,
        username VARCHAR(100) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        email VARCHAR(100),
        role_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
      ) ENGINE=InnoDB;
    `);

    await usersDb.query(`
      INSERT IGNORE INTO roles (name) VALUES 
      ('Owner (Level 1)'), 
      ('Admin/CAL (Level 2)')
    `);

    console.log('qm_users_db migrations completed.');
    console.log('Running migrations for qm_assets_db...');

    await assetsDb.query(`DROP TABLE IF EXISTS audit_logs;`);
    await assetsDb.query(`DROP TABLE IF EXISTS assets;`);

    await assetsDb.query(`
      CREATE TABLE assets (
        id VARCHAR(50) PRIMARY KEY,
        itemNo INT AUTO_INCREMENT UNIQUE,
        machineName VARCHAR(255) NOT NULL,
        brand VARCHAR(100),
        model VARCHAR(100),
        serialNo VARCHAR(100),
        boiNo VARCHAR(100),
        assetNo VARCHAR(100) NOT NULL,
        machineNo VARCHAR(100),
        calibrationId VARCHAR(100),
        machineType VARCHAR(100),
        receivedDate DATE,
        invoiceNo VARCHAR(100),
        invCost DECIMAL(15,2),
        currency VARCHAR(10),
        exchangeRateToThb DECIMAL(10,4),
        amountThb DECIMAL(15,2),
        owner VARCHAR(100),
        location VARCHAR(100),
        plant VARCHAR(100),
        floor VARCHAR(50),
        area VARCHAR(100),
        bookValueThb DECIMAL(15,2),
        status VARCHAR(50) DEFAULT 'Good',
        requireYN VARCHAR(5) DEFAULT 'Y',
        remark TEXT,
        reviewStatus VARCHAR(50) DEFAULT 'Waiting List',
        sourceSystem VARCHAR(100),
        usefulLifeYears INT DEFAULT 7,
        lastUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `);

    await assetsDb.query(`
      CREATE TABLE audit_logs (
        id VARCHAR(50) PRIMARY KEY,
        assetId VARCHAR(50),
        assetName VARCHAR(255),
        assetNo VARCHAR(100),
        action VARCHAR(100) NOT NULL,
        performedBy VARCHAR(100),
        performedByRole VARCHAR(100),
        details TEXT,
        changes JSON,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (assetId) REFERENCES assets(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `);

    console.log('qm_assets_db migrations completed.');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

runMigrations();
