import { NbMenuItem } from '@nebular/theme';

// TODO: mobile autoclose

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'home-outline',
    link: '/pages/dashboard',
    home: true,
  },
  //---
  {
    title: 'COURSE',//TODO: Hier in der Gruppe Das Course Management unterbringen. Jeder Nutzer kann selber kurse anlegen und beliebig vielen joinen -> z.B. nachhilfe
    group: true,
  },
  {
    title: 'Exams',
    icon: 'award-outline',
    link: '/pages/exams',
  },
  {
    title: 'Files',
    icon: 'file-outline',
    link: '/pages/files',
  },
  {
    title: 'Index Cards',
    icon: 'book-outline',
    link: '/pages/index-cards',
  },
  {
    title: 'Feedback',
    icon: 'message-square-outline',
    link: '/pages/feedback',
  },
  //---
  {
    title: 'PERSONAL',
    group: true,
  },
  {
    title: 'Todos',
    icon: 'checkmark-square-outline',
    link: '/pages/todos',
  },
];
