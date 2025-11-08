import { 
  MAX_IMAGE_SIZE_BYTES, 
  ALLOWED_IMAGE_TYPES,
  MAX_SURVEY_TITLE_LENGTH,
  MAX_SURVEY_DESCRIPTION_LENGTH,
  MAX_QUESTION_TITLE_LENGTH,
  MAX_QUESTIONS_PER_SURVEY
} from '../config/constants'

/**
 * Resultado de validación
 */
export interface ValidationResult {
  isValid: boolean
  error?: string
}

/**
 * Valida si un archivo de imagen es válido
 */
export function validateImageFile(file: File): ValidationResult {
  // Validar tipo de archivo
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: `Tipo de archivo no permitido. Solo se permiten: ${ALLOWED_IMAGE_TYPES.join(', ')}`
    }
  }

  // Validar tamaño de archivo
  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      isValid: false,
      error: `La imagen excede el tamaño máximo de ${MAX_IMAGE_SIZE_BYTES / (1024 * 1024)}MB`
    }
  }

  return { isValid: true }
}

/**
 * Valida el título de una encuesta
 */
export function validateSurveyTitle(title: string): ValidationResult {
  if (!title || title.trim().length === 0) {
    return {
      isValid: false,
      error: 'El título es obligatorio'
    }
  }

  if (title.length > MAX_SURVEY_TITLE_LENGTH) {
    return {
      isValid: false,
      error: `El título no puede exceder ${MAX_SURVEY_TITLE_LENGTH} caracteres`
    }
  }

  return { isValid: true }
}

/**
 * Valida la descripción de una encuesta
 */
export function validateSurveyDescription(description: string): ValidationResult {
  if (description && description.length > MAX_SURVEY_DESCRIPTION_LENGTH) {
    return {
      isValid: false,
      error: `La descripción no puede exceder ${MAX_SURVEY_DESCRIPTION_LENGTH} caracteres`
    }
  }

  return { isValid: true }
}

/**
 * Valida el título de una pregunta
 */
export function validateQuestionTitle(title: string): ValidationResult {
  if (!title || title.trim().length === 0) {
    return {
      isValid: false,
      error: 'El título de la pregunta es obligatorio'
    }
  }

  if (title.length > MAX_QUESTION_TITLE_LENGTH) {
    return {
      isValid: false,
      error: `El título no puede exceder ${MAX_QUESTION_TITLE_LENGTH} caracteres`
    }
  }

  return { isValid: true }
}

/**
 * Valida el número de preguntas en una encuesta
 */
export function validateQuestionCount(currentCount: number): ValidationResult {
  if (currentCount >= MAX_QUESTIONS_PER_SURVEY) {
    return {
      isValid: false,
      error: `No puedes agregar más de ${MAX_QUESTIONS_PER_SURVEY} preguntas a una encuesta`
    }
  }

  return { isValid: true }
}

/**
 * Valida una dirección de email
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim().length === 0) {
    return {
      isValid: false,
      error: 'El email es obligatorio'
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: 'El email no es válido'
    }
  }

  return { isValid: true }
}

/**
 * Valida una contraseña
 */
export function validatePassword(password: string): ValidationResult {
  if (!password || password.length === 0) {
    return {
      isValid: false,
      error: 'La contraseña es obligatoria'
    }
  }

  if (password.length < 6) {
    return {
      isValid: false,
      error: 'La contraseña debe tener al menos 6 caracteres'
    }
  }

  return { isValid: true }
}

/**
 * Valida las opciones de una pregunta de opción múltiple
 */
export function validateQuestionOptions(options: string[]): ValidationResult {
  if (!options || options.length < 2) {
    return {
      isValid: false,
      error: 'Debe haber al menos 2 opciones'
    }
  }

  const emptyOptions = options.filter(opt => !opt || opt.trim().length === 0)
  if (emptyOptions.length > 0) {
    return {
      isValid: false,
      error: 'Todas las opciones deben tener texto'
    }
  }

  return { isValid: true }
}
