import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface Exam {
  title: string;
  description: string;
  deadline: Date;
  duration?: number;
  room?: string;
  tools?: string[];
  additionalInformations?: string[];
}

@Component({
  selector: 'ngx-exams',
  templateUrl: './exams.component.html',
  styleUrls: ['./exams.component.scss'],
})
export class ExamsComponent implements OnInit {
  exams: Exam[] = [
    {
      title: 'Portfolio-Prüfung: Programmierung',
      description: 'TODO',
      deadline: new Date(),
      additionalInformations: ['Kombiklausur mit irgendwas anderem'],
    },
    {
      title: 'Portfolio-Prüfung: Demonstration',
      description: 'TODO',
      deadline: new Date(),
      duration: 10,
      room: '123B',
      tools: ['n Taschencalculator', 'NOTizen'],
    },
    {
      title: 'Portfolio-Prüfung: Dokumentation',
      description: 'TODO',
      deadline: new Date(),
      additionalInformations: ['Be Awesome', 'Be Woopy'],
    },
  ];

  constructor(private readonly route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      console.log('params', params);
    });
  }
}
