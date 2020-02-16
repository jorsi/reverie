import * as events from 'events';

const emitter = new events.EventEmitter();
const messageQueue: {
  eventName: string,
  data?: any,
  cb?: () => void
}[] = [];

export function flush (): void {
  messageQueue.forEach((message) => {
    emitter.emit(message.eventName, message.data);
  });
  messageQueue.length = 0;
}

export function emit (eventName: string, data?: any, cb?: () => void): void {
  messageQueue.push({
    eventName: eventName,
    data: data,
    cb: cb
  });
}

export function emitSync (eventName: string, data?: any, cb?: () => void): void {
  emitter.emit(eventName, data, cb);
}

export function on (name: string, listener: (...options) => void) {
  emitter.on(name, listener);
}

// current issue:
// event emitter becomes massive after so many worlds are created
// since each world attaches a new event listener, instead of using
// the old one
