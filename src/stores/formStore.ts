import { create } from 'zustand'

interface FormState {
  values: Record<string, string>
  errors: Record<string, string | null>
  loading: boolean
  globalError: string | null
  setValues: (values: Record<string, string>) => void
  setValue: (name: string, value: string) => void
  setErrors: (errors: Record<string, string | null>) => void
  setError: (name: string, error: string | null) => void
  setLoading: (loading: boolean) => void
  setGlobalError: (error: string | null) => void
  reset: (fields: string[]) => void
}

export const useFormStore = create<FormState>((set) => ({
  values: {},
  errors: {},
  loading: false,
  globalError: null,

  setValues: (values) => set({ values }),
  
  setValue: (name, value) => set((state) => ({
    values: { ...state.values, [name]: value },
    errors: { ...state.errors, [name]: null }
  })),
  
  setErrors: (errors) => set({ errors }),
  
  setError: (name, error) => set((state) => ({
    errors: { ...state.errors, [name]: error }
  })),
  
  setLoading: (loading) => set({ loading }),
  
  setGlobalError: (error) => set({ globalError: error }),
  
  reset: (fields) => set({
    values: Object.fromEntries(fields.map(f => [f, ''])),
    errors: {},
    loading: false,
    globalError: null
  }),
}))
