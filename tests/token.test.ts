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

describe('POST /api/token', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a token for a valid email', async () => {
    const res = await request(app)
      .post('/api/token')
      .send({ email: 'test@test.com' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
  });

  it('should return 400 if email is missing', async () => {
    const res = await request(app)
      .post('/api/token')
      .send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 400 if email is not a string', async () => {
    const res = await request(app)
      .post('/api/token')
      .send({ email: 123 });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should store the token in Redis', async () => {
    await request(app)
      .post('/api/token')
      .send({ email: 'test@test.com' });

    expect(redisClient.set).toHaveBeenCalledWith(
      expect.stringMatching(/^token:/),
      'test@test.com'
    );
  });
});