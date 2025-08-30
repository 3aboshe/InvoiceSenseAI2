"use client"

import { useState, useEffect } from "react"
import { FileText, Calendar, DollarSign, User, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Invoice {
  id: string
  invoiceNumber?: string
  clientName: string
  totalAmount: number
  currency: string
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "ERROR"
  createdAt: string
  processedBy: string
}

export default function RecentInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching recent invoices
    const fetchInvoices = async () => {
      setLoading(true)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data for demo
      const mockInvoices: Invoice[] = [
        {
          id: "1",
          invoiceNumber: "INV-001",
          clientName: "Acme Corporation",
          totalAmount: 2500,
          currency: "USD",
          status: "COMPLETED",
          createdAt: "2024-01-15T10:30:00Z",
          processedBy: "Employee User"
        },
        {
          id: "2",
          invoiceNumber: "INV-002",
          clientName: "Tech Solutions Inc",
          totalAmount: 1800,
          currency: "USD",
          status: "COMPLETED",
          createdAt: "2024-01-14T14:45:00Z",
          processedBy: "Employee User"
        },
        {
          id: "3",
          invoiceNumber: "INV-003",
          clientName: "Global Industries",
          totalAmount: 3200,
          currency: "USD",
          status: "PROCESSING",
          createdAt: "2024-01-13T09:15:00Z",
          processedBy: "Employee User"
        }
      ]
      
      setInvoices(mockInvoices)
      setLoading(false)
    }
    
    fetchInvoices()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "PROCESSING":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "PENDING":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "ERROR":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  if (loading) {
    return (
      <Card className="premium-card">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p className="text-slate-400 mt-4">Loading recent invoices...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="premium-card">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <FileText className="w-5 h-5 mr-2" />
          Recent Invoices
        </CardTitle>
      </CardHeader>
      <CardContent>
        {invoices.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-400">No invoices processed yet</p>
            <p className="text-sm text-slate-500 mt-2">
              Upload your first invoice to get started
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-slate-600/50 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-slate-700/50 rounded-lg">
                      <FileText className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">
                        {invoice.invoiceNumber || `Invoice #${invoice.id}`}
                      </h4>
                      <p className="text-sm text-slate-400">{invoice.clientName}</p>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={getStatusColor(invoice.status)}
                  >
                    {invoice.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    <span className="text-slate-400">Amount:</span>
                    <span className="text-white font-medium">
                      {invoice.currency} {invoice.totalAmount.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span className="text-slate-400">Date:</span>
                    <span className="text-white">
                      {formatDate(invoice.createdAt)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-purple-400" />
                    <span className="text-slate-400">By:</span>
                    <span className="text-white">
                      {invoice.processedBy}
                    </span>
                  </div>
                </div>
                
                <div className="mt-3 flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-400 hover:text-white hover:bg-slate-700/50"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}