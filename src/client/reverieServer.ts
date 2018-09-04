import * as io from 'socket.io-client';
import Packet from '../common/data/net/packet';

export const server = io('/socket');
export function on (event: string, cb: (...args: any[]) => void) {
    server.on(event, cb);
}
export function send (packet: Packet) {
    server.emit(packet.event, packet);
}