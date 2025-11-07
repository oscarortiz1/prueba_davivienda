import { Survey, Question, SurveyResponse } from '../domain/Survey'

export interface SurveyRepository {

  createSurvey(survey: Omit<Survey, 'id' | 'createdAt' | 'updatedAt'>): Promise<Survey>
  getSurvey(id: string): Promise<Survey | null>
  getAllSurveys(userId?: string): Promise<Survey[]>
  updateSurvey(id: string, survey: Partial<Survey>): Promise<Survey>
  deleteSurvey(id: string): Promise<void>
  

  addQuestion(surveyId: string, question: Omit<Question, 'id' | 'surveyId'>): Promise<Question>
  updateQuestion(questionId: string, question: Partial<Question>): Promise<Question>
  deleteQuestion(questionId: string): Promise<void>
  

  submitResponse(response: Omit<SurveyResponse, 'id' | 'completedAt'>): Promise<SurveyResponse>
  getResponses(surveyId: string): Promise<SurveyResponse[]>
}
