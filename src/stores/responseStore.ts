import { create } from 'zustand'
import axios from 'axios'

const API_URL = 'http://localhost:8080/api'

interface ResponseState {
  answers: { [questionId: string]: string | string[] }
  respondentEmail: string
  submitting: boolean
  survey: any | null
  loading: boolean
  hasResponded: boolean
  respondedSurveys: Set<string>
  setAnswer: (questionId: string, value: string | string[]) => void
  setRespondentEmail: (email: string) => void
  setSubmitting: (submitting: boolean) => void
  setSurvey: (survey: any | null) => void
  setLoading: (loading: boolean) => void
  setHasResponded: (hasResponded: boolean) => void
  checkIfResponded: (surveyId: string, email: string) => Promise<boolean>
  checkRespondedSurveys: (surveyIds: string[], email: string) => Promise<void>
  submitResponse: (surveyId: string) => Promise<void>
  reset: () => void
}

export const useResponseStore = create<ResponseState>((set, get) => ({
  answers: {},
  respondentEmail: '',
  submitting: false,
  survey: null,
  loading: true,
  hasResponded: false,
  respondedSurveys: new Set<string>(),

  setAnswer: (questionId, value) => {
    set(state => ({
      answers: { ...state.answers, [questionId]: value }
    }))
  },

  setRespondentEmail: (email) => set({ respondentEmail: email }),

  setSubmitting: (submitting) => set({ submitting }),

  setSurvey: (survey) => set({ survey }),

  setLoading: (loading) => set({ loading }),

  setHasResponded: (hasResponded) => set({ hasResponded }),

  checkIfResponded: async (surveyId, email) => {
    try {
      const response = await axios.get(`${API_URL}/surveys/${surveyId}/responses`)
      const responses = response.data
      const hasResponded = responses.some((r: any) => r.respondentId === email)
      set({ hasResponded })
      return hasResponded
    } catch (error) {
      return false
    }
  },

  checkRespondedSurveys: async (surveyIds, email) => {
    const responded = new Set<string>()
    for (const surveyId of surveyIds) {
      try {
        const response = await axios.get(`${API_URL}/surveys/${surveyId}/responses`)
        const responses = response.data
        const hasResponded = responses.some((r: any) => r.respondentId === email)
        if (hasResponded) {
          responded.add(surveyId)
        }
      } catch (error) {
        console.error(`Error checking survey ${surveyId}:`, error)
      }
    }
    set({ respondedSurveys: responded })
  },

  submitResponse: async (surveyId) => {
    const { answers, respondentEmail } = get()
    
    if (!respondentEmail || !respondentEmail.trim()) {
      throw new Error('El correo electrónico es requerido')
    }
    
    if (Object.keys(answers).length === 0) {
      throw new Error('Debes responder al menos una pregunta')
    }
    
    const formattedAnswers = Object.entries(answers).map(([questionId, value]) => ({
      questionId,
      value: Array.isArray(value) ? value : [value]
    }))

    try {
      await axios.post(`${API_URL}/surveys/${surveyId}/responses`, {
        respondentEmail,
        answers: formattedAnswers
      })
      
      set({ hasResponded: true })
    } catch (error) {
      throw error
    }
  },

  reset: () => set({ answers: {}, respondentEmail: '', submitting: false, survey: null, loading: true, hasResponded: false })
}))
