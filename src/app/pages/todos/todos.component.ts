import { Component, OnInit } from '@angular/core';
import { NbDialogConfig, NbDialogService } from '@nebular/theme';
import { AddComponent } from './add/add.component';
import { Todo, TodosService } from '../../@core/data/todos.service';

import { groupBy } from 'lodash';
import {
  format,
  startOfDay,
  subMonths,
  addMonths,
  startOfMonth,
  endOfMonth,
} from 'date-fns';
import { TranslateService } from '@ngx-translate/core';
import { eachDayOfInterval } from 'date-fns/esm';

const today = new Date();
const startDate = format(startOfMonth(subMonths(today, 1)), 'yyyy-MM-dd');
const endDate = format(endOfMonth(addMonths(today, 2)), 'yyyy-MM-dd');

@Component({
  selector: 'todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss'],
})
export class TodosComponent implements OnInit {
  items: Todo[] = [];

  echartOptions;

  loading = true;

  constructor(
    private readonly todosService: TodosService,
    private readonly dialogService: NbDialogService,
    private readonly translate: TranslateService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.reload();
    this.translate.onLangChange.subscribe(async ({ lang }) => {
      this.echartOptions = await this.generateChartConfig();
    });
    this.echartOptions = await this.generateChartConfig();
  }

  private async generateChartConfig() {
    return {
      title: {
        top: 30,
        left: 'center',
        text: `${startDate} - ${endDate}`,
      },
      tooltip: {
        position: 'top',
      },
      legend: {
        show: false,
      },
      visualMap: {
        max: this.echartOptions?.visualMap.max,
        show: false,
      },
      calendar: {
        dayLabel: {
          firstDay: 0,
          nameMap: await this.translate.get('todos.chart.day').toPromise(),
        },
        monthLabel: {
          nameMap: await this.translate.get('todos.chart.month').toPromise(),
        },
        top: 85,
        left: 46,
        right: 46,
        cellSize: ['auto', 32],
        range: [startDate, endDate],
        yearLabel: { show: false },
        itemStyle: {
          borderWidth: 1,
          borderColor: '#edf1f7',
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#8f9bb3',
            width: 1,
            type: 'solid',
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowBlur: 10,
          },
        },
      },
      series: {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: this.echartOptions?.series.data,
      },
    };
  }

  private reload() {
    this.loading = true;
    this.todosService.get().then((v) => {
      this.items = v;
      const dates = v.flatMap((todo) => {
        const start = todo.startDate || todo.endDate;
        const end = todo.endDate || todo.startDate;
        return start && end ? eachDayOfInterval({ start, end }) : [];
      });

      const dategroup = groupBy(
        dates,
        (date) => format(startOfDay(date), 'yyyy-MM-dd'),
      );

      let max = 0;
      this.echartOptions.series.data = Object.entries(dategroup).map(
        ([date, { length }]) => {
          if (length > max) max = length;
          return [date, length];
        },
      );
      this.echartOptions.visualMap.max = max;
      this.echartOptions = { ...this.echartOptions }; // Forces change detection
      this.loading = false;
    });
  }

  openAddDialog(model?: Todo) {
    const options: Partial<NbDialogConfig> = {};
    if (model) options.context = { model };

    this.dialogService.open(AddComponent, options).onClose.subscribe((v) => {
      if (v) this.reload();
    });
  }

  async toggleCompleted(checked: boolean, todo: Todo) {
    // TODO: add delayed write?
    todo.completed = checked;
    await this.todosService.upsert(todo);
  }
}
