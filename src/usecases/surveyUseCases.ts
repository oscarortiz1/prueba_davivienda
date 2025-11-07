import { SurveyRepository } from '../adapters/SurveyRepository'
import { Survey, Question, SurveyResponse } from '../domain/Survey'

export function makeSurveyUseCases(repo: SurveyRepository) {

  async function createSurvey(data: Omit<Survey, 'id' | 'createdAt' | 'updatedAt'>): Promise<Survey> {
    if (!data.title.trim()) throw new Error('El título es obligatorio')
    if (!data.createdBy) throw new Error('Usuario no identificado')
    return repo.createSurvey(data)
  }

  async function getSurvey(id: string): Promise<Survey | null> {
    if (!id) throw new Error('ID de encuesta requerido')
    return repo.getSurvey(id)
  }

  async function getAllSurveys(userId?: string): Promise<Survey[]> {
    return repo.getAllSurveys(userId)
  }

  async function updateSurvey(id: string, data: Partial<Survey>): Promise<Survey> {
    if (!id) throw new Error('ID de encuesta requerido')
    return repo.updateSurvey(id, data)
  }

  async function deleteSurvey(id: string): Promise<void> {
    if (!id) throw new Error('ID de encuesta requerido')
    return repo.deleteSurvey(id)
  }

  async function publishSurvey(id: string): Promise<Survey> {
    return repo.updateSurvey(id, { isPublished: true })
  }

  async function unpublishSurvey(id: string): Promise<Survey> {
    return repo.updateSurvey(id, { isPublished: false })
  }


  async function addQuestion(surveyId: string, data: Omit<Question, 'id' | 'surveyId'>): Promise<Question> {
    if (!data.title.trim()) throw new Error('El título de la pregunta es obligatorio')
    if (!surveyId) throw new Error('ID de encuesta requerido')
    return repo.addQuestion(surveyId, data)
  }

  async function updateQuestion(questionId: string, data: Partial<Question>): Promise<Question> {
    if (!questionId) throw new Error('ID de pregunta requerido')
    return repo.updateQuestion(questionId, data)
  }

  async function deleteQuestion(questionId: string): Promise<void> {
    if (!questionId) throw new Error('ID de pregunta requerido')
    return repo.deleteQuestion(questionId)
  }


  async function submitResponse(data: Omit<SurveyResponse, 'id' | 'completedAt'>): Promise<SurveyResponse> {
    if (!data.surveyId) throw new Error('ID de encuesta requerido')
    if (!data.answers.length) throw new Error('Debe responder al menos una pregunta')
    return repo.submitResponse(data)
  }

  async function getResponses(surveyId: string): Promise<SurveyResponse[]> {
    if (!surveyId) throw new Error('ID de encuesta requerido')
    return repo.getResponses(surveyId)
  }

  async function getSurveyStats(surveyId: string) {
    const responses = await repo.getResponses(surveyId)
    const survey = await repo.getSurvey(surveyId)
    
    if (!survey) throw new Error('Encuesta no encontrada')

    return {
      totalResponses: responses.length,
      questions: survey.questions.map(question => {
        const questionAnswers = responses.flatMap(r => 
          r.answers.filter(a => a.questionId === question.id)
        )

        if (question.type === 'multiple-choice' || question.type === 'dropdown') {
          const counts = questionAnswers.reduce((acc, answer) => {
            const value = answer.value as string
            acc[value] = (acc[value] || 0) + 1
            return acc
          }, {} as Record<string, number>)

          return {
            questionId: question.id,
            title: question.title,
            type: question.type,
            data: Object.entries(counts).map(([label, count]) => ({ label, count }))
          }
        }

        if (question.type === 'checkbox') {
          const counts = questionAnswers.reduce((acc, answer) => {
            const values = answer.value as string[]
            values.forEach(v => {
              acc[v] = (acc[v] || 0) + 1
            })
            return acc
          }, {} as Record<string, number>)

          return {
            questionId: question.id,
            title: question.title,
            type: question.type,
            data: Object.entries(counts).map(([label, count]) => ({ label, count }))
          }
        }

        if (question.type === 'scale') {
          const values = questionAnswers.map(a => parseInt(a.value as string))
          const average = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0

          return {
            questionId: question.id,
            title: question.title,
            type: question.type,
            average: average.toFixed(2),
            responses: values.length
          }
        }

        return {
          questionId: question.id,
          title: question.title,
          type: question.type,
          responses: questionAnswers.map(a => a.value)
        }
      })
    }
  }

  return {
    createSurvey,
    getSurvey,
    getAllSurveys,
    updateSurvey,
    deleteSurvey,
    publishSurvey,
    unpublishSurvey,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    submitResponse,
    getResponses,
    getSurveyStats,
  }
}
