import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';

describe('getIsEnableAuthToggle', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...ORIGINAL_ENV };
    // Start from a clean slate so individual tests control the relevant vars,
    // independent of any auth env vars present in the ambient environment.
    delete process.env.AUTH_URL;
    delete process.env.NEXTAUTH_URL;
    delete process.env.DIAL_API_KEY;
    for (const key of Object.keys(process.env)) {
      if (key.startsWith('AUTH_')) {
        delete process.env[key];
      }
    }
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  // `hasConfiguredAuthProviders` is evaluated at module load time, so each test
  // sets env vars first and then re-imports the module in isolation.
  const loadToggle = async (): Promise<() => boolean> => {
    const { getIsEnableAuthToggle } = await import('../get-auth-toggle');

    return getIsEnableAuthToggle;
  };

  const configureKeycloak = (): void => {
    process.env.AUTH_KEYCLOAK_CLIENT_ID = 'client-id';
    process.env.AUTH_KEYCLOAK_SECRET = 'secret';
    process.env.AUTH_KEYCLOAK_HOST = 'https://keycloak.example.com';
  };

  it('enables auth when a provider is configured and NEXTAUTH_URL is set', async () => {
    process.env.NEXTAUTH_URL = 'http://localhost:4001';
    configureKeycloak();

    const getIsEnableAuthToggle = await loadToggle();

    expect(getIsEnableAuthToggle()).toBe(true);
  });

  it('enables auth when a provider is configured and AUTH_URL is set', async () => {
    process.env.AUTH_URL = 'http://localhost:4200';
    configureKeycloak();

    const getIsEnableAuthToggle = await loadToggle();

    expect(getIsEnableAuthToggle()).toBe(true);
  });

  it('keeps auth enabled even when DIAL_API_KEY is also set', async () => {
    process.env.NEXTAUTH_URL = 'http://localhost:4001';
    process.env.DIAL_API_KEY = 'dial-api-key';
    configureKeycloak();

    // Regression: DIAL_API_KEY must no longer take precedence over a
    // configured auth provider.
    const getIsEnableAuthToggle = await loadToggle();

    expect(getIsEnableAuthToggle()).toBe(true);
  });

  it('disables auth when no provider is configured', async () => {
    process.env.NEXTAUTH_URL = 'http://localhost:4001';
    process.env.DIAL_API_KEY = 'dial-api-key';

    const getIsEnableAuthToggle = await loadToggle();

    expect(getIsEnableAuthToggle()).toBe(false);
  });

  it('disables auth when a provider is configured but auth URL is missing', async () => {
    configureKeycloak();

    const getIsEnableAuthToggle = await loadToggle();

    expect(getIsEnableAuthToggle()).toBe(false);
  });
});
