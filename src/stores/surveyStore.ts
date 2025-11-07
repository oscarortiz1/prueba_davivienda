import { create } from 'zustand'
import { Survey } from '../domain/Survey'
import axios from 'axios'

const API_URL = 'http://localhost:8080/api'

interface SurveyState {
  surveys: Survey[]
  loading: boolean
  setSurveys: (surveys: Survey[]) => void
  setLoading: (loading: boolean) => void
  refreshSurveys: () => Promise<void>
  createSurvey: (data: { title: string; description: string }) => Promise<Survey>
  getSurvey: (id: string) => Promise<Survey>
  updateSurvey: (id: string, data: { title: string; description: string }) => Promise<Survey>
  deleteSurvey: (id: string) => Promise<void>
  publishSurvey: (id: string) => Promise<Survey>
  addQuestion: (surveyId: string, question: any) => Promise<Survey>
  updateQuestion: (surveyId: string, questionId: string, question: any) => Promise<Survey>
  deleteQuestion: (surveyId: string, questionId: string) => Promise<Survey>
}

export const useSurveyStore = create<SurveyState>((set, get) => ({
  surveys: [],
  loading: false,

  setSurveys: (surveys) => set({ surveys }),
  
  setLoading: (loading) => set({ loading }),

  refreshSurveys: async () => {
    set({ loading: true })
    try {
      const response = await axios.get(`${API_URL}/surveys/my-surveys`)
      set({ surveys: response.data })
    } catch (error) {
      console.error('Error fetching surveys:', error)
    } finally {
      set({ loading: false })
    }
  },

  createSurvey: async (data) => {
    const response = await axios.post(`${API_URL}/surveys`, data)
    await get().refreshSurveys()
    return response.data
  },
  
  getSurvey: async (id) => {
    const response = await axios.get(`${API_URL}/surveys/${id}`)
    return response.data
  },
  
  updateSurvey: async (id, data) => {
    const response = await axios.put(`${API_URL}/surveys/${id}`, data)
    await get().refreshSurveys()
    return response.data
  },
  
  deleteSurvey: async (id: string) => {
    await axios.delete(`${API_URL}/surveys/${id}`)
    await get().refreshSurveys()
  },
  
  publishSurvey: async (id) => {
    const response = await axios.put(`${API_URL}/surveys/${id}/publish`)
    await get().refreshSurveys()
    return response.data
  },
  
  addQuestion: async (surveyId, question) => {
    const response = await axios.post(`${API_URL}/surveys/${surveyId}/questions`, question)
    return response.data
  },
  
  updateQuestion: async (surveyId, questionId, question) => {
    const response = await axios.put(`${API_URL}/surveys/${surveyId}/questions/${questionId}`, question)
    return response.data
  },
  
  deleteQuestion: async (surveyId, questionId) => {
    const response = await axios.delete(`${API_URL}/surveys/${surveyId}/questions/${questionId}`)
    return response.data
  },
}))
