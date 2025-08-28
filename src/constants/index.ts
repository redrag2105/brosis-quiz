export const HOUSE_OPTIONS = [
  {
    value: 'faerie',
    label: 'Faerie',
    icon: '🧚',
    color: 'from-emerald-400 to-green-500',
    bgColor: 'bg-emerald-500/20',
    borderColor: 'border-emerald-500/40',
    textColor: 'text-emerald-400',
    description: 'Khôn ngoan và sáng tạo'
  },
  {
    value: 'phoenix',
    label: 'Phoenix',
    icon: '🔥',
    color: 'from-red-400 to-orange-500',
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500/40',
    textColor: 'text-red-400',
    description: 'Dũng cảm và mạnh mẽ'
  },
  {
    value: 'thunderbird',
    label: 'ThunderBird',
    icon: '⚡',
    color: 'from-blue-400 to-indigo-500',
    bgColor: 'bg-blue-500/20',
    borderColor: 'border-blue-500/40',
    textColor: 'text-blue-400',
    description: 'Nhanh nhẹn và thông minh'
  },
  {
    value: 'unicorn',
    label: 'Unicorn',
    icon: '🦄',
    color: 'from-purple-400 to-pink-500',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/40',
    textColor: 'text-purple-400',
    description: 'Huyền bí và độc đáo'
  }
] as const;

export const QUIZ_CONFIG = {
  TOTAL_QUESTIONS: 21,
  TIME_LIMIT_MINUTES: 30
} as const;

export const ROUTES = {
  HOME: '/',
  REGISTRATION: '/registration',
  QUIZ: '/quiz',
  RESULTS: '/results',
  LEADERBOARD: '/leaderboard'
} as const;
