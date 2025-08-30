interface AirtableConfig {
  apiKey: string
  baseId: string
  tables: {
    invoices: string
    clients: string
    analytics: string
  }
}

interface AirtableRecord {
  id: string
  fields: Record<string, any>
  createdTime: string
}

interface AirtableCreateResponse {
  id: string
  fields: Record<string, any>
  createdTime: string
}

interface AirtableUpdateResponse {
  id: string
  fields: Record<string, any>
  createdTime: string
}

class AirtableService {
  private config: AirtableConfig
  private baseUrl: string

  constructor(config: AirtableConfig) {
    this.config = config
    this.baseUrl = `https://api.airtable.com/v0/${config.baseId}`
  }

  private async request(endpoint: string, options: RequestInit = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Invoice operations
  async createInvoice(invoiceData: {
    invoiceNumber?: string
    clientId?: string
    company?: string
    totalAmount: number
    currency: string
    status: string
    processingTime?: number
    originalFilename?: string
    processedBy: string
    lineItems?: Array<{
      description: string
      quantity: number
      unitPrice: number
      amount: number
    }>
  }): Promise<AirtableCreateResponse> {
    const fields: Record<string, any> = {
      'Total Amount': invoiceData.totalAmount,
      'Currency': invoiceData.currency,
      'Status': invoiceData.status,
      'Processed By': invoiceData.processedBy,
    }

    if (invoiceData.invoiceNumber) {
      fields['Invoice Number'] = invoiceData.invoiceNumber
    }

    if (invoiceData.clientId) {
      fields['Client ID'] = invoiceData.clientId
    }

    if (invoiceData.company) {
      fields['Company'] = invoiceData.company
    }

    if (invoiceData.processingTime) {
      fields['Processing Time'] = invoiceData.processingTime
    }

    if (invoiceData.originalFilename) {
      fields['Original Filename'] = invoiceData.originalFilename
    }

    if (invoiceData.lineItems && invoiceData.lineItems.length > 0) {
      fields['Description'] = invoiceData.lineItems.map(item => item.description).join(', ')
      fields['Quantity'] = invoiceData.lineItems.reduce((sum, item) => sum + item.quantity, 0)
      fields['Unit Price'] = invoiceData.lineItems[0].unitPrice
    }

    return this.request(`/${this.config.tables.invoices}`, {
      method: 'POST',
      body: JSON.stringify({
        records: [{ fields }]
      }),
    })
  }

  async updateInvoice(id: string, updates: Record<string, any>): Promise<AirtableUpdateResponse> {
    return this.request(`/${this.config.tables.invoices}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        fields: updates
      }),
    })
  }

  async getInvoices(filter?: Record<string, any>): Promise<AirtableRecord[]> {
    let endpoint = `/${this.config.tables.invoices}`
    
    if (filter) {
      const filterFormula = Object.entries(filter)
        .map(([key, value]) => `{${key}} = '${value}'`)
        .join(' AND ')
      endpoint += `?filterByFormula=${encodeURIComponent(filterFormula)}`
    }

    const response = await this.request(endpoint)
    return response.records
  }

  // Client operations
  async createClient(clientData: {
    name: string
    email?: string
    phone?: string
    address?: string
  }): Promise<AirtableCreateResponse> {
    const fields: Record<string, any> = {
      'Name': clientData.name,
      'Total Revenue': 0,
      'Invoice Count': 0,
    }

    if (clientData.email) {
      fields['Email'] = clientData.email
    }

    if (clientData.phone) {
      fields['Phone'] = clientData.phone
    }

    if (clientData.address) {
      fields['Address'] = clientData.address
    }

    return this.request(`/${this.config.tables.clients}`, {
      method: 'POST',
      body: JSON.stringify({
        records: [{ fields }]
      }),
    })
  }

  async updateClient(id: string, updates: {
    totalRevenue?: number
    invoiceCount?: number
    lastInvoiceDate?: string
  }): Promise<AirtableUpdateResponse> {
    const fields: Record<string, any> = {}

    if (updates.totalRevenue !== undefined) {
      fields['Total Revenue'] = updates.totalRevenue
    }

    if (updates.invoiceCount !== undefined) {
      fields['Invoice Count'] = updates.invoiceCount
    }

    if (updates.lastInvoiceDate) {
      fields['Last Invoice Date'] = updates.lastInvoiceDate
    }

    return this.request(`/${this.config.tables.clients}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        fields
      }),
    })
  }

  async getClients(): Promise<AirtableRecord[]> {
    const response = await this.request(`/${this.config.tables.clients}`)
    return response.records
  }

  // Analytics operations
  async createAnalytics(analyticsData: {
    totalRevenue: number
    invoiceCount: number
    avgProcessingTime: number
    currencyBreakdown?: string
  }): Promise<AirtableCreateResponse> {
    const fields: Record<string, any> = {
      'Total Revenue': analyticsData.totalRevenue,
      'Invoice Count': analyticsData.invoiceCount,
      'Average Processing Time': analyticsData.avgProcessingTime,
      'Date': new Date().toISOString().split('T')[0],
    }

    if (analyticsData.currencyBreakdown) {
      fields['Currency Breakdown'] = analyticsData.currencyBreakdown
    }

    return this.request(`/${this.config.tables.analytics}`, {
      method: 'POST',
      body: JSON.stringify({
        records: [{ fields }]
      }),
    })
  }

  async getAnalytics(dateRange?: { start: string; end: string }): Promise<AirtableRecord[]> {
    let endpoint = `/${this.config.tables.analytics}`
    
    if (dateRange) {
      const filterFormula = `AND(IS_AFTER({Date}, '${dateRange.start}'), IS_BEFORE({Date}, '${dateRange.end}'))`
      endpoint += `?filterByFormula=${encodeURIComponent(filterFormula)}`
    }

    const response = await this.request(endpoint)
    return response.records
  }
}

