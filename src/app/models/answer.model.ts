export interface Answer {
  answer: string;
  key: string;
  createUserId: string;
  questionId: string;
}
export interface AnswerId extends Answer {
  id: string;
}
