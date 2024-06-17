import { createFileRoute } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Descriptions, Tag } from '@douyinfe/semi-ui';
import { useCurrentInstance } from '@/hooks/useCurrentInstance';
import { useMeiliClient } from '@/hooks/useMeiliClient';
import { useInstanceStats } from '@/hooks/useInstanceStats';
import { useMemo } from 'react';
import { Copyable } from '@/components/Copyable';
import { getTimeText } from '@/utils/text';
import _ from 'lodash';
import { useInstanceHealth } from '@/hooks/useInstanceHealth';
import { IndexList } from '@/components/IndexList';
import { TitleWithUnderline } from '@/components/title';
import { Tooltip } from '@arco-design/web-react';
import { InsFormModal } from '@/components/instanceFormModal';

function InsDash() {
  const { t } = useTranslation('instance');
  const currentInstance = useCurrentInstance();
  const client = useMeiliClient();
  const stats = useInstanceStats(client);
  const isHealth = useInstanceHealth(client);

  const insDescriptionsData = useMemo(() => {
    return [
      {
        key: t('host'),
        value: <Copyable>{currentInstance.host}</Copyable>,
      },
      {
        key: t('common:updated_at'),
        value: getTimeText(currentInstance.updatedTime),
      },
      {
        key: t('db_size'),
        value: `${_.ceil((stats?.databaseSize ?? 0) / 1048576, 2)} MB`,
      },
      {
        key: t('status.label'),
        value: isHealth ? <Tag color="green">{t('status.available')}</Tag> : <Tag color="amber">{t('unknown')}</Tag>,
      },
    ];
  }, [currentInstance.host, currentInstance.updatedTime, isHealth, stats?.databaseSize, t]);

  return (
    <main className="flex-1 grid grid-cols-4 overflow-scroll max-h-fit">
      <div className="p-4 laptop:col-start-2 laptop:col-end-4 col-start-1 col-end-5 flex flex-col gap-4">
        <div flex flex-row gap-4 items-baseline>
          <TitleWithUnderline>{`#${currentInstance.id} ${currentInstance.name}`}</TitleWithUnderline>
          <InsFormModal ins={currentInstance} type="edit">
            <Tooltip content={t('edit')} position="right" mini>
              <div className="i-lucide:edit w-1em h-1em cursor-pointer"></div>
            </Tooltip>
          </InsFormModal>
        </div>
        <Descriptions className="" align="left" data={insDescriptionsData} />
        <IndexList client={client} />
      </div>
    </main>
  );
}

export const Route = createFileRoute('/ins/$insID/_layout/')({
  component: InsDash,
});
