// frontend/src/api/dashboard.ts
// All API call functions used by the application.

import client from './client'
import type {
  ChatMessage,
  DashboardData,
  EmailData,
  EmailType,
  RecommendationsResponse,
  SummaryData,
} from '../types'

// ── Dashboard ─────────────────────────────────────────────────────────────────

export async function fetchDashboard(employeeId: string): Promise<DashboardData> {
  const { data } = await client.get<DashboardData>('/dashboard', {
    params: { employee_id: employeeId },
  })
  return data
}

// ── Recommendations ───────────────────────────────────────────────────────────

export async function fetchRecommendations(
  employeeId: string,
): Promise<RecommendationsResponse> {
  const { data } = await client.post<RecommendationsResponse>('/recommendations', {
    employee_id: employeeId,
  })
  return data
}

// ── Summary ───────────────────────────────────────────────────────────────────

export async function fetchSummary(employeeId: string): Promise<SummaryData> {
  const { data } = await client.post<SummaryData>('/summary', {
    employee_id: employeeId,
  })
  return data
}

// ── Email ─────────────────────────────────────────────────────────────────────

export async function generateEmail(
  employeeId: string,
  emailType: EmailType,
  context?: string,
): Promise<EmailData> {
  const { data } = await client.post<EmailData>('/email', {
    employee_id: employeeId,
    email_type: emailType,
    context: context ?? null,
  })
  return data
}

// ── Chat ──────────────────────────────────────────────────────────────────────

export async function sendChatMessage(
  employeeId: string,
  messages: ChatMessage[],
): Promise<{ reply: string }> {
  const { data } = await client.post<{ reply: string }>('/chat', {
    employee_id: employeeId,
    messages,
  })
  return data
}
