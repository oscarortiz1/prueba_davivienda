import { create } from 'zustand'
import { Question } from '../domain/Survey'

interface EditorState {
  title: string
  description: string
  questions: Question[]
  loading: boolean
  saving: boolean
  setTitle: (title: string) => void
  setDescription: (description: string) => void
  setQuestions: (questions: Question[]) => void
  setLoading: (loading: boolean) => void
  setSaving: (saving: boolean) => void
  addQuestion: () => void
  updateQuestion: (index: number, field: keyof Question, value: any) => void
  deleteQuestion: (index: number) => void
  reset: () => void
}

export const useEditorStore = create<EditorState>((set, get) => ({
  title: '',
  description: '',
  questions: [],
  loading: false,
  saving: false,

  setTitle: (title) => set({ title }),
  
  setDescription: (description) => set({ description }),
  
  setQuestions: (questions) => set({ questions }),
  
  setLoading: (loading) => set({ loading }),
  
  setSaving: (saving) => set({ saving }),

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
    set({ questions: [...questions, newQuestion] })
  },

  updateQuestion: (index, field, value) => {
    const questions = [...get().questions]
    questions[index] = { ...questions[index], [field]: value }
    set({ questions })
  },

  deleteQuestion: (index) => {
    const questions = get().questions.filter((_, i) => i !== index)
    set({ questions })
  },

  reset: () => set({ title: '', description: '', questions: [], loading: false, saving: false }),
}))
