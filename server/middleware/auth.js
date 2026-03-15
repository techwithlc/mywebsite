// Simple API key auth for admin endpoints.
// Set ADMIN_API_KEY in your server .env — keep it long and random.
export function requireAdminKey(req, res, next) {
  const key = req.headers['x-admin-key'];
  const expected = process.env.ADMIN_API_KEY;

  if (!expected) {
    console.error('ADMIN_API_KEY env var is not set — refusing all admin requests');
    return res.status(503).json({ success: false, message: 'Admin access not configured' });
  }

  if (!key || key !== expected) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  next();
}
