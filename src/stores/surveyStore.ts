import { create } from 'zustand'
import { Survey } from '../domain/Survey'
import axios from 'axios'

const API_URL = 'http://localhost:8080/api'

interface SurveyState {
  surveys: Survey[]
  publishedSurveys: Survey[]
  loading: boolean
  setSurveys: (surveys: Survey[]) => void
  setPublishedSurveys: (surveys: Survey[]) => void
  setLoading: (loading: boolean) => void
  refreshSurveys: () => Promise<void>
  refreshSurveysSilent: () => Promise<void>
  refreshPublishedSurveys: () => Promise<void>
  createSurvey: (data: { 
    title: string
    description: string
    durationValue?: number | null
    durationUnit?: string
  }) => Promise<Survey>
  getSurvey: (id: string) => Promise<Survey>
  getPublicSurvey: (id: string) => Promise<Survey>
  updateSurvey: (id: string, data: { 
    title: string
    description: string
    durationValue?: number | null
    durationUnit?: string
  }) => Promise<Survey>
  deleteSurvey: (id: string) => Promise<void>
  publishSurvey: (id: string) => Promise<Survey>
  addQuestion: (surveyId: string, question: any) => Promise<Survey>
  updateQuestion: (surveyId: string, questionId: string, question: any) => Promise<Survey>
  deleteQuestion: (surveyId: string, questionId: string) => Promise<Survey>
}

export const useSurveyStore = create<SurveyState>((set, get) => ({
  surveys: [],
  publishedSurveys: [],
  loading: false,

  setSurveys: (surveys) => set({ surveys }),
  
  setPublishedSurveys: (publishedSurveys) => set({ publishedSurveys }),
  
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

  refreshSurveysSilent: async () => {
    try {
      const response = await axios.get(`${API_URL}/surveys/my-surveys`)
      set({ surveys: response.data })
    } catch (error) {
      console.error('Error fetching surveys:', error)
    }
  },

  refreshPublishedSurveys: async () => {
    try {
      const response = await axios.get(`${API_URL}/surveys/published`)
      set({ publishedSurveys: response.data })
    } catch (error) {
      console.error('Error fetching published surveys:', error)
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
  
  getPublicSurvey: async (id) => {
    const response = await axios.get(`${API_URL}/surveys/public/${id}`)
    return response.data
  },
  
  updateSurvey: async (id, data) => {
    if (!id || id === 'new') {
      throw new Error('Debes guardar la encuesta antes de actualizarla')
    }
    
    const response = await axios.put(`${API_URL}/surveys/${id}`, data)
    await get().refreshSurveys()
    return response.data
  },
  
  deleteSurvey: async (id: string) => {
    if (!id) {
      throw new Error('ID de encuesta requerido')
    }
    await axios.delete(`${API_URL}/surveys/${id}`)
    await get().refreshSurveys()
  },
  
  publishSurvey: async (id) => {
    if (!id || id === 'new') {
      throw new Error('Debes guardar la encuesta antes de publicarla')
    }
    const response = await axios.put(`${API_URL}/surveys/${id}/publish`)
    await get().refreshSurveys()
    return response.data
  },
  
  addQuestion: async (surveyId, question) => {
    if (!surveyId) {
      throw new Error('ID de encuesta requerido para agregar pregunta')
    }
    const response = await axios.post(`${API_URL}/surveys/${surveyId}/questions`, question)
    return response.data
  },
  
  updateQuestion: async (surveyId, questionId, question) => {
    if (!surveyId || !questionId) {
      throw new Error('IDs requeridos para actualizar pregunta')
    }
    const response = await axios.put(`${API_URL}/surveys/${surveyId}/questions/${questionId}`, question)
    return response.data
  },
  
  deleteQuestion: async (surveyId, questionId) => {
    if (!surveyId || !questionId) {
      throw new Error('IDs requeridos para eliminar pregunta')
    }
    const response = await axios.delete(`${API_URL}/surveys/${surveyId}/questions/${questionId}`)
    return response.data
  },
}))
