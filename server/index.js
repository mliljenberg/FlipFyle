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
server.listen(8081);
const io = require('socket.io')(server, { origins: '*:*' });


// If you need a backend, e.g. an API, add your custom backend-specific middleware here
// app.use('/api', myApi);

// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';
console.log(host, ' : ', port);

// Start your app.
server.listen(port, host, async err => {
  if (err) {
    console.log(port);
    return logger.error(err.message);
  }

  io.sockets.on('connection', socket => {
    // convenience function to log server messages on the client
    console.log('you got to the connection stage...');
    function log(data) {
      socket.emit('log', data);
    }

    socket.on('message', (message, room) => {
      log('Client said: ', message);
      io.to(room).emit('message', message);
    });
    socket.on('error', error => {
      log(`Error recived ${error}`);
      // TODO: Implement logging for each error.
    });
    socket.on('loging', logJson => {
      log(`Error recived ${logJson}`);
      // TODO: Implement logging possibly with mongo db?
    });
    socket.on('create or join', roomId => {
      let room = roomId;
      log(`Received request to create or join room ${room}`);
      if (room === -1) {
        const id = crypto.randomBytes(3).toString('hex');
        room = id;
      }
      // TODO: Make sure a third person can't join a excisting room.

      const clientsInRoom = io.sockets.adapter.rooms[room];
      const numClients = clientsInRoom
        ? Object.keys(clientsInRoom.sockets).length
        : 0;
      console.log(`Room ${room} now has ${numClients} client(s)`);

      if (numClients === 0) {
        socket.join(room);
        log(`Client ID ${socket.id} created room ${room}`);
        socket.emit('created', room, socket.id);
      } else if (numClients === 1) {
        log(`Client ID ${socket.id} joined room ${room}`);
        socket.emit('joined', room);
        socket.join(room);
        // socket.emit('joined', room, socket.id);
        io.to(room).emit('ready', room);
        // socket.broadcast.emit('ready', room);
      } else {
        // max two clients
        socket.emit('full', room);
      }
    });

    socket.on('disconnect', (reason, room) => {
      console.log(`Peer or server disconnected. Reason: ${reason}.`);
      io.to(room).emit('bye');
    });

    socket.on('bye', room => {
      console.log(`Peer said bye on room ${room}.`);
    });
  });

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
