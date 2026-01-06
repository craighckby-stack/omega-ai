import { createServer } from 'http';
import { Server } from 'socket.io';

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  },
  pingInterval: 10000,
  pingTimeout: 5000,
  transports: ['websocket', 'polling']
});

io.on('connection', (socket) => {
  console.log(`ðŸ“¡ Client connected: ${socket.id}`);

  // Join default rooms
  socket.join('metrics');
  socket.join('agents');
  socket.join('reasoning');
  socket.join('memory');
  socket.join('security');

  // Send initial state
  socket.emit('connected', {
    socketId: socket.id,
    timestamp: Date.now(),
    rooms: ['metrics', 'agents', 'reasoning', 'memory', 'security']
  });

  // Metrics room
  socket.on('join-metrics', () => {
    socket.join('metrics');
    socket.emit('joined-metrics', { room: 'metrics' });
  });

  // Agents room
  socket.on('join-agents', () => {
    socket.join('agents');
    socket.emit('joined-agents', { room: 'agents' });
  });

  // Reasoning room
  socket.on('join-reasoning', () => {
    socket.join('reasoning'); // FIX: Corrected typo from 'reasioning'
    socket.emit('joined-reasoning', { room: 'reasoning' }); // FIX: Corrected typo
  });

  // Memory room
  socket.on('join-memory', () => {
    socket.join('memory');
    socket.emit('joined-memory', { room: 'memory' });
  });

  // Security room
  socket.on('join-security', () => {
    socket.join('security');
    socket.emit('joined-security', { room: 'security' });
  });

  // Broadcast updates
  socket.on('broadcast-metrics', (data) => {
    socket.to('metrics').emit('metrics-update', data);
  });

  socket.on('broadcast-agents', (data) => {
    socket.to('agents').emit('agents-update', data);
  });

  socket.on('broadcast-reasoning', (data) => {
    socket.to('reasoning').emit('reasoning-update', data); // FIX: Corrected room ('reasoning') and emitted event name ('reasoning-update')
  });

  socket.on('broadcast-memory', (data) => {
    socket.to('memory').emit('memory-update', data);
  });

  socket.on('broadcast-security', (data) => {
    socket.to('security').emit('security-update', data);
  });
});

io.on('disconnect', (socket) => {
  console.log(`ðŸ“¡ Client disconnected: ${socket.id}`);
});

const PORT = process.env.WEBSOCKET_PORT || 3003;

httpServer.listen(PORT, () => {
  console.log(`ðŸš€ WebSocket service running on port ${PORT}`);
  console.log(`ðŸ“¡ Connected clients: ${io.engine.clientsCount}`);
});

export { io, httpServer };