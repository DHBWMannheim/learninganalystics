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

  echartOptions = {
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
      max: 0,
      show: false,
    },
    calendar: {
      // TODO: Einstellungen nach Sprache mit 'nameMap'
      dayLabel: {
        // firstDay: 1, // start on Monday
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
      data: [],
    },
  };

  mergedata: {
    series: {
      data: [];
    };
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

      const dategroup = groupBy(
        v.filter((v) => v.deadline),
        ({ deadline }) => format(startOfDay(deadline), 'yyyy-MM-dd'),
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

  loadNext() {}

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
