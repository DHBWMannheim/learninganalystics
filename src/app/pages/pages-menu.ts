import { NbMenuItem } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';

export const PRE_COURSE_MENU_ITEMS = async (ts: TranslateService): Promise<NbMenuItem[]> => [
  {
    title: 'Dashboard',
    icon: 'home-outline',
    link: '/pages/dashboard',
    home: true,
  },

  {
    title: 'Courses',
    group: true,
  },
  

 
];

export const POST_COURSE_MENU_ITEMS = async (ts: TranslateService): Promise<NbMenuItem[]>  => [
  {
    title: 'Join or Create',
    icon: 'plus-square-outline',
    link: '/pages/new-course',
  },

  //---

  //---
  {
    title: 'PERSONAL',
    group: true,
  },
  {
    title: await ts.get('menu.todos').toPromise(),
    icon: 'checkmark-square-outline',
    link: '/pages/todos',
  },
]

// TODO: Loggin wait -> actionpage?
