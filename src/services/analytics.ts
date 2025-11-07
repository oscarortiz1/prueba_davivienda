import { analytics } from '../config/firebase'
import { logEvent } from 'firebase/analytics'


export const analyticsService = {

  trackPageView: (pageName: string) => {
    if (analytics) {
      logEvent(analytics, 'page_view', {
        page_name: pageName,
        timestamp: new Date().toISOString()
      })
    }
  },

  trackSignUp: (method: string = 'email') => {
    if (analytics) {
      logEvent(analytics, 'sign_up', {
        method: method
      })
    }
  },


  trackLogin: (method: string = 'email') => {
    if (analytics) {
      logEvent(analytics, 'login', {
        method: method
      })
    }
  },

  trackSurveyCreated: (surveyId: string, questionCount: number) => {
    if (analytics) {
      logEvent(analytics, 'survey_created', {
        survey_id: surveyId,
        question_count: questionCount,
        timestamp: new Date().toISOString()
      })
    }
  },


  trackSurveyPublished: (surveyId: string) => {
    if (analytics) {
      logEvent(analytics, 'survey_published', {
        survey_id: surveyId,
        timestamp: new Date().toISOString()
      })
    }
  },

  trackSurveyDeleted: (surveyId: string) => {
    if (analytics) {
      logEvent(analytics, 'survey_deleted', {
        survey_id: surveyId,
        timestamp: new Date().toISOString()
      })
    }
  },

  trackSurveyEdited: (surveyId: string) => {
    if (analytics) {
      logEvent(analytics, 'survey_edited', {
        survey_id: surveyId,
        timestamp: new Date().toISOString()
      })
    }
  },


  trackCustomEvent: (eventName: string, params?: Record<string, any>) => {
    if (analytics) {
      logEvent(analytics, eventName, {
        ...params,
        timestamp: new Date().toISOString()
      })
    }
  }
}
