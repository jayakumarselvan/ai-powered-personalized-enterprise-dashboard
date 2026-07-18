// frontend/src/types/index.ts
// All TypeScript type definitions for the application.

export interface EmployeeSummary {
  id: string
  name: string
  role: string
  department: string
  avatar_initials: string
  avatar_color: string
}

export interface SprintInfo {
  name: string
  end_date: string
  committed_points: number
  completed_points: number
  remaining_days: number
}

export interface Ticket {
  id: string
  title: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  status: string
  due: string
}

export interface PullRequest {
  id: string
  title: string
  reviewers: string[]
  status: string
  age_hours: number
}

export interface Meeting {
  id: string
  title: string
  time: string
  duration_min: number
  attendees: number
  is_optional: boolean
  platform: string
}

export interface Notification {
  id: string
  type: 'urgent' | 'warning' | 'info'
  message: string
  time: string
}

export interface CustomerEscalation {
  id: string
  customer: string
  issue: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  sla_hours_remaining: number
}

export interface ActivityItem {
  action: string
  time: string
}

export interface Deadline {
  title: string
  date: string
}

export interface Employee {
  id: string
  name: string
  role: string
  department: string
  team: string
  manager: string
  avatar_initials: string
  avatar_color: string
  performance_score: number
  productivity_score: number
  current_sprint: SprintInfo
  open_tickets: Ticket[]
  pending_prs: PullRequest[]
  meetings: Meeting[]
  notifications: Notification[]
  customer_escalations: CustomerEscalation[]
  learning_goals: string[]
  recent_activity: ActivityItem[]
  upcoming_deadlines: Deadline[]
}

export interface DashboardData {
  employee: Employee
  employees: EmployeeSummary[]
}

// ── AI Response Types ─────────────────────────────────────────────────────────

export interface Recommendation {
  id: string
  category: 'urgent' | 'productivity' | 'risk' | 'learning' | 'team'
  title: string
  description: string
  action_label: string
  priority: number
}

export interface RecommendationsResponse {
  recommendations: Recommendation[]
}

export interface SummaryData {
  productivity_summary: string
  estimated_workload: string
  risk_level: 'low' | 'medium' | 'high' | 'critical'
  priority_score: number
  suggestions: string[]
  motivational_message: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface EmailData {
  subject: string
  body: string
}

export type EmailType = 'customer_email' | 'status_update' | 'meeting_summary' | 'sprint_update'

export type ActivePage = 'dashboard' | 'chat' | 'email' | 'summary'
