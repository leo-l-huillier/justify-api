const store: Record<string, string> = {};

const redisClient = {
  get: jest.fn(async (key: string) => store[key] ?? null),
  set: jest.fn(async (key: string, value: string) => {
    store[key] = value;
  }),
  connect: jest.fn(async () => {}),
};

export default redisClient;