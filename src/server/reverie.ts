import * as network from './modules/networkModule';
import * as events from './modules/eventsModule';

import * as WorldModule from './modules/worldModule';

import Client from './client';
import WorldDataPacket from '../common/data/net/server/worldData';
import WorldDestroyPacket from '../common/data/net/server/worldDestroy';
import MessagePacket from '../common/data/net/server/serverMessage';
import ClientEntityPacket from '../common/data/net/server/clientEntity';
import { Dictionary } from '../common/types';

export interface ReverieConfiguration {}
export const __rootdir = __dirname;
export const clients: Dictionary<Client> = {};

/** ends the program */
export function exit() {
    process.exit();
}


/** network setup */
function onNetworkConnection (socket: SocketIO.Socket) {
    console.log(`reverie connection: ${socket.id}`);
    // add to client dictionary
    const client = clients[socket.id] = new Client(socket);

    // send world and entity if exists
    // let w = WorldModule.get();
    // if (w) {
    //     client.send(new WorldDataPacket(w));
    //     let entity = WorldModule.createEntity(client.socket.handshake.address);
    //     client.send(new ClientEntityPacket(entity.serial));
    // }
}

function onNetworkDisconnect (...args: any[]) {
    console.log(...args);
}

function onTerminalCommand (data: any) {
    // const entity = this.world.onNewClient();
    // this.socketEntities[entity.serial] = packet.socket.id;
    // packet.socket.send('world/playerEntity', new ServerPackets.PlayerEntity(entity));
}

/** client setup */
function onClientMessage (client: Client, message: string) {
    const words = message.split(' ');
    if (words.length === 0) return;
    const command = words.shift();

    switch (command) {
        case '/create':
            if (!WorldModule.worldCreated) {
                if (words.length >= 3) {
                    const seed = words.shift();
                    if (!seed) return;
                    let width = words.shift();
                    if (!width || isNaN(parseInt(width))) return;
                    let w = parseInt(width);
                    let height = words.shift();
                    if (!height || isNaN(parseInt(height))) return;
                    let h = parseInt(height);

                    let model = WorldModule.create(seed, w, h);
                    client.send(new MessagePacket('You are filled with imagination.'));

                    // create entities for all connected clients
                    for (let serial in clients) {
                        let c = clients[serial];
                        let entity = WorldModule.createEntity(c.socket.handshake.address);
                        c.send(new ClientEntityPacket(entity.serial));
                    }

                    // broadcast new world to all clients
                    // events.emit('reverie/create', new WorldDataPacket(model));
                } else {
                    client.send(new MessagePacket('You can\'t seem to picture anything.'));
                }
            } else {
                client.send(new MessagePacket('You feel a longing for more.'));
            }
        break;
        case '/destroy':
            if (WorldModule.worldCreated) {
                WorldModule.destroy();
                client.send(new MessagePacket('Your mind has become blank.'));

                // broadcast destroy world to all clients
                events.emit('reverie/destroy', new WorldDestroyPacket());
            } else {
                client.send(new MessagePacket('You seem perplexed.'));
            }
            break;
        default:
            // send to other clients
            for (let serial in clients) {
                // if (serial === client.socket.id) continue;
                let c = clients[serial];
                c.send(new MessagePacket(`A voice echoes in the distance... "${message}"`));
            }
            break;
    }
}

/** register events */
events.on('network/connection', (socket: SocketIO.Socket) => onNetworkConnection(socket));
events.on('network/disconnect', (data: any) => onNetworkDisconnect(data));
events.on('terminal/command', (data) => onTerminalCommand(data));

