import * as http from 'http';
import * as io from 'socket.io';
import * as events from './eventsModule';
import Packet from '../../common/data/net/packet';
import { Dictionary } from '../../common/types';

// create the node http server
const httpServer = http.createServer();

// attach socket server to http server
const socketServer = io(httpServer);

// start up http server
httpServer.listen(3000);

// setup socket connection
let sockets: Dictionary<SocketIO.Socket> = {};
socketServer.on('connection', (socket) => {
  sockets[socket.id] = socket;
  events.emit('network/connection', socket);
});
