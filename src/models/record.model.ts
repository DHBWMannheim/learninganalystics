//Karteikarten
export interface Record {
    id: string;
    name: string;
    description: string;
    user: DocumentRef;
    course: DocumentRef;
}
