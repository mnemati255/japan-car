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
  job: icon('ic-job'),
  blog: icon('ic-blog'),
  chat: icon('ic-chat'),
  mail: icon('ic-mail'),
  user: icon('ic-user'),
  file: icon('ic-file'),
  lock: icon('ic-lock'),
  tour: icon('ic-tour'),
  order: icon('ic-order'),
  label: icon('ic-label'),
  blank: icon('ic-blank'),
  kanban: icon('ic-kanban'),
  folder: icon('ic-folder'),
  course: icon('ic-course'),
  params: icon('ic-params'),
  banking: icon('ic-banking'),
  booking: icon('ic-booking'),
  invoice: icon('ic-invoice'),
  product: icon('ic-product'),
  calendar: icon('ic-calendar'),
  disabled: icon('ic-disabled'),
  external: icon('ic-external'),
  subpaths: icon('ic-subpaths'),
  menuItem: icon('ic-menu-item'),
  ecommerce: icon('ic-ecommerce'),
  analytics: icon('ic-analytics'),
  dashboard: icon('ic-dashboard'),
};

// ----------------------------------------------------------------------

export function navData(t: TFunction<any, any>): NavSectionProps['data'] {
  return [
    {
      subheader: t('subheader'),
      items: [
        {
          title: t('auctions'),
          path: paths.dashboard.auction.root,
          icon: ICONS.folder,
          children: [
            { title: t('list'), path: paths.dashboard.auction.root },
            { title: t('create'), path: paths.dashboard.auction.new },
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
          title: t('baseInfo'),
          path: paths.dashboard.baseInfo.root,
          icon: ICONS.menuItem,
        },
      ],
    },
  ];
}
