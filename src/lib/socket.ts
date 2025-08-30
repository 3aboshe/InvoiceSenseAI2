import { Server } from "socket.io"
import { NextApiRequest, NextApiResponse } from "next"

export type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: {
      io: Server
    }
  }
}

export function initSocketIO(req: NextApiRequest, res: NextApiResponseWithSocket) {
  if (!res.socket.server.io) {
    console.log("Initializing Socket.IO server...")
    const io = new Server(res.socket.server, {
      path: "/api/socketio",
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    })

    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id)

      // Join room based on user role
      socket.on("join-room", (room: string) => {
        socket.join(room)
        console.log(`Socket ${socket.id} joined room: ${room}`)
      })

      // Handle invoice processing events
      socket.on("invoice-processing", (data) => {
        socket.to("admin-room").emit("invoice-processing", data)
      })

      socket.on("invoice-completed", (data) => {
        socket.to("admin-room").emit("invoice-completed", data)
        socket.to("employee-room").emit("invoice-completed", data)
      })

      socket.on("invoice-error", (data) => {
        socket.to("admin-room").emit("invoice-error", data)
      })

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id)
      })
    })

    res.socket.server.io = io
  }
}

// Socket emission functions
export function emitInvoiceUpdate(io: Server, data: any) {
  if (io) {
    io.to("admin-room").emit("invoice-update", data)
    io.to("employee-room").emit("invoice-update", data)
  }
}

export function emitStatsUpdate(io: Server, data: any) {
  if (io) {
    io.to("admin-room").emit("stats-update", data)
    io.to("employee-room").emit("stats-update", data)
  }
}