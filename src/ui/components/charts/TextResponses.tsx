interface TextResponsesProps {
  responses: string[]
  title: string
}

export default function TextResponses({ responses, title }: TextResponsesProps) {
  if (responses.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-center text-gray-500">No hay respuestas aún</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">{title}</h3>
      <div className="mb-3 flex items-center justify-between text-sm">
        <span className="text-gray-600">Total de respuestas:</span>
        <span className="font-semibold text-gray-900">{responses.length}</span>
      </div>
      <div className="max-h-96 space-y-3 overflow-y-auto">
        {responses.map((response, index) => (
          <div key={index} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">Respuesta #{index + 1}</span>
            </div>
            <p className="text-sm text-gray-800">{response}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
