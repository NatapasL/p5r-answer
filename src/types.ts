export interface Confidant {
  type: string;
  character: string;
  rank: number;
  dialogue_prompts: DialoguePrompt[];
}

interface DialoguePrompt {
  prompt_order: number;
  options: DialoguePromptOption[];
}

interface DialoguePromptOption {
  text: string;
  points: number;
  is_best: boolean;
}

export interface Classroom {
  type: string;
  date: string;
  question: string;
  options: ClassroomOption[];
}

interface ClassroomOption {
  text: string;
  is_correct: boolean;
}

export interface Option {
  label: string;
  value: string;
}
