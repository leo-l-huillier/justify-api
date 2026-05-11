import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', (err) => console.error('Redis error:', err));

export async function connectRedis(): Promise<void> {
  await client.connect();
  console.log('Connected to Redis');
}

export default client;