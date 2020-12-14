export interface Exam {
  id: string;
}
export interface WrittenExam extends Exam {
  start: Date;
  end: Date;
  room: string;
}
export interface AlternativeExam extends Exam {}
