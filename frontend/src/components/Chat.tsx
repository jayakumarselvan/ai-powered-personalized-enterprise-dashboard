// frontend/src/components/Chat.tsx
// Full-page AI chat assistant with employee context.

import { type FC, useState, useRef, useEffect } from 'react'
import { RiRobot2Line, RiSendPlane2Line, RiUser3Line } from 'react-icons/ri'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { ChatMessage } from '../types'

const SUGGESTED_QUESTIONS = [
  'What should I work on today?',
  'Summarize my tasks.',
  'What are today\'s risks?',
  'Draft an email to my customer.',
  'Which meetings can I skip?',
  'Suggest my priorities.',
]

interface Props {
  employeeName: string
  loading: boolean
  onSend: (messages: ChatMessage[]) => Promise<string>
}

const Chat: FC<Props> = ({ employeeName, loading, onSend }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (text?: string) => {
    const content = (text ?? input).trim()
    if (!content || loading) return

    const userMsg: ChatMessage = { role: 'user', content }
    const newHistory = [...messages, userMsg]
    setMessages(newHistory)
    setInput('')

    const reply = await onSend(newHistory)
    setMessages([...newHistory, { role: 'assistant', content: reply }])
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-dark-600">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <RiRobot2Line size={18} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-100">AI Assistant</p>
          <p className="text-xs text-gray-500">
            Knows {employeeName}'s full context
          </p>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-slow" />
          <span className="text-xs text-green-400">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-8 animate-fade-in">
            <RiRobot2Line size={36} className="text-indigo-500 mx-auto mb-3" />
            <p className="text-gray-300 font-medium mb-1">Hi {employeeName.split(' ')[0]}! 👋</p>
            <p className="text-gray-500 text-sm mb-6">
              I know your tickets, PRs, meetings, and escalations. Ask me anything.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="text-xs bg-dark-700 hover:bg-dark-600 border border-dark-500 hover:border-indigo-500 text-gray-300 hover:text-gray-100 px-3 py-2 rounded-xl transition-all duration-200"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 animate-slide-up ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                msg.role === 'assistant'
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                  : 'bg-dark-600 border border-dark-400'
              }`}
            >
              {msg.role === 'assistant' ? (
                <RiRobot2Line size={14} className="text-white" />
              ) : (
                <RiUser3Line size={14} className="text-gray-400" />
              )}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-indigo-600 bg-opacity-30 border border-indigo-500 border-opacity-30 text-gray-100 rounded-tr-sm whitespace-pre-wrap'
                  : 'bg-dark-700 border border-dark-500 text-gray-200 rounded-tl-sm prose-chat'
              }`}
            >
              {msg.role === 'user' ? msg.content : (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                    strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                    em: ({ children }) => <em className="text-indigo-300">{children}</em>,
                    ul: ({ children }) => <ul className="list-disc list-inside space-y-1 my-2 text-gray-300">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 my-2 text-gray-300">{children}</ol>,
                    li: ({ children }) => <li className="text-gray-300">{children}</li>,
                    code: ({ children }) => <code className="bg-dark-800 text-indigo-300 px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>,
                    pre: ({ children }) => <pre className="bg-dark-800 border border-dark-500 rounded-xl p-3 my-2 overflow-x-auto text-xs font-mono text-gray-300">{children}</pre>,
                    h1: ({ children }) => <h1 className="text-base font-bold text-white mt-3 mb-1">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-sm font-bold text-white mt-3 mb-1">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-sm font-semibold text-indigo-300 mt-2 mb-1">{children}</h3>,
                    blockquote: ({ children }) => <blockquote className="border-l-2 border-indigo-500 pl-3 my-2 text-gray-400 italic">{children}</blockquote>,
                    a: ({ href, children }) => <a href={href} className="text-indigo-400 underline hover:text-indigo-300" target="_blank" rel="noopener noreferrer">{children}</a>,
                    hr: () => <hr className="border-dark-500 my-3" />,
                    table: ({ children }) => (
                      <div className="overflow-x-auto my-3">
                        <table className="w-full text-xs border-collapse">{children}</table>
                      </div>
                    ),
                    thead: ({ children }) => <thead>{children}</thead>,
                    tbody: ({ children }) => <tbody>{children}</tbody>,
                    tr: ({ children }) => (
                      <tr className="border-b border-dark-500 last:border-0">{children}</tr>
                    ),
                    th: ({ children }) => (
                      <th className="text-left px-3 py-2 text-indigo-300 font-semibold bg-dark-800 first:rounded-tl-lg last:rounded-tr-lg whitespace-nowrap">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => (
                      <td className="px-3 py-2 text-gray-300 align-top border-r border-dark-600 last:border-0">
                        {children}
                      </td>
                    ),
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <RiRobot2Line size={14} className="text-white" />
            </div>
            <div className="bg-dark-700 border border-dark-500 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1 items-center">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-dark-600">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Ask me anything about your work today..."
            className="input-dark flex-1 text-sm"
            disabled={loading}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="btn-primary px-4 flex items-center gap-2"
          >
            <RiSendPlane2Line size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chat
