import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { usersDb } from '../config/db';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { employee_id, username, password, email, role_id, location } = req.body;

    // Check if user exists
    const [existingUsers]: any = await usersDb.query('SELECT * FROM users WHERE employee_id = ?', [employee_id]);
    if (existingUsers.length > 0) {
      res.status(400).json({ message: 'User already exists with this Employee ID' });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Insert user
    const [result]: any = await usersDb.query(
      'INSERT INTO users (employee_id, username, password_hash, email, role_id, location) VALUES (?, ?, ?, ?, ?, ?)',
      [employee_id, username, password_hash, email, role_id || 1, location || null]
    );

    res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { employee_id, password, rememberMe } = req.body;

    const [users]: any = await usersDb.query(
      SELECT u.*, r.name as role_name 
      FROM users u 
      LEFT JOIN roles r ON u.role_id = r.id 
      WHERE u.employee_id = ?
    , [employee_id]);

    if (users.length === 0) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const payload = {
      user: {
        id: user.id.toString(),
        employee_id: user.employee_id,
        username: user.username,
        role: user.role_name,
        location: user.location,
        department: 'QM',
        name: user.username ? \ - \ : user.employee_id
      }
    };

    const expiresIn = rememberMe ? '7d' : '24h';

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'secret',
      { expiresIn },
      (err: Error | null, token: string | undefined) => {
        if (err) throw err;
        res.json({ token, user: payload.user });
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
