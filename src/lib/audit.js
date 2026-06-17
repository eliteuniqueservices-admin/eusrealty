import dbConnect from './mongodb';
import AuditLog from '@/models/AuditLog';

/**
 * Utility to log administrative actions directly to MongoDB.
 * @param {object} req - Request object containing headers and auth
 * @param {string} action - Action name (e.g. 'Property Created')
 * @param {string} details - Detailed text description of the changes
 */
export async function logAdminAction(req, action, details) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || '127.0.0.1';
    
    // Fallback if session is missing or auth is direct
    const name = req.auth?.user?.name || 'System';
    const email = req.auth?.user?.email || req.auth?.email || 'system@eusrealty.com';
    const role = req.auth?.user?.role || req.auth?.role || 'admin';

    await dbConnect();
    await AuditLog.create({
      action,
      details,
      performedBy: { name, email, role },
      ipAddress: ip,
    });
    
    console.log(`📝 [AUDIT LOG] Action: "${action}" performed by ${email} from IP ${ip}`);
  } catch (err) {
    console.error('Audit logging failed:', err.message);
  }
}
