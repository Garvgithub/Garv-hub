import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import * as Types from '../types';

interface DataContextType {
  projects: Types.Project[];
  setProjects: (value: Types.Project[] | ((val: Types.Project[]) => Types.Project[])) => void;
  tasks: Types.Task[];
  setTasks: (value: Types.Task[] | ((val: Types.Task[]) => Types.Task[])) => void;
  expenses: Types.Expense[];
  setExpenses: (value: Types.Expense[] | ((val: Types.Expense[]) => Types.Expense[])) => void;
  habits: Types.Habit[];
  setHabits: (value: Types.Habit[] | ((val: Types.Habit[]) => Types.Habit[])) => void;
  notes: Types.Note[];
  setNotes: (value: Types.Note[] | ((val: Types.Note[]) => Types.Note[])) => void;
  canvaFonts: Types.CanvaFont[];
  setCanvaFonts: (value: Types.CanvaFont[] | ((val: Types.CanvaFont[]) => Types.CanvaFont[])) => void;
  canvaApps: Types.CanvaApp[];
  setCanvaApps: (value: Types.CanvaApp[] | ((val: Types.CanvaApp[]) => Types.CanvaApp[])) => void;
  canvaIdeas: Types.CanvaIdea[];
  setCanvaIdeas: (value: Types.CanvaIdea[] | ((val: Types.CanvaIdea[]) => Types.CanvaIdea[])) => void;
  canvaLinks: Types.CanvaLink[];
  setCanvaLinks: (value: Types.CanvaLink[] | ((val: Types.CanvaLink[]) => Types.CanvaLink[])) => void;
  notFixedBudget: Types.NotFixedBudget[];
  setNotFixedBudget: (value: Types.NotFixedBudget[] | ((val: Types.NotFixedBudget[]) => Types.NotFixedBudget[])) => void;
  fixedBudgets: Types.FixedBudget[];
  setFixedBudgets: (value: Types.FixedBudget[] | ((val: Types.FixedBudget[]) => Types.FixedBudget[])) => void;
  fixedExpenses: Types.FixedExpense[];
  setFixedExpenses: (value: Types.FixedExpense[] | ((val: Types.FixedExpense[]) => Types.FixedExpense[])) => void;
  stories: Types.Story[];
  setStories: (value: Types.Story[] | ((val: Types.Story[]) => Types.Story[])) => void;
  scenes: Types.Scene[];
  setScenes: (value: Types.Scene[] | ((val: Types.Scene[]) => Types.Scene[])) => void;
  shayaris: Types.Shayari[];
  setShayaris: (value: Types.Shayari[] | ((val: Types.Shayari[]) => Types.Shayari[])) => void;
  rekhtaSavedShayaris: Types.RekhtaSavedShayari[];
  setRekhtaSavedShayaris: (value: Types.RekhtaSavedShayari[] | ((val: Types.RekhtaSavedShayari[]) => Types.RekhtaSavedShayari[])) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useLocalStorage<Types.Project[]>('projects', []);
  const [tasks, setTasks] = useLocalStorage<Types.Task[]>('tasks', []);
  const [expenses, setExpenses] = useLocalStorage<Types.Expense[]>('expenses', []);
  const [habits, setHabits] = useLocalStorage<Types.Habit[]>('habits', []);
  const [notes, setNotes] = useLocalStorage<Types.Note[]>('notes', []);
  const [canvaFonts, setCanvaFonts] = useLocalStorage<Types.CanvaFont[]>('canvaFonts', []);
  const [canvaApps, setCanvaApps] = useLocalStorage<Types.CanvaApp[]>('canvaApps', []);
  const [canvaIdeas, setCanvaIdeas] = useLocalStorage<Types.CanvaIdea[]>('canvaIdeas', []);
  const [canvaLinks, setCanvaLinks] = useLocalStorage<Types.CanvaLink[]>('canvaLinks', []);
  const [notFixedBudget, setNotFixedBudget] = useLocalStorage<Types.NotFixedBudget[]>('notFixedBudget', []);
  const [fixedBudgets, setFixedBudgets] = useLocalStorage<Types.FixedBudget[]>('fixedBudgets', []);
  const [fixedExpenses, setFixedExpenses] = useLocalStorage<Types.FixedExpense[]>('fixedExpenses', []);
  const [stories, setStories] = useLocalStorage<Types.Story[]>('stories', []);
  const [scenes, setScenes] = useLocalStorage<Types.Scene[]>('scenes', []);
  const [shayaris, setShayaris] = useLocalStorage<Types.Shayari[]>('shayaris', []);
  const [rekhtaSavedShayaris, setRekhtaSavedShayaris] = useLocalStorage<Types.RekhtaSavedShayari[]>('rekhtaSavedShayaris', []);

  return (
    <DataContext.Provider
      value={{
        projects,
        setProjects,
        tasks,
        setTasks,
        expenses,
        setExpenses,
        habits,
        setHabits,
        notes,
        setNotes,
        canvaFonts,
        setCanvaFonts,
        canvaApps,
        setCanvaApps,
        canvaIdeas,
        setCanvaIdeas,
        canvaLinks,
        setCanvaLinks,
        notFixedBudget,
        setNotFixedBudget,
        fixedBudgets,
        setFixedBudgets,
        fixedExpenses,
        setFixedExpenses,
        stories,
        setStories,
        scenes,
        setScenes,
        shayaris,
        setShayaris,
        rekhtaSavedShayaris,
        setRekhtaSavedShayaris,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
