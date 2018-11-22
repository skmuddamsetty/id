export interface InterviewAnswer {
  answer?: string;
  createUserId?: string;
  createDate?: any;
  interviewId?: string;
  questiondId?: string;
  userName?: string;
}
export interface InterviewAnswerId extends InterviewAnswer {
  id: string;
}
