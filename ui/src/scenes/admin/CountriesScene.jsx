/**
 * Admin — countries list. Super-admin only.
 */
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { routeBuilders } from '../../common/constants/routes.js';
import { PageLayout } from '../../components/layout/PageLayout.jsx';
import { useProviderFetch } from '../../hooks/useProviderFetch.js';
import { CountryProvider } from '../../providers/index.js';
import { Card } from '../../components/primitives/Card.jsx';
import { Spinner } from '../../components/primitives/Spinner.jsx';
import { Button } from '../../components/primitives/Button.jsx';
import { Badge } from '../../components/primitives/Badge.jsx';

export default function CountriesScene() {
  const { t } = useTranslation();
  const { data, loading } = useProviderFetch(
    () => CountryProvider.listCountries({ enabled: false }),
    { deps: [] },
  );

  return (
    <PageLayout title={t('admin.countries.title')}>
      <Card>
        {loading && <Spinner />}
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t('admin.countries.columns.name')}</th>
              <th>{t('admin.countries.columns.iso2')}</th>
              <th>{t('admin.countries.columns.iso3')}</th>
              <th>{t('admin.countries.columns.defaultCurrency')}</th>
              <th>{t('admin.countries.columns.defaultLanguage')}</th>
              <th>{t('admin.countries.columns.status')}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {(data || []).map((c) => (
              <tr key={c.iso2Code}>
                <td>
                  <Link to={routeBuilders.adminCountryDetail(c.iso2Code)}>{c.name}</Link>
                </td>
                <td>{c.iso2Code}</td>
                <td>{c.iso3Code}</td>
                <td>{c.defaultCurrencyCode}</td>
                <td>{c.defaultLanguageCode}</td>
                <td>
                  <Badge variant={c.enabled ? 'success' : 'neutral'}>
                    {c.enabled
                      ? t('admin.countries.status.enabled')
                      : t('admin.countries.status.disabled')}
                  </Badge>
                </td>
                <td>
                  <Link to={routeBuilders.adminCountryDetail(c.iso2Code)}>
                    <Button variant="ghost">{t('common.edit')}</Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </PageLayout>
  );
}