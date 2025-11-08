import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useSurveyStore } from '../stores/surveyStore'
import { useEditorStore } from '../stores/editorStore'
import { useToastStore } from '../stores/toastStore'
import { QuestionType, Question } from '../domain/Survey'
import Button from '../ui/components/Button'
import ImageUpload from '../ui/components/ImageUpload'

export default function SurveyEditor() {
  const params = useParams<{ id: string }>()
  const id = params.id || 'new'
  const navigate = useNavigate()
  const [isEditingExpiration, setIsEditingExpiration] = useState(false)
  const user = useAuthStore((state) => state.user)
  const createSurvey = useSurveyStore((state) => state.createSurvey)
  const getSurvey = useSurveyStore((state) => state.getSurvey)
  const updateSurvey = useSurveyStore((state) => state.updateSurvey)
  const addQuestion = useSurveyStore((state) => state.addQuestion)
  const updateQuestion = useSurveyStore((state) => state.updateQuestion)
  const deleteQuestion = useSurveyStore((state) => state.deleteQuestion)
  const publishSurvey = useSurveyStore((state) => state.publishSurvey)
  const showToast = useToastStore((state) => state.showToast)
  
  const title = useEditorStore((state) => state.title)
  const description = useEditorStore((state) => state.description)
  const questions = useEditorStore((state) => state.questions)
  const durationValue = useEditorStore((state) => state.durationValue)
  const durationUnit = useEditorStore((state) => state.durationUnit)
  const expiresAt = useEditorStore((state) => state.expiresAt)
  const loading = useEditorStore((state) => state.loading)
  const saving = useEditorStore((state) => state.saving)
  const publishing = useEditorStore((state) => state.publishing)
  const currentSurveyId = useEditorStore((state) => state.currentSurveyId)
  const hasUnsavedChanges = useEditorStore((state) => state.hasUnsavedChanges)
  const isPublished = useEditorStore((state) => state.isPublished)
  const setTitle = useEditorStore((state) => state.setTitle)
  const setDescription = useEditorStore((state) => state.setDescription)
  const setDuration = useEditorStore((state) => state.setDuration)
  const setLoading = useEditorStore((state) => state.setLoading)
  const setSaving = useEditorStore((state) => state.setSaving)
  const setPublishing = useEditorStore((state) => state.setPublishing)
  const setCurrentSurveyId = useEditorStore((state) => state.setCurrentSurveyId)
  const setHasUnsavedChanges = useEditorStore((state) => state.setHasUnsavedChanges)
  const loadSurveyData = useEditorStore((state) => state.loadSurveyData)
  const handleAddQuestion = useEditorStore((state) => state.addQuestion)
  const handleUpdateQuestion = useEditorStore((state) => state.updateQuestion)
  const handleDeleteQuestion = useEditorStore((state) => state.deleteQuestion)
  const reset = useEditorStore((state) => state.reset)

  useEffect(() => {
    if (id && id !== 'new') {
      setCurrentSurveyId(id)
      loadSurvey()
    } else {
      setCurrentSurveyId(null)
      reset()
    }
  }, [id])

  const loadSurvey = async () => {
    if (!id || id === 'new') return
    setLoading(true)
    try {
      const survey = await getSurvey(id)
      if (survey) {
        if (survey.createdBy !== user?.id) {
          showToast('No tienes permisos para editar esta encuesta', 'error')
          navigate('/')
          return
        }
        
        const normalizedQuestions = survey.questions.map(q => ({
          ...q,
          type: q.type.toLowerCase().replace(/_/g, '-') as QuestionType
        }))
        
        loadSurveyData(
          survey.title, 
          survey.description, 
          normalizedQuestions, 
          survey.isPublished,
          survey.durationValue,
          survey.durationUnit as 'minutes' | 'hours' | 'days' | 'none' | undefined,
          survey.expiresAt
        )
      }
    } catch (error: any) {
      showToast('Error al cargar la encuesta: ' + (error.response?.data?.message || error.message), 'error')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const validateQuestions = () => {
    const emptyQuestions = questions.filter(q => !q.title.trim())
    if (emptyQuestions.length > 0) {
      showToast('Todas las preguntas deben tener un título', 'warning')
      return false
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      const questionNumber = i + 1

      if (q.type === 'multiple-choice' || q.type === 'checkbox' || q.type === 'dropdown') {
        if (!q.options || q.options.length === 0) {
          showToast(`La pregunta ${questionNumber} de tipo "${getQuestionTypeLabel(q.type)}" debe tener al menos una opción`, 'warning')
          return false
        }

        if (q.options.length < 2) {
          showToast(`La pregunta ${questionNumber} de tipo "${getQuestionTypeLabel(q.type)}" debe tener al menos 2 opciones`, 'warning')
          return false
        }

        const emptyOptions = q.options.filter(opt => !opt.trim())
        if (emptyOptions.length > 0) {
          showToast(`La pregunta ${questionNumber} tiene opciones vacías. Completa o elimina las opciones vacías.`, 'warning')
          return false
        }

        const uniqueOptions = new Set(q.options.map(opt => opt.trim().toLowerCase()))
        if (uniqueOptions.size !== q.options.length) {
          showToast(`La pregunta ${questionNumber} tiene opciones duplicadas. Cada opción debe ser única.`, 'warning')
          return false
        }
      }

      if (q.type === 'scale') {
        if (!q.options || q.options.length < 2) {
          showToast(`La pregunta ${questionNumber} de tipo "Escala lineal" debe tener al menos 2 niveles`, 'warning')
          return false
        }
      }
    }

    return true
  }

  const getQuestionTypeLabel = (type: string) => {
    const types: { [key: string]: string } = {
      'multiple-choice': 'Opción múltiple',
      'checkbox': 'Casillas de verificación',
      'dropdown': 'Desplegable',
      'text': 'Respuesta corta',
      'scale': 'Escala lineal'
    }
    return types[type] || type
  }

  const handleCopyLink = () => {
    const link = `${window.location.origin}/survey/${currentSurveyId}/respond`
    navigator.clipboard.writeText(link)
    showToast('Enlace copiado al portapapeles', 'success')
  }

  const handleSave = async () => {
    if (!user) return
    
    if (questions.length === 0) {
      showToast('Debes agregar al menos una pregunta antes de guardar la encuesta', 'warning')
      return
    }
    
    if (!validateQuestions()) {
      return
    }

    setSaving(true)
    
    try {
      if (id === 'new' && !currentSurveyId) {
        const survey = await createSurvey({
          title,
          description,
          durationValue,
          durationUnit
        })
      
        for (const q of questions) {
          await addQuestion(survey.id, {
            title: q.title,
            type: q.type.toUpperCase().replace(/-/g, '_'),
            options: q.options,
            required: q.required,
            order: q.order,
            imageUrl: q.imageUrl
          })
        }
        
        setCurrentSurveyId(survey.id)
        showToast('Encuesta guardada exitosamente. Ahora puedes publicarla.', 'success')
        
        window.history.replaceState(null, '', `/survey/${survey.id}/edit`)
        
        const savedSurvey = await getSurvey(survey.id)
        if (savedSurvey) {
          const normalizedQuestions = savedSurvey.questions.map((q: any) => ({
            ...q,
            type: q.type.toLowerCase().replace(/_/g, '-') as QuestionType
          }))
          loadSurveyData(
            savedSurvey.title,
            savedSurvey.description,
            normalizedQuestions,
            savedSurvey.isPublished,
            savedSurvey.durationValue,
            savedSurvey.durationUnit as 'minutes' | 'hours' | 'days' | 'none' | undefined,
            savedSurvey.expiresAt
          )
        } else {
          setHasUnsavedChanges(false)
        }
      } else if ((id && id !== 'new') || currentSurveyId) {
        const surveyId = currentSurveyId || id
        await updateSurvey(surveyId, { 
          title, 
          description,
          durationValue,
          durationUnit
        })
        
        const currentSurvey = await getSurvey(surveyId)
        const existingQuestions = currentSurvey.questions || []
        
        const existingIds = new Set(existingQuestions.map((q: any) => q.id))
        const currentIds = new Set(questions.filter(q => q.id && !q.id.includes('temp')).map(q => q.id))
        
        for (const existingQ of existingQuestions) {
          if (!currentIds.has(existingQ.id)) {
            await deleteQuestion(surveyId, existingQ.id)
          }
        }
        
        for (const q of questions) {
          if (q.id && !q.id.includes('temp') && existingIds.has(q.id)) {
            await updateQuestion(surveyId, q.id, {
              title: q.title,
              type: q.type.toUpperCase().replace(/-/g, '_'),
              options: q.options,
              required: q.required,
              order: q.order,
              imageUrl: q.imageUrl
            })
          } else {
            await addQuestion(surveyId, {
              title: q.title,
              type: q.type.toUpperCase().replace(/-/g, '_'),
              options: q.options,
              required: q.required,
              order: q.order,
              imageUrl: q.imageUrl
            })
          }
        }
        
        showToast('Encuesta actualizada exitosamente', 'success')
        
        const updatedSurvey = await getSurvey(surveyId)
        if (updatedSurvey) {
          const normalizedQuestions = updatedSurvey.questions.map((q: any) => ({
            ...q,
            type: q.type.toLowerCase().replace(/_/g, '-') as QuestionType
          }))
          loadSurveyData(
            updatedSurvey.title,
            updatedSurvey.description,
            normalizedQuestions,
            updatedSurvey.isPublished,
            updatedSurvey.durationValue,
            updatedSurvey.durationUnit as 'minutes' | 'hours' | 'days' | 'none' | undefined,
            updatedSurvey.expiresAt
          )
        } else {
          setHasUnsavedChanges(false)
        }
      }

      setIsEditingExpiration(false)
    } catch (error: any) {
      showToast('Error al guardar: ' + (error.response?.data?.message || error.message), 'error')
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    const surveyId = currentSurveyId || (id !== 'new' ? id : null)
    
    if (!surveyId) {
      showToast('Debes guardar la encuesta primero', 'warning')
      return
    }
    
    if (hasUnsavedChanges) {
      showToast('Tienes cambios sin guardar. Guarda la encuesta antes de publicarla.', 'warning')
      return
    }
    
    if (questions.length === 0) {
      showToast('Debes agregar al menos una pregunta antes de publicar la encuesta', 'warning')
      return
    }
    
    if (!validateQuestions()) {
      return
    }
    
    setPublishing(true)
    
    try {
      await publishSurvey(surveyId)
      showToast('Encuesta publicada exitosamente. Ahora otros usuarios podrán verla en el home.', 'success')
      navigate('/')
    } catch (error: any) {
      showToast('Error al publicar: ' + (error.response?.data?.message || error.message), 'error')
    } finally {
      setPublishing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-r-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver
            </button>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                onClick={handleSave}
                disabled={saving || !title.trim() || questions.length === 0 || (!!currentSurveyId && !hasUnsavedChanges)}
              >
                {saving ? 'Guardando...' : 'Guardar'}
              </Button>
              {currentSurveyId && (
                <Button 
                  onClick={handlePublish} 
                  disabled={publishing || hasUnsavedChanges || !title.trim() || questions.length === 0}
                >
                  {publishing ? 'Publicando...' : 'Publicar'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {currentSurveyId && hasUnsavedChanges && (
          <div className="mb-6 rounded-xl border border-yellow-200 bg-yellow-50 p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <svg className="h-5 w-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="font-semibold text-yellow-900 mb-1">⚠️ Tienes cambios sin guardar</h3>
                <p className="text-sm text-yellow-700">
                  Se han realizado cambios en la encuesta. Por favor, guarda los cambios para no perderlos.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Info message for unpublished survey (only if no unsaved changes) */}
        {currentSurveyId && !isPublished && !hasUnsavedChanges && (
          <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <svg className="h-5 w-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">ℹ️ Encuesta guardada pero no publicada</h3>
                <p className="text-sm text-blue-700">
                  Tu encuesta está guardada pero aún no es visible para otros usuarios. Da clic en "Publicar" para que otros puedan responderla.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Green success message with link - Always show if published at least once */}
        {isPublished && currentSurveyId && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="font-semibold text-green-900">Encuesta publicada</h3>
                </div>
                <p className="text-sm text-green-700 mb-3">Comparte este enlace para que otros usuarios puedan responder tu encuesta:</p>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/survey/${currentSurveyId}/respond`}
                    className="flex-1 rounded-md border border-green-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none"
                  />
                  <Button onClick={handleCopyLink} className="whitespace-nowrap">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copiar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <input
            type="text"
            placeholder="Título de la encuesta"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="mb-4 w-full border-0 border-b-2 border-gray-200 bg-transparent text-3xl font-bold text-gray-900 placeholder-gray-400 focus:border-red-600 focus:outline-none focus:ring-0"
          />
          <textarea
            placeholder="Descripción (opcional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={2}
            className="w-full resize-none border-0 bg-transparent text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-0"
          />

          {/* Duration Section */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="mb-3 flex items-center justify-between text-sm font-medium text-gray-700">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Duración de la encuesta
              </div>
              {expiresAt && isPublished && !isEditingExpiration && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    setIsEditingExpiration(true)
                  }}
                  className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors"
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Cambiar fecha
                </button>
              )}
              {isEditingExpiration && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    setIsEditingExpiration(false)
                  }}
                  className="flex items-center gap-1 rounded-md bg-gray-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-700 transition-colors"
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancelar
                </button>
              )}
            </div>
            {expiresAt && isPublished && !isEditingExpiration ? (
              <div className="mb-4 rounded-lg border-l-4 border-purple-500 bg-purple-50 px-4 py-3">
                <p className="text-sm font-semibold text-purple-900">
                  ⏰ Actualmente expira el:
                </p>
                <p className="mt-1 text-lg font-bold text-purple-700">
                  {new Date(expiresAt).toLocaleDateString('es-ES', { 
                    day: 'numeric', 
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            ) : (
              <p className="mb-4 text-sm text-gray-500">
                Define cuánto tiempo estará disponible la encuesta para recibir respuestas
              </p>
            )}
            
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              {/* Duration Value Input */}
              <div className="flex-1">
                <label className="mb-2 block text-xs font-medium text-gray-600">Cantidad</label>
                <input
                  type="number"
                  min="1"
                  placeholder="Ej: 7"
                  value={durationValue || ''}
                  onChange={(e) => {
                    const val = e.target.value ? parseInt(e.target.value) : null
                    setDuration(val, durationUnit === 'none' ? 'days' : durationUnit)
                  }}
                  disabled={durationUnit === 'none' || (isPublished && !!expiresAt && !isEditingExpiration)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20 disabled:cursor-not-allowed disabled:bg-gray-100"
                />
              </div>

              {/* Duration Unit Select */}
              <div className="flex-1">
                <label className="mb-2 block text-xs font-medium text-gray-600">Unidad</label>
                <select
                  value={durationUnit}
                  onChange={(e) => {
                    const unit = e.target.value as 'minutes' | 'hours' | 'days' | 'none'
                    if (unit === 'none') {
                      setDuration(null, 'none')
                    } else {
                      setDuration(durationValue || 1, unit)
                    }
                  }}
                  disabled={isPublished && !!expiresAt && !isEditingExpiration}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/20 disabled:cursor-not-allowed disabled:bg-gray-100"
                >
                  <option value="none">Sin duración</option>
                  <option value="minutes">Minutos</option>
                  <option value="hours">Horas</option>
                  <option value="days">Días</option>
                </select>
              </div>
            </div>

            {/* Expiry Date Preview */}
            {isPublished && expiresAt && !hasUnsavedChanges && (
              <div className="mt-4 rounded-lg border border-slate-300 bg-slate-100 p-3">
                <div className="flex items-start gap-2">
                  <svg className="h-4 w-4 text-slate-700 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-800">
                      Encuesta publicada - Expira el:
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">
                      {new Date(expiresAt).toLocaleString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Warning when modifying duration on published survey */}
            {isPublished && expiresAt && hasUnsavedChanges && durationUnit !== 'none' && (
              <div className="mt-4 rounded-lg border border-orange-200 bg-orange-50 p-3">
                <div className="flex items-start gap-2">
                  <svg className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-orange-900">
                      ⚠️ Al guardar, la fecha de expiración se recalculará
                    </p>
                    <p className="mt-1 text-xs text-orange-700">
                      Nueva expiración: {durationValue} {durationUnit === 'minutes' ? 'minutos' : durationUnit === 'hours' ? 'horas' : 'días'} desde ahora
                    </p>
                    <p className="mt-2 text-xs font-semibold text-orange-800">
                      Fecha actual de expiración: {new Date(expiresAt).toLocaleString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {!isPublished && durationUnit !== 'none' && durationValue && durationValue > 0 && (
              <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
                <div className="flex items-start gap-2">
                  <svg className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-blue-900">
                      Cuando se publique, la encuesta expirará en:
                    </p>
                    <p className="mt-1 text-sm font-semibold text-blue-700">
                      {durationValue} {durationUnit === 'minutes' ? 'minutos' : durationUnit === 'hours' ? 'horas' : 'días'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {durationUnit === 'none' && (
              <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <p className="text-xs text-gray-600">
                  ✨ La encuesta estará disponible indefinidamente hasta que la cierres manualmente
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-4">
          {questions.length === 0 && (
            <div className="rounded-xl border-2 border-dashed border-yellow-300 bg-yellow-50 p-6 text-center">
              <svg className="mx-auto h-12 w-12 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="mt-3 text-sm font-medium text-yellow-800">
                ⚠️ Debes agregar al menos una pregunta para poder guardar o publicar la encuesta
              </p>
            </div>
          )}
          
          {questions.map((q, index) => (
            <QuestionCard
              key={q.id}
              question={q}
              index={index}
              onUpdate={handleUpdateQuestion}
              onDelete={handleDeleteQuestion}
            />
          ))}

          <button
            onClick={handleAddQuestion}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-white p-6 text-gray-600 transition hover:border-red-600 hover:text-red-600"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Agregar pregunta
          </button>
        </div>
      </main>
    </div>
  )
}

function QuestionCard({
  question,
  index,
  onUpdate,
  onDelete
}: {
  question: Question
  index: number
  onUpdate: (index: number, field: keyof Question, value: any) => void
  onDelete: (index: number) => void
}) {
  const questionTypes: { value: QuestionType; label: string }[] = [
    { value: 'text', label: 'Respuesta corta' },
    { value: 'multiple-choice', label: 'Opción múltiple' },
    { value: 'checkbox', label: 'Casillas de verificación' },
    { value: 'dropdown', label: 'Desplegable' },
    { value: 'scale', label: 'Escala lineal' }
  ]

  const needsOptions = question.type === 'multiple-choice' || question.type === 'checkbox' || question.type === 'dropdown'
  const isScale = question.type === 'scale'

  const handleAddOption = () => {
    const options = question.options || []
    onUpdate(index, 'options', [...options, ''])
  }

  const handleUpdateOption = (optIndex: number, value: string) => {
    const options = [...(question.options || [])]
    options[optIndex] = value
    onUpdate(index, 'options', options)
  }

  const handleDeleteOption = (optIndex: number) => {
    const options = (question.options || []).filter((_, i) => i !== optIndex)
    onUpdate(index, 'options', options)
  }

  const handleScaleChange = (scaleType: string) => {
    if (scaleType === '1-5') {
      onUpdate(index, 'options', ['1', '2', '3', '4', '5'])
    } else if (scaleType === '1-10') {
      onUpdate(index, 'options', ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'])
    } else if (scaleType === '0-5') {
      onUpdate(index, 'options', ['0', '1', '2', '3', '4', '5'])
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-4">
        <input
          type="text"
          placeholder={`Pregunta ${index + 1}`}
          value={question.title}
          onChange={e => onUpdate(index, 'title', e.target.value)}
          className="flex-1 border-0 border-b border-gray-200 bg-transparent text-lg font-medium focus:border-red-600 focus:outline-none focus:ring-0"
        />
        <select
          value={question.type}
          onChange={e => onUpdate(index, 'type', e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
        >
          {questionTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>

      {/* Componente para subir imagen */}
      <div className="mb-4">
        <ImageUpload
          imageUrl={question.imageUrl}
          onImageChange={(imageUrl) => onUpdate(index, 'imageUrl', imageUrl)}
        />
      </div>

      {needsOptions && (
        <div className="mb-4 space-y-2">
          {(question.options || []).map((option, optIndex) => (
            <div key={optIndex} className="flex items-center gap-2">
              <span className="text-gray-400">{optIndex + 1}.</span>
              <input
                type="text"
                placeholder="Opción"
                value={option}
                onChange={e => handleUpdateOption(optIndex, e.target.value)}
                className="flex-1 rounded-md border border-gray-200 px-3 py-1.5 text-sm focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
              />
              <button
                onClick={() => handleDeleteOption(optIndex)}
                className="text-gray-400 hover:text-red-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
          <button
            onClick={handleAddOption}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Agregar opción
          </button>
        </div>
      )}

      {isScale && (
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Selecciona el rango de la escala:
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleScaleChange('1-5')}
              className={`flex-1 rounded-md border px-3 py-2 text-sm transition ${
                question.options?.length === 5 && question.options[0] === '1' && question.options[4] === '5'
                  ? 'border-red-600 bg-red-50 text-red-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-red-600'
              }`}
            >
              1 - 5
            </button>
            <button
              type="button"
              onClick={() => handleScaleChange('0-5')}
              className={`flex-1 rounded-md border px-3 py-2 text-sm transition ${
                question.options?.length === 6 && question.options[0] === '0' && question.options[5] === '5'
                  ? 'border-red-600 bg-red-50 text-red-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-red-600'
              }`}
            >
              0 - 5
            </button>
            <button
              type="button"
              onClick={() => handleScaleChange('1-10')}
              className={`flex-1 rounded-md border px-3 py-2 text-sm transition ${
                question.options?.length === 10 && question.options[0] === '1' && question.options[9] === '10'
                  ? 'border-red-600 bg-red-50 text-red-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-red-600'
              }`}
            >
              1 - 10
            </button>
          </div>
          {question.options && question.options.length > 0 && (
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="text-sm text-gray-500">Vista previa:</span>
              {question.options.map((opt, i) => (
                <span key={i} className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 bg-gray-50 text-xs font-medium text-gray-700">
                  {opt}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={question.required}
            onChange={e => onUpdate(index, 'required', e.target.checked)}
            className="rounded border-gray-300 text-red-600 focus:ring-red-600"
          />
          Obligatoria
        </label>
        <button
          onClick={() => onDelete(index)}
          className="text-sm text-gray-400 hover:text-red-600"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  )
}
