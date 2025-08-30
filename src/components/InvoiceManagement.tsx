"use client"

import { useState, useEffect } from "react"
import { FileText, Search, Filter, Download, Eye, Trash2, CheckCircle, XCircle, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"

interface InvoiceData {
  id: string
  invoiceNumber: string
  clientName: string
  totalAmount: number
  currency: string
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "ERROR"
  createdAt: string
  processedBy: string
  processingTime?: number
  lineItemsCount: number
}

export default function InvoiceManagement() {
  const [invoices, setInvoices] = useState<InvoiceData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null)

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock data
      const mockInvoices: InvoiceData[] = [
        {
          id: "1",
          invoiceNumber: "INV-2024-001",
          clientName: "Acme Corporation",
          totalAmount: 2500,
          currency: "USD",
          status: "COMPLETED",
          createdAt: "2024-01-15T10:30:00Z",
          processedBy: "Employee User",
          processingTime: 2450,
          lineItemsCount: 3
        },
        {
          id: "2",
          invoiceNumber: "INV-2024-002",
          clientName: "Tech Solutions Inc",
          totalAmount: 1800,
          currency: "USD",
          status: "COMPLETED",
          createdAt: "2024-01-14T14:45:00Z",
          processedBy: "Employee User",
          processingTime: 2100,
          lineItemsCount: 2
        },
        {
          id: "3",
          invoiceNumber: "INV-2024-003",
          clientName: "Global Industries",
          totalAmount: 3200,
          currency: "USD",
          status: "PROCESSING",
          createdAt: "2024-01-13T09:15:00Z",
          processedBy: "John Smith",
          lineItemsCount: 4
        },
        {
          id: "4",
          invoiceNumber: "INV-2024-004",
          clientName: "StartUp Co",
          totalAmount: 950,
          currency: "USD",
          status: "ERROR",
          createdAt: "2024-01-12T16:20:00Z",
          processedBy: "Jane Doe",
          processingTime: 5000,
          lineItemsCount: 1
        },
        {
          id: "5",
          invoiceNumber: "INV-2024-005",
          clientName: "Mega Corp",
          totalAmount: 4500,
          currency: "USD",
          status: "PENDING",
          createdAt: "2024-01-11T11:00:00Z",
          processedBy: "System",
          lineItemsCount: 0
        }
      ]
      
      setInvoices(mockInvoices)
    } catch (error) {
      toast.error("Failed to fetch invoices")
    } finally {
      setLoading(false)
    }
  }

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case "PROCESSING":
        return <Clock className="w-4 h-4 text-blue-400" />
      case "ERROR":
        return <XCircle className="w-4 h-4 text-red-400" />
      default:
        return <Clock className="w-4 h-4 text-yellow-400" />
    }
  }

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleExport = () => {
    toast.success("Export functionality would be implemented here")
  }

  const handleDeleteInvoice = async (invoiceId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setInvoices(prev => prev.filter(invoice => invoice.id !== invoiceId))
      toast.success("Invoice deleted successfully")
    } catch (error) {
      toast.error("Failed to delete invoice")
    }
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
            <p className="text-slate-400 mt-4">Loading invoices...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Invoice Management</h2>
          <p className="text-slate-400">Monitor and manage all processed invoices</p>
        </div>
        
        <Button onClick={handleExport} className="premium-button">
          <Download className="w-4 h-4 mr-2" />
          Export All
        </Button>
      </div>

      {/* Filters */}
      <Card className="premium-card">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="premium-input pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="premium-input w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass-morphism border-slate-700/50">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="PROCESSING">Processing</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="ERROR">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card className="premium-card">
        <CardHeader>
          <CardTitle className="text-white">All Invoices ({filteredInvoices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700/50">
                  <TableHead className="text-slate-400">Invoice #</TableHead>
                  <TableHead className="text-slate-400">Client</TableHead>
                  <TableHead className="text-slate-400">Amount</TableHead>
                  <TableHead className="text-slate-400">Status</TableHead>
                  <TableHead className="text-slate-400">Processed By</TableHead>
                  <TableHead className="text-slate-400">Date</TableHead>
                  <TableHead className="text-slate-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id} className="border-slate-700/50 hover:bg-slate-800/30">
                    <TableCell className="font-medium text-white">
                      {invoice.invoiceNumber}
                    </TableCell>
                    <TableCell className="text-white">
                      {invoice.clientName}
                    </TableCell>
                    <TableCell className="text-white font-medium">
                      {invoice.currency} {invoice.totalAmount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(invoice.status)}
                        <Badge className={getStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {invoice.processedBy}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {new Date(invoice.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedInvoice(invoice)}
                              className="text-slate-400 hover:text-white hover:bg-slate-700/50"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="glass-morphism border-slate-700/50 max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="text-white">
                                Invoice Details - {selectedInvoice?.invoiceNumber}
                              </DialogTitle>
                            </DialogHeader>
                            {selectedInvoice && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-slate-400">Client</p>
                                    <p className="text-white font-medium">{selectedInvoice.clientName}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-slate-400">Amount</p>
                                    <p className="text-white font-medium">
                                      {selectedInvoice.currency} {selectedInvoice.totalAmount.toLocaleString()}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-slate-400">Status</p>
                                    <Badge className={getStatusColor(selectedInvoice.status)}>
                                      {selectedInvoice.status}
                                    </Badge>
                                  </div>
                                  <div>
                                    <p className="text-sm text-slate-400">Processing Time</p>
                                    <p className="text-white font-medium">
                                      {selectedInvoice.processingTime ? `${selectedInvoice.processingTime}ms` : "N/A"}
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm text-slate-400 mb-2">Line Items ({selectedInvoice.lineItemsCount})</p>
                                  <div className="bg-slate-800/50 rounded-lg p-3">
                                    <p className="text-slate-300 text-sm">
                                      Line item details would be displayed here...
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteInvoice(invoice.id)}
                          className="text-slate-400 hover:text-red-400 hover:bg-red-400/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredInvoices.length === 0 && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400">No invoices found</p>
              <p className="text-sm text-slate-500 mt-2">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}