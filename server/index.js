/* eslint consistent-return:0 */

const express = require('express');
const logger = require('./logger');
const cors = require('cors');
const crypto = require('crypto');

const argv = require('./argv');
const port = require('./port');
const setup = require('./middlewares/frontendMiddleware');
const isDev = process.env.NODE_ENV !== 'production';
const ngrok =
  (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel
    ? require('ngrok')
    : false;
const { resolve } = require('path');
const app = express();
app.use(cors());
const server = require('http').Server(app);
const io = require('socket.io')(server, { origins: '*:*' });
server.listen(3001);

// If you need a backend, e.g. an API, add your custom backend-specific middleware here
// app.use('/api', myApi);

// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});
const created = false;

io.sockets.on('connection', socket => {
  // convenience function to log server messages on the client
  function log() {
    const array = ['Message from server:'];
    array.push(...arguments);
    socket.emit('log', array);
  }

  socket.on('message', message => {
    log('Client said: ', message);
    // for a real app, would be room-only (not broadcast)
    socket.broadcast.emit('message', message);
  });

  socket.on('create or join', room => {
    log(`Received request to create or join room ${room}`);
    if (room === -1) {
      const id = crypto.randomBytes(3).toString('hex');
      console.log(id);
    }
    const clientsInRoom = io.sockets.adapter.rooms[room];
    const numClients = clientsInRoom
      ? Object.keys(clientsInRoom.sockets).length
      : 0;
    log(`Room ${room} now has ${numClients} client(s)`);

    if (numClients === 0) {
      socket.join(room);
      log(`Client ID ${socket.id} created room ${room}`);
      socket.emit('created', room, socket.id);
    } else if (numClients === 1) {
      log(`Client ID ${socket.id} joined room ${room}`);
      // io.sockets.in(room).emit('join', room);
      socket.join(room);
      socket.emit('joined', room, socket.id);
      io.sockets.in(room).emit('ready', room);
      socket.broadcast.emit('ready', room);
    } else {
      // max two clients
      socket.emit('full', room);
    }
  });

  socket.on('ipaddr', () => {
    const ifaces = os.networkInterfaces();
    for (const dev in ifaces) {
      ifaces[dev].forEach(details => {
        if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
          socket.emit('ipaddr', details.address);
        }
      });
    }
  });

  socket.on('disconnect', reason => {
    console.log(`Peer or server disconnected. Reason: ${reason}.`);
    socket.broadcast.emit('bye');
  });

  socket.on('bye', room => {
    console.log(`Peer said bye on room ${room}.`);
  });
});
// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';

// Start your app.
app.listen(port, host, async err => {
  if (err) {
    return logger.error(err.message);
  }

  // Connect to ngrok in dev mode
  if (ngrok) {
    let url;
    try {
      url = await ngrok.connect(port);
    } catch (e) {
      return logger.error(e);
    }
    logger.appStarted(port, prettyHost, url);
  } else {
    logger.appStarted(port, prettyHost);
  }
});
