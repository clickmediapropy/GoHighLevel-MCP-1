import { describe, it, expect, beforeEach, jest, afterEach } from '@jest/globals';
import { AxiosInstance } from 'axios';
import { GHLApiClient } from '../../src/clients/ghl-api-client.js';
import { createLogger } from '../../src/utils/logger.js';

jest.mock('axios', () => ({
  default: {
    create: jest.fn(),
  },
}));

import axios from 'axios';

const mockedAxios = axios as unknown as {
  create: jest.Mock<AxiosInstance>;
};

describe('GHLApiClient', () => {
  const baseConfig = {
    accessToken: 'token_123',
    baseUrl: 'https://example.test',
    version: '2021-07-28',
    locationId: 'loc_123',
  } as const;

  let axiosInstance: jest.Mocked<AxiosInstance>;

  beforeEach(() => {
    axiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      patch: jest.fn(),
      defaults: { headers: {} },
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
    } as unknown as jest.Mocked<AxiosInstance>;

    mockedAxios.create.mockReturnValue(axiosInstance);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('creates axios instance with provided configuration', () => {
    // eslint-disable-next-line no-new
    new GHLApiClient({ ...baseConfig }, createLogger('TestClient'));

    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: baseConfig.baseUrl,
      headers: {
        Authorization: `Bearer ${baseConfig.accessToken}`,
        Version: baseConfig.version,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      timeout: 30000,
    });
  });

  it('updates access token correctly', () => {
    const client = new GHLApiClient({ ...baseConfig }, createLogger('TestClient'));

    client.updateAccessToken('token_456');

    expect(axiosInstance.defaults.headers['Authorization']).toBe('Bearer token_456');
  });

  it('performs connection test request', async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: { locationId: baseConfig.locationId } });

    const client = new GHLApiClient({ ...baseConfig }, createLogger('TestClient'));
    await client.testConnection();

    expect(axiosInstance.get).toHaveBeenCalledWith(`/locations/${baseConfig.locationId}`);
  });
});
