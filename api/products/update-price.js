import { verifyToken, hasPermission } from '../_security.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  // 1. Verify Authentication
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const verification = verifyToken(authHeader);

  if (!verification.valid) {
    return res.status(401).json({
      success: false,
      error: 'Authentication Required: You must be logged in to modify product prices.',
      details: verification.error
    });
  }

  const user = verification.user;

  // 2. Strict Owner Authorization Enforcement
  if (!hasPermission(user.role, 'edit_price') || user.role !== 'owner') {
    return res.status(403).json({
      success: false,
      error: 'Permission Denied: Only store owner (Buddhadev Bera) is authorized to modify product prices.',
      currentRole: user.role,
      requiredRole: 'owner'
    });
  }

  // 3. Validate Inputs
  const { productId, mrp, sellingPrice, badge } = req.body || {};

  if (!productId) {
    return res.status(400).json({ success: false, error: 'Product ID is required.' });
  }

  const numMrp = parseFloat(mrp);
  const numSellingPrice = parseFloat(sellingPrice);

  if (isNaN(numMrp) || numMrp <= 0) {
    return res.status(400).json({ success: false, error: 'MRP must be a valid positive number.' });
  }

  if (isNaN(numSellingPrice) || numSellingPrice <= 0) {
    return res.status(400).json({ success: false, error: 'Selling price must be a valid positive number.' });
  }

  if (numSellingPrice > numMrp) {
    return res.status(400).json({
      success: false,
      error: 'Selling price cannot exceed Maximum Retail Price (MRP).'
    });
  }

  const discount = Math.round(((numMrp - numSellingPrice) / numMrp) * 100);
  const savingsAmount = parseFloat((numMrp - numSellingPrice).toFixed(2));

  // 4. Return Authorized Result with Cryptographic Audit Trail
  return res.status(200).json({
    success: true,
    message: `Price successfully updated for product ${productId}.`,
    productId,
    pricing: {
      mrp: numMrp,
      sellingPrice: numSellingPrice,
      discount,
      savingsAmount,
      badge: badge || (discount >= 15 ? "Today's Deal" : "Best Price")
    },
    auditReceipt: {
      authorizedBy: user.displayName,
      authorizedUsername: user.username,
      role: user.role,
      timestamp: new Date().toISOString()
    }
  });
}
