import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search.component';
import { NbCardModule, NbListModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { SearchRoutingModule } from './search-routing.module';

@NgModule({
  declarations: [SearchComponent],
  imports: [
    CommonModule,
    ThemeModule,
    NbCardModule,
    SearchRoutingModule,
    NbListModule,
  ],
})
export class SearchModule {}
