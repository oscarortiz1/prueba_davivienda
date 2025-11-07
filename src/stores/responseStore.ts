import { create } from 'zustand'
import axios from 'axios'

const API_URL = 'http://localhost:8080/api'

interface ResponseState {
  answers: { [questionId: string]: string | string[] }
  respondentEmail: string
  submitting: boolean
  setAnswer: (questionId: string, value: string | string[]) => void
  setRespondentEmail: (email: string) => void
  setSubmitting: (submitting: boolean) => void
  submitResponse: (surveyId: string) => Promise<void>
  reset: () => void
}

export const useResponseStore = create<ResponseState>((set, get) => ({
  answers: {},
  respondentEmail: '',
  submitting: false,

  setAnswer: (questionId, value) => {
    set(state => ({
      answers: { ...state.answers, [questionId]: value }
    }))
  },

  setRespondentEmail: (email) => set({ respondentEmail: email }),

  setSubmitting: (submitting) => set({ submitting }),

  submitResponse: async (surveyId) => {
    const { answers, respondentEmail } = get()
    
    const formattedAnswers = Object.entries(answers).map(([questionId, value]) => ({
      questionId,
      value: Array.isArray(value) ? value : [value]
    }))

    await axios.post(`${API_URL}/surveys/${surveyId}/responses`, {
      respondentEmail,
      answers: formattedAnswers
    })
  },

  reset: () => set({ answers: {}, respondentEmail: '', submitting: false })
}))
