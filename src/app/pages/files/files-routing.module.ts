import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { FilesComponent } from './files.component';

const routes: Routes = [
  {
    path: '',
    component: FilesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FilesRoutingModule {}
