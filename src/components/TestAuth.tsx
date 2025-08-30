"use client"

import { useSession, signIn } from "next-auth/react"

export default function TestAuth() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (session) {
    return (
      <div>
        <p>Signed in as {session.user.email}</p>
        <p>Role: {session.user.role}</p>
        <button onClick={() => signIn()}>Sign in</button>
      </div>
    )
  }

  return (
    <div>
      <p>Not signed in</p>
      <button onClick={() => signIn("credentials", { 
        email: "admin@demo.com", 
        password: "demo123" 
      })}>
        Sign in as Admin
      </button>
      <br />
      <button onClick={() => signIn("credentials", { 
        email: "employee@demo.com", 
        password: "demo123" 
      })}>
        Sign in as Employee
      </button>
    </div>
  )
}