"use client"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileText, Brain, BarChart3, Users, Loader2 } from "lucide-react"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid credentials")
      } else {
        // Get user session to determine role
        const session = await getSession()
        if (session?.user?.role === "ADMIN") {
          router.push("/admin")
        } else {
          router.push("/dashboard")
        }
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse-slow"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Hero Content */}
        <div className="space-y-8 animate-fade-in">
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-6xl font-bold text-gradient">
              InvoiceSense AI
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              Transform your invoice processing with intelligent automation. 
              Extract data instantly with our AI-powered platform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center p-4 glass-card">
              <FileText className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-1">Smart Extraction</h3>
              <p className="text-sm text-slate-400">AI-powered data extraction</p>
            </div>
            <div className="text-center p-4 glass-card">
              <Brain className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-1">Intelligent Processing</h3>
              <p className="text-sm text-slate-400">Advanced OCR technology</p>
            </div>
            <div className="text-center p-4 glass-card">
              <BarChart3 className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-1">Real-time Analytics</h3>
              <p className="text-sm text-slate-400">Live insights & reporting</p>
            </div>
          </div>

          <div className="flex items-center space-x-8 text-slate-400">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Role-based access</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Multi-format support</span>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="animate-slide-up">
          <Card className="w-full max-w-md mx-auto glass-card shadow-premium-lg">
            <CardHeader className="space-y-1 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 premium-gradient rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
              <CardDescription className="text-slate-400">
                Sign in to access your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="premium-input"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-300">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="premium-input"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                {error && (
                  <Alert className="border-red-500/20 bg-red-500/10">
                    <AlertDescription className="text-red-400">{error}</AlertDescription>
                  </Alert>
                )}
                <Button 
                  type="submit" 
                  className="w-full premium-button"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
              
              <div className="mt-6 p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                <h4 className="font-medium text-white mb-3">Demo Accounts</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 bg-slate-800/50 rounded">
                    <div>
                      <span className="text-blue-400 font-medium">Employee:</span>
                      <span className="text-slate-400 ml-2">employee@demo.com</span>
                    </div>
                    <span className="text-slate-500">demo123</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-slate-800/50 rounded">
                    <div>
                      <span className="text-purple-400 font-medium">Admin:</span>
                      <span className="text-slate-400 ml-2">admin@demo.com</span>
                    </div>
                    <span className="text-slate-500">demo123</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}