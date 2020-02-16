let view;
let buffer;
let element;
let canvas;
let ctx;
var lastRender = new Date();
var delta = 0;
var worldLoaded = false;
let top = 0;
let left = 0;
let offset = {
  x: 0,
  y: 0
};
let zoom = 1;
let minSize = 12;
let blockSize = 32;
let center;

export function init(container) {
  view = createView(window.innerWidth, window.innerHeight);
  canvas = createCanvas();
  buffer = createCanvas();
  container.appendChild(canvas);
}

export function get(type) {
  switch (type) {
    case 'view':
      return view;
    case 'canvas':
      return canvas;
    case 'buffer':
      return buffer;
    case 'delta':
      return delta;
  }
}

export function move(x, y) {
  // move offset relative to scale size
  // so that it doesn't become slow when
  // zoomed in
  view.offset.x -= Math.floor(x * view.zoom * view.minSize / 2);
  view.offset.y -= Math.floor(y * view.zoom * view.minSize / 2);
}

export function resize() {
  view.width = buffer.element.width = canvas.element.width = window.innerWidth;
  view.height = buffer.element.height = canvas.element.height = window.innerHeight;

  view.center.x = Math.floor(view.width / 2);
  view.center.y = Math.floor(view.height / 2);
}

export function render(state) {
  var now = new Date();
  delta = now.getTime() - lastRender.getTime();
  lastRender = now;

  // clear buffer and canvas
  buffer.clear();
  canvas.clear();

  // draw to buffer
  if (state.world) {
    buffer.drawWorldMap(state.world);
  }
  if (state.regions) {
    for (let region of state.regions) {
      region.render(buffer.ctx, view);
    }
  }
  if (state.entity) {
    view.follow(state.entity['position'].x, state.entity['position'].y, state.entity['position'].z);
    buffer.drawPlayerEntity(state.entity);
  }
  if (state.entities) {
    state.entities.forEach(function (entity) {
      entity.render(buffer.ctx, view);
    });
  }
  if (state.debug) {
    // console.log(state.debug.cells)
    if (state.debug) buffer.drawDebugMaps(state.debug)
  }

  // switch to canvas
  swap();
}

function createCanvas() {
  element = document.createElement('canvas');
  element.width = window.innerWidth;
  element.height = window.innerHeight;
  ctx = element.getContext('2d');
  return element;
}

function clear() {
  ctx.clearRect(0, 0, element.width, element.height);
}

function drawPlayerEntity(entity) {
  let canvasPosition = view.worldToCanvas(
    entity['position'].x,
    entity['position'].y,
    entity['position'].z
  );
  let widthOffset = entity['transform'].width / 2;
  ctx.fillStyle = 'rgba(150,150,200,.8)';
  ctx.fillRect(
    canvasPosition.x - view.offset.x - widthOffset,
    canvasPosition.y - view.offset.y - entity['transform'].height,
    entity['transform'].width,
    entity['transform'].height
  );
}

function drawEntities(entities) {
  for (let e of entities) {
    let canvasPosition = view.worldToCanvas(
      e['position'].x,
      e['position'].y,
      e['position'].z
    );
    let widthOffset = e['transform'].width / 2;
    ctx.fillStyle = 'rgba(150,150,200,.8)';
    ctx.fillRect(
      canvasPosition.x - view.offset.x - widthOffset,
      canvasPosition.y - view.offset.y - e['transform'].height,
      e['transform'].width,
      e['transform'].height
    );
  }
}

function drawDebugMaps(maps) {
  for (let x = 0; x < 32; x++) {
    for (let y = 0; y < 32; y++) {
      for (let z = 0; z < 32; z++) {
        let canvasPosition = view.worldToCanvas(x, y, z);
        canvasPosition.x -= view.offset.x;
        canvasPosition.y -= view.offset.y;

        let cellMap;
        for (let i = 0; i < maps.cells.length; i++) {
          if (maps.cells[i].z === z) cellMap = maps.cells[i];
        }
        if (view.isOnScreen(canvasPosition.x, canvasPosition.y) && cellMap && cellMap.values[x][y]) {
          let val = maps.temperature[x][y][z];
          let color;
          if (val < 0) color = 'rgba(0, 0, 255, ' + Math.abs(val) / 50 + ')';
          if (val >= 0) color = 'rgba(255, 0, 0, ' + val / 50 + ')';
          ctx.fillStyle = color;

          // console.log(color);
          // console.log(x, y, z);
          // draw bottom face
          ctx.beginPath();
          ctx.moveTo(canvasPosition.x, canvasPosition.y);
          ctx.lineTo(canvasPosition.x - view.blockSize / 2, canvasPosition.y - view.blockSize / 4);
          ctx.lineTo(canvasPosition.x, canvasPosition.y - (view.blockSize / 2));
          ctx.lineTo(canvasPosition.x + view.blockSize / 2, canvasPosition.y - view.blockSize / 4);
          ctx.closePath();
          ctx.fill();
        }
      }
    }
  }
}

