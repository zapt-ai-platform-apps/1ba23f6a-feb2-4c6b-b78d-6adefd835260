import { db, authenticateUser, Sentry } from './_apiUtils.js';
import { messages } from '../drizzle/schema.js';
import { Server } from 'socket.io';

// This is a WebSocket API route
export default function SocketHandler(req, res) {
  console.log("Socket API connection attempt");
  
  // Already existing socket server
  if (res.socket.server.io) {
    console.log('Socket already running');
    res.end();
    return;
  }

  // Create a new Socket.io instance
  const io = new Server(res.socket.server, {
    path: '/api/socket',
    addTrailingSlash: false,
  });
  res.socket.server.io = io;

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication token is missing'));
      }

      // Create a mock request object for authenticateUser
      const mockReq = {
        headers: {
          authorization: `Bearer ${token}`
        }
      };

      try {
        const user = await authenticateUser(mockReq);
        socket.user = user;
        next();
      } catch (error) {
        console.error("Socket authentication error:", error);
        next(new Error('Authentication failed'));
      }
    } catch (error) {
      console.error("Socket middleware error:", error);
      Sentry.captureException(error);
      next(new Error('Internal server error'));
    }
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    console.log('User connected:', socket.user.email);

    // Join main channel
    socket.join('main');

    // Send welcome message
    socket.emit('message', { 
      id: 'system',
      content: 'Selamat datang di chat Frost Warlord!',
      sender: 'System',
      createdAt: new Date()
    });

    // Load past messages
    socket.on('load_messages', async () => {
      try {
        const history = await db.select()
          .from(messages)
          .orderBy(messages.createdAt)
          .limit(50);

        socket.emit('message_history', history);
      } catch (error) {
        console.error("Error loading message history:", error);
        Sentry.captureException(error);
      }
    });

    // Handle incoming messages
    socket.on('send_message', async (messageData) => {
      try {
        const { content } = messageData;
        
        if (!content || typeof content !== 'string' || content.trim() === '') {
          return;
        }

        // Save message to database
        const [newMessage] = await db.insert(messages)
          .values({
            content,
            senderId: socket.user.id
          })
          .returning();

        // Broadcast to all clients
        io.to('main').emit('message', {
          id: newMessage.id,
          content: newMessage.content,
          sender: socket.user,
          createdAt: newMessage.createdAt
        });
      } catch (error) {
        console.error("Error sending message:", error);
        Sentry.captureException(error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle client disconnection
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  console.log('Socket server initialized');
  res.end();
}