import { create } from 'zustand'
import { Question } from '../domain/Survey'

interface EditorState {
  title: string
  description: string
  questions: Question[]
  durationValue: number | null
  durationUnit: 'minutes' | 'hours' | 'days' | 'none'
  loading: boolean
  saving: boolean
  publishing: boolean
  currentSurveyId: string | null
  hasUnsavedChanges: boolean
  isPublished: boolean
  setTitle: (title: string) => void
  setDescription: (description: string) => void
  setQuestions: (questions: Question[]) => void
  setDuration: (value: number | null, unit: 'minutes' | 'hours' | 'days' | 'none') => void
  setLoading: (loading: boolean) => void
  setSaving: (saving: boolean) => void
  setPublishing: (publishing: boolean) => void
  setCurrentSurveyId: (id: string | null) => void
  setHasUnsavedChanges: (hasChanges: boolean) => void
  setIsPublished: (isPublished: boolean) => void
  loadSurveyData: (
    title: string, 
    description: string, 
    questions: Question[], 
    isPublished: boolean,
    durationValue?: number | null,
    durationUnit?: 'minutes' | 'hours' | 'days' | 'none',
    expiresAt?: Date | null
  ) => void
  addQuestion: () => void
  updateQuestion: (index: number, field: keyof Question, value: any) => void
  deleteQuestion: (index: number) => void
  reset: () => void
}

export const useEditorStore = create<EditorState>((set, get) => ({
  title: '',
  description: '',
  questions: [],
  durationValue: null,
  durationUnit: 'none',
  loading: false,
  saving: false,
  publishing: false,
  currentSurveyId: null,
  hasUnsavedChanges: false,
  isPublished: false,

  setTitle: (title) => set({ title, hasUnsavedChanges: true }),
  
  setDescription: (description) => set({ description, hasUnsavedChanges: true }),
  
  setQuestions: (questions) => set({ questions }),

  setDuration: (value, unit) => set({ durationValue: value, durationUnit: unit, hasUnsavedChanges: true }),
  
  setLoading: (loading) => set({ loading }),
  
  setSaving: (saving) => set({ saving }),

  setPublishing: (publishing) => set({ publishing }),

  setCurrentSurveyId: (id) => set({ currentSurveyId: id }),

  setHasUnsavedChanges: (hasChanges) => set({ hasUnsavedChanges: hasChanges }),

  setIsPublished: (isPublished) => set({ isPublished }),

  loadSurveyData: (title, description, questions, isPublished, durationValue, durationUnit, expiresAt) => {
    const finalDurationValue = durationValue !== undefined && durationValue !== null ? durationValue : null
    const finalDurationUnit = durationUnit || 'none'
    
    set({ 
      title, 
      description, 
      questions, 
      isPublished,
      durationValue: finalDurationValue,
      durationUnit: finalDurationUnit,
      hasUnsavedChanges: false 
    })
  },

  addQuestion: () => {
    const questions = get().questions
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      surveyId: '',
      title: '',
      type: 'text',
      required: false,
      order: questions.length
    }
    set({ questions: [...questions, newQuestion], hasUnsavedChanges: true })
  },

  updateQuestion: (index, field, value) => {
    const questions = [...get().questions]
    questions[index] = { ...questions[index], [field]: value }
    set({ questions, hasUnsavedChanges: true })
  },

  deleteQuestion: (index) => {
    const questions = get().questions.filter((_, i) => i !== index)
    set({ questions, hasUnsavedChanges: true })
  },

  reset: () => set({ 
    title: '', 
    description: '', 
    questions: [],
    durationValue: null,
    durationUnit: 'none',
    loading: false, 
    saving: false,
    publishing: false,
    currentSurveyId: null,
    hasUnsavedChanges: false,
    isPublished: false
  }),
}))
