import { useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useResultsStore } from '../stores/resultsStore'
import { useToastStore } from '../stores/toastStore'
import { Question } from '../domain/Survey'
import Button from '../ui/components/Button'
import BarChartComponent from '../ui/components/charts/BarChartComponent'
import PieChartComponent from '../ui/components/charts/PieChartComponent'
import TextResponses from '../ui/components/charts/TextResponses'

export default function SurveyResults() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const survey = useResultsStore((state) => state.survey)
  const responses = useResultsStore((state) => state.responses)
  const results = useResultsStore((state) => state.results)
  const loading = useResultsStore((state) => state.loading)
  const error = useResultsStore((state) => state.error)
  const loadResults = useResultsStore((state) => state.loadResults)
  const refreshResults = useResultsStore((state) => state.refreshResults)
  const reset = useResultsStore((state) => state.reset)
  const showToast = useToastStore((state) => state.showToast)
  const pollingIntervalRef = useRef<number | null>(null)

  useEffect(() => {
    if (id) {
      loadResults(id)
    }
    return () => reset()
  }, [id, loadResults, reset])

  useEffect(() => {
    if (id && survey) {
      pollingIntervalRef.current = window.setInterval(() => {
        refreshResults(id)
      }, 5000)


      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current)
        }
      }
    }
  }, [id, survey, refreshResults])

  useEffect(() => {
    if (error) {
      showToast(error, 'error')
    }
  }, [error, showToast])

  useEffect(() => {
    if (survey && survey.createdBy !== user?.id) {
      showToast('No tienes permisos para ver los resultados de esta encuesta', 'error')
      navigate('/')
    }
  }, [survey, user, navigate, showToast])

  const handleBack = () => {
    navigate('/')
  }

  const handleExport = () => {
    if (!survey || !responses) return

    const BOM = '\uFEFF'
    
    const title = `"Encuesta: ${survey.title}"`
    const date = `"Fecha de exportación: ${new Date().toLocaleString('es-ES')}"`
    const totalResponses = `"Total de respuestas: ${responses.length}"`
    const separator = '' 
    
    const headers = [
      'No.',
      'Email del participante',
      'Fecha y hora de respuesta',
      ...survey.questions.map((q: any) => {
        const typeLabel = getQuestionTypeLabel(q.type.toLowerCase().replace(/_/g, '-'))
        return `${q.title} (${typeLabel})`
      })
    ]
    
    const rows = responses
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()) 
      .map((response, index) => {
        const row = [
          String(index + 1), 
          response.respondentId || response.respondentEmail || 'Anónimo',
          formatDateForExport(response.completedAt)
        ]
        
        survey.questions.forEach((question: any) => {
          const answer = response.answers.find(a => a.questionId === question.id)
          if (answer && answer.value) {
            row.push(answer.value.join(' | '))
          } else {
            row.push('Sin respuesta')
          }
        })
        
        return row
      })

    const csvLines = [
      title,
      date,
      totalResponses,
      separator,
      headers.map(h => `"${h}"`).join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ]

    const csvContent = BOM + csvLines.join('\r\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    const fileName = `Resultados_${survey.title.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`
    
    link.setAttribute('href', url)
    link.setAttribute('download', fileName)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    showToast('Resultados exportados exitosamente', 'success')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-red-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Cargando resultados...</p>
        </div>
      </div>
    )
  }

  if (!survey) {
    return null
  }

  const totalResponses = responses.length

  const getLastResponseDate = (): string => {
    if (responses.length === 0) {
      return ''
    }
    
    const sortedResponses = [...responses].sort((a, b) => {
      const dateA = new Date(a.completedAt).getTime()
      const dateB = new Date(b.completedAt).getTime()
      return dateB - dateA
    })
    
    return sortedResponses[0]?.completedAt || ''
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Button onClick={handleBack} variant="ghost" className="p-2">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-gray-900">Resultados de la Encuesta</h1>
                  {/* Real-time indicator */}
                  <div className="flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-green-600"></div>
                    <span className="text-xs font-medium text-green-700">En vivo</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">{survey.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleExport} disabled={totalResponses === 0}>
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Exportar CSV
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Summary Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-white/60 bg-white/80 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Respuestas</p>
                <p className="text-2xl font-bold text-gray-900">{totalResponses}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/60 bg-white/80 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Preguntas</p>
                <p className="text-2xl font-bold text-gray-900">{survey.questions.length}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/60 bg-white/80 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estado</p>
                <p className="text-2xl font-bold text-green-600">
                  {survey.isPublished ? 'Publicada' : 'Borrador'}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-white/60 bg-white/80 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Última respuesta</p>
                <p className="text-sm font-bold text-gray-900">
                  {totalResponses > 0 && responses.length > 0
                    ? formatDate(getLastResponseDate())
                    : 'Sin respuestas'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time update info banner */}
        <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Actualizaciones automáticas activas.</span> Los resultados se actualizan cada 5 segundos cuando llegan nuevas respuestas.
            </p>
          </div>
        </div>

        {/* No responses message */}
        {totalResponses === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white/60 p-12 text-center">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No hay respuestas todavía</h3>
            <p className="mt-2 text-sm text-gray-600">
              Comparte tu encuesta para comenzar a recibir respuestas
            </p>
          </div>
        )}

        {/* Results by Question */}
        {totalResponses > 0 && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">Resultados por Pregunta</h2>
            
            {results.map((result, index) => {
              const question = survey.questions.find((q: Question) => q.id === result.questionId)
              
              return (
                <div key={result.questionId}>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {index + 1}. {result.questionTitle}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Tipo: {getQuestionTypeLabel(result.questionType)} • {result.totalResponses} respuestas
                    </p>
                  </div>

                  {/* Mostrar imagen si existe */}
                  {question?.imageUrl && (
                    <div className="mb-4">
                      <img
                        src={question.imageUrl}
                        alt="Imagen de la pregunta"
                        className="max-h-64 w-full rounded-lg border border-gray-300 object-contain bg-gray-50"
                      />
                    </div>
                  )}

                  {result.questionType === 'text' ? (
                    <TextResponses 
                      responses={result.textResponses || []} 
                      title="Respuestas"
                    />
                  ) : result.questionType === 'scale' ? (
                    <BarChartComponent 
                      data={result.answers} 
                      title="Distribución de Respuestas"
                    />
                  ) : result.answers.length <= 5 ? (
                    <PieChartComponent 
                      data={result.answers} 
                      title="Distribución de Respuestas"
                    />
                  ) : (
                    <BarChartComponent 
                      data={result.answers} 
                      title="Distribución de Respuestas"
                    />
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

function getQuestionTypeLabel(type: string): string {
  const types: { [key: string]: string } = {
    'multiple-choice': 'Opción múltiple',
    'checkbox': 'Casillas de verificación',
    'dropdown': 'Desplegable',
    'text': 'Respuesta corta',
    'scale': 'Escala lineal'
  }
  return types[type] || type
}

function formatDateForExport(dateString: string): string {
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
    return 'Error en fecha'
  }
}

function formatDate(dateString: string): string {
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
