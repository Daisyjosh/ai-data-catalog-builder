import { AlertTriangle, X } from 'lucide-react'
import { useState } from 'react'

export interface ErrorAlertProps {
  title?: string
  message: string
  onDismiss?: () => void
}

export default function ErrorAlert({ title, message, onDismiss }: ErrorAlertProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  return (
    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
      <div className="flex gap-4">
        <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          {title && <h3 className="font-semibold mb-1">{title}</h3>}
          <p className="text-sm">{message}</p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-destructive/60 hover:text-destructive ml-2 flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
