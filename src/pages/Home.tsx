import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useSurveyStore } from '../stores/surveyStore'
import { useUIStore } from '../stores/uiStore'
import { useToastStore } from '../stores/toastStore'
import Button from '../ui/components/Button'
import { useEffect } from 'react'

export default function HomePage() {
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const surveys = useSurveyStore((state) => state.surveys)
  const publishedSurveys = useSurveyStore((state) => state.publishedSurveys)
  const loading = useSurveyStore((state) => state.loading)
  const deleteSurvey = useSurveyStore((state) => state.deleteSurvey)
  const refreshSurveys = useSurveyStore((state) => state.refreshSurveys)
  const refreshPublishedSurveys = useSurveyStore((state) => state.refreshPublishedSurveys)
  const deleteConfirm = useUIStore((state) => state.deleteConfirmId)
  const setDeleteConfirm = useUIStore((state) => state.setDeleteConfirmId)
  const showToast = useToastStore((state) => state.showToast)
  const navigate = useNavigate()

  useEffect(() => {
    refreshSurveys()
    refreshPublishedSurveys()
    
    const interval = setInterval(() => {
      refreshPublishedSurveys()
    }, 5000)
    
    return () => clearInterval(interval)
  }, [refreshSurveys, refreshPublishedSurveys])

  const mySurveys = surveys.filter(s => s.createdBy === user?.id)
  const otherPublishedSurveys = publishedSurveys.filter(s => s.createdBy !== user?.id)

  const handleDelete = async (id: string) => {
    try {
      await deleteSurvey(id)
      setDeleteConfirm(null)
      showToast('Encuesta eliminada exitosamente', 'success')
    } catch (error: any) {
      showToast('Error al eliminar: ' + (error.response?.data?.message || error.message), 'error')
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Davivienda</h1>
                <p className="text-xs text-gray-500">Plataforma de Encuestas</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2 sm:gap-4">
              <span className="text-sm text-gray-600">Hola, <span className="font-semibold">{user?.name}</span></span>
              <Button variant="ghost" onClick={handleLogout} className="text-sm">
                Cerrar sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-8 rounded-2xl border border-white/60 bg-white/80 p-6 sm:p-8 shadow-lg backdrop-blur-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Mis Encuestas</h2>
              <p className="mt-2 text-sm sm:text-base text-gray-600">Crea, gestiona y analiza tus encuestas en tiempo real</p>
            </div>
            <Button onClick={() => navigate('/survey/new')} className="w-full sm:w-auto">
              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nueva encuesta
            </Button>
          </div>
        </div>

        {/* Surveys Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-red-600 border-r-transparent"></div>
            <p className="mt-4 text-gray-600">Cargando encuestas...</p>
          </div>
        ) : mySurveys.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white/60 p-12 text-center">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No tienes encuestas</h3>
            <p className="mt-2 text-sm text-gray-600">Comienza creando tu primera encuesta</p>
            <Button onClick={() => navigate('/survey/new')} className="mt-6">
              Crear mi primera encuesta
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mySurveys.map(survey => (
              <div
                key={survey.id}
                className="group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className="mb-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      survey.isPublished 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {survey.isPublished ? '● Publicada' : '○ Borrador'}
                    </span>
                    <button
                      onClick={() => setDeleteConfirm(survey.id)}
                      className="rounded p-1 text-gray-400 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{survey.title}</h3>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">{survey.description}</p>
                </div>

                <div className="mb-4 flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {survey.questions.length} preguntas
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {new Date(survey.updatedAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    onClick={() => navigate(`/survey/${survey.id}/edit`)}
                    className="flex-1 justify-center text-sm"
                  >
                    Editar
                  </Button>
                  <Button
                    onClick={() => navigate(`/survey/${survey.id}/results`)}
                    variant="ghost"
                    className="flex-1 justify-center text-sm"
                  >
                    Ver resultados
                  </Button>
                </div>

                {/* Delete Confirmation Modal */}
                {deleteConfirm === survey.id && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-black/60 p-4 backdrop-blur-sm">
                    <div className="w-full rounded-lg bg-white p-4 shadow-xl">
                      <h4 className="font-semibold text-gray-900">¿Eliminar encuesta?</h4>
                      <p className="mt-2 text-sm text-gray-600">Esta acción no se puede deshacer.</p>
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => handleDelete(survey.id)}
                          className="flex-1 rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                        >
                          Eliminar
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="flex-1 rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Encuestas Publicadas por Otros Usuarios */}
        {otherPublishedSurveys.length > 0 && (
          <div className="mt-16">
            <div className="mb-6 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-gray-900">Encuestas Publicadas</h2>
              <p className="mt-2 text-sm text-gray-600">Explora y responde encuestas creadas por otros usuarios</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {otherPublishedSurveys.map(survey => (
                <div
                  key={survey.id}
                  className="group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="mb-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">
                        ● Publicada
                      </span>
                      <span className="text-xs text-gray-500">
                        <svg className="inline h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{survey.title}</h3>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">{survey.description}</p>
                  </div>

                  <div className="mb-4 flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {survey.questions.length} preguntas
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {new Date(survey.updatedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <Button
                    onClick={() => navigate(`/survey/${survey.id}/respond`)}
                    className="w-full justify-center text-sm"
                  >
                    Responder encuesta
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-white/60 bg-white/80 p-6 backdrop-blur-sm">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900">Crear Encuestas</h3>
            <p className="mt-2 text-sm text-gray-600">Diseña formularios personalizados con múltiples tipos de preguntas</p>
          </div>
          <div className="rounded-xl border border-white/60 bg-white/80 p-6 backdrop-blur-sm">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900">Analiza Resultados</h3>
            <p className="mt-2 text-sm text-gray-600">Visualiza estadísticas y gráficos en tiempo real</p>
          </div>
          <div className="rounded-xl border border-white/60 bg-white/80 p-6 backdrop-blur-sm">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900">Comparte Fácilmente</h3>
            <p className="mt-2 text-sm text-gray-600">Publica y comparte tus encuestas con cualquier persona</p>
          </div>
        </div>
      </main>
    </div>
  )
}
