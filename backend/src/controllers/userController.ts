import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { usersDb } from '../config/db';

// Get all users with their roles
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const [users]: any = await usersDb.query(`
      SELECT u.id, u.employee_id, u.username, u.email, u.role_id, u.location, u.created_at, r.name as role_name 
      FROM users u 
      LEFT JOIN roles r ON u.role_id = r.id
      ORDER BY u.created_at DESC
    `);
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin adds a new user
export const addUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { employee_id, username, password, email, role_id, location } = req.body;

    const [existingUsers]: any = await usersDb.query('SELECT * FROM users WHERE employee_id = ?', [employee_id]);
    if (existingUsers.length > 0) {
      res.status(400).json({ message: 'User already exists with this Employee ID' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const [result]: any = await usersDb.query(
      'INSERT INTO users (employee_id, username, password_hash, email, role_id, location) VALUES (?, ?, ?, ?, ?, ?)',
      [employee_id, username, password_hash, email, role_id || 1, location || null] // Default to Level 1
    );

    res.status(201).json({ message: 'User created successfully', id: result.insertId });
  } catch (error) {
    console.error('Add user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin updates user (role, etc)
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { username, email, role_id, password, location } = req.body;

    let updateQuery = 'UPDATE users SET username = ?, email = ?, role_id = ?, location = ? WHERE id = ?';
    let updateParams = [username, email, role_id, location || null, id];

    // Optional password reset by admin
    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);
      updateQuery = 'UPDATE users SET username = ?, email = ?, role_id = ?, location = ?, password_hash = ? WHERE id = ?';
      updateParams = [username, email, role_id, location || null, password_hash, id];
    }

    await usersDb.query(updateQuery, updateParams);
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin deletes user
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await usersDb.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
