// server.ts - Next.js Standalone + Socket.IO
import { createServer } from 'http';
import { Server } from 'socket.io';
import next from 'next';

const dev = process.env.NODE_ENV !== 'production';
const currentPort = 3000;
const hostname = '0.0.0.0';

// Custom server with Socket.IO integration
async function createCustomServer() {
  try {
    // Create Next.js app
    const nextApp = next({ 
      dev,
      dir: process.cwd(),
      // In production, use the current directory where .next is located
      conf: dev ? undefined : { distDir: './.next' }
    });

    await nextApp.prepare();
    const handle = nextApp.getRequestHandler();

    // Create HTTP server that will handle both Next.js and Socket.IO
    const server = createServer((req, res) => {
      // Skip socket.io requests from Next.js handler
      if (req.url?.startsWith('/api/socketio')) {
        return;
      }
      handle(req, res);
    });

    // Setup Socket.IO
    const io = new Server(server, {
      path: '/api/socketio',
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    // Socket.IO event handlers
    io.on("connection", (socket) => {
      console.log("Client connected:", socket.id);

      // Join room based on user role
      socket.on("join-room", (room: string) => {
        socket.join(room);
        console.log(`Socket ${socket.id} joined room: ${room}`);
      });

      // Handle invoice processing events
      socket.on("invoice-processing", (data) => {
        socket.to("admin-room").emit("invoice-processing", data);
      });

      socket.on("invoice-completed", (data) => {
        socket.to("admin-room").emit("invoice-completed", data);
        socket.to("employee-room").emit("invoice-completed", data);
      });

      socket.on("invoice-error", (data) => {
        socket.to("admin-room").emit("invoice-error", data);
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });

    // Start the server
    server.listen(currentPort, hostname, () => {
      console.log(`> Ready on http://${hostname}:${currentPort}`);
      console.log(`> Socket.IO server running at ws://${hostname}:${currentPort}/api/socketio`);
    });

  } catch (err) {
    console.error('Server startup error:', err);
    process.exit(1);
  }
}

// Start the server
createCustomServer();
