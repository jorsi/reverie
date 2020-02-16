import * as fs from 'fs';
import * as path from 'path';
import * as events from './events';
import * as network from './network/network';
import * as worldService from './world/worldService';
import { iScript } from './data/iScript';
import config from '../../reverie.json';
import { World } from './world/world.model';

const scripts: Array<iScript> = [];
let exiting: boolean = false;
let serverTicks = 0;
let startTime: Date = new Date();
let lastUpdate: Date = new Date();
let lastOutputTime: Date = new Date();
let running: boolean = false;
let updateRate: number = 100;
let updateTimer: NodeJS.Timer | undefined;
let currentWorld: World | undefined;

// load scripts
// const scriptsDirectory = path.resolve(__dirname, '../scripts');
// console.log(`loading all scripts in ${scriptsDirectory}`);
// loadScripts(scriptsDirectory, 0);
// console.log(`finished loading ${scripts.length} scripts`);
// console.log(`\n\nReverie is now running...\n\n`);

network.init();

// setup events
events.on('message', (message) => {
  if (message = 'generate') {
    currentWorld = worldService.generate();
    network.broadcast('world/init', currentWorld);
  }
});

start();

function tick() {
  // update times
  const now = new Date();
  const delta = now.getTime() - lastUpdate.getTime();
  lastUpdate = now;

  // output to console every 10th second
  if (now.getTime() % 10000 === 0) {
    console.log(`server ticks ${serverTicks}`);
  }

  // process timer events

  // process queued events
  events.flush();

  // update if current world exists
  if (currentWorld) {
    worldService.update(currentWorld);
  }

  serverTicks++;

  // exit when closing
  if (running) {
    updateTimer = setTimeout(() => tick(), 1000.0 / updateRate);
  }
}

function start() {
  running = true;
  tick();
}

function stop() {
  running = false;
}

function loadScripts(dir: string, level: number): void {
  // indentation for subdirectories
  let indent = '  ';
  for (let i = 0; i < level; i++) {
    indent += indent;
  }

  const base = path.basename(dir);
  const stat = fs.lstatSync(dir);
  if (stat.isDirectory()) {
    // increase indent and read new sub dir
    console.log(`${indent}${base}/`);

    ++level;
    const files = fs.readdirSync(dir);
    for (let i = 0; i < files.length; i++) {
      loadScripts(path.join(dir, files[i]), level);
    }
  } else {
    // file found, check if javascript file
    if (path.extname(dir) === '.js') {
      console.log(`${indent}─ ${base}`);

      const script: iScript = {
        file: base
      };
      scripts.push(script);
      require(dir);
    }
  }
}