import { Gender } from "./gender.enum";

export interface User {
  id: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  roles?: {
    admin?: boolean;
    lecturer?: boolean;
  };
  gender: Gender;
  matriculationNr: number;
  //TODO: Lern Type
  course: DocumentRef;
}
