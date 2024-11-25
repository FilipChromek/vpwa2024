export interface Message {
  id: number;
  createdBy: string;
  channelId: string;
  content: string;
}

export interface Channel {
  id: number;
  name: string;
  createdBy: number;
  isPrivate: boolean;
}

export interface Room {
  id: number;
  name: string;
  type: string;
  messages: Message[];
}

export interface User {
  id: number;
  name: string;
  username: string;
  status: string;
}

export interface Meta {
  totalCount: number;
}
