import express from 'express';
import tokenRouter from './routes/token';
import justifyRouter from './routes/justify';

import { connectRedis } from './services/redis';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.text());

app.use('/api', tokenRouter);
app.use('/api', justifyRouter);

async function start(): Promise<void> {
  try {
    await connectRedis();
  } catch (err) {
    console.error('Could not connect to Redis:', err);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();


export default app;
