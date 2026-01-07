import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

const DEFAULT_PORT = 3003;
// Ensure port is parsed as a number if set via environment variables
const PORT = parseInt(process.env.WEBSOCKET_PORT || String(DEFAULT_PORT), 10);
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const DEFAULT_ROOMS = ['metrics', 'agents', 'reasoning', 'memory', 'security'];

// Create HTTP server instance
const httpServer = createServer();

// Initialize Socket.IO server configuration
const io = new Server(httpServer, {
  cors: {
    origin: APP_URL,
    methods: ['GET', 'POST'],
    credentials: true, // Recommended for production CORS setups
  },
  // Optimize stability and minimize latency
  pingInterval: 10000,
  pingTimeout: 5000,
  transports: ['websocket', 'polling']
});

/**
 * Sets up listeners for dynamic room joining and broadcasting for predefined rooms.
 * @param socket The connected socket instance.
 */
const setupRoomListeners = (socket: Socket) => {
  DEFAULT_ROOMS.forEach(room => {
    
    // Listener for explicit room join request
    socket.on(`join-${room}`, () => {
      if (!socket.rooms.has(room)) {
        socket.join(room);
        socket.emit(`joined-${room}`, { room });
        console.log(`Socket ${socket.id} joined room: ${room}`);
      }
    });

    // Listener for broadcasting updates to a specific room
    socket.on(`broadcast-${room}`, (data) => {
      // Broadcast to all other clients in the room, excluding the sender
      console.log(`Broadcasting update to room [${room}] from ${socket.id}`);
      socket.to(room).emit(`${room}-update`, data);
    });
  });
};

/**
 * Handles client connection and sets up room listeners.
 * @param socket The connected socket instance.
 */
const handleConnection = (socket: Socket) => {
  // FIX: Corrected mangled UTF-8 characters
  console.log(`✅ Client connected: ${socket.id}`); 

  // --- Initial Setup ---
  
  // Automatically join all default rooms upon connection
  DEFAULT_ROOMS.forEach(room => {
    socket.join(room);
  });

  // Send initial state back to the client
  socket.emit('connected', {
    socketId: socket.id,
    timestamp: Date.now(),
    rooms: DEFAULT_ROOMS
  });

  // --- Dynamic Room Joining & Broadcasting Logic ---
  setupRoomListeners(socket);

  // --- Disconnection Handling ---

  socket.on('disconnect', (reason) => {
    // FIX: Corrected mangled UTF-8 characters
    console.log(`❌ Client disconnected: ${socket.id} (Reason: ${reason})`);
  });
};

io.on('connection', handleConnection);

// Add robust error handling for the HTTP server
httpServer.on('error', (err: NodeJS.ErrnoException) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`FATAL ERROR: Port ${PORT} is already in use.`);
  } else {
    console.error(`FATAL SERVER ERROR:`, err);
  }
  process.exit(1); // Exit process immediately upon fatal error
});

// Start the HTTP server listening
httpServer.listen(PORT, () => {
  // FIX: Corrected mangled UTF-8 characters
  console.log(`🚀 WebSocket service running on port ${PORT} (CORS Origin: ${APP_URL})`); 
  // Initial client count check should be done after the server is ready, but before actual clients connect.
  // io.engine.clientsCount is deprecated. Using io.sockets.sockets.size for accurate count (though 0 at startup).
  console.log(`✅ Server initialized.`);
});

export { io, httpServer };