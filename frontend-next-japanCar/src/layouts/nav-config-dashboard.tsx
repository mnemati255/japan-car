import type { NavSectionProps } from '@/components/nav-section';

import { paths } from '@/routes/paths';

import { CONFIG } from '@/global-config';

import { SvgColor } from '@/components/svg-color';
import { TFunction } from 'i18next';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`${CONFIG.assetsDir}/assets/icons/navbar/${name}.svg`} />
);

const ICONS = {
  user: icon('ic-user'),
  lock: icon('ic-lock'),
  folder: icon('ic-folder'),
  menuItem: icon('ic-menu-item'),
  customer: icon('ic-customer'),
  dashboard: icon('ic-dashboard'),
  notif: icon('ic-notif'),
  file: icon('ic-file'),
};

// ----------------------------------------------------------------------

export function navData(t: TFunction<any, any>): NavSectionProps['data'] {
  return [
    {
      subheader: t('subheader'),
      items: [
        {
          title: t('notification.notifications'),
          path: paths.dashboard.notification.root,
          icon: ICONS.notif,
          children: [
            { title: t('notification.inbox'), path: paths.dashboard.notification.inbox },
            {
              title: t('notification.resolved'),
              path: paths.dashboard.notification.resolved,
            },
          ],
        },
        {
          title: t('cars'),
          path: paths.dashboard.car.root,
          icon: ICONS.folder,
          children: [
            { title: t('list'), path: paths.dashboard.car.root },
            { title: t('create'), path: paths.dashboard.car.new },
          ],
        },
        {
          title: t('customers'),
          path: paths.dashboard.customer.root,
          icon: ICONS.customer,
          children: [
            { title: t('list'), path: paths.dashboard.customer.root },
            { title: t('create'), path: paths.dashboard.customer.new },
          ],
        },
        {
          title: t('users'),
          path: paths.dashboard.user.root,
          icon: ICONS.user,
          children: [
            { title: t('list'), path: paths.dashboard.user.root },
            { title: t('create'), path: paths.dashboard.user.new },
          ],
        },
        {
          title: t('roles'),
          path: paths.dashboard.role.root,
          icon: ICONS.lock,
          children: [
            { title: t('list'), path: paths.dashboard.role.root },
            { title: t('create'), path: paths.dashboard.role.new },
          ],
        },
        {
          title: t('reports'),
          path: paths.dashboard.reports.root,
          icon: ICONS.file,
          children: [
            { title: t('cars'), path: paths.dashboard.reports.car },
          ],
        },
        {
          title: t('baseInfo.title'),
          path: paths.dashboard.baseInfo.root,
          icon: ICONS.menuItem,
          children: [
            { title: t('baseInfo.brands'), path: paths.dashboard.baseInfo.brand },
            { title: t('baseInfo.models'), path: paths.dashboard.baseInfo.model },
            { title: t('baseInfo.colors'), path: paths.dashboard.baseInfo.color },
            { title: t('baseInfo.parts'), path: paths.dashboard.baseInfo.part },
            { title: t('baseInfo.mechanics'), path: paths.dashboard.baseInfo.mechanic },
            { title: t('baseInfo.auctions'), path: paths.dashboard.baseInfo.auction },
          ],
        },
      ],
    },
  ];
}
