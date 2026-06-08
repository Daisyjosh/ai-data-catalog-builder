import { format, formatDistance, formatRelative } from 'date-fns'

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'MMM dd, yyyy')
}

export function formatTime(date: string | Date): string {
  return format(new Date(date), 'HH:mm:ss')
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'MMM dd, yyyy HH:mm:ss')
}

export function formatRelativeTime(date: string | Date): string {
  return formatDistance(new Date(date), new Date(), { addSuffix: true })
}

export function parseDate(dateString: string): Date {
  return new Date(dateString)
}

export function isRecent(date: string | Date, days: number = 7): boolean {
  const dateObj = new Date(date)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - dateObj.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= days
}
