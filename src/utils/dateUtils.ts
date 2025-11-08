/**
 * Formatea una fecha para exportación en formato CSV
 * @param dateString - String de fecha ISO
 * @returns Fecha formateada como DD/MM/YYYY HH:mm:ss
 */
export function formatDateForExport(dateString: string): string {
  if (!dateString || dateString.trim() === '') {
    return 'Sin fecha'
  }
  
  try {
    const date = new Date(dateString)
    
    if (isNaN(date.getTime())) {
      return 'Fecha inválida'
    }
    
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
  } catch (error) {
    console.error('Error formatting date for export:', error, dateString)
    return 'Error en fecha'
  }
}

/**
 * Formatea una fecha para visualización en la UI
 * @param dateString - String de fecha ISO
 * @returns Fecha formateada según locale español
 */
export function formatDate(dateString: string): string {
  if (!dateString || dateString.trim() === '') {
    return 'Sin respuestas'
  }
  
  try {
    const date = new Date(dateString)
    
    if (isNaN(date.getTime())) {
      return 'Fecha inválida'
    }
    
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    console.error('Error formatting date:', error, dateString)
    return 'Error en fecha'
  }
}

/**
 * Formatea una fecha de forma relativa (hace X tiempo)
 * @param dateString - String de fecha ISO
 * @returns Texto relativo como "hace 5 minutos"
 */
export function formatRelativeDate(dateString: string): string {
  if (!dateString || dateString.trim() === '') {
    return 'Nunca'
  }
  
  try {
    const date = new Date(dateString)
    
    if (isNaN(date.getTime())) {
      return 'Fecha inválida'
    }
    
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    
    if (days > 7) {
      return formatDate(dateString)
    } else if (days > 0) {
      return `hace ${days} día${days > 1 ? 's' : ''}`
    } else if (hours > 0) {
      return `hace ${hours} hora${hours > 1 ? 's' : ''}`
    } else if (minutes > 0) {
      return `hace ${minutes} minuto${minutes > 1 ? 's' : ''}`
    } else {
      return 'hace un momento'
    }
  } catch (error) {
    console.error('Error formatting relative date:', error, dateString)
    return 'Error en fecha'
  }
}
