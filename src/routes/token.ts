import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import redisClient from '../services/redis';

const router = Router();

router.post('/token', async (req, res) => {
  const { email } = req.body;

  if (!email || typeof email !== 'string') {
    res.status(400).json({ error: 'A valid email is required' });
    return;
  }

  const token = uuidv4();

  await redisClient.set(`token:${token}`, email);

  res.json({ token });
});

export default router;