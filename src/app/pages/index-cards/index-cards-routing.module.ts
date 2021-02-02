import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { IndexCardsComponent } from './index-cards.component';

const routes: Routes = [
  {
    path: '',
    component: IndexCardsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndexCardsRoutingModule {}
