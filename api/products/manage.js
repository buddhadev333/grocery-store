import { verifyToken, hasPermission } from '../_security.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  const authHeader = req.headers.authorization || req.headers.Authorization;
  const verification = verifyToken(authHeader);

  if (!verification.valid) {
    return res.status(401).json({
      success: false,
      error: 'Authentication Required: Please log in to manage products.',
      details: verification.error
    });
  }

  const user = verification.user;
  const { action, payload } = req.body || {};

  if (!action) {
    return res.status(400).json({ success: false, error: 'Action type is required.' });
  }

  // Check action permissions
  if (action === 'update_stock') {
    if (!hasPermission(user.role, 'manage_stock')) {
      return res.status(403).json({
        success: false,
        error: 'Permission Denied: You do not have permission to manage stock.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Stock updated successfully.',
      action,
      payload,
      authorizedBy: user.displayName
    });
  }

  // All other catalog changes (add, delete, edit details) require Owner
  if (user.role !== 'owner') {
    return res.status(403).json({
      success: false,
      error: `Permission Denied: Only store owner (Buddhadev Bera) is authorized to execute ${action}.`,
      requiredRole: 'owner',
      currentRole: user.role
    });
  }

  return res.status(200).json({
    success: true,
    message: `Action ${action} authorized and executed successfully.`,
    action,
    payload,
    authorizedBy: user.displayName,
    timestamp: new Date().toISOString()
  });
}
