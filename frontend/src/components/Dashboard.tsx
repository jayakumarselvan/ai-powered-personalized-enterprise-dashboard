// frontend/src/components/Dashboard.tsx
// Main dashboard page with all cards — header, metrics, tickets, meetings, etc.

import { type FC, useEffect } from 'react'
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
} from 'recharts'
import {
  RiSparklingLine,
  RiAlarmWarningLine,
  RiGitPullRequestLine,
  RiCalendarLine,
  RiBellLine,
  RiFireLine,
  RiRefreshLine,
} from 'react-icons/ri'
import type { Employee, Recommendation, SummaryData } from '../types'
import RecommendationCard from './RecommendationCard'
import SummaryCard from './SummaryCard'
import QuickActions from './QuickActions'
import LoadingSpinner from './LoadingSpinner'
import type { ActivePage } from '../types'

interface Props {
  employee: Employee
  recommendations: Recommendation[]
  summary: SummaryData | null
  loadingRecs: boolean
  loadingSummary: boolean
  onLoadRecommendations: () => void
  onLoadSummary: () => void
  onNavigate: (page: ActivePage) => void
}

const PRIORITY_BADGE: Record<string, string> = {
  critical: 'badge-critical',
  high: 'badge-high',
  medium: 'badge-medium',
  low: 'badge-low',
}

const NOTIF_DOT: Record<string, string> = {
  urgent: 'bg-red-500',
  warning: 'bg-orange-400',
  info: 'bg-blue-400',
}

