import { Api } from '../src/api/Api.js';
import { CacheStrategies } from '../src/api/CacheStrategies.js';

describe('Api request dispatch', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('dispatches write requests to the XHR implementation', async () => {
    const response = { ok: true, status: 201, data: {}, headers: {} };
    const performRequest = jest.spyOn(Api, 'performRequest').mockResolvedValue(response);

    await expect(Api.request({ method: 'POST', path: '/register', body: {} })).resolves.toBe(response);

    expect(performRequest).toHaveBeenCalledWith(
      expect.objectContaining({ method: 'POST', url: '/register' }),
    );
  });

  it('dispatches GET requests through the cache handler', async () => {
    const response = { ok: true, status: 200, data: [], headers: {} };
    const handleGet = jest.spyOn(Api, 'handleGet').mockResolvedValue(response);

    await expect(
      Api.request({ method: 'GET', path: '/countries', cache: CacheStrategies.None }),
    ).resolves.toBe(response);

    expect(handleGet).toHaveBeenCalledWith(expect.objectContaining({ url: '/countries' }));
  });

  it('dispatches uncached GET requests to the XHR implementation', async () => {
    const response = { ok: true, status: 200, data: [], headers: {} };
    const performRequest = jest.spyOn(Api, 'performRequest').mockResolvedValue(response);

    await expect(
      Api.handleGet({
        url: '/countries',
        cacheKey: 'GET:/countries',
        cacheStrategy: CacheStrategies.None,
        responseType: 'json',
        options: {},
      }),
    ).resolves.toBe(response);

    expect(performRequest).toHaveBeenCalledWith(
      expect.objectContaining({ method: 'GET', url: '/countries' }),
    );
  });
});
