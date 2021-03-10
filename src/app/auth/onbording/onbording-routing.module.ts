import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { OnbordingComponent } from './onbording.component';

const routes: Routes = [
  {
    path: '',
    component: OnbordingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnbordingRoutingModule {}
