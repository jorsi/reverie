import * as perlin from '../../common/utils/perlin';
import PRNG from '../../common/utils/prng';
import * as events from '../events';
import { World } from './world.model';
import Automaton from '../../common/utils/automaton';

// const WorldMap = require('../common/world/WorldMap');
// const Region = require('../common/world/RegionMap');
// const Area = require('../common/world/AreaMap');
// const Location = require('../common/world/LocationMap');
// const Entity = require('../common/entities/Entity');
// var Generator = require('./world/Generator');
// var RegionGenerator = require('./world/RegionGenerator');

const random = new PRNG(1);
let updating: boolean = false;
let tps: number;
let ticks: number = 0;
let tickTimes: Array<number> = [];
let startTime: Date = new Date();
let lastUpdate: Date = new Date();

export function generate() {
  const universe: World = {
    id: 1,
    maps: {},
    seed: 'asdf',
    x: 32,
    y: 32,
    z: 16
  };

  let sample = 32 / 2;
  perlin.seed(random.next());
  let temp = universe.maps.temperature = [];
  for (let x = 0; x < universe.x; x++) {
    temp.push([]);
    for (let y = 0; y < universe.y; y++) {
      temp[x].push([]);
      for (let z = 0; z < universe.z; z++) {
        let value = perlin.noise3d(x / sample, y / sample, z);
        value = value * 50;
        temp[x][y][z] = value;
      }
    }
  }
  universe.maps.cells = [];
  for (let i = 0; i < 5; i++) {
    let cells = new Automaton(32, 32);
    let cz = Math.floor(random.range(0, 32));
    let map = {
      z: cz,
      values: cells
    }
    universe.maps.cells.push(map);
  }

  return universe;
}

export function destroy() {
  // remove event stuff
}

export function update(world: World): void {
  updating = true;
  const now = new Date();

  // calculate average timing of last 10 ticks
  let totalTickTimes = 0;
  tickTimes.forEach(tickTime => {
    totalTickTimes += tickTime;
  });
  if (totalTickTimes > 1000) {
    tps = tickTimes.length;
    tickTimes.shift();
  }
  tickTimes.push(Math.round(now.getTime() - lastUpdate.getTime()));

  events.emit('update');

  ticks++;
  updating = false;
  lastUpdate = now;
}

export function print() {
  console.log(JSON.stringify(this));
}

// Universe.prototype.onClientConnection = function (client) {
//   // create entity for client
//   let entity = new Entity('spirit');

//   if (entity) {
//     // add entity to client
//     client.entity = entity;

//     let position = entity.getComponent('position');
//     position.x = 0; //Math.floor(Math.random() * x);
//     position.y = 0; //Math.floor(Math.random() * y);
//     position.z = 0;//Math.floor(Math.random() * z);

//     // add to entity list
//     entities.push(entity);

//     // send back client information
//     client.send('player/init', entity);
//     client.send('world/init', get('world'));
//   } else {
//     client.send('reverie/error', 'error creating entity for player');
//   }
// }
// Universe.prototype.onClientDisconnect = function (client) {
//   for (var i = 0; i < entities.length; i++) {
//       var entity = entities[i];
//       if (client.entity === entity) {
//         entities.splice(i, 1);
//         break;
//       }
//   }
// }
// Universe.prototype.onClientMessage = function (client, message) {
//   // find entity associated with client
//   let entity = client.entity;

//   if (entity) {
//     log.debug('received message "' + message + '" from entity with id #' + entity.id)
//   }
// }
// Universe.prototype.onClientMove = function (client, movement) {
//   // find entity associated with client
//   let entity = client.entity;

//   if (entity && entity['position']) {
//     log.debug('received move "' + movement.dir + '" from entity with id #' + entity.id);
//     switch (movement.dir) {
//       case 'north':
//         if (entity['position'].y > 0)
//           entity['position'].y--
//         break;
//       case 'northEast':
//         if (entity['position'].y > 0)
//           entity['position'].y--;
//         if (entity['position'].x < x)
//           entity['position'].x++;
//         break;
//       case 'east':
//         if (entity['position'].x < x)
//           entity['position'].x++;
//         break;
//       case 'southEast':
//         if (entity['position'].y < y)
//           entity['position'].y++;
//         if (entity['position'].x < x)
//           entity['position'].x++;
//         break;
//       case 'south':
//         if (entity['position'].y < y)
//           entity['position'].y++;
//         break;
//       case 'southWest':
//         if (entity['position'].y < y)
//           entity['position'].y++;
//         if (entity['position'].x > 0)
//           entity['position'].x--;
//         break;
//       case 'west':
//         if (entity['position'].x > 0)
//           entity['position'].x--;
//         break;
//       case 'northWest':
//         if (entity['position'].y > 0)
//           entity['position'].y--;
//         if (entity['position'].x > 0)
//           entity['position'].x--;
//         break;
//     }

