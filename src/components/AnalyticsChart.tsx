"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts"

interface AnalyticsChartProps {
  type: "revenue" | "processing"
}

export default function AnalyticsChart({ type }: AnalyticsChartProps) {
  // Mock data for revenue chart
  const revenueData = [
    { month: "Jan", revenue: 45000, invoices: 120 },
    { month: "Feb", revenue: 52000, invoices: 145 },
    { month: "Mar", revenue: 48000, invoices: 132 },
    { month: "Apr", revenue: 61000, invoices: 158 },
    { month: "May", revenue: 55000, invoices: 142 },
    { month: "Jun", revenue: 67000, invoices: 167 },
    { month: "Jul", revenue: 72000, invoices: 189 },
    { month: "Aug", revenue: 68000, invoices: 175 },
    { month: "Sep", revenue: 74000, invoices: 198 },
    { month: "Oct", revenue: 79000, invoices: 205 },
    { month: "Nov", revenue: 85000, invoices: 218 },
    { month: "Dec", revenue: 92000, invoices: 235 }
  ]

  // Mock data for processing chart
  const processingData = [
    { day: "Mon", processed: 45, failed: 2, avgTime: 2400 },
    { day: "Tue", processed: 52, failed: 1, avgTime: 2200 },
    { day: "Wed", processed: 48, failed: 3, avgTime: 2600 },
    { day: "Thu", processed: 61, failed: 1, avgTime: 2100 },
    { day: "Fri", processed: 55, failed: 2, avgTime: 2300 },
    { day: "Sat", processed: 32, failed: 0, avgTime: 2800 },
    { day: "Sun", processed: 28, failed: 1, avgTime: 3000 }
  ]

  // Mock data for success rate pie chart
  const successRateData = [
    { name: "Successful", value: 98.5, color: "#10b981" },
    { name: "Failed", value: 1.5, color: "#ef4444" }
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey === "revenue" ? `Revenue: $${entry.value.toLocaleString()}` : 
               entry.dataKey === "invoices" ? `Invoices: ${entry.value}` :
               entry.dataKey === "processed" ? `Processed: ${entry.value}` :
               entry.dataKey === "failed" ? `Failed: ${entry.value}` :
               entry.dataKey === "avgTime" ? `Avg Time: ${entry.value}ms` : entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  if (type === "revenue") {
    return (
      <div className="space-y-6">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="invoices" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    )
  }

  if (type === "processing") {
    return (
      <div className="space-y-6">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={processingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="processed" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="failed" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={successRateData}
                  cx="50%"
                  cy="50%"
                  innerRadius={30}
                  outerRadius={50}
                  dataKey="value"
                >
                  {successRateData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-2">
            <h4 className="text-white font-medium">Success Rate</h4>
            <div className="space-y-1">
              {successRateData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-slate-300">{item.name}</span>
                  </div>
                  <span className="text-sm text-white font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}