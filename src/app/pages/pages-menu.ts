import { NbMenuItem } from '@nebular/theme';

// TODO: Wird das zu Moodle-Ähnlich??
export const PRE_COURSE_MENU_ITEMS: NbMenuItem[] = [
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
  {
    title: 'Join or Create',
    icon: 'plus-square-outline',
    link: '/pages/new-course',
  },
];

export const POST_COURSE_MENU_ITEMS = [
  {
    title: 'PERSONAL',
    group: true,
  },
  {
    title: 'Todos',
    icon: 'checkmark-square-outline',
    link: '/pages/todos',
  },
]

// TODO: Loggin wait -> actionpage?
