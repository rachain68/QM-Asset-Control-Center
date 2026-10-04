import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Create connection pool for users database
export const usersDb = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME_USERS || 'qm_users_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Create connection pool for assets database
export const assetsDb = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME_ASSETS || 'qm_assets_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export const connectDB = async () => {
  try {
    // Test users db connection
    const usersConnection = await usersDb.getConnection();
    console.log(`Connected to Users Database: ${process.env.DB_NAME_USERS || 'qm_users_db'}`);
    usersConnection.release();

    // Test assets db connection
    const assetsConnection = await assetsDb.getConnection();
    console.log(`Connected to Assets Database: ${process.env.DB_NAME_ASSETS || 'qm_assets_db'}`);
    assetsConnection.release();
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
};
