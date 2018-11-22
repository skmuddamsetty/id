export interface InterviewQuestion {
  question?: string;
  createUserId?: string;
  createDate?: any;
  interviewId?: string;
}
export interface InterviewQuestionId extends InterviewQuestion {
  id: string;
}
