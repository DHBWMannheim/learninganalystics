import { Exam } from "./exam.model";

export interface Lecture {
  id: string;
  name: string;
  exam: Exam;
}
