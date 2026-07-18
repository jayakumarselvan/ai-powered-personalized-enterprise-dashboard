// frontend/src/components/SummaryCard.tsx
// AI Summary card — displays productivity summary, risk, workload, and suggestions.

import { type FC } from 'react'
import { RiSparklingLine, RiRefreshLine } from 'react-icons/ri'
import type { SummaryData } from '../types'
import LoadingSpinner from './LoadingSpinner'

interface Props {
  summary: SummaryData | null
  loading: boolean
  onRefresh: () => void
}

const RISK_CONFIG = {
  low: { label: 'Low Risk', color: 'text-green-400', bg: 'bg-green-500 bg-opacity-10 border-green-500 border-opacity-20' },
  medium: { label: 'Medium Risk', color: 'text-yellow-400', bg: 'bg-yellow-500 bg-opacity-10 border-yellow-500 border-opacity-20' },
  high: { label: 'High Risk', color: 'text-orange-400', bg: 'bg-orange-500 bg-opacity-10 border-orange-500 border-opacity-20' },
  critical: { label: 'Critical Risk', color: 'text-red-400', bg: 'bg-red-500 bg-opacity-10 border-red-500 border-opacity-20' },
}

const WORKLOAD_CONFIG: Record<string, { label: string; color: string; width: string }> = {
  light: { label: 'Light', color: 'bg-green-500', width: 'w-1/4' },
  moderate: { label: 'Moderate', color: 'bg-yellow-500', width: 'w-1/2' },
  heavy: { label: 'Heavy', color: 'bg-orange-500', width: 'w-3/4' },
  overloaded: { label: 'Overloaded', color: 'bg-red-500', width: 'w-full' },
}

const SummaryCard: FC<Props> = ({ summary, loading, onRefresh }) => {
  return (
    <div className="glass-card p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <RiSparklingLine size={18} className="text-purple-400" />
          <h3 className="text-sm font-semibold text-gray-200">AI Summary</h3>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-1.5 rounded-lg hover:bg-dark-600 text-gray-400 hover:text-gray-200 transition-all disabled:opacity-50"
          title="Regenerate"
        >
          <RiRefreshLine size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {loading && <LoadingSpinner label="Generating summary..." size="sm" />}

      {!loading && !summary && (
        <div className="text-center py-6">
          <RiSparklingLine size={28} className="text-gray-600 mx-auto mb-2" />
          <p className="text-xs text-gray-500">Click refresh to generate your AI summary</p>
        </div>
      )}

      {!loading && summary && (
        <div className="space-y-4 animate-fade-in">
          {/* Risk & Workload */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`rounded-xl p-3 border ${RISK_CONFIG[summary.risk_level]?.bg ?? ''}`}>
              <p className="text-xs text-gray-500 mb-1">Risk Level</p>
              <p className={`text-sm font-bold ${RISK_CONFIG[summary.risk_level]?.color ?? ''}`}>
                {RISK_CONFIG[summary.risk_level]?.label ?? summary.risk_level}
              </p>
            </div>
            <div className="rounded-xl p-3 border border-dark-500 bg-dark-700 bg-opacity-40">
              <p className="text-xs text-gray-500 mb-1">Priority Score</p>
              <div className="flex items-end gap-1">
                <span className="text-lg font-bold text-indigo-400">{summary.priority_score}</span>
                <span className="text-xs text-gray-500 mb-0.5">/100</span>
              </div>
            </div>
          </div>

          {/* Workload bar */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-400">Workload</span>
              <span className="text-gray-300 font-medium capitalize">
                {WORKLOAD_CONFIG[summary.estimated_workload]?.label ?? summary.estimated_workload}
              </span>
            </div>
            <div className="h-1.5 bg-dark-600 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${WORKLOAD_CONFIG[summary.estimated_workload]?.color ?? 'bg-indigo-500'} ${WORKLOAD_CONFIG[summary.estimated_workload]?.width ?? 'w-1/2'} transition-all duration-700`}
              />
            </div>
          </div>

          {/* Summary text */}
          <p className="text-xs text-gray-400 leading-relaxed">{summary.productivity_summary}</p>

          {/* Suggestions */}
          <div>
            <p className="text-xs font-semibold text-gray-300 mb-2">Suggestions</p>
            <ul className="space-y-1.5">
              {summary.suggestions.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
                  <span className="text-indigo-400 mt-0.5 flex-shrink-0">›</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Motivational message */}
          <div className="rounded-xl bg-gradient-to-r from-indigo-900 from-opacity-30 to-purple-900 to-opacity-30 border border-indigo-500 border-opacity-20 p-3">
            <p className="text-xs text-indigo-300 italic">{summary.motivational_message}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default SummaryCard
