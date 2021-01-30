import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'home-outline',
    link: '/pages/dashboard',
    home: true,
  },
  //--- TODO: ist es besser ein collapsable menü zu machen?
  {
    title: 'COURSES',//TODO: Hier in der Gruppe Das Course Management unterbringen. Jeder Nutzer kann selber kurse anlegen und beliebig vielen joinen -> z.B. nachfilfe
    group: true,
  },
  {
    title: 'Index Cards',
    icon: 'book-outline',
    link: '/pages/index-cards',
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
    badge: {
      text: '30',//TODO:
      status: 'primary',
    },
  },
];
