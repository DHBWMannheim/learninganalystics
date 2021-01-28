import { Component, OnInit } from '@angular/core';
import { NbDialogConfig, NbDialogService } from '@nebular/theme';
import { AddComponent } from './add/add.component';
import { Todo, TodosService } from '../../@core/data/todos.service';

import { groupBy } from 'lodash';
import { startOfDay } from 'date-fns';

function getVirtulData(year: string) {
  year = year || '2017';
  const date = +echarts.number.parseDate(year + '-01-01');
  const end = +echarts.number.parseDate(+year + 1 + '-01-01');
  const dayTime = 3600 * 24 * 1000;
  const data = [];
  for (let time = date; time < end; time += dayTime) {
    data.push([
      echarts.format.formatTime('yyyy-MM-dd', time),
      Math.floor(Math.random() * 10000),
    ]);
  }
  return data;
}

@Component({
  selector: 'todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss'],
})
export class TodosComponent implements OnInit {
  items: Todo[] = [];

  echartOptions = {
    title: {
      top: 30,
      left: 'center',
      text: '2020-09-01' + ' - ' + '2021-03-30', //TODO:
    },
    tooltip: {
      formatter: '{c0}<br />',
    },
    visualMap: {
      min: 0,
      max: 0, // TODO:
      type: 'piecewise',
      splitNumber: '2', // TODO:
      orient: 'horizontal',
      left: 'center',
      top: 65,
    },
    calendar: {
      top: 120,
      left: 30,
      right: 30,
      cellSize: ['auto', 18],
      range: ['2020-09-01', '2021-03-30'], // TODO: Semester
      itemStyle: {
        borderWidth: 0.5,
      },
      yearLabel: { show: false },
    },
    series: {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: [],
    },
  };

  loading = true;

  constructor(
    private readonly todosService: TodosService,
    private readonly dialogService: NbDialogService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.reload();
  }

  private reload() {
    // TODO: add load limit, ...
    this.loading = true;
    this.todosService.get().then((v) => {
      this.items = v;

      const dategroup = groupBy(v, ({ deadline }) =>
        startOfDay(deadline).toISOString(),
      );
      //TODO: undefined

      let max = 0;
      this.echartOptions.series.data = Object.entries(dategroup).map(
        ([date, { length }]) => {
          if (length > max) max = length;
          return [echarts.format.formatTime('yyyy-MM-dd', date), length];
        },
      );
      this.echartOptions.visualMap.max = max;

      this.echartOptions = { ...this.echartOptions }; // Forces change detection
      this.loading = false;
    });
  }

  loadNext() {}

  openAddDialog(model?: Todo) {
    const options: Partial<NbDialogConfig> = {};
    if (model) {
      options.context = { model };
    }

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
