// Chat History
export type ChatAttributes {
  id: number;
  name: string;
  content: ChatContent[];
  creationDate?: string;
}

export type ChatContent {
  date: string;
  role: string;
  content: string;
  model: string;
}
