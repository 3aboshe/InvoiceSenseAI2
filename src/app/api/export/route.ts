import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { type, filters } = await request.json()

    if (!type || !["invoices", "clients", "analytics"].includes(type)) {
      return NextResponse.json({ error: "Invalid export type" }, { status: 400 })
    }

    let data: any[] = []
    let csvContent = ""

    switch (type) {
      case "invoices":
        const invoices = await db.invoice.findMany({
          include: {
            client: true,
            processedBy: true,
            lineItems: true
          },
          orderBy: { createdAt: "desc" }
        })

        csvContent = "Invoice ID,Client,Invoice Number,Total Amount,Currency,Status,Processed By,Created At\n"
        invoices.forEach(invoice => {
          csvContent += `${invoice.id},${invoice.client?.name || "N/A"},${invoice.invoiceNumber || "N/A"},${invoice.totalAmount},${invoice.currency},${invoice.status},${invoice.processedBy.name},${invoice.createdAt}\n`
        })
        break

      case "clients":
        const clients = await db.client.findMany({
          orderBy: { totalRevenue: "desc" }
        })

        csvContent = "Client ID,Name,Email,Phone,Total Revenue,Invoice Count,Last Invoice Date\n"
        clients.forEach(client => {
          csvContent += `${client.id},${client.name},${client.email || "N/A"},${client.phone || "N/A"},${client.totalRevenue},${client.invoiceCount},${client.lastInvoiceDate || "N/A"}\n`
        })
        break

      case "analytics":
        const analytics = await db.analytics.findMany({
          orderBy: { date: "desc" }
        })

        csvContent = "Date,Total Revenue,Invoice Count,Avg Processing Time,Currency Breakdown\n"
        analytics.forEach(analytic => {
          csvContent += `${analytic.date},${analytic.totalRevenue},${analytic.invoiceCount},${analytic.avgProcessingTime},"${analytic.currencyBreakdown || ""}"\n`
        })
        break
    }

    // Create response with CSV file
    const response = new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${type}-export-${new Date().toISOString().split('T')[0]}.csv"`
      }
    })

    return response

  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json(
      { error: "Failed to export data" },
      { status: 500 }
    )
  }
}