import crypto from 'crypto';
import { Request, Response, NextFunction } from 'express';

// Valid admin sessions (token -> session info)
export interface AdminSession {
  token: string;
  adminName: string;
  email: string;
  role: 'super_admin';
  createdAt: number;
  expiresAt: number;
  lastActive: number;
}

// In-memory session store
const sessions = new Map<string, AdminSession>();

// Session configuration: 4 hours expiration
export const SESSION_TTL_MS = 4 * 60 * 60 * 1000;

/**
 * Check if ADMIN_SECRET_KEY is configured in the server environment.
 * NEVER uses any default, demo, or fallback password.
 */
export const isAuthConfigured = (): boolean => {
  const key = process.env.ADMIN_SECRET_KEY;
  return typeof key === 'string' && key.trim().length > 0;
};

/**
 * Validates provided administrator password against server environment secret.
 * Uses timing-safe string comparison to prevent timing attacks.
 * Rejects immediately if no server secret is configured.
 */
export const verifyAdminPassword = (password: unknown): boolean => {
  if (typeof password !== 'string' || !isAuthConfigured()) {
    return false;
  }
  const configuredSecret = process.env.ADMIN_SECRET_KEY!.trim();
  const inputPassword = password.trim();

  // Convert to buffers for constant-time comparison
  const inputBuffer = Buffer.from(inputPassword, 'utf-8');
  const secretBuffer = Buffer.from(configuredSecret, 'utf-8');

  if (inputBuffer.length !== secretBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(inputBuffer, secretBuffer);
};

/**
 * Creates a cryptographically secure admin session.
 */
export const createAdminSession = (
  adminName: string = 'Gold Trader John (Admin)',
  email: string = 'admin@goldtraderjohn.com'
): AdminSession => {
  const token = crypto.randomBytes(32).toString('hex');
  const now = Date.now();
  const session: AdminSession = {
    token,
    adminName,
    email,
    role: 'super_admin',
    createdAt: now,
    expiresAt: now + SESSION_TTL_MS,
    lastActive: now
  };
  sessions.set(token, session);
  return session;
};

/**
 * Validates a session token and checks for expiration.
 */
export const validateSession = (token?: string): AdminSession | null => {
  if (!token) return null;
  const session = sessions.get(token);
  if (!session) return null;

  const now = Date.now();
  if (now > session.expiresAt) {
    sessions.delete(token);
    return null;
  }

  // Slide last active timestamp
  session.lastActive = now;
  return session;
};

/**
 * Destroys an active session (logout).
 */
export const destroySession = (token: string): boolean => {
  if (!token) return false;
  return sessions.delete(token);
};

// Periodically clean up expired sessions every 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [token, session] of sessions.entries()) {
    if (now > session.expiresAt) {
      sessions.delete(token);
    }
  }
}, 15 * 60 * 1000);

export interface AuthenticatedRequest extends Request {
  adminSession?: AdminSession;
  sessionToken?: string;
}

/**
 * Express middleware to protect all admin endpoints.
 * Extracts session from:
 * 1. Secure HttpOnly cookie ('admin_session')
 * 2. Authorization header ('Bearer <token>')
 * 3. Custom header ('x-admin-token')
 */
export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let token = '';

  // 1. Check HttpOnly cookie first
  if (req.cookies && typeof req.cookies.admin_session === 'string') {
    token = req.cookies.admin_session.trim();
  }

  // 2. Check Authorization header
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7).trim();
    }
  }

  // 3. Check custom header
  if (!token && typeof req.headers['x-admin-token'] === 'string') {
    token = req.headers['x-admin-token'].trim();
  }

  const session = validateSession(token);
  if (!session) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized. Admin session is invalid, expired, or missing. Please sign in.'
    });
  }

  req.adminSession = session;
  req.sessionToken = token;
  next();
};
