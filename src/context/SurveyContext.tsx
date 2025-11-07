import React from 'react'
import { makeSurveyUseCases } from '../usecases/surveyUseCases'
import { MockSurveyService } from '../infrastructure/MockSurveyService'
import { Survey } from '../domain/Survey'

const surveyService = new MockSurveyService()
const surveyUseCases = makeSurveyUseCases(surveyService)

type SurveyContextType = {
  surveys: Survey[]
  loading: boolean
  refreshSurveys: () => Promise<void>
  createSurvey: typeof surveyUseCases.createSurvey
  getSurvey: typeof surveyUseCases.getSurvey
  updateSurvey: typeof surveyUseCases.updateSurvey
  deleteSurvey: typeof surveyUseCases.deleteSurvey
  publishSurvey: typeof surveyUseCases.publishSurvey
  unpublishSurvey: typeof surveyUseCases.unpublishSurvey
  addQuestion: typeof surveyUseCases.addQuestion
  updateQuestion: typeof surveyUseCases.updateQuestion
  deleteQuestion: typeof surveyUseCases.deleteQuestion
  submitResponse: typeof surveyUseCases.submitResponse
  getResponses: typeof surveyUseCases.getResponses
  getSurveyStats: typeof surveyUseCases.getSurveyStats
}

const SurveyContext = React.createContext<SurveyContextType | null>(null)

export function SurveyProvider({ children }: { children: React.ReactNode }) {
  const [surveys, setSurveys] = React.useState<Survey[]>([])
  const [loading, setLoading] = React.useState(true)

  const refreshSurveys = React.useCallback(async () => {
    setLoading(true)
    try {
      const allSurveys = await surveyUseCases.getAllSurveys()
      setSurveys(allSurveys)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    refreshSurveys()
  }, [refreshSurveys])

  const value: SurveyContextType = {
    surveys,
    loading,
    refreshSurveys,
    createSurvey: surveyUseCases.createSurvey,
    getSurvey: surveyUseCases.getSurvey,
    updateSurvey: surveyUseCases.updateSurvey,
    deleteSurvey: surveyUseCases.deleteSurvey,
    publishSurvey: surveyUseCases.publishSurvey,
    unpublishSurvey: surveyUseCases.unpublishSurvey,
    addQuestion: surveyUseCases.addQuestion,
    updateQuestion: surveyUseCases.updateQuestion,
    deleteQuestion: surveyUseCases.deleteQuestion,
    submitResponse: surveyUseCases.submitResponse,
    getResponses: surveyUseCases.getResponses,
    getSurveyStats: surveyUseCases.getSurveyStats,
  }

  return <SurveyContext.Provider value={value}>{children}</SurveyContext.Provider>
}

export function useSurvey() {
  const ctx = React.useContext(SurveyContext)
  if (!ctx) throw new Error('useSurvey debe usarse dentro de SurveyProvider')
  return ctx
}
