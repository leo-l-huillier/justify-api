import { Request, Response, NextFunction } from 'express';
import redisClient from '../services/redis';

export async function authMiddleware(req: Request, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    res.status(401).json({ error: 'Missing Authorization header' });
    return;
  }

  const parts = authHeader.split(' ');
  const token = parts[1];

  if (!token) {
    res.status(401).json({ error: 'Invalid Authorization format, expected: Bearer <token>' });
    return;
  }

  // Redis
  const email = await redisClient.get(`token:${token}`);

  if (!email) {
    res.status(401).json({ error: 'Invalid or unknown token' });
    return;
  }

  next();
}