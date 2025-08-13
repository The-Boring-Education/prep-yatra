export type ChallengeStatus = 'active' | 'completed' | 'paused' | 'cancelled';

export type PredefinedChallenge = '21DaysPython' | '21DaysJava' | '50DaysInternship';

export interface Challenge {
  _id: string;
  user: string;
  name: string;
  description?: string;
  totalDays: number;
  currentDay: number;
  status: ChallengeStatus;
  startDate: string;
  endDate?: string;
  isPredefined: boolean;
  predefinedType?: PredefinedChallenge;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ChallengeLog {
  _id: string;
  challenge: string;
  user: string;
  day: number;
  progressText: string;
  hoursSpent: number;
  date: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateChallengeRequest {
  name: string;
  description?: string;
  totalDays: number;
  isPredefined: boolean;
  predefinedType?: PredefinedChallenge;
}

export interface UpdateChallengeRequest {
  challengeId: string;
  name?: string;
  description?: string;
  totalDays?: number;
  status?: ChallengeStatus;
}

export interface CreateChallengeLogRequest {
  challengeId: string;
  progressText: string;
  hoursSpent: number;
  copyToPrepLogs?: boolean;
}

export interface ChallengeProgress {
  challenge: Challenge;
  logs: ChallengeLog[];
  completionPercentage: number;
  daysRemaining: number;
  streak: number;
  totalHoursSpent: number;
  averageHoursPerDay: number;
}

export interface ChallengesResponse {
  status: boolean;
  data: Challenge[];
}

export interface ChallengeLogsResponse {
  status: boolean;
  data: ChallengeLog[];
}

export interface SingleChallengeResponse {
  status: boolean;
  data: Challenge;
}

export interface SocialMediaTemplate {
  challengeName: string;
  currentDay: number;
  progressText: string;
  nextGoals: string[];
  appUrl: string;
}

// Predefined challenge templates
export const PREDEFINED_CHALLENGES: Record<PredefinedChallenge, Omit<CreateChallengeRequest, 'isPredefined' | 'predefinedType'>> = {
  '21DaysPython': {
    name: '21 Days of Learning Python',
    description: 'Master Python fundamentals in 21 days with hands-on practice and projects.',
    totalDays: 21
  },
  '21DaysJava': {
    name: '21 Days of Learning Java',
    description: 'Build a strong foundation in Java programming with daily coding challenges.',
    totalDays: 21
  },
  '50DaysInternship': {
    name: '50 Days of Cracking Internship',
    description: 'Comprehensive preparation for internship interviews including DSA, system design, and projects.',
    totalDays: 50
  }
};