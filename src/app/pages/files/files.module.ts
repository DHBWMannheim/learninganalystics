import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbListModule,
  NbProgressBarModule,
} from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
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
    NbIconModule,
    TranslateModule.forChild(),
  ],
  declarations: [FilesComponent],
})
export class FilesModule {}
