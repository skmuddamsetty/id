export interface Interview {
  createUserId?: string;
  title?: string;
  company?: string;
  technologies?: string[];
}
export interface InterviewId extends Interview {
  id: string;
}
