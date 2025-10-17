// Type definitions for all modules

export interface Project {
  id: string; // PRJ-YYYYMMDD-HHMMSS
  name: string;
  startDate: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Planning' | 'In Progress' | 'On Hold' | 'Completed';
  notes: string;
}

export interface Task {
  id: string; // TSK-YYYYMMDD-HHMMSS
  projectId: string;
  title: string;
  assignee: string;
  dueDate: string;
  status: 'To Do' | 'In Progress' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  isRecurring: boolean;
  recurrenceRule?: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  reminderMinutes?: number;
  notes: string;
}

export interface Expense {
  id: string; // EXP-YYYYMMDD-HHMMSS
  projectId: string;
  date: string;
  category: string;
  amount: number;
  paymentMethod: string;
  vendor: string;
  notes: string;
  receiptUrl?: string;
}

export interface Habit {
  id: string; // HBT-YYYYMMDD-HHMMSS
  name: string;
  frequency: 'Daily' | 'Weekly';
  startDate: string;
  streak: number;
  isActive: boolean;
  notes: string;
}

export interface Note {
  id: string; // NTE-YYYYMMDD-HHMMSS
  projectId?: string;
  createdOn: string;
  title: string;
  content: string;
  tags: string;
}

export interface CanvaFont {
  id: string; // CNF-YYYYMMDD-HHMMSS
  name: string;
  useCaseNotes: string;
}

export interface CanvaApp {
  id: string; // CNA-YYYYMMDD-HHMMSS
  name: string;
  purpose: string;
  quickTip: string;
}

export interface CanvaIdea {
  id: string; // CNI-YYYYMMDD-HHMMSS
  title: string;
  description: string;
  tag: string;
}

export interface CanvaLink {
  id: string; // CNL-YYYYMMDD-HHMMSS
  title: string;
  url: string;
  notes: string;
}

export interface NotFixedBudget {
  id: string; // NFB-YYYYMMDD-HHMMSS
  date: string;
  source: string;
  type: 'Income' | 'Expense';
  category: 'Food' | 'Academic' | 'Fuel' | 'Personal Growth' | 'Misc';
  amount: number;
  notes: string;
}

export interface FixedBudget {
  id: string; // FBD-YYYYMMDD-HHMMSS
  month: string;
  totalBudget: number;
  notes: string;
}

export interface FixedExpense {
  id: string; // FEX-YYYYMMDD-HHMMSS
  fixedBudgetId: string;
  category: string;
  allocatedAmount: number;
  spentAmount: number;
  notes: string;
}

export interface Story {
  id: string; // STY-YYYYMMDD-HHMMSS
  title: string;
  type: string;
  genre: string;
  tone: string;
  status: 'Idea' | 'Outlining' | 'In Progress' | 'Completed';
  mainTheme: string;
  summary: string;
  inspirationSource: string;
  linkedNotes: string[];
  linkedCanvaIdeas: string[];
  dateCreated: string;
  lastUpdated: string;
}

export interface Scene {
  id: string; // SCN-YYYYMMDD-HHMMSS
  storyId: string;
  sceneNumber: number;
  title: string;
  type: 'Real' | 'Dream' | 'Flashback' | 'Other';
  summary: string;
  dialogueNotes: string;
  visualTone: string;
  location: string;
  emotionFocus: string;
  musicStyle: string;
  completed: boolean;
}

export interface Shayari {
  id: string; // SHY-YYYYMMDD-HHMMSS
  title: string;
  content: string;
  tags: string;
  dateCreated: string;
  imageUrl?: string;
}

export interface RekhtaSavedShayari {
  id: string; // RKT-YYYYMMDD-HHMMSS
  title: string;
  poet: string;
  content: string;
  rekhtaUrl: string;
  dateSaved: string;
}
