'use client';

import { CustomBreadcrumbs } from '@/components/custom-breadcrumbs';
import { DashboardContent } from '@/layouts/dashboard';
import Paper from '@mui/material/Paper';
import Tab, { TabProps } from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useTabs } from 'minimal-shared/hooks';
import { Fragment } from 'react';
import { BrandListView } from './brand-list-view';
import { ColorListView } from './color-list-view';
import { ModelListView } from './model-list-view';

const TABS: TabProps[] = [
  {
    value: 'brands',
    label: 'Brands',
  },
  {
    value: 'models',
    label: 'Models',
  },
  {
    value: 'colors',
    label: 'Colors',
  },
];

export function BaseInfoTabsView() {
  const tab = useTabs('brands');

  return (
    <>
      <DashboardContent>
        <CustomBreadcrumbs heading="Base informations" sx={{ mb: { xs: 3, md: 5 } }} />

        <Tabs value={tab.value} onChange={tab.onChange}>
          {TABS.map((x) => (
            <Tab key={x.value} value={x.value} label={x.label} />
          ))}
        </Tabs>

        <Paper variant="outlined" sx={{ mt: 3 }}>
          {TABS.map((x) =>
            x.value === tab.value ? <Fragment key={x.value}>
              { tab.value == 'brands' && <BrandListView /> }
              { tab.value == 'models' && <ModelListView /> }
              { tab.value == 'colors' && <ColorListView /> }
            </Fragment> : null
          )}
        </Paper>
      </DashboardContent>
    </>
  );
}
