/* eslint consistent-return:0 */

const express = require('express');
const logger = require('./logger');
const cors = require('cors');

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

function socketIdsInRoom(name) {
  console.log(io.sockets.adapter.rooms[name]);

  const room = io.sockets.adapter.rooms[name];
  // const socketIds = io.nsps['/'].adapter.rooms[name];

  if (room) {
    const socketIds = room.sockets;
    console.log(socketIds);
    const collection = [];
    for (const key in socketIds) {
      console.log(key);
      collection.push(key);
    }
    return collection;
  }
  return [];
}

io.on('connection', socket => {
  console.log('connection');
  socket.on('disconnect', () => {
    console.log('disconnect');
    if (socket.room) {
      const room = socket.room;
      io.to(room).emit('leave', socket.id);
      socket.leave(room);
    }
  });

  socket.on('join', (name, callback) => {
    console.log('join', name);
    const socketIds = socketIdsInRoom(name);
    console.log(socketIds);
    callback(socketIds);
    socket.join(name);
    socket.room = name;
  });

  socket.on('exchange', data => {
    console.log('exchange', data);
    data.from = socket.id;
    const to = io.sockets.connected[data.to];
    to.emit('exchange', data);
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
