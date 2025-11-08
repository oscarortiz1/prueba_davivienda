/**
 * Constantes de configuración de la aplicación
 */

// API Configuration
export const API_BASE_URL = 'http://localhost:8080'

// Image Configuration
export const MAX_IMAGE_SIZE_MB = 2
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']

// Survey Configuration
export const MAX_QUESTIONS_PER_SURVEY = 100
export const MAX_SURVEY_TITLE_LENGTH = 200
export const MAX_SURVEY_DESCRIPTION_LENGTH = 1000
export const MAX_QUESTION_TITLE_LENGTH = 500

// Duration Units
export const DURATION_UNITS = {
  NONE: 'none',
  MINUTES: 'minutes',
  HOURS: 'hours',
  DAYS: 'days'
} as const

// Question Types
export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'multiple-choice',
  CHECKBOX: 'checkbox',
  DROPDOWN: 'dropdown',
  TEXT: 'text',
  SCALE: 'scale'
} as const

// Question Type Labels
export const QUESTION_TYPE_LABELS: Record<string, string> = {
  'multiple-choice': 'Opción múltiple',
  'checkbox': 'Casillas de verificación',
  'dropdown': 'Desplegable',
  'text': 'Respuesta corta',
  'scale': 'Escala lineal'
}

// Auto-refresh Configuration
export const RESULTS_POLLING_INTERVAL_MS = 5000 // 5 seconds

// Toast Configuration
export const TOAST_DURATION_MS = 3000 // 3 seconds
export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info'
} as const

// CSV Export Configuration
export const CSV_BOM = '\uFEFF'
export const CSV_SEPARATOR = ','
export const CSV_LINE_SEPARATOR = '\r\n'