const Dashboard: FC<Props> = ({
  employee,
  recommendations,
  summary,
  loadingRecs,
  loadingSummary,
  onLoadRecommendations,
  onLoadSummary,
  onNavigate,
}) => {
  useEffect(() => {
    if (recommendations.length === 0) {
      onLoadRecommendations()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employee.id])

  const sprintPct = employee.current_sprint.committed_points > 0
    ? Math.round(
        (employee.current_sprint.completed_points / employee.current_sprint.committed_points) * 100,
      )
    : 0

  const ticketData = [
    { name: 'Critical', count: employee.open_tickets.filter((t) => t.priority === 'critical').length, fill: '#ef4444' },
    { name: 'High', count: employee.open_tickets.filter((t) => t.priority === 'high').length, fill: '#f97316' },
    { name: 'Medium', count: employee.open_tickets.filter((t) => t.priority === 'medium').length, fill: '#eab308' },
    { name: 'Low', count: employee.open_tickets.filter((t) => t.priority === 'low').length, fill: '#22c55e' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Header ── */}
      <div className="bg-gradient-header rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-purple-500 blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-blue-500 blur-3xl translate-y-1/2 -translate-x-1/4" />
        </div>
        <div className="relative z-10">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="text-indigo-300 text-sm font-medium mb-1">Good morning 👋</p>
              <h1 className="text-2xl font-bold text-white">
                Welcome back, {employee.name.split(' ')[0]}
              </h1>
              <p className="text-indigo-200 text-sm mt-1">
                {employee.role} · {employee.department} · {employee.team}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Productivity Score Radial */}
              <div className="text-center">
                <div className="w-20 h-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      innerRadius={24}
                      outerRadius={36}
                      data={[{ value: employee.productivity_score, fill: '#6366f1' }]}
                      startAngle={90}
                      endAngle={90 - (employee.productivity_score / 100) * 360}
                    >
                      <RadialBar dataKey="value" cornerRadius={4} background={{ fill: '#1e1b4b' }} />
                      <Tooltip content={() => null} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-white font-bold -mt-2 text-lg">{employee.productivity_score}</p>
                <p className="text-indigo-300 text-xs">Productivity</p>
              </div>

              {/* Performance Score */}
              <div className="text-center">
                <div className="w-20 h-20">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      innerRadius={24}
                      outerRadius={36}
                      data={[{ value: employee.performance_score, fill: '#8b5cf6' }]}
                      startAngle={90}
                      endAngle={90 - (employee.performance_score / 100) * 360}
                    >
                      <RadialBar dataKey="value" cornerRadius={4} background={{ fill: '#1e1b4b' }} />
                      <Tooltip content={() => null} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-white font-bold -mt-2 text-lg">{employee.performance_score}</p>
                <p className="text-indigo-300 text-xs">Performance</p>
              </div>
            </div>
          </div>

          {/* Sprint progress */}
          <div className="mt-5 bg-white bg-opacity-5 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-indigo-200">{employee.current_sprint.name}</span>
              <span className="text-xs text-indigo-300">{employee.current_sprint.remaining_days} days left · {sprintPct}%</span>
            </div>
            <div className="h-2 bg-indigo-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full transition-all duration-700"
                style={{ width: `${sprintPct}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-indigo-300 mt-1">
              <span>{employee.current_sprint.completed_points} pts done</span>
              <span>{employee.current_sprint.committed_points - employee.current_sprint.completed_points} pts remaining</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">Quick Actions</p>
        <QuickActions
          onNavigate={onNavigate}
          onGenerateSummary={onLoadSummary}
          loadingSummary={loadingSummary}
        />
      </div>

      {/* ── Metrics row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: 'Open Tickets',
            value: employee.open_tickets.length,
            sub: `${employee.open_tickets.filter((t) => t.priority === 'critical').length} critical`,
            color: 'text-red-400',
            icon: <RiAlarmWarningLine size={20} className="text-red-400" />,
          },
          {
            label: 'Pending PRs',
            value: employee.pending_prs.length,
            sub: `${employee.pending_prs.filter((p) => p.status === 'changes_requested').length} need changes`,
            color: 'text-purple-400',
            icon: <RiGitPullRequestLine size={20} className="text-purple-400" />,
          },
          {
            label: "Today's Meetings",
            value: employee.meetings.length,
            sub: `${employee.meetings.filter((m) => !m.is_optional).length} required`,
            color: 'text-blue-400',
            icon: <RiCalendarLine size={20} className="text-blue-400" />,
          },
          {
            label: 'Notifications',
            value: employee.notifications.length,
            sub: `${employee.notifications.filter((n) => n.type === 'urgent').length} urgent`,
            color: 'text-orange-400',
            icon: <RiBellLine size={20} className="text-orange-400" />,
          },
        ].map((card) => (
          <div key={card.label} className="glass-card p-4">
            <div className="flex items-start justify-between mb-2">
              {card.icon}
            </div>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{card.label}</p>
            <p className="text-xs text-gray-600 mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Left 2/3 */}
        <div className="xl:col-span-2 space-y-5">

          {/* Tickets */}
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <RiAlarmWarningLine size={16} className="text-red-400" />
                <h3 className="text-sm font-semibold text-gray-200">Open Tickets</h3>
              </div>
              <span className="text-xs text-gray-500">{employee.open_tickets.length} total</span>
            </div>
            <div className="space-y-2">
              {employee.open_tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-dark-800 bg-opacity-50 border border-dark-600 hover:border-dark-400 transition-colors"
                >
                  <span className="text-xs text-gray-500 font-mono w-20 flex-shrink-0">{ticket.id}</span>
                  <span className="flex-1 text-sm text-gray-200 truncate">{ticket.title}</span>
                  <span className={`flex-shrink-0 ${PRIORITY_BADGE[ticket.priority] ?? ''}`}>
                    {ticket.priority}
                  </span>
                  <span className="text-xs text-gray-500 flex-shrink-0">{ticket.due}</span>
                </div>
              ))}
            </div>
          </div>

          {/* PRs */}
          {employee.pending_prs.length > 0 && (
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <RiGitPullRequestLine size={16} className="text-purple-400" />
                <h3 className="text-sm font-semibold text-gray-200">Pending Pull Requests</h3>
              </div>
              <div className="space-y-2">
                {employee.pending_prs.map((pr) => (
                  <div
                    key={pr.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-dark-800 bg-opacity-50 border border-dark-600"
                  >
                    <span className="text-xs text-gray-500 font-mono w-16 flex-shrink-0">{pr.id}</span>
                    <span className="flex-1 text-sm text-gray-200 truncate">{pr.title}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                        pr.status === 'changes_requested'
                          ? 'bg-orange-500 bg-opacity-15 text-orange-400 border border-orange-500 border-opacity-30'
                          : 'bg-blue-500 bg-opacity-15 text-blue-400 border border-blue-500 border-opacity-30'
                      }`}
                    >
                      {pr.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-gray-500 flex-shrink-0">{pr.age_hours}h ago</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Meetings */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <RiCalendarLine size={16} className="text-blue-400" />
              <h3 className="text-sm font-semibold text-gray-200">Today's Meetings</h3>
            </div>
            <div className="space-y-2">
              {employee.meetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-dark-800 bg-opacity-50 border border-dark-600"
                >
                  <div className="flex-shrink-0 text-center">
                    <p className="text-sm font-bold text-blue-400">{meeting.time}</p>
                    <p className="text-xs text-gray-500">{meeting.duration_min}m</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-200 truncate">{meeting.title}</p>
                    <p className="text-xs text-gray-500">{meeting.attendees} attendees · {meeting.platform}</p>
                  </div>
                  {meeting.is_optional && (
                    <span className="text-xs text-gray-500 bg-dark-700 border border-dark-500 px-2 py-0.5 rounded-full flex-shrink-0">
                      Optional
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Ticket breakdown chart */}
          <div className="glass-card p-5">
            <p className="text-sm font-semibold text-gray-200 mb-4">Ticket Priority Breakdown</p>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={ticketData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d2d50" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: '#1a1a27', border: '1px solid #3d3d6b', borderRadius: 8, color: '#e5e7eb', fontSize: 12 }}
                  cursor={{ fill: '#ffffff08' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {ticketData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1/3 */}
        <div className="space-y-5">
          {/* AI Summary */}
          <SummaryCard
            summary={summary}
            loading={loadingSummary}
            onRefresh={onLoadSummary}
          />

          {/* Notifications */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <RiBellLine size={16} className="text-orange-400" />
              <h3 className="text-sm font-semibold text-gray-200">Notifications</h3>
            </div>
            <div className="space-y-2">
              {employee.notifications.map((notif) => (
                <div key={notif.id} className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-dark-700 transition-colors">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${NOTIF_DOT[notif.type] ?? 'bg-gray-500'}`} />
                  <div>
                    <p className="text-xs text-gray-300 leading-relaxed">{notif.message}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{notif.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Escalations */}
          {employee.customer_escalations.length > 0 && (
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <RiFireLine size={16} className="text-red-400" />
                <h3 className="text-sm font-semibold text-gray-200">Customer Escalations</h3>
              </div>
              <div className="space-y-2">
                {employee.customer_escalations.map((esc) => (
                  <div
                    key={esc.id}
                    className="p-3 rounded-xl bg-red-500 bg-opacity-5 border border-red-500 border-opacity-20"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-red-300">{esc.customer}</p>
                      <span className={`badge-${esc.severity}`}>{esc.severity}</span>
                    </div>
                    <p className="text-xs text-gray-400">{esc.issue}</p>
                    <p className="text-xs text-red-400 mt-1">SLA: {esc.sla_hours_remaining}h remaining</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-gray-200 mb-3">Recent Activity</h3>
            <div className="space-y-3">
              {employee.recent_activity.map((item, i) => (
                <div key={i} className="flex gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0 mt-1.5" />
                  <div>
                    <p className="text-xs text-gray-300">{item.action}</p>
                    <p className="text-xs text-gray-600">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── AI Recommendations ── */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <RiSparklingLine size={18} className="text-indigo-400" />
            <h3 className="text-sm font-semibold text-gray-200">AI Recommendations</h3>
          </div>
          <button
            onClick={onLoadRecommendations}
            disabled={loadingRecs}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-200 transition-colors disabled:opacity-50"
          >
            <RiRefreshLine size={13} className={loadingRecs ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {loadingRecs && <LoadingSpinner label="Generating recommendations..." size="sm" />}

        {!loadingRecs && recommendations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recommendations.map((rec, i) => (
              <RecommendationCard key={rec.id} recommendation={rec} index={i} />
            ))}
          </div>
        )}

        {!loadingRecs && recommendations.length === 0 && (
          <div className="text-center py-6">
            <p className="text-sm text-gray-500">No recommendations yet. Click Refresh to generate.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
