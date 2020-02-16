export function init (worldModel) {
  // createdAt = worldModel.createdAt;
  // cycle = worldModel.cycle;
  // scale = worldModel.scale;
  // seed = worldModel.seed;
  // x = worldModel.x;
  // y = worldModel.y;
  // z = worldModel.z;
  // center = worldModel.center;
  // regions = worldModel.regions;
  // regionSize = worldModel.regionSize;
  // chunkSize = worldModel.chunkSize;
  // lastEvent = Date.now();

  // // world data
  // entities = worldModel.entities;
  // debug = {
  //   cells: [],
  //   temperature: []
  // };
  // maps = {
  //   world: [],
  //   region: [],
  //   area: [],
  //   location: []
  // };
  // regions = worldModel.regions;

  // // register events
  // events.on('world/world', (wm) => onReceiveWorld(wm));
  // events.on('world/region', (region) => onReceiveRegion(region));
  // events.on('world/area', (area) => onReceiveArea(area));
  // events.on('world/location', (location) => onReceiveLocation(location));
  // events.on('debug/maps', (maps) => onReceiveDebugMaps(maps));
}

function cache(type, data) {
  switch (type) {
    case 'regions':
      // regions = data;
      break;
  }
}
function get(name) {
  switch (name) {
    case 'world':
      // return maps.world;
      break;
    case 'debug':
      // return debug.maps;
      break;
  }
}
function onReceiveDebugMaps(maps) {
  // debug.maps = maps;
}
function onReceiveWorld(wm) {
  // maps.world = wm;
}
function onReceiveRegion(region) {}
function onReceiveArea(area) {}
function onReceiveLocation(location) {}