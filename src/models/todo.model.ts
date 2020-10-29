export interface Todo {
  id: string;
  name: string;
  deadline: Date;
  user: DocumentRef;
}
