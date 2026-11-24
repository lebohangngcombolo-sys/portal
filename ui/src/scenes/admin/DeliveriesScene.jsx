/**
 * Admin — notification deliveries.
 *
 * Search deliveries by status, channel, or notification ID. Inspect a
 * delivery to see its full failure chain and retry eligible ones.
 */
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { formatDateTime } from '../../common/utils/date.js';
import { CHANNEL_CODES } from '../../common/constants/channels.js';
import { PageLayout } from '../../components/layout/PageLayout.jsx';
import { useDebounce } from '../../hooks/useDebounce.js';
import { usePagination } from '../../hooks/usePagination.js';
import { useProviderFetch } from '../../hooks/useProviderFetch.js';
import { useToast } from '../../contexts/ToastContext.jsx';
import { NotificationProvider } from '../../providers/index.js';
import { Card } from '../../components/primitives/Card.jsx';
import { Spinner } from '../../components/primitives/Spinner.jsx';
import { Button } from '../../components/primitives/Button.jsx';
import { TextInput } from '../../components/primitives/TextInput.jsx';
import { Select } from '../../components/primitives/Select.jsx';
import { Pagination } from '../../components/primitives/Pagination.jsx';
import { Badge } from '../../components/primitives/Badge.jsx';
import { Modal } from '../../components/primitives/Modal.jsx';
import { DeliveryDetail } from '../../components/domain/DeliveryDetail.jsx';

const DELIVERY_STATUSES = ['ACCEPTED', 'DELIVERED', 'BOUNCED', 'FAILED'];

export default function DeliveriesScene() {
  const { t, i18n } = useTranslation();
  const toast = useToast();
  const [status, setStatus] = useState('');
  const [channel, setChannel] = useState('');
  const [search, setSearch] = useState('');
  const debounced = useDebounce(search, 400);
  const pagination = usePagination({ page: 0, size: 20 });
  const [detail, setDetail] = useState(null);

  const { data, loading, refetch } = useProviderFetch(
    () =>
      NotificationProvider.adminSearchDeliveries({
        status: status || undefined,
        channel: channel || undefined,
        page: pagination.page,
        size: pagination.size,
      }),
    { deps: [status, channel, debounced, pagination.page, pagination.size] },
  );

  useEffect(() => {
  pagination.setPage(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [status, channel]);

  const content = data?.content || [];
  const page = data?.page || { number: 0, size: pagination.size, totalElements: 0, totalPages: 0 };

  const handleRetry = async (delivery) => {
    const res = await NotificationProvider.adminRetryDelivery(delivery.id);
    if (!res.ok) {
      toast.error(res.messages?.[0] || 'Failed');
      return;
    }
    toast.success(t('common.save'));
    setDetail(null);
    refetch();
  };

  const statusOptions = [
    { value: '', label: t('common.all', { defaultValue: 'All' }) },
    ...DELIVERY_STATUSES.map((s) => ({ value: s, label: s })),
  ];
  const channelOptions = [
    { value: '', label: t('common.all', { defaultValue: 'All' }) },
    ...CHANNEL_CODES.map((c) => ({ value: c, label: c })),
  ];

  return (
    <PageLayout title={t('admin.deliveries.title', { defaultValue: 'Deliveries' })}>
      <Card>
        <div className="filters">
          <Select
            label={t('admin.deliveries.status', { defaultValue: 'Status' })}
            options={statusOptions}
            value={status}
            onChange={setStatus}
          />
          <Select
            label={t('admin.deliveries.channel', { defaultValue: 'Channel' })}
            options={channelOptions}
            value={channel}
            onChange={setChannel}
          />
          <TextInput
            label={t('admin.deliveries.search', { defaultValue: 'Search' })}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading && <Spinner />}
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t('admin.deliveries.provider', { defaultValue: 'Provider' })}</th>
              <th>{t('admin.deliveries.statusLabel', { defaultValue: 'Status' })}</th>
              <th>{t('admin.deliveries.attempts', { defaultValue: 'Attempts' })}</th>
              <th>{t('admin.deliveries.created', { defaultValue: 'Created' })}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {content.map((d) => (
              <tr key={d.id}>
                <td>{d.provider}</td>
                <td>
                  <Badge
                    variant={
                      d.status === 'DELIVERED'
                        ? 'success'
                        : d.status === 'FAILED' || d.status === 'BOUNCED'
                          ? 'error'
                          : 'neutral'
                    }
                  >
                    {d.status}
                  </Badge>
                </td>
                <td>{d.attemptNumber}</td>
                <td>
                  {d.createdAt ? formatDateTime(d.createdAt, i18n.language) : '—'}
                </td>
                <td>
                  <Button variant="ghost" onClick={() => setDetail(d)}>
                    {t('common.view', { defaultValue: 'View' })}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          page={page.number}
          size={page.size}
          totalPages={page.totalPages}
          totalElements={page.totalElements}
          onPageChange={(n) => pagination.setPage(n)}
          onSizeChange={(s) => pagination.setSize(s)}
        />
      </Card>

      <Modal open={Boolean(detail)} onClose={() => setDetail(null)}>
        {detail && (
          <DeliveryDetail
            delivery={detail}
            onRetry={() => handleRetry(detail)}
            onClose={() => setDetail(null)}
          />
        )}
      </Modal>
    </PageLayout>
  );
}