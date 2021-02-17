import { NbMenuItem } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';

export const PRE_COURSE_MENU_ITEMS = async (
  ts: TranslateService,
): Promise<NbMenuItem[]> => [
  {
    title: 'Dashboard',
    icon: 'home-outline',
    link: '/pages/dashboard',
    home: true,
  },

  {
    title: await ts.get('menu.courses').toPromise(),
    group: true,
  },
];

export const POST_COURSE_MENU_ITEMS = async (
  ts: TranslateService,
): Promise<NbMenuItem[]> => [
  {
    title: await ts.get('menu.joinCreate').toPromise(),
    icon: 'plus-square-outline',
    link: '/pages/new-course',
  },
  {
    title: await ts.get('menu.personal').toPromise(),
    group: true,
  },
  {
    title: await ts.get('menu.todos').toPromise(),
    icon: 'checkmark-square-outline',
    link: '/pages/todos',
  },
];

// TODO: Loggin wait -> actionpage?
