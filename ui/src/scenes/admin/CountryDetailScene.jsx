/**
 * Admin — country detail with quick links to its config, KYC requirements,
 * and organization requirements. Also allows toggling enabled/disabled.
 */
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { routeBuilders } from '../../common/constants/routes.js';
import { PageLayout } from '../../components/layout/PageLayout.jsx';
import { useProviderFetch } from '../../hooks/useProviderFetch.js';
import { useToast } from '../../contexts/ToastContext.jsx';
import { CountryProvider } from '../../providers/index.js';
import { Card } from '../../components/primitives/Card.jsx';
import { Spinner } from '../../components/primitives/Spinner.jsx';
import { Button } from '../../components/primitives/Button.jsx';
import { Badge } from '../../components/primitives/Badge.jsx';

export default function CountryDetailScene() {
  const { code } = useParams();
  const { t } = useTranslation();
  const toast = useToast();
  const [saving, setSaving] = useState(false);

  const { data: country, loading, refetch } = useProviderFetch(
    () => CountryProvider.getCountry(code),
    { deps: [code] },
  );

  const handleToggleStatus = async () => {
    if (!country) return;
    setSaving(true);
    try {
      const res = await CountryProvider.changeCountryStatus(code, {
        enabled: !country.enabled,
      });
      if (!res.ok) {
        toast.error(res.messages?.[0] || 'Failed');
        return;
      }
      toast.success(t('common.save'));
      refetch();
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageLayout
      title={country?.name || code}
      subtitle={country?.iso2Code ? `ISO ${country.iso2Code}` : `${code}`}
      actions={
        country && (
          <>
            <Link to={routeBuilders.adminCountryConfig(code)}>
              <Button variant="ghost">{t('admin.countries.configuration.title')}</Button>
            </Link>
            <Link to={routeBuilders.adminCountryKycRequirements(code)}>
              <Button variant="ghost">{t('navigation.kycCases')}</Button>
            </Link>
            <Link to={routeBuilders.adminCountryOrgRequirements(code)}>
              <Button variant="ghost">
                {t('organization.create.sections.registration', { defaultValue: 'Requirements' })}
              </Button>
            </Link>
            <Button
              variant={country.enabled ? 'danger' : 'primary'}
              onClick={handleToggleStatus}
              disabled={saving}
            >
              {country.enabled
                ? t('admin.countries.status.disabled')
                : t('admin.countries.status.enabled')}
            </Button>
          </>
        )
      }
    >
      {loading && <Spinner />}
      {country && (
        <>
          <Card>
            <dl>
              <dt>{t('admin.countries.columns.name')}</dt>
              <dd>{country.name}</dd>
              <dt>{t('admin.countries.columns.iso2')}</dt>
              <dd>{country.iso2Code}</dd>
              <dt>{t('admin.countries.columns.iso3')}</dt>
              <dd>{country.iso3Code}</dd>
              <dt>{t('admin.countries.columns.defaultCurrency')}</dt>
              <dd>{country.defaultCurrencyCode}</dd>
              <dt>{t('admin.countries.columns.defaultLanguage')}</dt>
              <dd>{country.defaultLanguageCode}</dd>
              <dt>{t('admin.countries.columns.status')}</dt>
              <dd>
                <Badge variant={country.enabled ? 'success' : 'neutral'}>
                  {country.enabled
                    ? t('admin.countries.status.enabled')
                    : t('admin.countries.status.disabled')}
                </Badge>
              </dd>
            </dl>
          </Card>

          <Card>
            <h3>{t('admin.countries.currencies', { defaultValue: 'Currencies' })}</h3>
            <ul>
              {(country.currencies || []).map((cur) => (
                <li key={cur.code}>
                  {cur.code} — {cur.name}
                  {cur.isDefault && <Badge variant="info">{t('common.default', { defaultValue: 'Default' })}</Badge>}
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h3>{t('admin.countries.languages', { defaultValue: 'Languages' })}</h3>
            <ul>
              {(country.languages || []).map((lang) => (
                <li key={lang.code}>
                  {lang.code} — {lang.name}
                  {lang.isDefault && <Badge variant="info">{t('common.default', { defaultValue: 'Default' })}</Badge>}
                </li>
              ))}
            </ul>
          </Card>
        </>
      )}
    </PageLayout>
  );
}
