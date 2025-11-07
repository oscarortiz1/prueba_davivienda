import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface PieChartComponentProps {
  data: {
    value: string
    count: number
    percentage: number
  }[]
  title: string
}

const COLORS = [
  '#DC2626', // Rojo
  '#2563EB', // Azul
  '#059669', // Verde
  '#D97706', // Naranja
  '#7C3AED', // Púrpura
  '#DB2777', // Rosa
  '#0891B2', // Cyan
  '#65A30D', // Lima
  '#DC2626', // Rojo claro (repetición con variación)
  '#4F46E5', // Índigo
]

export default function PieChartComponent({ data, title }: PieChartComponentProps) {
  const chartData = data.map((item, index) => ({
    name: item.value,
    value: item.count,
    percentage: item.percentage,
    fill: COLORS[index % COLORS.length]
  }))

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(entry: any) => `${entry.percentage.toFixed(1)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
                    <p className="mb-1 font-semibold text-gray-900">{payload[0].name}</p>
                    <p className="text-sm text-gray-600">
                      Respuestas: <span className="font-semibold">{payload[0].value}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Porcentaje: <span className="font-semibold">{payload[0].payload.percentage.toFixed(1)}%</span>
                    </p>
                  </div>
                )
              }
              return null
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend below chart */}
      <div className="mt-4 space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div 
                className="h-3 w-3 rounded-full" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-gray-700">{item.value}</span>
            </div>
            <div className="flex gap-3">
              <span className="font-semibold text-gray-900">{item.count}</span>
              <span className="text-gray-500">({item.percentage.toFixed(1)}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
