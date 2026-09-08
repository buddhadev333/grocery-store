import crypto from 'crypto';

// Server-side secret key for HMAC token signing (never sent to client)
const SERVER_SECRET = process.env.AUTH_SECRET || 'fresh_nest_secure_auth_key_buddhadev_bera_2026';

// Server-side authorized user directory
export const USERS = [
  {
    id: 'usr_owner_01',
    username: 'buddhadev',
    displayName: 'Buddhadev Bera',
    role: 'owner',
    title: 'Owner & Store Administrator',
    // In production, use bcrypt hash. For zero-dependency serverless portability:
    passwordHash: crypto.createHmac('sha256', SERVER_SECRET).update('Owner@2026').digest('hex')
  },
  {
    id: 'usr_staff_01',
    username: 'staff',
    displayName: 'Store Staff (Rahul)',
    role: 'staff',
    title: 'Store Staff & Inventory Associate',
    passwordHash: crypto.createHmac('sha256', SERVER_SECRET).update('Staff@2026').digest('hex')
  }
];

// Hash password with server salt
export function hashPassword(password) {
  return crypto.createHmac('sha256', SERVER_SECRET).update(password).digest('hex');
}

// Generate signed token
export function generateToken(user) {
  const payload = {
    userId: user.id,
    username: user.username,
    displayName: user.displayName,
    role: user.role,
    title: user.title,
    issuedAt: Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', SERVER_SECRET).update(payloadB64).digest('base64url');

  return `${payloadB64}.${signature}`;
}

// Verify signed token from Authorization: Bearer <token>
export function verifyToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false, error: 'Authorization header missing or invalid format' };
  }

  const token = authHeader.split(' ')[1];
  const parts = token.split('.');
  if (parts.length !== 2) {
    return { valid: false, error: 'Invalid token structure' };
  }

  const [payloadB64, signature] = parts;
  const expectedSig = crypto.createHmac('sha256', SERVER_SECRET).update(payloadB64).digest('base64url');

  if (signature !== expectedSig) {
    return { valid: false, error: 'Token signature verification failed. Untrusted or tampered token.' };
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
    if (Date.now() > payload.expiresAt) {
      return { valid: false, error: 'Token has expired. Please log in again.' };
    }
    return { valid: true, user: payload };
  } catch (err) {
    return { valid: false, error: 'Malformed token payload' };
  }
}

// Role-Based Access Control matrix
export const ROLE_PERMISSIONS = {
  owner: [
    'view_products',
    'buy_products',
    'view_orders',
    'edit_price',
    'bulk_price',
    'add_product',
    'delete_product',
    'edit_product',
    'manage_stock',
    'manage_discounts'
  ],
  staff: [
    'view_products',
    'view_orders',
    'manage_stock'
  ],
  customer: [
    'view_products',
    'buy_products'
  ]
};

export function hasPermission(role, permission) {
  const permissions = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.customer;
  return permissions.includes(permission);
}
