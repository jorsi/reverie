// Reverie client
// Created by Jonathon Orsi
import './assets/base.css';
import io from 'socket.io-client';
import * as network from './network';
import * as inputManager from './inputManager';
import * as worldService from './world/worldService';
import * as renderer from './renderer/renderer';

// init socket.io and network
let socket = io(':3000');
network.init(socket);
inputManager.init();

const reverieContainer = document.querySelector('#reverie');
if (reverieContainer) {
  renderer.init(reverieContainer);
}
function update() {
  requestAnimationFrame(() => update());
}

update();
