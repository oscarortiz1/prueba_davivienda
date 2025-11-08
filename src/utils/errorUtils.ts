/**
 * Utilidades para manejar y formatear errores de la API
 */

export interface ApiError {
  message: string
  errors?: { [key: string]: string }
  status?: number
}

/**
 */
export function getErrorMessage(error: any): string {
  if (!error.response) {
    if (error.message?.includes('Network Error')) {
      return 'No se pudo conectar con el servidor. Verifica tu conexión a internet.'
    }
    return error.message || 'Ocurrió un error inesperado'
  }

  const response = error.response
  const data = response.data as ApiError

  if (data.errors && Object.keys(data.errors).length > 0) {
    const fieldErrors = Object.entries(data.errors)
      .map(([field, message]) => {
        const fieldName = getFieldName(field)
        return `• ${fieldName}: ${message}`
      })
      .join('\n')
    
    return `Por favor, corrige los siguientes errores:\n${fieldErrors}`
  }

  if (data.message) {
    return data.message
  }

  switch (response.status) {
    case 400:
      return 'La solicitud contiene datos inválidos'
    case 401:
      return 'No estás autorizado. Por favor inicia sesión'
    case 403:
      return 'No tienes permisos para realizar esta acción'
    case 404:
      return 'El recurso solicitado no existe'
    case 500:
      return 'Error del servidor. Por favor intenta más tarde'
    default:
      return `Error: ${response.status} - ${response.statusText}`
  }
}


function getFieldName(field: string): string {
  const fieldNames: { [key: string]: string } = {
    'respondentEmail': 'Correo electrónico',
    'answers': 'Respuestas',
    'answers[0].questionId': 'ID de pregunta',
    'answers[0].value': 'Respuesta',
    'title': 'Título',
    'description': 'Descripción',
    'email': 'Correo electrónico',
    'password': 'Contraseña',
    'name': 'Nombre'
  }

  for (const [pattern, name] of Object.entries(fieldNames)) {
    if (field.includes(pattern) || field === pattern) {
      return name
    }
  }

  return field
}


export function getFieldErrors(error: any): { [key: string]: string } | null {
  if (!error.response?.data?.errors) {
    return null
  }

  return error.response.data.errors
}


export function isValidationError(error: any): boolean {
  return error.response?.status === 400 && 
         error.response?.data?.errors !== undefined
}


export function isAuthError(error: any): boolean {
  return error.response?.status === 401 || error.response?.status === 403
}


export function isNotFoundError(error: any): boolean {
  return error.response?.status === 404
}
