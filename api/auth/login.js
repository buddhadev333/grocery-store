import { USERS, hashPassword, generateToken, ROLE_PERMISSIONS } from '../_security.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    const cleanUsername = String(username).trim().toLowerCase();
    const user = USERS.find(u => u.username.toLowerCase() === cleanUsername);

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const inputHash = hashPassword(String(password));
    if (inputHash !== user.passwordHash) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const token = generateToken(user);
    const permissions = ROLE_PERMISSIONS[user.role] || [];

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.displayName}!`,
      token,
      user: {
        id: user.id,
        username: user.username,
        displayName: user.displayName,
        role: user.role,
        title: user.title,
        permissions
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error during authentication.' });
  }
}
