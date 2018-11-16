import { Conversation } from './conversation.model';
export interface Conversations {
  conversations: Array<Conversation>;
  interviewId: string;
}
export interface ConversationsId extends Conversations {
  id: string;
}
