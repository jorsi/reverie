/*
 * Reverie
 * an online browser-based simulation
 * created by Jonathon Orsi
 * July 17th, 2017
 *
 * */

const version = {
    major: 0,
    minor: 0,
    patch: 21
};

/** setup graceful shutdown when pressing Ctrl+C in terminal for windows */
import * as readline from 'readline';
if (process.platform === 'win32') {
    let rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on('SIGINT', function () {
        process.emit('SIGINT');
    });
}
process.on('SIGINT', function () {
    process.exit();
});

console.log(`
=====================================================================
ooooooooo.                                             o8o
888    Y88.                                            "
888   .d88'  .ooooo.  oooo    ooo  .ooooo.  oooo d8b oooo   .ooooo.
888ooo88P'  d88'  88b   88.  .8'  d88'  88b  888""8P  888  d88'  88b
888 88b.    888ooo888    88..8'   888ooo888  888      888  888ooo888
888   88b.  888    .o     888'    888    .o  888      888  888    .o
o888o  o888o  Y8bod8P'      8'      Y8bod8P' d888b    o888o  Y8bod8P'
=====================================================================
(v${version.major}.${version.minor}.${version.patch})`);
console.log('\n');

/** import and execute modules */
import './modules/eventsModule';
import * as EventsModule from './modules/eventsModule';
import './modules/networkModule';
import * as NetworkModule from './modules/networkModule';
import './modules/terminalModule';
import * as TerminalModule from './modules/terminalModule';
import './modules/worldModule';
import * as WorldModule from './modules/worldModule';

let isRunning = false;
let tps = 60;
let timePerTick = 1000 / tps;
let serverTicks = 0;
let accumulator = 0;
let deltas: number[] = [];
let startTime: Date = new Date();
let lastUpdate = startTime.getTime();
let reverieLoop: NodeJS.Timer;

/** main update loop for server */
function update() {
    // update times
    serverTicks++;
    const now = new Date().getTime();
    const delta = now - lastUpdate;
    lastUpdate = now;

    // process server timers
    // timers.process(delta);

    // process events queue
    EventsModule.process();

    // update modules
    if (WorldModule.model) {
        accumulator += delta;
        while (accumulator >= timePerTick) {
            WorldModule.update(timePerTick);
            accumulator -= timePerTick;
        }
    }

    // asynchronous loop
    if (isRunning) {
        reverieLoop = setTimeout(() => update(), timePerTick);
    } else {
        // cleanup before exiting?
        // this.exit();
    }
}

isRunning = true;
update();
console.log(`Reverie started on ${startTime.toLocaleDateString()}...`);
