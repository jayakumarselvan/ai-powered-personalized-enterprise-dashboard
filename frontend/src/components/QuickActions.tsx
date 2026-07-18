// frontend/src/components/QuickActions.tsx
// Quick action buttons row on the dashboard.

import { type FC } from 'react'
import {
  RiRobot2Line,
  RiMailLine,
  RiBarChartLine,
  RiSparklingLine,
} from 'react-icons/ri'
import type { ActivePage } from '../types'

interface Props {
  onNavigate: (page: ActivePage) => void
  onGenerateSummary: () => void
  loadingSummary: boolean
}

const QuickActions: FC<Props> = ({ onNavigate, onGenerateSummary, loadingSummary }) => {
  const actions = [
    {
      label: 'AI Assistant',
      description: 'Ask anything',
      icon: <RiRobot2Line size={20} />,
      color: 'from-indigo-600 to-indigo-700',
      onClick: () => onNavigate('chat'),
    },
    {
      label: 'Email Generator',
      description: 'Draft instantly',
      icon: <RiMailLine size={20} />,
      color: 'from-purple-600 to-purple-700',
      onClick: () => onNavigate('email'),
    },
    {
      label: 'AI Summary',
      description: 'Today at a glance',
      icon: <RiBarChartLine size={20} />,
      color: 'from-blue-600 to-blue-700',
      onClick: () => onNavigate('summary'),
    },
    {
      label: 'Daily Digest',
      description: 'Generate now',
      icon: <RiSparklingLine size={20} />,
      color: 'from-pink-600 to-pink-700',
      onClick: onGenerateSummary,
      loading: loadingSummary,
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={action.onClick}
          disabled={action.loading}
          className={`bg-gradient-to-br ${action.color} rounded-2xl p-4 text-left hover:opacity-90 active:scale-95 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          <div className="text-white mb-2">{action.icon}</div>
          <p className="text-white text-sm font-semibold leading-tight">{action.label}</p>
          <p className="text-white text-opacity-70 text-xs mt-0.5">{action.description}</p>
        </button>
      ))}
    </div>
  )
}

export default QuickActions
