import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useSurveyStore } from '../stores/surveyStore'
import { useResponseStore } from '../stores/responseStore'
import { useToastStore } from '../stores/toastStore'
import { Question } from '../domain/Survey'
import Button from '../ui/components/Button'
import Input from '../ui/components/Input'

export default function SurveyResponse() {
  const params = useParams<{ id: string }>()
  const surveyId = params.id!
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const getSurvey = useSurveyStore((state) => state.getSurvey)
  const showToast = useToastStore((state) => state.showToast)
  
  const answers = useResponseStore((state) => state.answers)
  const respondentEmail = useResponseStore((state) => state.respondentEmail)
  const submitting = useResponseStore((state) => state.submitting)
  const survey = useResponseStore((state) => state.survey)
  const loading = useResponseStore((state) => state.loading)
  const setAnswer = useResponseStore((state) => state.setAnswer)
  const setRespondentEmail = useResponseStore((state) => state.setRespondentEmail)
  const setSubmitting = useResponseStore((state) => state.setSubmitting)
  const setSurvey = useResponseStore((state) => state.setSurvey)
  const setLoading = useResponseStore((state) => state.setLoading)
  const submitResponse = useResponseStore((state) => state.submitResponse)
  const reset = useResponseStore((state) => state.reset)

  useEffect(() => {
    loadSurvey()
    return () => reset()
  }, [surveyId])

  useEffect(() => {
    if (user?.email) {
      setRespondentEmail(user.email)
    }
  }, [user])

  const loadSurvey = async () => {
    setLoading(true)
    try {
      const data = await getSurvey(surveyId)
      if (data) {
        const normalizedQuestions = data.questions.map((q: any) => ({
          ...q,
          type: q.type.toLowerCase().replace(/_/g, '-')
        }))
        setSurvey({ ...data, questions: normalizedQuestions })
      }
    } catch (error: any) {
      showToast('Error al cargar la encuesta: ' + (error.response?.data?.message || error.message), 'error')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user && !respondentEmail.trim()) {
      showToast('Debes proporcionar un correo electrónico para responder la encuesta', 'warning')
      return
    }

    if (!respondentEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      showToast('Debes proporcionar un correo electrónico válido', 'warning')
      return
    }

    const requiredQuestions = survey.questions.filter((q: Question) => q.required)
    const unansweredRequired = requiredQuestions.filter((q: Question) => {
      const answer = answers[q.id]
      return !answer || (Array.isArray(answer) && answer.length === 0) || answer === ''
    })

    if (unansweredRequired.length > 0) {
      showToast('Debes responder todas las preguntas obligatorias', 'warning')
      return
    }

    setSubmitting(true)
    try {
      await submitResponse(surveyId)
      showToast('¡Respuesta enviada exitosamente! Gracias por tu participación.', 'success')
      setTimeout(() => {
        navigate('/')
      }, 2000)
    } catch (error: any) {
      showToast('Error al enviar respuesta: ' + (error.response?.data?.message || error.message), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-r-transparent"></div>
      </div>
    )
  }

  if (!survey) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="text-center">
          <p className="text-gray-600">Encuesta no encontrada</p>
          <Button onClick={() => navigate('/')} className="mt-4">Volver al inicio</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6">
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
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900">{survey.title}</h1>
          {survey.description && (
            <p className="mt-2 text-gray-600">{survey.description}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!user && (
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Correo electrónico <span className="text-red-600">*</span>
              </label>
              <Input
                type="email"
                placeholder="tu@email.com"
                value={respondentEmail}
                onChange={(e) => setRespondentEmail(e.target.value)}
                required
              />
            </div>
          )}

          {survey.questions.map((question: Question, index: number) => (
            <QuestionResponse
              key={question.id}
              question={question}
              index={index}
              value={answers[question.id]}
              onChange={(value) => setAnswer(question.id, value)}
            />
          ))}

          <div className="flex justify-end">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Enviando...' : 'Enviar respuestas'}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}

function QuestionResponse({
  question,
  index,
  value,
  onChange
}: {
  question: Question
  index: number
  value: string | string[]
  onChange: (value: string | string[]) => void
}) {
  const handleCheckboxChange = (option: string, checked: boolean) => {
    const currentValues = (value as string[]) || []
    if (checked) {
      onChange([...currentValues, option])
    } else {
      onChange(currentValues.filter(v => v !== option))
    }
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-medium text-gray-900">
        {index + 1}. {question.title}
        {question.required && <span className="ml-1 text-red-600">*</span>}
      </h3>

      {question.type === 'text' && (
        <Input
          type="text"
          placeholder="Tu respuesta"
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
          required={question.required}
        />
      )}

      {question.type === 'multiple-choice' && (
        <div className="space-y-2">
          {question.options?.map((option, i) => (
            <label key={i} className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option}
                checked={value === option}
                onChange={(e) => onChange(e.target.value)}
                required={question.required}
                className="h-4 w-4 border-gray-300 text-red-600 focus:ring-red-600"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      )}

      {question.type === 'checkbox' && (
        <div className="space-y-2">
          {question.options?.map((option, i) => (
            <label key={i} className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={((value as string[]) || []).includes(option)}
                onChange={(e) => handleCheckboxChange(option, e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      )}

      {question.type === 'dropdown' && (
        <select
          value={(value as string) || ''}
          onChange={(e) => onChange(e.target.value)}
          required={question.required}
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
        >
          <option value="">Selecciona una opción</option>
          {question.options?.map((option, i) => (
            <option key={i} value={option}>{option}</option>
          ))}
        </select>
      )}

      {question.type === 'scale' && (
        <div className="space-y-2">
          {question.options?.map((option, i) => (
            <label key={i} className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option}
                checked={value === option}
                onChange={(e) => onChange(e.target.value)}
                required={question.required}
                className="h-4 w-4 border-gray-300 text-red-600 focus:ring-red-600"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
