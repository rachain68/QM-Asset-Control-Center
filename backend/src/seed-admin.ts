import bcrypt from 'bcryptjs';
import { usersDb } from './config/db';

const seedAdmin = async () => {
  try {
    const employee_id = 'admin';
    const username = 'System Admin';
    const password = 'password';
    const email = 'admin@hana.com';
    const role_id = 2; // Level 2 Admin

    const [existing]: any = await usersDb.query('SELECT * FROM users WHERE employee_id = ?', [employee_id]);
    if (existing.length > 0) {
      console.log('Admin user already exists.');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    await usersDb.query(
      'INSERT INTO users (employee_id, username, password_hash, email, role_id) VALUES (?, ?, ?, ?, ?)',
      [employee_id, username, password_hash, email, role_id]
    );

    console.log('Default Admin user created successfully.');
    console.log('Employee ID:', employee_id);
    console.log('Password:', password);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
};

seedAdmin();
