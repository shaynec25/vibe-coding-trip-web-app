import { LucideIcon } from "lucide-react";

export interface LinkData {
  label: string;
  url: string;
}

export interface OptionData {
  id: string;
  title: string;
  subtitle?: string;
  tags?: string[];
  description?: string[];
  mapLink?: string;
  recommended?: boolean;
}

export interface ScheduleItem {
  id?: string;
  day?: string;
  time: string;
  title: string;
  location?: string;
  mapLink?: string;
  icon: LucideIcon;
  description?: string;
  options?: OptionData[];
  type: 'default' | 'activity' | 'food' | 'transport' | 'rest';
  specialContent?: 'hiking_guide';
}

export interface HikingMilestone {
  time: string;
  event: string;
  note?: string;
}

export interface HikingGuideData {
  prepList: string[];
  milestones: HikingMilestone[];
  stats: {
    upTime: string;
    restTime: string;
    downTime: string;
    totalTime: string;
  };
}

export interface ChecklistItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  description?: string[];
}

export interface ChecklistCategory {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  payer: string;
  date: string;
  category?: string;
  splitWith?: string[];
}

export interface CandidateItem {
  name: string;
  type: string;
  description: string;
  mapLink: string;
}