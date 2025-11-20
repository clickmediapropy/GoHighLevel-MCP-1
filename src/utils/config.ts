import { GHLConfig } from '../types/ghl-types.js';
import { Logger } from './logger.js';

type LoadConfigOptions = {
  env?: NodeJS.ProcessEnv;
  logger?: Logger;
};

const DEFAULT_BASE_URL = 'https://services.leadconnectorhq.com';
const DEFAULT_API_VERSION = '2021-07-28';

export function loadGHLConfig(options: LoadConfigOptions = {}): GHLConfig {
  const env = options.env ?? process.env;
  const logger = options.logger;

  const accessToken = env.GHL_API_TOKEN || env.GHL_API_KEY || '';
  const baseUrl = env.GHL_BASE_URL || DEFAULT_BASE_URL;
  const version = env.GHL_API_VERSION || DEFAULT_API_VERSION;
  const locationId = env.GHL_LOCATION_ID || '';

  if (!env.GHL_API_TOKEN && env.GHL_API_KEY) {
    logger?.warn('GHL_API_TOKEN not provided, falling back to GHL_API_KEY');
  }

  const missing: string[] = [];

  if (!accessToken) {
    missing.push('GHL_API_TOKEN');
  }

  if (!locationId) {
    missing.push('GHL_LOCATION_ID');
  }

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  logger?.debug('Loaded GoHighLevel configuration', {
    baseUrl,
    version,
    locationId,
  });

  return {
    accessToken,
    baseUrl,
    version,
    locationId,
  };
}
