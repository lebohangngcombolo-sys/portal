import { Api } from 'tb-state';

import { authTokenStore } from '../../../providers/AuthProvider.js';
import { Provider } from '../../../providers/Provider.js';

describe('Provider authenticated request handling', () => {
  afterEach(() => {
    authTokenStore.clear();
    Provider.setSessionExpiredHandler(null);
    Provider.reset();
  });

  it('retries a request once after the session handler refreshes the token', async () => {
    authTokenStore.setTokens({ accessToken: 'expired-token', refreshToken: 'refresh-token' });
    const request = jest
      .spyOn(Api, 'request')
      .mockResolvedValueOnce({
        status: 401,
        data: { success: false, code: 'INVALID_ACCESS_TOKEN', message: 'Unauthorized' },
        headers: {},
      })
      .mockResolvedValueOnce({
        status: 200,
        data: { success: true, data: { id: 'user-1' } },
        headers: {},
      });
    const sessionHandler = jest.fn(async () => {
      authTokenStore.setTokens({ accessToken: 'fresh-token', refreshToken: 'new-refresh-token' });
      return true;
    });
    Provider.setSessionExpiredHandler(sessionHandler);

    const result = await Provider.request({ method: 'GET', path: '/api/v1/identity/me' });

    expect(result.ok).toBe(true);
    expect(request).toHaveBeenCalledTimes(2);
    expect(request.mock.calls[0][0].headers.Authorization).toContain('expired-token');
    expect(request.mock.calls[1][0].headers.Authorization).toContain('fresh-token');
    expect(sessionHandler).toHaveBeenCalledWith({
      status: 401,
      code: 'INVALID_ACCESS_TOKEN',
      alreadyRetried: false,
    });
  });

  it('does not retry a request more than once', async () => {
    authTokenStore.setTokens({ accessToken: 'expired-token', refreshToken: 'refresh-token' });
    const request = jest.spyOn(Api, 'request').mockResolvedValue({
      status: 401,
      data: { success: false, code: 'INVALID_ACCESS_TOKEN', message: 'Unauthorized' },
      headers: {},
    });
    const sessionHandler = jest.fn(async ({ alreadyRetried }) => !alreadyRetried);
    Provider.setSessionExpiredHandler(sessionHandler);

    const result = await Provider.request({ method: 'GET', path: '/api/v1/identity/me' });

    expect(result.ok).toBe(false);
    expect(request).toHaveBeenCalledTimes(2);
    expect(sessionHandler).toHaveBeenCalledTimes(2);
    expect(sessionHandler).toHaveBeenLastCalledWith({
      status: 401,
      code: 'INVALID_ACCESS_TOKEN',
      alreadyRetried: true,
    });
  });

  it('does not deduplicate session restoration against a new profile request', async () => {
    const request = jest
      .spyOn(Api, 'request')
      .mockResolvedValueOnce({
        status: 401,
        data: { success: false, code: 'UNAUTHORIZED', message: 'Expired session' },
        headers: {},
      })
      .mockResolvedValueOnce({
        status: 200,
        data: { success: true, data: { id: 'new-user' } },
        headers: {},
      });

    await Promise.all([
      Provider.request({
        method: 'GET',
        path: '/api/v1/identity/me',
        skipSessionHandling: true,
        dedupeKey: 'session-restore:1',
      }),
      Provider.request({ method: 'GET', path: '/api/v1/identity/me' }),
    ]);

    expect(request).toHaveBeenCalledTimes(2);
  });
});
