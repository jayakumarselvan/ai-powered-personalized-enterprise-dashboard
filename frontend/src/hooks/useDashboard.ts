// frontend/src/hooks/useDashboard.ts
// Data-fetching hook for the dashboard and AI features.

import { useState, useCallback } from 'react'
import {
  fetchDashboard,
  fetchRecommendations,
  fetchSummary,
  generateEmail,
  sendChatMessage,
} from '../api/dashboard'
import type {
  ChatMessage,
  DashboardData,
  EmailData,
  EmailType,
  RecommendationsResponse,
  SummaryData,
} from '../types'

export function useDashboard() {
  const [employeeId, setEmployeeId] = useState<string>('jayakumar')
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [recommendations, setRecommendations] = useState<RecommendationsResponse | null>(null)
  const [summary, setSummary] = useState<SummaryData | null>(null)
  const [email, setEmail] = useState<EmailData | null>(null)

  const [loadingDashboard, setLoadingDashboard] = useState(false)
  const [loadingRecs, setLoadingRecs] = useState(false)
  const [loadingSummary, setLoadingSummary] = useState(false)
  const [loadingEmail, setLoadingEmail] = useState(false)
  const [loadingChat, setLoadingChat] = useState(false)

  const [error, setError] = useState<string | null>(null)

  // ── Dashboard ───────────────────────────────────────────────────────────────

  const loadDashboard = useCallback(async (id?: string) => {
    const targetId = id ?? employeeId
    setLoadingDashboard(true)
    setError(null)
    try {
      const data = await fetchDashboard(targetId)
      setDashboardData(data)
      // Reset AI data when switching users
      setRecommendations(null)
      setSummary(null)
      setEmail(null)
    } catch (e) {
      setError('Failed to load dashboard data.')
      console.error(e)
    } finally {
      setLoadingDashboard(false)
    }
  }, [employeeId])

  const switchEmployee = useCallback((id: string) => {
    setEmployeeId(id)
    loadDashboard(id)
  }, [loadDashboard])

  // ── Recommendations ─────────────────────────────────────────────────────────

  const loadRecommendations = useCallback(async () => {
    setLoadingRecs(true)
    setError(null)
    try {
      const data = await fetchRecommendations(employeeId)
      setRecommendations(data)
    } catch (e) {
      setError('Failed to generate recommendations.')
      console.error(e)
    } finally {
      setLoadingRecs(false)
    }
  }, [employeeId])

  // ── Summary ─────────────────────────────────────────────────────────────────

  const loadSummary = useCallback(async () => {
    setLoadingSummary(true)
    setError(null)
    try {
      const data = await fetchSummary(employeeId)
      setSummary(data)
    } catch (e) {
      setError('Failed to generate summary.')
      console.error(e)
    } finally {
      setLoadingSummary(false)
    }
  }, [employeeId])

  // ── Email ───────────────────────────────────────────────────────────────────

  const loadEmail = useCallback(
    async (emailType: EmailType, context?: string) => {
      setLoadingEmail(true)
      setError(null)
      try {
        const data = await generateEmail(employeeId, emailType, context)
        setEmail(data)
      } catch (e) {
        setError('Failed to generate email.')
        console.error(e)
      } finally {
        setLoadingEmail(false)
      }
    },
    [employeeId],
  )

  // ── Chat ────────────────────────────────────────────────────────────────────

  const chat = useCallback(
    async (messages: ChatMessage[]): Promise<string> => {
      setLoadingChat(true)
      setError(null)
      try {
        const { reply } = await sendChatMessage(employeeId, messages)
        return reply
      } catch (e) {
        setError('Chat request failed.')
        console.error(e)
        return 'Sorry, I encountered an error. Please try again.'
      } finally {
        setLoadingChat(false)
      }
    },
    [employeeId],
  )

  return {
    employeeId,
    dashboardData,
    recommendations,
    summary,
    email,
    loadingDashboard,
    loadingRecs,
    loadingSummary,
    loadingEmail,
    loadingChat,
    error,
    loadDashboard,
    switchEmployee,
    loadRecommendations,
    loadSummary,
    loadEmail,
    chat,
  }
}
