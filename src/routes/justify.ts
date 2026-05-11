import { Router } from 'express';
import justifyText from '../services/justify';
import { authMiddleware } from '../middleware/auth';
import redisClient from '../services/redis';

const router = Router();

const DAILY_WORD_LIMIT = 80000;

router.post('/justify', authMiddleware, async (req, res) => {
  const text = req.body;

  if (!text || typeof text !== 'string') {
    res.status(400).json({ error: 'A valid text/plain body is required' });
    return;
  }

  // Get the token from the header
  const token = req.headers['authorization']!.split(' ')[1];

  // Count the words in this request
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  // Build a Redis key that is unique per token per day
  const today = new Date().toISOString().slice(0, 10); // "2026-05-11"
  const rateLimitKey = `ratelimit:${token}:${today}`;

  // Get the current word count for today
  const current = await redisClient.get(rateLimitKey);
  const currentCount = current ? parseInt(current) : 0;

  if (currentCount + wordCount > DAILY_WORD_LIMIT) {
    res.status(402).json({ error: 'Daily word limit exceeded' });
    return;
  }

  // Increment the counter, set it to expire at midnight (86400 seconds = 24h)
  await redisClient.set(rateLimitKey, currentCount + wordCount, { EX: 86400 });

  const justified = justifyText(text);
  res.type('text/plain').send(justified);
});

export default router;