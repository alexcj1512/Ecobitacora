import crypto from 'crypto';

// Simple hash function (en producción usar bcrypt)
export function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function verifyPassword(password, hash) {
  return hashPassword(password) === hash;
}

export function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

export function verifyToken(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'No autorizado' });
  }

  // Verificar token en sessions
  const sessions = req.app.get('sessions') || {};
  const userId = sessions[token];
  
  if (!userId) {
    return res.status(401).json({ message: 'Token inválido' });
  }

  req.userId = userId;
  next();
}
