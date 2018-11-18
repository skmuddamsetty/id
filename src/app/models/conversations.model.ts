import { Conversation } from './conversation.model';
export interface Conversations {
  conversations: Array<Conversation>;
  interviewId: string;
  updateDate: any;
}
export interface ConversationsId extends Conversations {
  id: string;
}
