export interface Interview {
  createUserId?: string;
  title?: string;
  company?: string;
  technologies?: string[];
  createDate?: any;
  updateDate?: any;
  location?: string;
  role?: string;
  createUserName?: string;
  noOfQuestions?: number;
  roleDesc?: string;
  companyDesc?: string;
}
export interface InterviewId extends Interview {
  id: string;
}
