jest.mock('../../src/services/redis', () => ({
  __esModule: true,
  default: require('./redis').default,
  connectRedis: jest.fn(async () => {}),
}));