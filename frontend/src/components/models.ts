export interface Message {
  name: string;
  text: string[];
  avatar: string;
  isSent: boolean;
}

export interface Room {
  id: number;
  name: string
}

export interface Meta {
  totalCount: number;
}
