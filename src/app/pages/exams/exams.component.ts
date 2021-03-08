import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoursesService } from '../../@core/data/course.service';
import { Exam, ExamService } from '../../@core/data/exams.service';

@Component({
  selector: 'ngx-exams',
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.scss']
})
export class ExamsComponent implements OnInit {

  courseId: string;
  exams: Exam[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly examService: ExamService,
    private readonly datepipe: DatePipe,
    private readonly courseService: CoursesService
  ) {}

  formatDate(date: string): string {
    return this.datepipe.transform(date, 'dd.MM.yyyy');
  }

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(async ({ courseId }) => {
      this.courseId = courseId;
      this.exams = await this.examService.getData(
        await this.examService
          .getCollection()
          .where('course', '==', this.courseService.createRef(this.courseId))
          .get(),
      );
    });
    /* this.examService.upsert({
      title: 'Testklausur',
      tools: ['Taschenrechner'],
      course: this.courseService.createRef(this.courseId),
      deadline: new Date().toISOString(),
      description: 'Testbeschreibung',
      duration: '10 Minuten',
      room: 'SAP Raum',
      additionalInformations: ['Information A'],
    }); */
    
  }
}
