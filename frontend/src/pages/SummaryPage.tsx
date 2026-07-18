// frontend/src/pages/SummaryPage.tsx
// Full AI Summary page — detailed productivity analysis.

import { type FC, useEffect } from 'react'
import {
  RiSparklingLine,
  RiRefreshLine,
  RiBarChartLine,
  RiShieldLine,
  RiLightbulbLine,
  RiHeartLine,
} from 'react-icons/ri'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import type { Employee, SummaryData } from '../types'
import LoadingSpinner from '../components/LoadingSpinner'

interface Props {
  employee: Employee
  summary: SummaryData | null
  loading: boolean
  onLoad: () => void
}

const RISK_CONFIG = {
  low: { label: 'Low', color: 'text-green-400', bar: 'bg-green-500', pct: 20 },
  medium: { label: 'Medium', color: 'text-yellow-400', bar: 'bg-yellow-500', pct: 50 },
  high: { label: 'High', color: 'text-orange-400', bar: 'bg-orange-500', pct: 75 },
  critical: { label: 'Critical', color: 'text-red-400', bar: 'bg-red-500', pct: 100 },
}

const WORKLOAD_CONFIG: Record<string, { pct: number; color: string }> = {
  light: { pct: 25, color: 'bg-green-500' },
  moderate: { pct: 50, color: 'bg-yellow-500' },
  heavy: { pct: 75, color: 'bg-orange-500' },
  overloaded: { pct: 100, color: 'bg-red-500' },
}

const SummaryPage: FC<Props> = ({ employee, summary, loading, onLoad }) => {
  useEffect(() => {
    if (!summary) onLoad()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employee.id])

  const radarData = [
    { axis: 'Productivity', value: employee.productivity_score },
    { axis: 'Performance', value: employee.performance_score },
    { axis: 'Sprint', value: Math.round((employee.current_sprint.completed_points / Math.max(employee.current_sprint.committed_points, 1)) * 100) },
    { axis: 'Tickets', value: Math.max(0, 100 - employee.open_tickets.length * 15) },
    { axis: 'Meetings', value: Math.max(0, 100 - employee.meetings.length * 10) },
  ]

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <RiBarChartLine size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-100">AI Summary</h2>
            <p className="text-xs text-gray-500">Personalized productivity analysis for {employee.name}</p>
          </div>
        </div>
        <button
          onClick={onLoad}
          disabled={loading}
          className="btn-ghost flex items-center gap-2 text-sm"
        >
          <RiRefreshLine size={14} className={loading ? 'animate-spin' : ''} />
          Regenerate
        </button>
      </div>

      {loading && <LoadingSpinner label="Generating your AI summary..." size="lg" />}

      {!loading && !summary && (
        <div className="glass-card p-12 text-center">
          <RiSparklingLine size={40} className="text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">Your AI summary hasn't been generated yet.</p>
          <button onClick={onLoad} className="btn-primary">
            Generate Summary
          </button>
        </div>
      )}

      {!loading && summary && (
        <div className="space-y-5 animate-slide-up">
          {/* Score cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="glass-card p-4 text-center">
              <p className="text-3xl font-bold text-indigo-400">{summary.priority_score}</p>
              <p className="text-xs text-gray-400 mt-1">Priority Score</p>
              <p className="text-xs text-gray-600 mt-0.5">out of 100</p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className={`text-2xl font-bold capitalize ${RISK_CONFIG[summary.risk_level]?.color ?? 'text-gray-400'}`}>
                {RISK_CONFIG[summary.risk_level]?.label ?? summary.risk_level}
              </p>
              <p className="text-xs text-gray-400 mt-1">Risk Level</p>
              <div className="h-1 bg-dark-600 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${RISK_CONFIG[summary.risk_level]?.bar ?? 'bg-gray-500'}`}
                  style={{ width: `${RISK_CONFIG[summary.risk_level]?.pct ?? 50}%` }}
                />
              </div>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-2xl font-bold text-purple-400 capitalize">
                {summary.estimated_workload}
              </p>
              <p className="text-xs text-gray-400 mt-1">Workload</p>
              <div className="h-1 bg-dark-600 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${WORKLOAD_CONFIG[summary.estimated_workload]?.color ?? 'bg-indigo-500'}`}
                  style={{ width: `${WORKLOAD_CONFIG[summary.estimated_workload]?.pct ?? 50}%` }}
                />
              </div>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-3xl font-bold text-green-400">{employee.performance_score}</p>
              <p className="text-xs text-gray-400 mt-1">Performance</p>
              <p className="text-xs text-gray-600 mt-0.5">score</p>
            </div>
          </div>

          {/* Summary + Radar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Productivity radar */}
            <div className="glass-card p-5">
              <p className="text-sm font-semibold text-gray-200 mb-4">Work Health Radar</p>
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                  <PolarGrid stroke="#2d2d50" />
                  <PolarAngleAxis
                    dataKey="axis"
                    tick={{ fill: '#6b7280', fontSize: 11 }}
                  />
                  <Radar
                    name="Score"
                    dataKey="value"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#1a1a27',
                      border: '1px solid #3d3d6b',
                      borderRadius: 8,
                      fontSize: 12,
                      color: '#e5e7eb',
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Summary text */}
            <div className="glass-card p-5 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <RiSparklingLine size={14} className="text-indigo-400" />
                  <p className="text-sm font-semibold text-gray-200">Today's Overview</p>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">{summary.productivity_summary}</p>
              </div>

              {/* Motivational message */}
              <div className="bg-gradient-to-r from-indigo-900 to-purple-900 bg-opacity-30 border border-indigo-500 border-opacity-20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <RiHeartLine size={14} className="text-pink-400" />
                  <p className="text-xs font-semibold text-pink-300">Message for you</p>
                </div>
                <p className="text-sm text-indigo-200 italic leading-relaxed">
                  {summary.motivational_message}
                </p>
              </div>
            </div>
          </div>

          {/* Suggestions */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <RiLightbulbLine size={16} className="text-yellow-400" />
              <h3 className="text-sm font-semibold text-gray-200">AI Suggestions</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {summary.suggestions.map((s, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-dark-800 bg-opacity-50 border border-dark-500 hover:border-indigo-500 hover:border-opacity-40 transition-colors"
                >
                  <div className="w-6 h-6 rounded-lg bg-indigo-600 bg-opacity-30 flex items-center justify-center mb-3">
                    <span className="text-xs font-bold text-indigo-400">{i + 1}</span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">{s}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Security / Risk Shield */}
          {(summary.risk_level === 'high' || summary.risk_level === 'critical') && (
            <div className="glass-card p-5 border-orange-500 border-opacity-30 bg-orange-500 bg-opacity-5">
              <div className="flex items-center gap-2 mb-2">
                <RiShieldLine size={16} className="text-orange-400" />
                <p className="text-sm font-semibold text-orange-300">Risk Alert</p>
              </div>
              <p className="text-sm text-gray-400">
                Your current risk level is{' '}
                <span className="text-orange-400 font-semibold capitalize">{summary.risk_level}</span>.
                {' '}Review customer escalations, overdue tickets, and sprint commitments immediately.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SummaryPage