function drawCellMap(cells) {
  let mx, my, mz = 32;
  for (let i = 0; i < 10; i++) {
    for (let x = 0; x < mx; x++) {
      for (let y = 0; y < my; y++) {
        let canvasPosition = view.worldToCanvas(x, y, cells[i].z);
        canvasPosition.x -= view.offset.x;
        canvasPosition.y -= view.offset.y;
        if (view.isOnScreen(canvasPosition.x, canvasPosition.y) && cells[i].values[x][y]) {
          ctx.fillStyle = 'rgba(255,255,255,.5)';

          // console.log(color);
          // console.log(x, y, z);
          // draw bottom face
          ctx.beginPath();
          ctx.moveTo(canvasPosition.x, canvasPosition.y);
          ctx.lineTo(canvasPosition.x - view.blockSize / 2, canvasPosition.y - view.blockSize / 4);
          ctx.lineTo(canvasPosition.x, canvasPosition.y - (view.blockSize / 2));
          ctx.lineTo(canvasPosition.x + view.blockSize / 2, canvasPosition.y - view.blockSize / 4);
          ctx.closePath();
          ctx.fill();
        }
      }
    }
  }
}

function drawWorldMap(wm) {
  let mx, my, mz = wm.length;
  for (let x = 0; x < mx; x++) {
    for (let y = 0; y < my; y++) {
      for (let z = 0; z < mz; z++) {
        let canvasPosition = view.worldToCanvas(x, y, z);
        canvasPosition.x -= view.offset.x;
        canvasPosition.y -= view.offset.y;
        if (
          view.isOnScreen(canvasPosition.x, canvasPosition.y)
          && (z == mx - 1 || y == mx - 1 || x == mx - 1) // if any position is toward cam
        ) {
          let val = wm[x][y][z];
          let color;
          if (val < 0) color = 'rgba(0, 0, 255, ' + Math.abs(val) / 50 + ')';
          if (val >= 0) color = 'rgba(255, 0, 0, ' + val / 50 + ')';
          ctx.fillStyle = color;

          // console.log(color);
          // console.log(x, y, z);
          // draw bottom face
          ctx.beginPath();
          ctx.moveTo(canvasPosition.x, canvasPosition.y);
          ctx.lineTo(canvasPosition.x - view.blockSize / 2, canvasPosition.y - view.blockSize / 4);
          ctx.lineTo(canvasPosition.x, canvasPosition.y - (view.blockSize / 2));
          ctx.lineTo(canvasPosition.x + view.blockSize / 2, canvasPosition.y - view.blockSize / 4);
          ctx.closePath();
          ctx.fill();
        }
      }
    }
  }
}

function createView(width, height) {
  top = 0;
  left = 0;
  center = {
    x: Math.floor(width / 2),
    y: Math.floor(height / 2)
  }
  offset = {
    x: 0,
    y: 0
  };
  zoom = 1;
  minSize = 12;
  blockSize = 32;
}

function follow(x, y, z) {
  let position = view.worldToCanvas(x, y, z);
  centerOn(position.x, position.y);
}

function centerOn(x, y) {
  offset.x = x - center.x;
  offset.y = y - center.y;
}

function isOnScreen(x, y) {
  // takes canvas positions and sees whether it's in view
  return x + view.blockSize >= view.left
    && x - view.blockSize <= view.left + view.width
    && y + view.blockSize >= view.top
    && y - view.blockSize <= view.top + view.height;
}

function isObscured(bx, by, bz, maxX, maxY, maxZ, position) {
  // check if there are any blocks directly
  // infront of this from the viewport perspective
  var offsetX = bx + 1;
  var offsetY = by + 1;
  var offsetZ = bz + 1;
  var viewportVisible = true;
  for (var i = 0; offsetX < maxX && offsetY < maxY && offsetZ < maxZ; i++) {
    var block = position[offsetX][offsetY][offsetZ].block;
    if (block !== null) {
      viewportVisible = false;
      break;
    }
    offsetX++;
    offsetY++;
    offsetZ++;
  }

  // check if all neighbours are covering
  // all of this blocks faces
  var neighbourX = bx + 1;
  var neighbourY = by + 1;
  var neighbourZ = bz + 1;
  var faceVisible = true;
  if (
    neighbourX < maxX &&
    neighbourY < maxY &&
    neighbourZ < maxZ &&
    position[neighbourX][by][bz].block !== null &&
    position[bx][neighbourY][bz].block !== null &&
    position[bx][by][neighbourZ].block !== null) {
    faceVisible = false;
  }

  // if (bx % 10 === 0 && by % 10 === 0 ) console.log(viewportVisible, faceVisible);
  return viewportVisible && faceVisible;
}

function worldToCanvas(wx, wy, wz) {
  var cx = ((wx - wy) * view.blockSize / 2);
  var cy = ((wy + wx) * view.blockSize / 4) - (wz * view.blockSize / 2);

  // if (position.x % 10 === 0 && position.y % 10 === 0) console.log(position, blockX, blockY, blockZ);
  return {
    x: cx,
    y: cy
  }
}

function canvasToWorld(canvasPosition) {
  // return world position in center of viewport
  var x = ((canvasPosition.x + canvasPosition.y) * 2 / view.blockSize);
  var y = ((canvasPosition.y - canvasPosition.x) * 4 / view.blockSize);

  // if (canvasPosition.x % 10 === 0 && canvasPosition.y % 10 === 0) console.log(x, y);
  return {
    x: Math.floor(x),
    y: Math.floor(y),
  }
}

function swap() {
  // cut the drawn rectangle
  var image = buffer.ctx.getImageData(view.left, view.top, view.width, view.height);
  // copy into visual canvas at different position
  canvas.ctx.putImageData(image, 0, 0);
}
