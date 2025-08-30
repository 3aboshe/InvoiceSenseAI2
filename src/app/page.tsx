"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return

    if (session) {
      // User is authenticated, redirect based on role
      if (session.user.role === "ADMIN") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    } else {
      // User is not authenticated, redirect to signin
      router.push("/auth/signin")
    }
  }, [session, status, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="text-center">
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p className="text-slate-400 mt-4">Loading InvoiceSense AI...</p>
      </div>
    </div>
  )
}