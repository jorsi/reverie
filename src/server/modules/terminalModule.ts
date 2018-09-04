import { Dictionary } from '../../common/types';

/**
 * Terminal Service
 * This provides small functionality for executing
 * commands while Reverie is running.
 */
let inputBuffer: (string | Buffer)[] = [];
if (process.stdin.isTTY) {
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (chunk) => {
        console.log(chunk);
        parseInput(chunk);
    });
}

function parseInput(chunk: string) {
    // sanitize chunk
    chunk = chunk.replace('\r', '');
    let params = chunk.split(' ');
    let command = params.shift();
    if (command && commands[command]) {
        commands[command].execute.apply(undefined, params);
    } else {
        console.log('There is no "' + command + '" command.');
        console.log('Available commands:');
        for (let name in commands) {
            console.log('    ' + name);
        }
    }
}

// start terminal
console.log('terminal started...');
export function clear () {
    console.clear();
}

/**
 * Command class for terminal.
 * Extending this class will register a new
 * command for the terminal to perform.
 */
export let commands: Dictionary<Command> = {};
export class Command {
    constructor(
        public name: string,
        public execute: () => void
    ) {
        commands[name] = this;
    }
}
