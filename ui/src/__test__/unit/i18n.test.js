import i18n, { initI18n } from '../../i18n/index.js';

describe('translation resources', () => {
  beforeAll(async () => {
    await initI18n();
  });

  it('resolves dotted auth keys from the English bundle', () => {
    expect(i18n.t('auth.register.title', { lng: 'en' })).toBe(
      'Create your TradeBridge Africa account',
    );
  });

  it('resolves dotted common keys from the English bundle', () => {
    expect(i18n.t('common.signIn', { lng: 'en' })).toBe('Sign in');
  });

  it('resolves dotted auth keys from the Portuguese bundle', () => {
    expect(i18n.t('auth.register.title', { lng: 'pt' })).toBe(
      'Criar a sua conta TradeBridge Africa',
    );
  });

  it('resolves organization and security keys in both supported languages', () => {
    expect(i18n.t('organization.list.title', { lng: 'en' })).toBe('Organizations');
    expect(i18n.t('organization.list.title', { lng: 'pt' })).toBe('Organizações');
    expect(i18n.t('account.security.subtitle', { lng: 'en' })).toBe(
      'Manage your password, two-factor authentication, and signed-in devices.',
    );
    expect(i18n.t('account.security.subtitle', { lng: 'pt' })).toBe(
      'Faça a gestão da palavra-passe, da autenticação de dois fatores e dos dispositivos com sessão iniciada.',
    );
  });
});
