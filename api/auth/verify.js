import { verifyToken, ROLE_PERMISSIONS } from '../_security.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed. Use GET.' });
  }

  const authHeader = req.headers.authorization || req.headers.Authorization;
  const verification = verifyToken(authHeader);

  if (!verification.valid) {
    return res.status(401).json({
      authenticated: false,
      error: verification.error
    });
  }

  const user = verification.user;
  const permissions = ROLE_PERMISSIONS[user.role] || [];

  return res.status(200).json({
    authenticated: true,
    user: {
      id: user.userId,
      username: user.username,
      displayName: user.displayName,
      role: user.role,
      title: user.title,
      permissions
    }
  });
}
