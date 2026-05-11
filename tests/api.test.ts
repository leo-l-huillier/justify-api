import request from 'supertest';
import app from '../src/index';
import redisClient from '../src/services/redis';

jest.mock('../src/services/redis', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    set: jest.fn(),
    connect: jest.fn(),
  },
  connectRedis: jest.fn(),
}));

const VALID_TOKEN = 'valid-token-123';

describe('POST /api/justify', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // By default, token exists in Redis and no words used today
    (redisClient.get as jest.Mock).mockImplementation(async (key: string) => {
      if (key === `token:${VALID_TOKEN}`) return 'test@test.com';
      return null; // no words used yet
    });
  });

  it('should return 401 if no token is provided', async () => {
    const res = await request(app)
      .post('/api/justify')
      .set('Content-Type', 'text/plain')
      .send('some text');

    expect(res.status).toBe(401);
  });

  it('should return 401 if token is invalid', async () => {
    (redisClient.get as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .post('/api/justify')
      .set('Content-Type', 'text/plain')
      .set('Authorization', 'Bearer invalid-token')
      .send('some text');

    expect(res.status).toBe(401);
  });

  it('should return justified text with a valid token', async () => {
    const res = await request(app)
      .post('/api/justify')
      .set('Content-Type', 'text/plain')
      .set('Authorization', `Bearer ${VALID_TOKEN}`)
      .send('The sky above the port was the color of television tuned to a dead channel.');

    expect(res.status).toBe(200);
    expect(res.type).toMatch(/text/);
    const lines = res.text.split('\n').filter(Boolean);
    lines.forEach(line => expect(line.length).toBe(80));
  });

  it('should return 400 if body is empty', async () => {
    const res = await request(app)
      .post('/api/justify')
      .set('Content-Type', 'text/plain')
      .set('Authorization', `Bearer ${VALID_TOKEN}`)
      .send('');

    expect(res.status).toBe(400);
  });

  it('should return 401 if Authorization header has no token after Bearer', async () => {
  const res = await request(app)
    .post('/api/justify')
    .set('Content-Type', 'text/plain')
    .set('Authorization', 'Bearer')
    .send('some text');

  expect(res.status).toBe(401);
});

  it('should return 402 if daily word limit is exceeded', async () => {
    (redisClient.get as jest.Mock).mockImplementation(async (key: string) => {
      if (key === `token:${VALID_TOKEN}`) return 'test@test.com';
      return '80000'; // already at the limit
    });

    const res = await request(app)
      .post('/api/justify')
      .set('Content-Type', 'text/plain')
      .set('Authorization', `Bearer ${VALID_TOKEN}`)
      .send('one more word');

    expect(res.status).toBe(402);
  });
});