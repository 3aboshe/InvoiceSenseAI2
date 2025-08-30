"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Upload, FileText, BarChart3, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import ImageUploader from "@/components/ImageUploader"
import RecentInvoices from "@/components/RecentInvoices"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("upload")

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/auth/signin")
    }
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p className="text-slate-400 mt-4">Loading...</p>
        </div>
      </div>
    )
  }

  const handleSignOut = async () => {
    await fetch("/api/auth/signout", { method: "POST" })
    router.push("/auth/signin")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="glass-nav border-b border-slate-800/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gradient">InvoiceSense AI</h1>
              <span className="text-sm text-slate-400">Employee Dashboard</span>
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
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="premium-card bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Total Invoices
              </CardTitle>
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                <FileText className="h-4 w-4 text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-1">0</div>
              <p className="text-xs text-slate-400 flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                +0 from last week
              </p>
            </CardContent>
          </Card>

          <Card className="premium-card bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Processed Today
              </CardTitle>
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-1">0</div>
              <p className="text-xs text-slate-400 flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                +0 from yesterday
              </p>
            </CardContent>
          </Card>

          <Card className="premium-card bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Success Rate
              </CardTitle>
              <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                <Upload className="h-4 w-4 text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-1">100%</div>
              <p className="text-xs text-slate-400 flex items-center">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                All invoices processed
              </p>
            </CardContent>
          </Card>

          <Card className="premium-card bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Total Revenue
              </CardTitle>
              <div className="w-8 h-8 bg-orange-500/20 rounded-full flex items-center justify-center">
                <span className="text-orange-400 font-bold text-sm">$</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-1">$0</div>
              <p className="text-xs text-slate-400 flex items-center">
                <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                +0 from last week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Tab Navigation */}
        <Card className="premium-card mb-8">
          <CardContent className="p-2">
            <div className="flex space-x-1">
              <Button
                variant={activeTab === "upload" ? "default" : "ghost"}
                onClick={() => setActiveTab("upload")}
                className={`transition-all duration-300 ${
                  activeTab === "upload"
                    ? "premium-gradient text-white shadow-lg shadow-blue-500/25"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Invoice
              </Button>
              <Button
                variant={activeTab === "recent" ? "default" : "ghost"}
                onClick={() => setActiveTab("recent")}
                className={`transition-all duration-300 ${
                  activeTab === "recent"
                    ? "premium-gradient text-white shadow-lg shadow-blue-500/25"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <FileText className="w-4 h-4 mr-2" />
                Recent Invoices
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === "upload" && <ImageUploader />}
          {activeTab === "recent" && <RecentInvoices />}
        </div>
      </main>
    </div>
  )
}