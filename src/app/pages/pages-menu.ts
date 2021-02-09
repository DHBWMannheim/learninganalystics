import { NbMenuItem } from '@nebular/theme';

// TODO: Wird das zu Moodle-Ähnlich??
export const MENU_ITEMS: NbMenuItem[] = [
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
    title: 'Verteilte Systeme',
    icon: 'book-outline', // TODO:
    children: [
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
    ],
  },

  {
    title: 'Theoretische Informatik',
    icon: 'book-outline', // TODO:
    children: [
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
    ],
  },

  {
    title: 'Betriebssysteme', //TODO: Hier in der Gruppe Das Course Management unterbringen. Jeder Nutzer kann selber kurse anlegen und beliebig vielen joinen -> z.B. nachhilfe
    icon: 'book-outline', // TODO:
    children: [
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
    ],
  },

  {
    title: 'Kommunikationssysteme', //TODO: Hier in der Gruppe Das Course Management unterbringen. Jeder Nutzer kann selber kurse anlegen und beliebig vielen joinen -> z.B. nachhilfe
    icon: 'book-outline', // TODO:
    children: [
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
    ],
  },

  {
    title: 'Join or Create',
    icon: 'plus-square-outline',
    link: '/pages/feedback',
  },

  //---

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

// TODO: Loggin wait -> actionpage?
