"use client"

import { useEffect, useRef } from "react"
import { useSession } from "next-auth/react"
import io, { Socket } from "socket.io-client"

export function useSocket() {
  const { data: session } = useSession()
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    if (session) {
      // Initialize socket connection
      socketRef.current = io(process.env.NODE_ENV === "production" ? "" : "http://localhost:3000", {
        path: "/api/socketio"
      })

      const socket = socketRef.current

      // Join appropriate room based on user role
      const room = session.user.role === "ADMIN" ? "admin-room" : "employee-room"
      socket.emit("join-room", room)

      // Cleanup on unmount
      return () => {
        socket.disconnect()
      }
    }
  }, [session])

  return socketRef.current
}