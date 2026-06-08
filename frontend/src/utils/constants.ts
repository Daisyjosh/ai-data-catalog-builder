export const SENSITIVITY_LEVELS = [
  { value: 'Public', label: 'Public' },
  { value: 'Internal', label: 'Internal' },
  { value: 'Confidential', label: 'Confidential' },
]

export const DATA_TYPES = [
  'String',
  'Integer',
  'Float',
  'Boolean',
  'Date',
  'DateTime',
  'JSON',
  'Unknown',
]

export const SOURCE_TYPES = [
  { value: 'CSV', label: 'CSV' },
  { value: 'JSON', label: 'JSON' },
  { value: 'SQLite', label: 'SQLite' },
]

export const AGENT_STATUSES = [
  { value: 'Running', label: 'Running', color: 'bg-blue-100 text-blue-800' },
  { value: 'Completed', label: 'Completed', color: 'bg-green-100 text-green-800' },
  { value: 'Failed', label: 'Failed', color: 'bg-red-100 text-red-800' },
  { value: 'Paused', label: 'Paused', color: 'bg-yellow-100 text-yellow-800' },
]

export const LOG_LEVELS = [
  { value: 'DEBUG', label: 'Debug' },
  { value: 'INFO', label: 'Info' },
  { value: 'WARNING', label: 'Warning' },
  { value: 'ERROR', label: 'Error' },
]

export const SEARCH_TYPES = [
  { value: 'keyword', label: 'Keyword Search' },
  { value: 'semantic', label: 'Semantic Search' },
]

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

export const ITEMS_PER_PAGE = 20

export const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB

export const SUPPORTED_FILE_TYPES = ['text/csv', 'application/json', 'application/x-sqlite3']

export const ANIMATION_DURATION = 300