//     client.send('player/update', entity);
//   }
// }
// Universe.prototype.onPlayerLevitate = function (client, levitate) {
//   // find entity associated with client
//   let entity = client.entity;

//   if (entity.type === 'spirit') {
//     log.debug('received levitate "' + levitate + '" from entity with id #' + entity.id)
//   }
// }


// Universe.prototype.stop = function () {
//   state.live = false;
// }
// Universe.prototype.start = function () {
//   state.live = true;
//   // reset lastCheck to now so that accumulator
//   // doesn't assume it should make up the time
//   // since the world was last running
//   time.lastCheck = new Date();
// }
// Universe.prototype.get = function (name, id) {
//   switch (name) {
//     case 'world':
//       return getWorldData();
//     case 'regions':
//       return getRegionData();
//     case 'entity':
//       let entity;
//       entities.forEach((e) => {
//         if (e.clientId === id) entity = e;
//       });
//       return entity;
//   }
// }
// Universe.prototype.getWorldData = function () {
//   var world = {
//     x: x,
//     y: y,
//     z: z,
//     seed: seed,
//     createdAt: createdAt,
//     cycle: cycle,
//     regions: regions.length,
//   };
//   return world;
// }
// Universe.prototype.getRegionData = function () {
//   let regions = [];

//   for (var i = 0; i < regions; i++) {
//     regions.push(regions[i]);
//   }

//   return regions;
// }

// Universe.prototype.generateWorldMap = function () {
//   let sample = 32 / 2;
//   perlin.seed(random.next());
//   let temp = maps.temperature = [];
//   for (let x = 0; x < 32; x++) {
//     temp.push([]);
//     for (let y = 0; y < 32; y++) {
//       temp[x].push([]);
//       for (let z = 0; z < 32; z++) {
//         value = perlin.noise3d(x / sample, y / sample, z);
//         value = value * 50;
//         temp[x][y][z] = value;
//       }
//     }
//   }
//   maps.cells = [];
//   for (let i = 0; i < 5; i++) {
//     let cells = new utils.automaton(32, 32, random);
//     let cz = Math.floor(random.range(0, 32));
//     let map = {
//       z: cz,
//       values: cells
//     }
//     maps.cells.push(map);
//   }
//   events.emit('network/broadcast', 'debug/maps', maps);
// }


// // OLD STUFF
// Universe.prototype.getWorld = function (scale) {
//   var sampleSize = scale;
//   var world = {
//     x: x / sampleSize,
//     y: y / sampleSize,
//     z: z / sampleSize,
//     center: {
//       x: Math.floor(x / sampleSize / 2),
//       y: Math.floor(y / sampleSize / 2),
//       z: Math.floor(z / sampleSize / 2)
//     },
//     sample: sampleSize,
//     regions: [],
//   };
//   // console.log(position.x, position.y, position.z);
//   // console.log(position.x - halfworld);

//   for (var x = 0; x < x / sampleSize; x++) {
//     world.regions.push([]);
//     for (var y = 0; y < y / sampleSize; y++) {
//       world.regions[x].push([])
//       for (var z = 0; z < z / sampleSize; z++) {
//         world.regions[x][y][z] = {};
//         world.regions[x][y][z].position = {
//             x: x,
//             y: y,
//             z: z
//         };
//         world.regions[x][y][z].block = getBlock(x * sampleSize, y * sampleSize, z * sampleSize);
//       }
//     }
//   }
//   // console.log(world);
//   return world;
// }
// Universe.prototype.getRegion = function (position) {
//   var halfRegion = regionSize / 2;
//   var region = {
//     chunks: []
//   };


//   // console.log(position.x, position.y, position.z);
//   // console.log(position.x - halfChunk);

//   for (var x = 0; x < regionSize; x++) {
//     region.chunks.push([]);
//     for (var y = 0; y < regionSize; y++) {
//       region.chunks[x].push([])
//       for (var z = 0; z < regionSize; z++) {
//         var regionX = x + position.x - halfRegion;
//         var regionY = y + position.y - halfRegion;
//         var regionZ = z + position.z - halfRegion;
//         var regionPosition = {
//           x: regionX,
//           y: regionY,
//           z: regionZ
//         }
//         region.chunks[x][y][z] = getChunk(regionPosition);
//       }
//     }
//   }
//   // console.log(chunk);
//   return region;
// }
// Universe.prototype.getChunk = function (position) {
//   var halfChunk = chunkSize / 2;
//   var chunk = [];


