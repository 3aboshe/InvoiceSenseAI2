import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { type } = await request.json()

    if (!type || !["invoices", "clients", "analytics"].includes(type)) {
      return NextResponse.json({ error: "Invalid export type" }, { status: 400 })
    }

    let csvContent = ""

    switch (type) {
      case "invoices":
        csvContent = "Invoice ID,Client,Invoice Number,Total Amount,Currency,Status,Processed By,Created At\n"
        csvContent += "1,Demo Client,INV-001,1000.00,USD,Processed,Admin User,2024-01-15\n"
        csvContent += "2,Sample Company,INV-002,2500.00,USD,Processed,Demo User,2024-01-16\n"
        break

      case "clients":
        csvContent = "Client ID,Name,Email,Phone,Total Revenue,Invoice Count,Last Invoice Date\n"
        csvContent += "1,Demo Client,demo@example.com,+1234567890,1000.00,1,2024-01-15\n"
        csvContent += "2,Sample Company,sample@example.com,+0987654321,2500.00,1,2024-01-16\n"
        break

      case "analytics":
        csvContent = "Date,Total Revenue,Invoice Count,Avg Processing Time,Currency Breakdown\n"
        csvContent += "2024-01-15,1000.00,1,2.5,\"USD: 1000.00\"\n"
        csvContent += "2024-01-16,2500.00,1,3.2,\"USD: 2500.00\"\n"
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