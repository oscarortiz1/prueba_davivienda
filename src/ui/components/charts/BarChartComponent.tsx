import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'

interface BarChartComponentProps {
  data: {
    value: string
    count: number
    percentage: number
  }[]
  title: string
}

const COLORS = ['#DC2626', '#EF4444', '#F87171', '#FCA5A5', '#FECACA', '#FEE2E2']

export default function BarChartComponent({ data, title }: BarChartComponentProps) {
  const chartData = data.map(item => ({
    name: item.value.length > 20 ? item.value.substring(0, 20) + '...' : item.value,
    fullName: item.value,
    count: item.count,
    percentage: item.percentage
  }))

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={100}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
                    <p className="mb-1 font-semibold text-gray-900">{payload[0].payload.fullName}</p>
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
          <Bar dataKey="count" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      {/* Legend below chart */}
      <div className="mt-4 space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div 
                className="h-3 w-3 rounded-sm" 
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
