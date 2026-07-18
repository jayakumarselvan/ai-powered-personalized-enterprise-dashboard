// frontend/src/components/Sidebar.tsx
// Left navigation sidebar with user switcher.

import { type FC } from 'react'
import {
  RiDashboardLine,
  RiRobot2Line,
  RiMailLine,
  RiBarChartLine,
  RiArrowRightSLine,
} from 'react-icons/ri'
import type { ActivePage, EmployeeSummary } from '../types'

interface SidebarProps {
  activePage: ActivePage
  onNavigate: (page: ActivePage) => void
  employees: EmployeeSummary[]
  currentEmployeeId: string
  onSwitchEmployee: (id: string) => void
}

const NAV_ITEMS: { id: ActivePage; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <RiDashboardLine size={18} /> },
  { id: 'chat', label: 'AI Assistant', icon: <RiRobot2Line size={18} /> },
  { id: 'email', label: 'Email Generator', icon: <RiMailLine size={18} /> },
  { id: 'summary', label: 'AI Summary', icon: <RiBarChartLine size={18} /> },
]

const Sidebar: FC<SidebarProps> = ({
  activePage,
  onNavigate,
  employees,
  currentEmployeeId,
  onSwitchEmployee,
}) => {
  return (
    <aside className="w-64 min-h-screen bg-dark-800 border-r border-dark-600 flex flex-col fixed top-0 left-0 z-20">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-dark-600">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <RiRobot2Line size={16} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">Enterprise AI</p>
            <p className="text-xs text-gray-500 leading-tight">Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <p className="text-xs text-gray-600 uppercase tracking-wider font-semibold px-3 mb-3">
          Navigation
        </p>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              activePage === item.id
                ? 'bg-indigo-600 bg-opacity-20 text-indigo-400 border border-indigo-500 border-opacity-30'
                : 'text-gray-400 hover:text-gray-200 hover:bg-dark-700'
            }`}
          >
            <span className="flex items-center gap-3">
              {item.icon}
              {item.label}
            </span>
            {activePage === item.id && <RiArrowRightSLine size={14} />}
          </button>
        ))}
      </nav>

      {/* User Switcher */}
      <div className="px-3 py-4 border-t border-dark-600">
        <p className="text-xs text-gray-600 uppercase tracking-wider font-semibold px-3 mb-3">
          Switch User
        </p>
        <div className="space-y-1">
          {employees.map((emp) => (
            <button
              key={emp.id}
              onClick={() => onSwitchEmployee(emp.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-all duration-200 ${
                currentEmployeeId === emp.id
                  ? 'bg-dark-600 border border-dark-400'
                  : 'hover:bg-dark-700'
              }`}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                style={{ backgroundColor: emp.avatar_color }}
              >
                {emp.avatar_initials}
              </div>
              <div className="text-left min-w-0">
                <p className="text-gray-200 font-medium truncate">{emp.name}</p>
                <p className="text-gray-500 truncate">{emp.department}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
