/** Services */
import * as network from './modules/networkModule';
import * as events from './modules/eventsModule';

/** Modules */
import * as WorldModule from './modules/worldModule';

import Entity from '../common/models/entity';

import Packet from '../common/data/net/packet';
import MessagePacket from '../common/data/net/client/message';
import MovePacket from '../common/data/net/client/move';
import InteractPacket from '../common/data/net/client/interact';
import FocusPacket from '../common/data/net/client/focus';

import { DIRECTION } from '../common/data/static/direction';

export default class Client {
    socket: SocketIO.Socket;
    entity: Entity;
    state: any = {
        inWorld: false as boolean,
    };
    isInWorld: boolean = false;

    constructor (socket: SocketIO.Socket) {
        this.socket = socket;

        socket.on('client/message', (p: MessagePacket) => this.onMessage(p));
        socket.on('client/move', (p: MovePacket) => this.onMove(p));
        socket.on('client/interact', (p: InteractPacket) => this.onInteract(p));
        socket.on('client/focus', (p: FocusPacket) => this.onFocus(p));
    }

    send (packet: Packet) {
        this.socket.emit(packet.event, packet);
    }

    // incoming packets
    onMessage (p: MessagePacket) {
        console.log(p);
        if (p.message.length === 0) return;
        if (p.message.charAt(0) !== '/' && this.entity) {
            WorldModule.onEntityMessage(this.entity, p.message);
        } else {
            events.emit('client/message', this, p.message);
        }
    }
    /**
     * Moves client to a new position if possible and sends
     * new position information to client and all clients
     * in range. Also sends new region information if
     * client is approaching the edges of the region they
     * are currently in.
     * @param client The client requesting to move
     * @param data The direction of move
     */
    onMove (p: MovePacket) {
        let nextPosition = this.parsePosition(this.entity.x, this.entity.y, p.direction);

        // return if entity can't move to position
        // if (!nextPosition || !reverie.getWorld().canMoveToPosition(nextPosition.x, nextPosition.y)) return;

        // send new position to entity
        // client.entity.moveTo(nextPosition);
        // client.send('entity/move', client.entity);

        // // send new client position to clients in range
        // for (let serial in this.clients) {
        //   let to = this.clients[serial];
        //   if (to.serial !== client.serial
        //       && this.regions.isPositionInRegion(to.entity.position, client.entity.position)) {
        //     to.send('entity/move', client.entity);
        //   }
        // }

        // see if entity is moving close enough to a new region
        // let region = this.controller.getRegionAt(nextPosition.x, nextPosition.y);
        // client.send('world/region', nextPosition);
    }
    parsePosition (x: number, y: number, direction: DIRECTION) {
        switch (direction) {
            case DIRECTION.NORTH:
                y--;
                break;
            case DIRECTION.NORTH_EAST:
                x++;
                y--;
                break;
            case DIRECTION.EAST:
                x++;
                break;
            case DIRECTION.SOUTH_EAST:
                x++;
                y++;
                break;
            case DIRECTION.SOUTH:
                y++;
                break;
            case DIRECTION.SOUTH_WEST:
                x--;
                y++;
                break;
            case DIRECTION.WEST:
                x--;
                break;
            case DIRECTION.NORTH_WEST:
                x--;
                y--;
                break;
        }
        // let position = reverie.getWorld().getPosition(x, y);
        // return position;
    }
    onInteract (p: InteractPacket) {
        // get entity
        // get object entity wants to interact with
        // check if entity cna interact with it
        // if entity can, perform interaction with object
        // if entity can't, reject
    }
    onFocus (p: FocusPacket) {
        // get entity
        // get object entity wants to focus
        // check if entity can focus on object
        // return information if entity can focus on it
    }
}