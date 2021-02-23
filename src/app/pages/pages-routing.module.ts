import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'todos',
        loadChildren: () =>
          import('./todos/todos.module').then((m) => m.TodosModule),
      },
      {
        path: 'search',
        loadChildren: () =>
          import('./search/search.module').then((m) => m.SearchModule),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./profile/profile.module').then((m) => m.ProfileModule),
      },
      {
        path: 'new-course',
        loadChildren: () =>
          import('./new-course/new-course.module').then(
            (m) => m.NewCourseModule,
          ),
      },

      {
        path: 'index-cards/:courseId',
        loadChildren: () =>
          import('./index-cards/index-cards.module').then(
            (m) => m.IndexCardsModule,
          ),
      },
      {
        path: 'files/:courseId',
        loadChildren: () =>
          import('./files/files.module').then((m) => m.FilesModule),
      },
      {
        path: 'feedback/:courseId',
        loadChildren: () =>
          import('./feedback/feedback.module').then((m) => m.FeedbackModule),
      },
      {
        path: 'exams/:courseId',
        loadChildren: () =>
          import('./exams/exams.module').then((m) => m.ExamsModule),
      },

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
