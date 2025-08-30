import { NextApiRequest, NextApiResponse } from "next"
import { initSocketIO, NextApiResponseWithSocket } from "@/lib/socket"

export default function handler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  try {
    initSocketIO(req, res)
    res.status(200).json({ message: "Socket.IO initialized" })
  } catch (error) {
    console.error("Socket.IO initialization error:", error)
    res.status(500).json({ error: "Failed to initialize Socket.IO" })
  }
}