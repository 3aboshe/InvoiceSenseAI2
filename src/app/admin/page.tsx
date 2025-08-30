"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { 
  BarChart3, 
  Users, 
  FileText, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  LogOut,
  Settings,
  Download,
  Eye,
  MoreHorizontal
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

interface AnalyticsData {
  totalRevenue: number
  totalInvoices: number
  avgProcessingTime: number
  activeUsers: number
  revenueGrowth: number
  invoiceGrowth: number
}

interface RecentActivity {
  id: string
  type: 'invoice' | 'user' | 'client'
  action: string
  description: string
  timestamp: string
  user: string
}

interface TopClient {
  id: string
  name: string
  revenue: number
  invoiceCount: number
  growth: number
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [topClients, setTopClients] = useState<TopClient[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return
    if (!session || session.user.role !== "ADMIN") {
      router.push("/auth/signin")
    }
  }, [session, status, router])

  useEffect(() => {
    if (session?.user?.role === "ADMIN") {
      fetchDashboardData()
    }
  }, [session])

  const fetchDashboardData = async () => {
    setLoading(true)
    
    // Simulate API calls with mock data
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setAnalytics({
      totalRevenue: 125430,
      totalInvoices: 342,
      avgProcessingTime: 2400,
      activeUsers: 12,
      revenueGrowth: 23.5,
      invoiceGrowth: 18.2
    })

    setRecentActivity([
      {
        id: "1",
        type: "invoice",
        action: "processed",
        description: "Invoice #INV-0034 processed successfully",
        timestamp: "2024-01-15T10:30:00Z",
        user: "Employee User"
      },
      {
        id: "2",
        type: "client",
        action: "created",
        description: "New client 'Global Industries' added",
        timestamp: "2024-01-15T09:45:00Z",
        user: "Admin User"
      },
      {
        id: "3",
        type: "user",
        action: "login",
        description: "User logged in to dashboard",
        timestamp: "2024-01-15T09:30:00Z",
        user: "Employee User"
      }
    ])

    setTopClients([
      {
        id: "1",
        name: "Acme Corporation",
        revenue: 45230,
        invoiceCount: 89,
        growth: 12.5
      },
      {
        id: "2",
        name: "Tech Solutions Inc",
        revenue: 38450,
        invoiceCount: 76,
        growth: 8.3
      },
      {
        id: "3",
        name: "Global Industries",
        revenue: 28900,
        invoiceCount: 54,
        growth: 15.7
      }
    ])

    setLoading(false)
  }

  const handleSignOut = async () => {
    await fetch("/api/auth/signout", { method: "POST" })
    router.push("/auth/signin")
  }

  const exportData = async (type: string) => {
    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ type })
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.style.display = "none"
        a.href = url
        a.download = `${type}-export-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.success(`${type} data exported successfully!`)
      } else {
        toast.error("Failed to export data")
      }
    } catch (error) {
      toast.error("Export failed")
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount)
  }

  const formatTime = (ms: number) => {
    return `${(ms / 1000).toFixed(1)}s`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p className="text-slate-400 mt-4">Loading Admin Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="glass-nav border-b border-slate-800/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gradient">InvoiceSense AI</h1>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                Admin Panel
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-300">
                Welcome, {session?.user?.name}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-slate-400 hover:text-white hover:bg-slate-800/50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="premium-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {analytics ? formatCurrency(analytics.totalRevenue) : "$0"}
              </div>
              <div className="flex items-center space-x-1 text-xs text-green-400">
                <TrendingUp className="w-3 h-3" />
                <span>+{analytics?.revenueGrowth}% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="premium-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Total Invoices
              </CardTitle>
              <FileText className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {analytics?.totalInvoices || 0}
              </div>
              <div className="flex items-center space-x-1 text-xs text-green-400">
                <TrendingUp className="w-3 h-3" />
                <span>+{analytics?.invoiceGrowth}% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="premium-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Avg Processing Time
              </CardTitle>
              <Clock className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {analytics ? formatTime(analytics.avgProcessingTime) : "0s"}
              </div>
              <div className="flex items-center space-x-1 text-xs text-slate-400">
                <span>Optimized performance</span>
              </div>
            </CardContent>
          </Card>

          <Card className="premium-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Active Users
              </CardTitle>
              <Users className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {analytics?.activeUsers || 0}
              </div>
              <div className="flex items-center space-x-1 text-xs text-slate-400">
                <span>Currently online</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Clients */}
          <div className="lg:col-span-2">
            <Card className="premium-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Top Clients
                </CardTitle>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-slate-400 hover:text-white"
                  onClick={() => exportData('invoices')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700/50">
                      <TableHead className="text-slate-400">Client Name</TableHead>
                      <TableHead className="text-slate-400">Revenue</TableHead>
                      <TableHead className="text-slate-400">Invoices</TableHead>
                      <TableHead className="text-slate-400">Growth</TableHead>
                      <TableHead className="text-slate-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topClients.map((client) => (
                      <TableRow key={client.id} className="border-slate-700/50">
                        <TableCell className="font-medium text-white">
                          {client.name}
                        </TableCell>
                        <TableCell className="text-white">
                          {formatCurrency(client.revenue)}
                        </TableCell>
                        <TableCell className="text-slate-300">
                          {client.invoiceCount}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress value={client.growth} className="w-16 h-2" />
                            <span className="text-sm text-green-400">
                              +{client.growth}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="glass-card">
                              <DropdownMenuItem className="text-white hover:bg-slate-700/50">
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-white hover:bg-slate-700/50">
                                <Download className="w-4 h-4 mr-2" />
                                Download Report
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card className="premium-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'invoice' ? 'bg-blue-400' :
                        activity.type === 'client' ? 'bg-green-400' :
                        'bg-purple-400'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium">
                          {activity.description}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-slate-400">
                            {activity.user}
                          </span>
                          <span className="text-xs text-slate-500">
                            {formatDate(activity.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="premium-card cursor-pointer hover:border-blue-500/50 transition-all duration-200">
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Manage Users</h3>
              <p className="text-sm text-slate-400">
                Add, edit, or remove user accounts
              </p>
            </CardContent>
          </Card>

          <Card className="premium-card cursor-pointer hover:border-green-500/50 transition-all duration-200">
            <CardContent className="p-6 text-center">
              <Settings className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">System Settings</h3>
              <p className="text-sm text-slate-400">
                Configure system preferences
              </p>
            </CardContent>
          </Card>

          <Card className="premium-card cursor-pointer hover:border-purple-500/50 transition-all duration-200" onClick={() => exportData('analytics')}>
            <CardContent className="p-6 text-center">
              <Download className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Export Reports</h3>
              <p className="text-sm text-slate-400">
                Download analytics and reports
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}