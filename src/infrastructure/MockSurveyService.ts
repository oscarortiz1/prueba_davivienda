import { Survey, Question, SurveyResponse } from '../domain/Survey'
import { SurveyRepository } from '../adapters/SurveyRepository'

export class MockSurveyService implements SurveyRepository {
  private readonly SURVEYS_KEY = 'surveys'
  private readonly RESPONSES_KEY = 'survey_responses'


  async createSurvey(survey: Omit<Survey, 'id' | 'createdAt' | 'updatedAt'>): Promise<Survey> {
    const surveys = this.getSurveysFromStorage()
    const newSurvey: Survey = {
      ...survey,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    surveys.push(newSurvey)
    this.saveSurveysToStorage(surveys)
    return newSurvey
  }

  async getSurvey(id: string): Promise<Survey | null> {
    const surveys = this.getSurveysFromStorage()
    return surveys.find(s => s.id === id) || null
  }

  async getAllSurveys(userId?: string): Promise<Survey[]> {
    const surveys = this.getSurveysFromStorage()
    if (userId) {
      return surveys.filter(s => s.createdBy === userId)
    }
    return surveys
  }

  async updateSurvey(id: string, survey: Partial<Survey>): Promise<Survey> {
    const surveys = this.getSurveysFromStorage()
    const index = surveys.findIndex(s => s.id === id)
    if (index === -1) throw new Error('Encuesta no encontrada')
    
    surveys[index] = {
      ...surveys[index],
      ...survey,
      updatedAt: new Date(),
    }
    this.saveSurveysToStorage(surveys)
    return surveys[index]
  }

  async deleteSurvey(id: string): Promise<void> {
    const surveys = this.getSurveysFromStorage()
    const filtered = surveys.filter(s => s.id !== id)
    this.saveSurveysToStorage(filtered)
  }

  async addQuestion(surveyId: string, question: Omit<Question, 'id' | 'surveyId'>): Promise<Question> {
    const surveys = this.getSurveysFromStorage()
    const survey = surveys.find(s => s.id === surveyId)
    if (!survey) throw new Error('Encuesta no encontrada')

    const newQuestion: Question = {
      ...question,
      id: crypto.randomUUID(),
      surveyId,
    }
    survey.questions.push(newQuestion)
    survey.updatedAt = new Date()
    this.saveSurveysToStorage(surveys)
    return newQuestion
  }

  async updateQuestion(questionId: string, question: Partial<Question>): Promise<Question> {
    const surveys = this.getSurveysFromStorage()
    let updatedQuestion: Question | null = null

    for (const survey of surveys) {
      const qIndex = survey.questions.findIndex(q => q.id === questionId)
      if (qIndex !== -1) {
        survey.questions[qIndex] = { ...survey.questions[qIndex], ...question }
        survey.updatedAt = new Date()
        updatedQuestion = survey.questions[qIndex]
        break
      }
    }

    if (!updatedQuestion) throw new Error('Pregunta no encontrada')
    this.saveSurveysToStorage(surveys)
    return updatedQuestion
  }

  async deleteQuestion(questionId: string): Promise<void> {
    const surveys = this.getSurveysFromStorage()
    
    for (const survey of surveys) {
      const filtered = survey.questions.filter(q => q.id !== questionId)
      if (filtered.length !== survey.questions.length) {
        survey.questions = filtered
        survey.updatedAt = new Date()
        break
      }
    }
    this.saveSurveysToStorage(surveys)
  }

  async submitResponse(response: Omit<SurveyResponse, 'id' | 'completedAt'>): Promise<SurveyResponse> {
    const responses = this.getResponsesFromStorage()
    const newResponse: SurveyResponse = {
      ...response,
      id: crypto.randomUUID(),
      completedAt: new Date(),
    }
    responses.push(newResponse)
    this.saveResponsesToStorage(responses)
    return newResponse
  }

  async getResponses(surveyId: string): Promise<SurveyResponse[]> {
    const responses = this.getResponsesFromStorage()
    return responses.filter(r => r.surveyId === surveyId)
  }


  private getSurveysFromStorage(): Survey[] {
    const data = localStorage.getItem(this.SURVEYS_KEY)
    if (!data) return []
    return JSON.parse(data).map((s: any) => ({
      ...s,
      createdAt: new Date(s.createdAt),
      updatedAt: new Date(s.updatedAt),
    }))
  }

  private saveSurveysToStorage(surveys: Survey[]): void {
    localStorage.setItem(this.SURVEYS_KEY, JSON.stringify(surveys))
  }

  private getResponsesFromStorage(): SurveyResponse[] {
    const data = localStorage.getItem(this.RESPONSES_KEY)
    if (!data) return []
    return JSON.parse(data).map((r: any) => ({
      ...r,
      completedAt: new Date(r.completedAt),
      answers: r.answers.map((a: any) => ({
        ...a,
        createdAt: new Date(a.createdAt),
      })),
    }))
  }

  private saveResponsesToStorage(responses: SurveyResponse[]): void {
    localStorage.setItem(this.RESPONSES_KEY, JSON.stringify(responses))
  }
}
