import { CheckCircle, X } from 'lucide-react'
import { useState } from 'react'

export interface SuccessToastProps {
  title?: string
  message: string
  onDismiss?: () => void
  autoClose?: number
}

export default function SuccessToast({ 
  title, 
  message, 
  onDismiss,
  autoClose = 5000
}: SuccessToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  React.useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(handleDismiss, autoClose)
      return () => clearTimeout(timer)
    }
  }, [autoClose])

  if (!isVisible) return null

  return (
    <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
      <div className="flex gap-4">
        <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600" />
        <div className="flex-1">
          {title && <h3 className="font-semibold mb-1">{title}</h3>}
          <p className="text-sm">{message}</p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-green-600/60 hover:text-green-600 ml-2 flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
