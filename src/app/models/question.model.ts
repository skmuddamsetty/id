export interface Question {
  question?: string;
  key?: string;
  createUserId?: string;
}
export interface QuestionId extends Question {
  id: string;
}
