# 🧾 InvoiceSense AI - Smart Invoice Processing

A powerful Next.js application that uses AI to automatically extract and process invoice data from images and PDFs, with real-time Airtable synchronization.

## ✨ Features

- **🤖 AI-Powered Processing**: Uses Groq AI to extract text from invoice images and PDFs
- **📊 Real-time Dashboard**: Beautiful UI with processing statistics and results
- **🔄 Airtable Sync**: Automatic synchronization with Airtable database
- **📱 Modern UI**: Built with Next.js 15, TypeScript, and Tailwind CSS
- **🔐 Authentication**: NextAuth.js integration
- **⚡ Real-time Updates**: Socket.IO for live processing updates
- **📈 Analytics**: Processing statistics and performance metrics

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Airtable account
- Groq API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd invoicesense-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your environment variables:
   ```env
   # Database
   DATABASE_URL="file:./prisma/dev.db"
   
   # NextAuth.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   
   # Airtable Integration
   AIRTABLE_API_KEY="your-airtable-api-key"
   AIRTABLE_BASE_ID="your-airtable-base-id"
   AIRTABLE_TABLE_NAME="Invoices"
   
   # Groq AI API
   GROQ_API_KEY="your-groq-api-key"
   
   # Environment
   NODE_ENV="development"
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript 5
- **Styling**: Tailwind CSS 4, shadcn/ui
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js
- **AI Processing**: Groq API
- **Real-time**: Socket.IO
- **External Sync**: Airtable API
- **Deployment**: Vercel

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   └── globals.css        # Global styles
├── components/            # React components
├── lib/                   # Utility libraries
│   ├── airtable.ts        # Airtable integration
│   ├── socket.ts          # Socket.IO setup
│   └── db.ts              # Database utilities
└── prisma/                # Database schema
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push database schema
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:reset` - Reset database
- `npm run db:seed` - Seed database with sample data

## 🌐 Deployment

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy!

### Environment Variables for Production

Make sure to set these in your Vercel dashboard:

- `DATABASE_URL` - Your production database URL
- `NEXTAUTH_URL` - Your production domain
- `NEXTAUTH_SECRET` - A secure random string
- `AIRTABLE_API_KEY` - Your Airtable API key
- `AIRTABLE_BASE_ID` - Your Airtable base ID
- `AIRTABLE_TABLE_NAME` - Your Airtable table name
- `GROQ_API_KEY` - Your Groq API key

## 🔑 Demo Login Credentials

For testing your deployed app, you can use these credentials:

**Admin User:**
- Email: `admin@demo.com`
- Password: `demo123`

**Employee User:**
- Email: `employee@demo.com`
- Password: `demo123`

## 📊 Airtable Setup

The application expects an Airtable base with the following structure:

### Invoices Table
- **Invoice Number** (Single line text)
- **Total Amount** (Currency)
- **Currency** (Single line text)
- **Status** (Single select: Processed, Pending)
- **Processed By** (Linked record to Users)
- **Processing Time** (Number)
- **Original Filename** (Single line text)
- **Created At** (Date)
- **Updated At** (Date)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Built with ❤️ using Next.js, TypeScript, and AI**
