export interface Interview {
  createUserId: string;
  title: string;
  company: string;
}
export interface InterviewId extends Interview {
  id: string;
}
