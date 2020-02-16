import io from 'socket.io';
import SocketClient from './SocketClient';
import * as events from '../events';

const clients: Array<SocketClient> = [];
let socketIO: SocketIO.Server;

export function broadcast(event, data) {
  console.log('broadcasting', event);
  socketIO.emit(event, data);
}

export function multicast(clientIds: number[], event, data) {
  clientIds.forEach(function (id) {
    clients[id].socket.send(event, data);
  });
}

export function send(clientId, event, data) {
  clients[clientId].socket.send(event, data);

}

export function init() {
  // create socket.io server
  socketIO = io(3000, {
    serveClient: false
  });

  // listen for new client socket connections
  socketIO.on('connection', (socket) => {
    const client = new SocketClient(socket);
    clients.push(client);

    // register received events from socket
    socket.on('disconnect', () => onDisconnect());
    socket.on('player/message', (message) => onMessage(message));
    socket.on('player/move', (movement) => onMove(movement));
    socket.on('player/inspect', (message) => onInspect(message));
    socket.on('player/interact', (message) => onInteract(message));
    socket.on('player/levitate', (levitate) => onPlayerLevitate(levitate));
    socket.on('world/world', (wm) => onReceiveWorldMap(wm));
  });

  // emit network initialized
  events.emit('network/initialized');
}

function onConnection() {
  // client has connected to the server
  // events.emit('client/connection', this);
}
function onDisconnect() {
  console.log(`Client disconnected ${this}`);
  // client has disconnected from the server
  // events.emit('client/disconnect', this);
}
function onReceive() { }

/**
 * Sent from client terminal
 * @param message text
 */
function onMessage(message) {
  events.emit('message', message);
}
function onMove(movement) {
  // move is message sent when a client
  // holds down the right mouse button
  events.emit('client/move', this, movement);
}
function onInspect(message) {
  // inspect is a message sent when a client
  // single clicks left mouse button
  events.emit('client/inspect', this, message);
}
function onInteract(message) {
  // interact is a message sent when a client
  // double clicks left mouse button
  events.emit('client/interact', this, message);
}
function onPlayerLevitate(levitate) {
  // interact is a message sent when a client
  // double clicks left mouse button
  events.emit('player/levitate', this, levitate);
}
function onReceiveWorldMap(wm) {
  // world map sent by server
  events.emit('world/world', this, wm);
}