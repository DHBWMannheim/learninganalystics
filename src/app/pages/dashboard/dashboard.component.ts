import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { CalendarEvent, CalendarEventAction } from 'angular-calendar';
import { isSameDay, isSameMonth } from 'date-fns';
import { ExamService } from '../../@core/data/exams.service';

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  a: {};
  a2: {};

  viewDate: Date = new Date();
  activeDayIsOpen: boolean = false;
  loadingExams: boolean = false;

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  events: CalendarEvent[] = [
    {
      start: new Date(),
      end: new Date(),
      title: 'Testprüfung',
      actions: this.actions,
      color: {
        primary: '#e10217',
        secondary: '#e10217'
      },
    },
  ]

  constructor(
    readonly auth: NbAuthService,
    public auth2: AngularFireAuth,
    private readonly examService: ExamService,
  ) {
    this.auth.onTokenChange().subscribe((token: NbAuthJWTToken) => {
      this.a = token.getPayload();
    });

    this.auth2.user.subscribe((u) => (this.a2 = u));
  }

  async reload() {
    this.loadingExams = true;
    const exams = await this.examService.getData(
      await this.examService
        .getCollection()
        .get(),
    );
    console.log(exams)
    this.loadingExams = false;
  }

  async ngOnInit(): Promise<void> {
    await this.reload()
  }

  handleEvent(action: string, event: CalendarEvent): void {
    console.log('event')
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }
}
