import { create } from 'zustand'
import axios from 'axios'

const API_URL = 'http://localhost:8080/api'

interface Answer {
  questionId: string
  value: string[]
}

interface SurveyResponse {
  id: string
  surveyId: string
  respondentId: string
  respondentEmail?: string
  answers: Answer[]
  completedAt: string
}

interface QuestionResult {
  questionId: string
  questionTitle: string
  questionType: string
  totalResponses: number
  answers: {
    value: string
    count: number
    percentage: number
  }[]
  textResponses?: string[]
}

interface ResultsState {
  survey: any | null
  responses: SurveyResponse[]
  results: QuestionResult[]
  loading: boolean
  error: string | null
  loadResults: (surveyId: string) => Promise<void>
  refreshResults: (surveyId: string) => Promise<void>
  reset: () => void
}

export const useResultsStore = create<ResultsState>((set, get) => ({
  survey: null,
  responses: [],
  results: [],
  loading: false,
  error: null,

  loadResults: async (surveyId: string) => {
    set({ loading: true, error: null })
    
    try {
      const surveyResponse = await axios.get(`${API_URL}/surveys/${surveyId}`)
      const survey = surveyResponse.data

      const responsesResponse = await axios.get(`${API_URL}/surveys/${surveyId}/responses`)
      const responses: SurveyResponse[] = responsesResponse.data

      const results: QuestionResult[] = survey.questions.map((question: any) => {
        const questionType = question.type.toLowerCase().replace(/_/g, '-')
        const questionAnswers = responses.flatMap(r => 
          r.answers
            .filter(a => a.questionId === question.id)
            .flatMap(a => a.value)
        )

        if (questionType === 'text') {
          return {
            questionId: question.id,
            questionTitle: question.title,
            questionType,
            totalResponses: questionAnswers.length,
            answers: [],
            textResponses: questionAnswers
          }
        } else if (questionType === 'scale') {
          const answerCounts = new Map<string, number>()
          
          questionAnswers.forEach(answer => {
            answerCounts.set(answer, (answerCounts.get(answer) || 0) + 1)
          })

          const answers = Array.from(answerCounts.entries()).map(([value, count]) => ({
            value,
            count,
            percentage: questionAnswers.length > 0 ? (count / questionAnswers.length) * 100 : 0
          })).sort((a, b) => parseInt(a.value) - parseInt(b.value))

          return {
            questionId: question.id,
            questionTitle: question.title,
            questionType,
            totalResponses: questionAnswers.length,
            answers
          }
        } else {
          const answerCounts = new Map<string, number>()
          
          questionAnswers.forEach(answer => {
            answerCounts.set(answer, (answerCounts.get(answer) || 0) + 1)
          })

          const answers = Array.from(answerCounts.entries()).map(([value, count]) => ({
            value,
            count,
            percentage: questionAnswers.length > 0 ? (count / questionAnswers.length) * 100 : 0
          })).sort((a, b) => b.count - a.count)

          return {
            questionId: question.id,
            questionTitle: question.title,
            questionType,
            totalResponses: questionAnswers.length,
            answers
          }
        }
      })

      set({ survey, responses, results, loading: false })
    } catch (error: any) {
      set({ 
        error: error.response?.data?.message || error.message, 
        loading: false 
      })
    }
  },

  refreshResults: async (surveyId: string) => {
    try {
      const surveyResponse = await axios.get(`${API_URL}/surveys/${surveyId}`)
      const survey = surveyResponse.data

      const responsesResponse = await axios.get(`${API_URL}/surveys/${surveyId}/responses`)
      const responses: SurveyResponse[] = responsesResponse.data

      const results: QuestionResult[] = survey.questions.map((question: any) => {
        const questionType = question.type.toLowerCase().replace(/_/g, '-')
        const questionAnswers = responses.flatMap(r => 
          r.answers
            .filter(a => a.questionId === question.id)
            .flatMap(a => a.value)
        )

        if (questionType === 'text') {
          return {
            questionId: question.id,
            questionTitle: question.title,
            questionType,
            totalResponses: questionAnswers.length,
            answers: [],
            textResponses: questionAnswers
          }
        } else if (questionType === 'scale') {
          const answerCounts = new Map<string, number>()
          
          questionAnswers.forEach(answer => {
            answerCounts.set(answer, (answerCounts.get(answer) || 0) + 1)
          })

          const answers = Array.from(answerCounts.entries()).map(([value, count]) => ({
            value,
            count,
            percentage: questionAnswers.length > 0 ? (count / questionAnswers.length) * 100 : 0
          })).sort((a, b) => parseInt(a.value) - parseInt(b.value))

          return {
            questionId: question.id,
            questionTitle: question.title,
            questionType,
            totalResponses: questionAnswers.length,
            answers
          }
        } else {
          const answerCounts = new Map<string, number>()
          
          questionAnswers.forEach(answer => {
            answerCounts.set(answer, (answerCounts.get(answer) || 0) + 1)
          })

          const answers = Array.from(answerCounts.entries()).map(([value, count]) => ({
            value,
            count,
            percentage: questionAnswers.length > 0 ? (count / questionAnswers.length) * 100 : 0
          })).sort((a, b) => b.count - a.count)

          return {
            questionId: question.id,
            questionTitle: question.title,
            questionType,
            totalResponses: questionAnswers.length,
            answers
          }
        }
      })

      set({ survey, responses, results })
    } catch (error: any) {
      console.error('Error refreshing results:', error)
    }
  },

  reset: () => set({ 
    survey: null, 
    responses: [], 
    results: [], 
    loading: false, 
    error: null 
  })
}))
