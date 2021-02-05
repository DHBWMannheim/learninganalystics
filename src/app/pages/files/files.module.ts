import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  NbButtonModule,
  NbCardModule,
  NbInputModule,
  NbListModule,
  NbProgressBarModule,
} from '@nebular/theme';
import { NgxFileDropModule } from 'ngx-file-drop';

import { ThemeModule } from '../../@theme/theme.module';
import { FilesRoutingModule } from './files-routing.module';
import { FilesComponent } from './files.component';

@NgModule({
  imports: [
    CommonModule,
    NbCardModule,
    ThemeModule,
    FilesRoutingModule,
    NgxFileDropModule,
    NbInputModule,
    NbButtonModule,
    NbListModule,
    NbProgressBarModule,
  ],
  declarations: [FilesComponent],
})
export class FilesModule {}
