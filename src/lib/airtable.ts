interface AirtableConfig {
  baseId: string
  apiKey: string
  tables: {
    invoices: string
    clients: string
    analytics: string
  }
}

interface AirtableRecord {
  id?: string
  fields: Record<string, any>
  createdTime?: string
}

interface AirtableResponse {
  records: AirtableRecord[]
}

class AirtableService {
  private config: AirtableConfig

  constructor(config: AirtableConfig) {
    this.config = config
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `https://api.airtable.com/v0/${this.config.baseId}${endpoint}`
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Airtable API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        errorText: errorText
      })
      throw new Error(`Airtable API Error: ${response.status} ${response.statusText} - ${errorText}`)
    }

    return response.json()
  }

  // Create invoice record
  async createInvoice(invoiceData: {
    invoiceNumber?: string
    clientName: string
    totalAmount: number
    currency: string
    status: string
    processedBy: string
    processingTime?: number
    originalFilename?: string
    lineItemsCount: number
  }): Promise<AirtableRecord> {
    const record = {
      fields: {
        'Invoice Number': invoiceData.invoiceNumber || `INV-${Date.now()}`,
        'Total Amount': invoiceData.totalAmount,
        'Currency': invoiceData.currency,
        'Status': invoiceData.status,
        'Processed By': invoiceData.processedBy,
        'Processing Time': invoiceData.processingTime || 0,
        'Original Filename': invoiceData.originalFilename || '',
        'Created At': new Date().toISOString().split('T')[0],
        'Updated At': new Date().toISOString().split('T')[0]
      }
    }

    console.log('Creating Airtable invoice record:', JSON.stringify(record, null, 2))

    const response = await this.makeRequest(`/${this.config.tables.invoices}`, {
      method: 'POST',
      body: JSON.stringify({ records: [record] })
    })

    return response.records[0]
  }

  // Create or update client record
  async upsertClient(clientData: {
    name: string
    email?: string
    phone?: string
    address?: string
    totalRevenue?: number
    invoiceCount?: number
    lastInvoiceDate?: string
  }): Promise<AirtableRecord> {
    // First, try to find existing client by name
    const filterFormula = `{Name} = '${clientData.name.replace(/'/g, "\\'")}'`
    const existingResponse = await this.makeRequest(
      `/${this.config.tables.clients}?filterByFormula=${encodeURIComponent(filterFormula)}`
    )

    if (existingResponse.records.length > 0) {
      // Update existing client
      const existingRecord = existingResponse.records[0]
      const updatedFields = {
        ...existingRecord.fields,
        'Total Revenue': (existingRecord.fields['Total Revenue'] || 0) + (clientData.totalRevenue || 0),
        'Invoice Count': (existingRecord.fields['Invoice Count'] || 0) + (clientData.invoiceCount || 0),
        'Last Invoice Date': clientData.lastInvoiceDate || existingRecord.fields['Last Invoice Date'],
        'Email': clientData.email || existingRecord.fields['Email'],
        'Phone': clientData.phone || existingRecord.fields['Phone'],
        'Address': clientData.address || existingRecord.fields['Address']
      }

      const response = await this.makeRequest(`/${this.config.tables.clients}/${existingRecord.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ fields: updatedFields })
      })

      return response
    } else {
      // Create new client
      const record = {
        fields: {
          'Name': clientData.name,
          'Email': clientData.email || '',
          'Phone': clientData.phone || '',
          'Address': clientData.address || '',
          'Total Revenue': clientData.totalRevenue || 0,
          'Invoice Count': clientData.invoiceCount || 0,
          'Last Invoice Date': clientData.lastInvoiceDate || '',
          'Created Date': new Date().toISOString()
        }
      }

      const response = await this.makeRequest(`/${this.config.tables.clients}`, {
        method: 'POST',
        body: JSON.stringify({ records: [record] })
      })

      return response.records[0]
    }
  }

  // Create analytics record
  async createAnalytics(analyticsData: {
    totalRevenue: number
    invoiceCount: number
    avgProcessingTime: number
    currencyBreakdown?: string
  }): Promise<AirtableRecord> {
    const record = {
      fields: {
        'Date': new Date().toISOString().split('T')[0], // Just the date part
        'Total Revenue': analyticsData.totalRevenue,
        'Invoice Count': analyticsData.invoiceCount,
        'Average Processing Time': analyticsData.avgProcessingTime,
        'Currency Breakdown': analyticsData.currencyBreakdown || '{}',
        'Created Date': new Date().toISOString()
      }
    }

    const response = await this.makeRequest(`/${this.config.tables.analytics}`, {
      method: 'POST',
      body: JSON.stringify({ records: [record] })
    })

    return response.records[0]
  }

  // Get invoices with optional filtering
  async getInvoices(filter?: {
    status?: string
    clientName?: string
    dateFrom?: string
    dateTo?: string
  }): Promise<AirtableRecord[]> {
    let filterFormula = ''
    
    if (filter) {
      const conditions = []
      
      if (filter.status) {
        conditions.push(`{Status} = '${filter.status}'`)
      }
      
      if (filter.clientName) {
        conditions.push(`{Client Name} = '${filter.clientName.replace(/'/g, "\\'")}'`)
      }
      
      if (filter.dateFrom) {
        conditions.push(`{Created Date} >= '${filter.dateFrom}'`)
      }
      
      if (filter.dateTo) {
        conditions.push(`{Created Date} <= '${filter.dateTo}'`)
      }
      
      if (conditions.length > 0) {
        filterFormula = `AND(${conditions.join(', ')})`
      }
    }

    const endpoint = filterFormula 
      ? `/${this.config.tables.invoices}?filterByFormula=${encodeURIComponent(filterFormula)}`
      : `/${this.config.tables.invoices}`

    const response = await this.makeRequest(endpoint)
    return response.records
  }

  // Get analytics data for a date range
  async getAnalytics(dateFrom?: string, dateTo?: string): Promise<AirtableRecord[]> {
    let filterFormula = ''
    
    if (dateFrom && dateTo) {
      filterFormula = `AND({Date} >= '${dateFrom}', {Date} <= '${dateTo}')`
    } else if (dateFrom) {
      filterFormula = `{Date} >= '${dateFrom}'`
    } else if (dateTo) {
      filterFormula = `{Date} <= '${dateTo}'`
    }

    const endpoint = filterFormula 
      ? `/${this.config.tables.analytics}?filterByFormula=${encodeURIComponent(filterFormula)}`
      : `/${this.config.tables.analytics}`

    const response = await this.makeRequest(endpoint)
    return response.records
  }

  // Get all clients
  async getClients(): Promise<AirtableRecord[]> {
    const response = await this.makeRequest(`/${this.config.tables.clients}`)
    return response.records
  }

  // Delete a record
  async deleteRecord(table: string, recordId: string): Promise<void> {
    await this.makeRequest(`/${table}/${recordId}`, {
      method: 'DELETE'
    })
  }
}

  // Create Airtable service instance
  export function createAirtableService(): AirtableService | null {
    const apiKey = process.env.AIRTABLE_API_KEY
    const baseId = process.env.AIRTABLE_BASE_ID

    if (!apiKey || !baseId) {
      console.warn('Airtable credentials not found. Airtable integration will be disabled.')
      return null
    }

    console.log('Creating Airtable service with:', {
      baseId,
      tables: {
        invoices: 'Invoices',
        clients: 'Clients',
        analytics: 'Analytics'
      }
    })

    return new AirtableService({
      apiKey,
      baseId,
      tables: {
        invoices: 'Invoices'
      }
    })
  }

export default AirtableService