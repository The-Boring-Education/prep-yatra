export interface Challenge {
  _id: string
  userId: string
  name: string
  totalDays: number
  currentDay: number
  startDate: string
  endDate: string
  isActive: boolean
  category?: string
  createdAt: string
  updatedAt: string
}

export interface ChallengeLog {
  _id: string
  challengeId: string
  userId: string
  day: number
  progressText: string
  hoursSpent: number
  nextGoals: string[]
  createdAt: string
}

export interface CreateChallengeDTO {
  userId: string
  name: string
  totalDays: number
  category?: string
  description?: string
}

export interface UpdateChallengeDTO {
  name?: string
  totalDays?: number
  category?: string
  currentDay?: number
}

export interface CreateChallengeLogDTO {
  challengeId: string
  userId: string
  day: number
  progressText: string
  hoursSpent: number
  nextGoals: string[]
}

export interface UpdateChallengeLogDTO {
  progressText?: string
  hoursSpent?: number
  nextGoals?: string[]
}

export interface ChallengeProgress {
  challengeId: string
  totalDays: number
  currentDay: number
  completedDays: number
  progressPercentage: number
  streak: number
  lastLoggedDate?: string
}

export interface ChallengeStats {
  totalChallenges: number
  activeChallenges: number
  completedChallenges: number
  totalHoursLogged: number
  currentStreak: number
  longestStreak: number
}

// Pre-defined challenge templates
export const CHALLENGE_TEMPLATES = [
  {
    id: 'python-21',
    name: '21 Days of Learning Python',
    totalDays: 21,
    category: 'Programming',
    description: 'Master Python fundamentals in 21 days',
    icon: '🐍',
    color: 'bg-green-500'
  },
  {
    id: 'java-21',
    name: '21 Days of Learning Java',
    totalDays: 21,
    category: 'Programming',
    description: 'Learn Java programming basics',
    icon: '☕',
    color: 'bg-orange-500'
  },
  {
    id: 'internship-50',
    name: '50 Days of Cracking Internship',
    totalDays: 50,
    category: 'Career',
    description: 'Prepare for internship interviews',
    icon: '💼',
    color: 'bg-blue-500'
  },
  {
    id: 'dsa-30',
    name: '30 Days of DSA',
    totalDays: 30,
    category: 'Programming',
    description: 'Master Data Structures and Algorithms',
    icon: '⚡',
    color: 'bg-purple-500'
  }
] as const

export type ChallengeTemplate = typeof CHALLENGE_TEMPLATES[number]