//   // console.log(position.x, position.y, position.z);
//   // console.log(position.x - halfChunk);

//   for (var x = 0; x < chunkSize; x++) {
//     chunk.push([]);
//     for (var y = 0; y < chunkSize; y++) {
//       chunk[x].push([])
//       for (var z = 0; z < chunkSize; z++) {
//         var blockX = x + position.x - halfChunk;
//         var blockY = y + position.y - halfChunk;
//         var blockZ = z + position.z - halfChunk;
//         chunk[x][y][z] = getBlock(blockX, blockY, blockZ);
//       }
//     }
//   }
//   // console.log(chunk);
//   return chunk;
// }
// Universe.prototype.getBlock = function (x, y, z) {
//   // Gather all information for particular location in world
//   var block;
//   if (x >= 0 && x < x && y >= 0 && y < y && z >= 0 && z < z)
//     block = maps.blocks[x][y][z];

//   // console.log(block);
//   return block;
// }

// Universe.prototype.entityAtLocation =  function (x, y, z) {
//   for (var i = 0; i < entities.length; i++) {
//     var entity = entities[i];
//     if (entity.components.Position.x === x &&
//         entity.components.Position.y === y &&
//         entity.components.Position.z === z) {
//           return entity;
//       }
//   }
// }
// Universe.prototype.getSurface = function (x, y) {
//   var z = 0;
//   for (var i = z; i > 0; i--) {
//     if (maps.earth[x][y][i] > 0) {
//       z = i;
//       break;
//     }
//   }
//   return z;
// }

// var BLOCKS = require('./world/BlockTypes');

// Universe.prototype.generate = function (options) {
//   options = options || {};
//   regionsMin = options.regionsMin || 10;
//   regionsMax = options.regionsMax || 27;
//   x = options.x || 1024;
//   y = options.y || 1024;
//   z = options.z || 256;

//   regions = RegionGenerator.create(this, regionsMin, regionsMax);

//   createdAt = Date.now();

//   events.emit('world', regions);

//   return this;
// }

// Universe.prototype.generateBlocks = function () {
//     var blocks = [];
//     var earth = maps.earth;
//     var wind = maps.wind;
//     var water = maps.water;
//     var fire = maps.fire;

//     for (var x = 0; x < x; x++) {
//       blocks.push([]);
//       for (var y = 0; y < y; y++) {
//         blocks[x].push([]);
//         for (var z = 0; z < z; z++) {

//           // debug
//           // if (x % 10 === 0) console.log(earth[x][y][z]);

//           var block = null;
//           if (earth[x][y][z] > 0) {
//             /* determine block from combination of wind, water, and fire */
//             // if (wind[x][y][z] === 1 && water[x][y][z] === 1 && fire[x][y][z] === 1) block = BLOCKS.GRASS;
//             // else if (wind[x][y][z] === 1 && water[x][y][z] !== 1 && fire[x][y][z] === 1) block = BLOCKS.SOIL;
//             // else if (wind[x][y][z] === 1 && water[x][y][z] !== 1 && fire[x][y][z] !== 1) block = BLOCKS.ROCK;
//             // else if (wind[x][y][z] !== 1 && water[x][y][z] === 1 && fire[x][y][z] === 1) block = BLOCKS.WATER;
//             // else if (wind[x][y][z] !== 1 && water[x][y][z] !== 1 && fire[x][y][z] === 1) block = BLOCKS.FIRE;
//             // else if (wind[x][y][z] !== 1 && water[x][y][z] !== 1 && fire[x][y][z] !== 1) block = BLOCKS.GOLD;
//             // else block = BLOCKS.ROCK;

//             if (z > z * 0.1 && z < z * 0.9 && z == getSurface(x,y)) block = BLOCKS.GRASS;
//             else if (earth[x][y][z] < 0.4) block = BLOCKS.SOIL;
//             else if (earth[x][y][z] < 0.6) block = BLOCKS.ROCK;
//             else if (earth[x][y][z] < 0.8) block = BLOCKS.METAL;
//             else block = BLOCKS.CORE;
//           }
//           blocks[x][y][z] = block;
//           // debug
//           // if (blocks[x][y][z] !== null) console.log(blocks[x][y][z]);
//         }
//       }
//     }

//     return blocks;
// }
