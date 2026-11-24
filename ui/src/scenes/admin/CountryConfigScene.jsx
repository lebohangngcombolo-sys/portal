/**
 * Admin — country configuration versions and publishing.
 *
 * Shows the active version, the version history, and provides a textarea
 * for editing/publishing a new version. Rollback restores a previous
 * version.
 */
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { formatDateTime } from '../../common/utils/date.js';
import { PageLayout } from '../../components/layout/PageLayout.jsx';
import { useProviderFetch } from '../../hooks/useProviderFetch.js';
import { useToast } from '../../contexts/ToastContext.jsx';
import { CountryProvider } from '../../providers/index.js';
import { Card } from '../../components/primitives/Card.jsx';
import { Spinner } from '../../components/primitives/Spinner.jsx';
import { Button } from '../../components/primitives/Button.jsx';
import { TextArea } from '../../components/primitives/Textarea.jsx';
import { Modal } from '../../components/primitives/Modal.jsx';

export default function CountryConfigScene() {
  const { code } = useParams();
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [changeSummary, setChangeSummary] = useState('');
  const [configText, setConfigText] = useState('');
  const [rollingBack, setRollingBack] = useState(null);

  const active = useProviderFetch(
    () => CountryProvider.getActiveConfiguration(code),
    { deps: [code] },
  );
  const versions = useProviderFetch(
    () => CountryProvider.listConfigurationVersions(code),
    { deps: [code] },
  );

  const openEdit = () => {
    setChangeSummary('');
    setConfigText(
      active.data?.configuration ? JSON.stringify(active.data.configuration, null, 2) : '',
    );
    setEditing(true);
  };

  const handlePublish = async () => {
    let configuration = null;
    if (configText.trim()) {
      try {
        configuration = JSON.parse(configText);
      } catch {
        toast.error(t('errors.malformedJson', { defaultValue: 'Invalid JSON' }));
        return;
      }
    }
    const res = await CountryProvider.publishConfiguration(code, {
      changeSummary,
      configuration,
    });
    if (!res.ok) {
      toast.error(res.messages?.[0] || 'Failed');
      return;
    }
    toast.success(t('common.save'));
    setEditing(false);
    active.refetch();
    versions.refetch();
  };

  const handleRollback = async () => {
    const res = await CountryProvider.rollbackConfiguration(code, {
      targetVersion: rollingBack.version,
      reason: 'Manual rollback',
    });
    if (!res.ok) {
      toast.error(res.messages?.[0] || 'Failed');
      return;
    }
    toast.success(t('common.save'));
    setRollingBack(null);
    active.refetch();
    versions.refetch();
  };

  return (
    <PageLayout
      title={t('admin.countries.configuration.title')}
      subtitle={code}
      actions={
        <Button variant="primary" onClick={openEdit}>
          {t('admin.countries.configuration.publish')}
        </Button>
      }
    >
      <Card>
        <h3>{t('admin.countries.configuration.currentVersion')}</h3>
        {active.loading && <Spinner />}
        {active.data && (
          <>
            <p>
              v{active.data.version} — {active.data.status}
            </p>
            <p>{active.data.changeSummary}</p>
            <pre>{JSON.stringify(active.data.configuration, null, 2)}</pre>
          </>
        )}
      </Card>

      <Card>
        <h3>{t('admin.countries.configuration.versions')}</h3>
        {versions.loading && <Spinner />}
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t('admin.countries.configuration.version', { defaultValue: 'Version' })}</th>
              <th>{t('admin.countries.configuration.status', { defaultValue: 'Status' })}</th>
              <th>{t('admin.countries.configuration.published', { defaultValue: 'Published' })}</th>
              <th>{t('admin.countries.configuration.summary', { defaultValue: 'Summary' })}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {(versions.data || []).map((v) => (
              <tr key={v.version}>
                <td>v{v.version}</td>
                <td>{v.status}</td>
                <td>
                  {v.publishedAt
                    ? formatDateTime(v.publishedAt, i18n.language)
                    : '—'}
                </td>
                <td>{v.changeSummary || '—'}</td>
                <td>
                  {v.status !== 'DRAFT' && (
                    <Button variant="ghost" onClick={() => setRollingBack(v)}>
                      {t('admin.countries.configuration.rollback')}
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Modal open={editing} onClose={() => setEditing(false)}>
        <h2>{t('admin.countries.configuration.publish')}</h2>
        <TextArea
          label={t('admin.countries.configuration.changeSummary')}
          value={changeSummary}
          onChange={(e) => setChangeSummary(e.target.value)}
          rows={2}
          maxLength={500}
          required
        />
        <TextArea
          label={t('admin.countries.configuration.json', { defaultValue: 'Configuration (JSON)' })}
          value={configText}
          onChange={(e) => setConfigText(e.target.value)}
          rows={15}
        />
        <Button
          variant="primary"
          onClick={handlePublish}
          disabled={!changeSummary.trim()}
        >
          {t('admin.countries.configuration.publish')}
        </Button>
        <Button variant="ghost" onClick={() => setEditing(false)}>
          {t('common.cancel')}
        </Button>
      </Modal>

      <Modal open={Boolean(rollingBack)} onClose={() => setRollingBack(null)}>
        <h2>{t('admin.countries.configuration.rollback')}</h2>
        <p>
          {t('admin.countries.configuration.rollbackConfirm', {
            version: rollingBack?.version,
            defaultValue: 'Roll back to version {{version}}?',
          })}
        </p>
        <Button variant="danger" onClick={handleRollback}>
          {t('admin.countries.configuration.rollback')}
        </Button>
        <Button variant="ghost" onClick={() => setRollingBack(null)}>
          {t('common.cancel')}
        </Button>
      </Modal>
    </PageLayout>
  );
}