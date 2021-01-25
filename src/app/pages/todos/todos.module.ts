import { NgModule } from "@angular/core";
import { NbCardModule, NbListModule } from "@nebular/theme";

import { ThemeModule } from "../../@theme/theme.module";
import { TodosComponent } from "./todos.component";

@NgModule({
  imports: [NbCardModule, ThemeModule, NbListModule],
  declarations: [TodosComponent],
})
export class Todosmodule {}
