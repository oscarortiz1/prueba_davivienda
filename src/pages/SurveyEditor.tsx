import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useSurveyStore } from '../stores/surveyStore'
import { useEditorStore } from '../stores/editorStore'
import { QuestionType, Question } from '../domain/Survey'
import Button from '../ui/components/Button'

export default function SurveyEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const createSurvey = useSurveyStore((state) => state.createSurvey)
  const getSurvey = useSurveyStore((state) => state.getSurvey)
  const updateSurvey = useSurveyStore((state) => state.updateSurvey)
  const addQuestion = useSurveyStore((state) => state.addQuestion)
  const publishSurvey = useSurveyStore((state) => state.publishSurvey)
  
  const title = useEditorStore((state) => state.title)
  const description = useEditorStore((state) => state.description)
  const questions = useEditorStore((state) => state.questions)
  const loading = useEditorStore((state) => state.loading)
  const saving = useEditorStore((state) => state.saving)
  const setTitle = useEditorStore((state) => state.setTitle)
  const setDescription = useEditorStore((state) => state.setDescription)
  const setQuestions = useEditorStore((state) => state.setQuestions)
  const setLoading = useEditorStore((state) => state.setLoading)
  const setSaving = useEditorStore((state) => state.setSaving)
  const handleAddQuestion = useEditorStore((state) => state.addQuestion)
  const handleUpdateQuestion = useEditorStore((state) => state.updateQuestion)
  const handleDeleteQuestion = useEditorStore((state) => state.deleteQuestion)
  const reset = useEditorStore((state) => state.reset)

  useEffect(() => {
    if (id && id !== 'new') {
      loadSurvey()
    } else {
      reset()
    }
  }, [id])

  const loadSurvey = async () => {
    if (!id || id === 'new') return
    setLoading(true)
    try {
      const survey = await getSurvey(id)
      if (survey) {
        setTitle(survey.title)
        setDescription(survey.description)
        setQuestions(survey.questions)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    try {
      if (id === 'new') {
        const survey = await createSurvey({
          title,
          description
        })
      
        for (const q of questions) {
          await addQuestion(survey.id, {
            title: q.title,
            type: q.type.toUpperCase().replace(/-/g, '_'),
            options: q.options,
            required: q.required,
            order: q.order
          })
        }
        navigate('/')
      } else {
        await updateSurvey(id!, { title, description })
        navigate('/')
      }
    } catch (error: any) {
      alert(error.message)
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    if (!id || id === 'new') {
      alert('Debes guardar la encuesta primero')
      return
    }
    try {
      await publishSurvey(id)
      alert('Encuesta publicada exitosamente')
      navigate('/')
    } catch (error: any) {
      alert(error.message)
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
              <Button variant="ghost" onClick={handleSave} disabled={saving || !title.trim()}>
                {saving ? 'Guardando...' : 'Guardar'}
              </Button>
              {id !== 'new' && (
                <Button onClick={handlePublish} disabled={!title.trim() || questions.length === 0}>
                  Publicar
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {/* Survey Info */}
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
        </div>

        {/* Questions */}
        <div className="space-y-4">
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
