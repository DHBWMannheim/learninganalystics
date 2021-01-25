import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { TodosComponent } from './todos.component';

const routes: Routes = [{
  path: '',
  component: TodosComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TodosRoutingModule {
}