// Create Airtable service instance
export function createAirtableService(): AirtableService {
  const config: AirtableConfig = {
    apiKey: process.env.AIRTABLE_API_KEY || '',
    baseId: process.env.AIRTABLE_BASE_ID || '',
    tables: {
      invoices: 'Invoices',
      clients: 'Clients',
      analytics: 'Analytics'
    }
  }

  if (!config.apiKey || !config.baseId) {
    console.warn('Airtable configuration missing. Using mock service.')
    // Return a mock service for development
    return new MockAirtableService()
  }

  return new AirtableService(config)
}

// Mock Airtable service for development
class MockAirtableService extends AirtableService {
  constructor() {
    super({
      apiKey: 'mock',
      baseId: 'mock',
      tables: { invoices: 'mock', clients: 'mock', analytics: 'mock' }
    })
  }

  async createInvoice(invoiceData: any): Promise<any> {
    console.log('Mock Airtable: Creating invoice', invoiceData)
    return {
      id: `mock-${Date.now()}`,
      fields: invoiceData,
      createdTime: new Date().toISOString()
    }
  }

  async updateClient(id: string, updates: any): Promise<any> {
    console.log('Mock Airtable: Updating client', id, updates)
    return {
      id,
      fields: updates,
      createdTime: new Date().toISOString()
    }
  }

  async createAnalytics(analyticsData: any): Promise<any> {
    console.log('Mock Airtable: Creating analytics', analyticsData)
    return {
      id: `mock-${Date.now()}`,
      fields: analyticsData,
      createdTime: new Date().toISOString()
    }
  }

  // Mock implementations for other methods
  async updateInvoice(id: string, updates: any): Promise<any> {
    console.log('Mock Airtable: Updating invoice', id, updates)
    return { id, fields: updates, createdTime: new Date().toISOString() }
  }

  async getInvoices(filter?: any): Promise<any[]> {
    console.log('Mock Airtable: Getting invoices', filter)
    return []
  }

  async createClient(clientData: any): Promise<any> {
    console.log('Mock Airtable: Creating client', clientData)
    return {
      id: `mock-${Date.now()}`,
      fields: clientData,
      createdTime: new Date().toISOString()
    }
  }

  async getClients(): Promise<any[]> {
    console.log('Mock Airtable: Getting clients')
    return []
  }

  async getAnalytics(dateRange?: any): Promise<any[]> {
    console.log('Mock Airtable: Getting analytics', dateRange)
    return []
  }
}