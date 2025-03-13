

type AddPromptBodyType = {
  title: string;
  content: string;
  folderId?: string;
};

type UpdatePromptBodyType = {
  id: string
  title?: string
  content?: string
}

export type { AddPromptBodyType, UpdatePromptBodyType };
