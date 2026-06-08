export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export function validateDatasetName(name: string): boolean {
  return name.length > 0 && name.length <= 255
}

export function validateDescription(description: string): boolean {
  return description.length <= 2000
}

export function validateBusinessDescription(description: string): boolean {
  return description.length >= 10 && description.length <= 500
}

export function validateTags(tags: string[]): boolean {
  return tags.length <= 5 && tags.every(tag => tag.length > 0)
}

export function validateFileSize(size: number, maxSize: number = 100 * 1024 * 1024): boolean {
  return size <= maxSize
}

export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type)
}

export interface ValidationError {
  field: string
  message: string
}

export function validateRequired(value: string | undefined | null, fieldName: string): ValidationError | null {
  if (!value || value.trim().length === 0) {
    return { field: fieldName, message: `${fieldName} is required` }
  }
  return null
}
