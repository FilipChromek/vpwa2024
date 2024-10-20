export interface Message {
  name: string;
  text: string[];
  avatar: string;
  isSent: boolean;
}

export interface Room {
  id: number;
  name: string;
  type: string;
  messages: Message[];
} // type ze by som dal typescriptovy enum

export interface User {
  id: number;
  name: string;
  nickname: string;
}

export interface Meta {
  totalCount: number;
}
