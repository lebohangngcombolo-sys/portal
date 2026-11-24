import { ConfigProvider } from '../../../providers/ConfigProvider.js';
import { Provider } from '../../../providers/Provider.js';

describe('ConfigProvider.loadAll', () => {
  it('uses the supported country and language lists when API data is unavailable', async () => {
    jest.spyOn(Provider, 'request').mockResolvedValue({
      ok: false,
      result: null,
      messages: ['Service unavailable'],
    });

    const config = await ConfigProvider.loadAll();

    expect(config.countries.map((country) => country.iso2Code)).toEqual(['ZA', 'PT']);
    expect(config.languages.map((language) => language.code)).toEqual(['en', 'pt']);
    expect(config.errors.map((error) => error.scope)).toEqual(['countries', 'languages']);
  });

  it('prefers country and language data returned by the API', async () => {
    jest.spyOn(Provider, 'request')
      .mockResolvedValueOnce({
        ok: true,
        result: [{ iso2Code: 'BW', name: 'Botswana' }],
      })
      .mockResolvedValueOnce({
        ok: true,
        result: [{ code: 'sw', name: 'Swahili' }],
      });

    const config = await ConfigProvider.loadAll();

    expect(config.countries).toEqual([{ iso2Code: 'BW', name: 'Botswana' }]);
    expect(config.languages).toEqual([{ code: 'sw', name: 'Swahili' }]);
  });
});
