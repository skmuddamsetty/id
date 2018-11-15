import { Conversation } from './conversation.model';
export interface Conversations {
  conversations: Array<Conversation>;
}
export interface ConversationsId extends Conversations {
  id: string;
}
