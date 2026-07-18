// frontend/src/App.tsx
// Root application component — manages page routing and top-level state.

import { type FC, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Chat from './components/Chat'
import EmailGenerator from './components/EmailGenerator'
import SummaryPage from './pages/SummaryPage'
import LoadingSpinner from './components/LoadingSpinner'
import { useDashboard } from './hooks/useDashboard'
import { useState } from 'react'
import type { ActivePage } from './types'

const App: FC = () => {
  const [activePage, setActivePage] = useState<ActivePage>('dashboard')

  const {
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
  } = useDashboard()

  // Load dashboard on mount
  useEffect(() => {
    loadDashboard()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const employee = dashboardData?.employee

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        employees={dashboardData?.employees ?? []}
        currentEmployeeId={employeeId}
        onSwitchEmployee={(id) => {
          switchEmployee(id)
          setActivePage('dashboard')
        }}
      />

      {/* Main content area */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-dark-900 bg-opacity-80 backdrop-blur-md border-b border-dark-600 px-8 py-3 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-200 capitalize">
              {activePage === 'dashboard' ? 'Dashboard' :
               activePage === 'chat' ? 'AI Assistant' :
               activePage === 'email' ? 'Email Generator' :
               'AI Summary'}
            </h2>
            {employee && (
              <p className="text-xs text-gray-500">{employee.name} · {employee.role}</p>
            )}
          </div>
          {error && (
            <div className="text-xs text-red-400 bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 px-3 py-1.5 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Page content */}
        <div
          className={`flex-1 p-8 ${activePage === 'chat' ? 'flex flex-col' : ''}`}
        >
          {loadingDashboard && (
            <div className="flex items-center justify-center min-h-96">
              <LoadingSpinner label="Loading your dashboard..." size="lg" />
            </div>
          )}

          {!loadingDashboard && !employee && (
            <div className="flex items-center justify-center min-h-96">
              <p className="text-gray-500">No data available.</p>
            </div>
          )}

          {!loadingDashboard && employee && (
            <>
              {activePage === 'dashboard' && (
                <Dashboard
                  employee={employee}
                  recommendations={recommendations?.recommendations ?? []}
                  summary={summary}
                  loadingRecs={loadingRecs}
                  loadingSummary={loadingSummary}
                  onLoadRecommendations={loadRecommendations}
                  onLoadSummary={loadSummary}
                  onNavigate={setActivePage}
                />
              )}

              {activePage === 'chat' && (
                <div className="flex-1 flex flex-col glass-card overflow-hidden -m-2">
                  <Chat
                    employeeName={employee.name}
                    loading={loadingChat}
                    onSend={chat}
                  />
                </div>
              )}

              {activePage === 'email' && (
                <EmailGenerator
                  loading={loadingEmail}
                  email={email}
                  onGenerate={loadEmail}
                />
              )}

              {activePage === 'summary' && (
                <SummaryPage
                  employee={employee}
                  summary={summary}
                  loading={loadingSummary}
                  onLoad={loadSummary}
                />
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
