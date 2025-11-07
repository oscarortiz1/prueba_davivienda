import { create } from 'zustand'
import { Survey } from '../domain/Survey'
import { makeSurveyUseCases } from '../usecases/surveyUseCases'
import { MockSurveyService } from '../infrastructure/MockSurveyService'

const surveyService = new MockSurveyService()
const surveyUseCases = makeSurveyUseCases(surveyService)

interface SurveyState {
  surveys: Survey[]
  loading: boolean
  setSurveys: (surveys: Survey[]) => void
  setLoading: (loading: boolean) => void
  refreshSurveys: () => Promise<void>
  createSurvey: typeof surveyUseCases.createSurvey
  getSurvey: typeof surveyUseCases.getSurvey
  updateSurvey: typeof surveyUseCases.updateSurvey
  deleteSurvey: (id: string) => Promise<void>
  publishSurvey: typeof surveyUseCases.publishSurvey
  unpublishSurvey: typeof surveyUseCases.unpublishSurvey
  addQuestion: typeof surveyUseCases.addQuestion
  updateQuestion: typeof surveyUseCases.updateQuestion
  deleteQuestion: typeof surveyUseCases.deleteQuestion
  submitResponse: typeof surveyUseCases.submitResponse
  getResponses: typeof surveyUseCases.getResponses
  getSurveyStats: typeof surveyUseCases.getSurveyStats
}

export const useSurveyStore = create<SurveyState>((set, get) => ({
  surveys: [],
  loading: false,

  setSurveys: (surveys) => set({ surveys }),
  
  setLoading: (loading) => set({ loading }),

  refreshSurveys: async () => {
    set({ loading: true })
    try {
      const surveys = await surveyUseCases.getAllSurveys()
      set({ surveys })
    } finally {
      set({ loading: false })
    }
  },

  createSurvey: surveyUseCases.createSurvey,
  
  getSurvey: surveyUseCases.getSurvey,
  
  updateSurvey: surveyUseCases.updateSurvey,
  
  deleteSurvey: async (id: string) => {
    await surveyUseCases.deleteSurvey(id)
    await get().refreshSurveys()
  },
  
  publishSurvey: surveyUseCases.publishSurvey,
  
  unpublishSurvey: surveyUseCases.unpublishSurvey,
  
  addQuestion: surveyUseCases.addQuestion,
  
  updateQuestion: surveyUseCases.updateQuestion,
  
  deleteQuestion: surveyUseCases.deleteQuestion,
  
  submitResponse: surveyUseCases.submitResponse,
  
  getResponses: surveyUseCases.getResponses,
  
  getSurveyStats: surveyUseCases.getSurveyStats,
}))
