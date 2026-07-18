// frontend/src/components/EmailGenerator.tsx
// Full-page email generator with type selection and copy-to-clipboard.

import { type FC, useState } from 'react'
import { RiMailLine, RiFileCopyLine, RiCheckLine } from 'react-icons/ri'
import type { EmailData, EmailType } from '../types'
import LoadingSpinner from './LoadingSpinner'

const EMAIL_TYPES: { id: EmailType; label: string; description: string }[] = [
  { id: 'customer_email', label: 'Customer Email', description: 'Address a customer issue or update' },
  { id: 'status_update', label: 'Status Update', description: 'Internal progress report' },
  { id: 'meeting_summary', label: 'Meeting Summary', description: 'Post-meeting action items' },
  { id: 'sprint_update', label: 'Sprint Update', description: 'Stakeholder sprint summary' },
]

interface Props {
  loading: boolean
  email: EmailData | null
  onGenerate: (type: EmailType, context?: string) => Promise<void>
}

const EmailGenerator: FC<Props> = ({ loading, email, onGenerate }) => {
  const [selectedType, setSelectedType] = useState<EmailType>('customer_email')
  const [context, setContext] = useState('')
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (!email) return
    const full = `Subject: ${email.subject}\n\n${email.body}`
    navigator.clipboard.writeText(full)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
          <RiMailLine size={20} className="text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-100">Email Generator</h2>
          <p className="text-xs text-gray-500">AI-crafted professional emails using your context</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Controls */}
        <div className="space-y-5">
          {/* Type selector */}
          <div className="glass-card p-5">
            <p className="text-sm font-semibold text-gray-200 mb-3">Select Email Type</p>
            <div className="space-y-2">
              {EMAIL_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all duration-200 ${
                    selectedType === type.id
                      ? 'border-indigo-500 border-opacity-50 bg-indigo-500 bg-opacity-10'
                      : 'border-dark-500 hover:border-dark-400 hover:bg-dark-700'
                  }`}
                >
                  <p className={`text-sm font-medium ${selectedType === type.id ? 'text-indigo-300' : 'text-gray-300'}`}>
                    {type.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{type.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Optional context */}
          <div className="glass-card p-5">
            <label className="text-sm font-semibold text-gray-200 block mb-2">
              Additional Context <span className="text-gray-500 font-normal">(optional)</span>
            </label>
            <textarea
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="e.g. Customer reported login issues since yesterday, meeting was about Q2 roadmap..."
              rows={3}
              className="input-dark resize-none text-sm"
            />
          </div>

          <button
            onClick={() => onGenerate(selectedType, context || undefined)}
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RiMailLine size={16} />
                Generate Email
              </>
            )}
          </button>
        </div>

        {/* Right: Output */}
        <div className="glass-card p-5 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-200">Generated Email</p>
            {email && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-200 transition-colors"
              >
                {copied ? (
                  <>
                    <RiCheckLine size={14} className="text-green-400" />
                    <span className="text-green-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <RiFileCopyLine size={14} />
                    Copy
                  </>
                )}
              </button>
            )}
          </div>

          {loading && <LoadingSpinner label="Drafting your email..." />}

          {!loading && !email && (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
              <RiMailLine size={32} className="text-gray-600 mb-3" />
              <p className="text-sm text-gray-500">Select a type and click Generate</p>
            </div>
          )}

          {!loading && email && (
            <div className="flex-1 animate-fade-in space-y-3">
              {/* Subject */}
              <div className="bg-dark-800 rounded-xl p-3 border border-dark-500">
                <p className="text-xs text-gray-500 mb-1">Subject</p>
                <p className="text-sm font-semibold text-indigo-300">{email.subject}</p>
              </div>
              {/* Body */}
              <div className="bg-dark-800 rounded-xl p-3 border border-dark-500 flex-1">
                <p className="text-xs text-gray-500 mb-2">Body</p>
                <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
                  {email.body}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EmailGenerator
