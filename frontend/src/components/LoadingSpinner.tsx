// frontend/src/components/LoadingSpinner.tsx
// Reusable loading state component.

import { type FC } from 'react'

interface Props {
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

const LoadingSpinner: FC<Props> = ({ label = 'Loading...', size = 'md' }) => {
  const sizeClass = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
  }[size]

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <div
        className={`${sizeClass} border-dark-500 border-t-indigo-500 rounded-full animate-spin`}
      />
      {label && <p className="text-sm text-gray-500">{label}</p>}
    </div>
  )
}

export default LoadingSpinner
