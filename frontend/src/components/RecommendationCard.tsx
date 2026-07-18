// frontend/src/components/RecommendationCard.tsx
// Displays a single AI recommendation with category badge and priority indicator.

import { type FC } from 'react'
import {
  RiAlarmWarningLine,
  RiLightbulbLine,
  RiShieldLine,
  RiBookOpenLine,
  RiTeamLine,
} from 'react-icons/ri'
import type { Recommendation } from '../types'

interface Props {
  recommendation: Recommendation
  index: number
}

const CATEGORY_CONFIG = {
  urgent: {
    icon: <RiAlarmWarningLine size={16} />,
    color: 'text-red-400',
    bg: 'bg-red-500 bg-opacity-10 border-red-500 border-opacity-20',
    dot: 'bg-red-500',
  },
  productivity: {
    icon: <RiLightbulbLine size={16} />,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500 bg-opacity-10 border-indigo-500 border-opacity-20',
    dot: 'bg-indigo-500',
  },
  risk: {
    icon: <RiShieldLine size={16} />,
    color: 'text-orange-400',
    bg: 'bg-orange-500 bg-opacity-10 border-orange-500 border-opacity-20',
    dot: 'bg-orange-500',
  },
  learning: {
    icon: <RiBookOpenLine size={16} />,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500 bg-opacity-10 border-cyan-500 border-opacity-20',
    dot: 'bg-cyan-500',
  },
  team: {
    icon: <RiTeamLine size={16} />,
    color: 'text-purple-400',
    bg: 'bg-purple-500 bg-opacity-10 border-purple-500 border-opacity-20',
    dot: 'bg-purple-500',
  },
}

const RecommendationCard: FC<Props> = ({ recommendation, index }) => {
  const cfg = CATEGORY_CONFIG[recommendation.category] ?? CATEGORY_CONFIG.productivity

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-xl border animate-slide-up ${cfg.bg}`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Priority number */}
      <div className="flex-shrink-0 w-6 h-6 rounded-lg bg-dark-800 bg-opacity-50 flex items-center justify-center text-xs font-bold text-gray-400">
        {recommendation.priority}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={cfg.color}>{cfg.icon}</span>
          <p className="text-sm font-semibold text-gray-100 leading-tight">
            {recommendation.title}
          </p>
        </div>
        <p className="text-xs text-gray-400 leading-relaxed">{recommendation.description}</p>
      </div>

      <div className={`flex-shrink-0 px-2 py-1 rounded-lg text-xs font-medium ${cfg.color} bg-dark-800 bg-opacity-40`}>
        {recommendation.action_label}
      </div>
    </div>
  )
}

export default RecommendationCard
