import { useState, useRef, useEffect } from 'react'
import { useToastStore } from '../../stores/toastStore'

interface ImageUploadProps {
  imageUrl?: string
  onImageChange: (imageUrl: string | null) => void
  disabled?: boolean
}

const MAX_FILE_SIZE = 2 * 1024 * 1024 
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']

export default function ImageUpload({ imageUrl, onImageChange, disabled }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(imageUrl || null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const showToast = useToastStore((state) => state.showToast)

  useEffect(() => {
    setPreview(imageUrl || null)
  }, [imageUrl])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!ALLOWED_TYPES.includes(file.type)) {
      showToast('Tipo de archivo no permitido. Usa: JPG, PNG, GIF o WEBP', 'error')
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      showToast('La imagen excede el tamaño máximo de 2MB', 'error')
      return
    }

    try {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64Image = reader.result as string
        setPreview(base64Image)
        onImageChange(base64Image)
        showToast('Imagen cargada correctamente', 'success')
      }

      reader.onerror = () => {
        showToast('Error al leer el archivo', 'error')
      }

      reader.readAsDataURL(file)
    } catch (error: any) {
      console.error('Error al cargar imagen:', error)
      showToast('Error al cargar la imagen', 'error')
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onImageChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Imagen (opcional)</label>
        <span className="text-xs text-gray-500">Máx. 2MB - JPG, PNG, GIF, WEBP</span>
      </div>

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="max-h-64 w-full rounded-lg border border-gray-300 object-contain bg-gray-50"
            onError={(e) => {
              console.error('❌ Error al cargar imagen:', preview)
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              showToast('Error al cargar la imagen. Verifica que el backend esté corriendo.', 'error')
            }}
            onLoad={() => {
              console.log('✅ Imagen cargada correctamente:', preview)
            }}
          />
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled}
            className="absolute right-2 top-2 rounded-full bg-red-600 p-2 text-white shadow-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {preview.startsWith('data:') && (
            <div className="mt-2 rounded-md bg-green-50 border border-green-200 px-3 py-2">
              <p className="text-xs text-green-800">
                ✅ Imagen cargada. Se guardará en base64 al guardar la pregunta.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleFileSelect}
            disabled={disabled}
            className="hidden"
          />
          <button
            type="button"
            onClick={handleClick}
            disabled={disabled}
            className="flex w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          >
            <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2 text-sm font-medium text-gray-700">Haz clic para subir una imagen</p>
            <p className="mt-1 text-xs text-gray-500">o arrastra y suelta aquí</p>
          </button>
        </div>
      )}
    </div>
  )
}
