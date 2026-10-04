import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const initializeDatabases = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    const dbUsers = process.env.DB_NAME_USERS || 'qm_users_db';
    const dbAssets = process.env.DB_NAME_ASSETS || 'qm_assets_db';

    console.log('Connecting to MySQL to initialize databases...');
    
    // Create Users DB
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbUsers}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`Database '${dbUsers}' created or already exists.`);

    // Create Assets DB
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbAssets}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`Database '${dbAssets}' created or already exists.`);

    await connection.end();
    console.log('Databases initialized successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing databases:', error);
    process.exit(1);
  }
};

initializeDatabases();
