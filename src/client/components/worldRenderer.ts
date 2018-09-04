import Point2D from '../../common/data/point2d';
import Point3D from '../../common/data/point3d';
import WorldLocation from '../../common/models/location';

export default class WorldRenderer {
  elapsedTime = 0;
  top = 0;
  left = 0;
  width: number;
  height: number;
  originPixel: Point2D = new Point2D(0, 0);
  originWorld: Point3D = new Point3D(0, 0, 0);
  BLOCK_SIZE = 32;
  REGION_SIZE = this.BLOCK_SIZE * 32;
  constructor (width: number, height: number) {
    this.width = width;
    this.height = height;
    this.originPixel.x = width / 2;
    this.originPixel.y = height / 2;
  }
  update (delta: number) {
    this.elapsedTime += delta;

    // update origin of client location
    // let entity = this.controller.getClientEntity();
    // if (entity) this.setWorldOrigin(entity.currentX, entity.currentY, entity.currentZ);
  }
  setWorldOrigin (x: number, y: number, z: number) {
    this.originWorld.x = x;
    this.originWorld.y = y;
    this.originWorld.z = z;
  }
  setPixelOrigin (x: number, y: number) {
    this.originPixel.x = x;
    this.originPixel.y = y;
  }
  mapWorldLocationToPixel (x: number, y: number, z: number) {
    let pixelX = (x - this.originWorld.x) * this.getTileSize()
                - (y - this.originWorld.y) * this.getTileSize()
                + this.originPixel.x;
    let pixelY = (y - this.originWorld.y) * (this.getTileSize() / 2)
                + (x - this.originWorld.x) * (this.getTileSize() / 2)
                - (z - this.originWorld.z) * (this.getTileSize() / 4)
                + this.originPixel.y;
    return new Point2D(pixelX, pixelY);
  }
  mapRegionToPixel (x: number, y: number, z: number) {
    let pixelX = (x - this.originWorld.x) * this.REGION_SIZE
                + (y - this.originWorld.y) * this.REGION_SIZE
                + this.originPixel.x;
    let pixelY = (y - this.originWorld.y) * (this.REGION_SIZE / 2)
                - (x - this.originWorld.x) * (this.REGION_SIZE / 2)
                - (z - this.originWorld.z) * (this.REGION_SIZE / 2)
                + this.originPixel.y;
    return new Point2D(pixelX, pixelY);
  }
  mapPixelToWorldLocation (x: number, y: number) {
    let worldX = Math.floor(x / this.getTileSize());
    let worldY = Math.floor(y / this.getTileSize());
    return {
      x: worldX,
      y: worldY
    };
  }
  getTileSize () {
    return this.BLOCK_SIZE;
  }
  setSize (width: number, height: number) {
    let deltaX = this.width - width;
    let deltaY = this.height - height;
    this.width = width;
    this.height = height;
    this.originPixel.x = this.originPixel.x - (deltaX / 2);
    this.originPixel.y = this.originPixel.y - (deltaY / 2);
  }
  isOnScreen (x: number, y: number, z: number) {
    let point = this.mapWorldLocationToPixel(x, y, z);
    // takes canvas positions and sees whether it's in view
    return  point.x + this.getTileSize() >= 0
            && point.x - this.getTileSize() <= this.width
            && point.y + this.getTileSize() >= 0
            && point.y - this.getTileSize() <= this.height;
  }
  isObscured (bx: number, by: number, bz: number, maxX: number, maxY: number, maxZ: number, position: any) {
    // check if there are any blocks directly
    // infront of this from the viewport perspective
    let offsetX = bx + 1;
    let offsetY = by + 1;
    let offsetZ = bz + 1;
    let viewportVisible = true;
    for (let i = 0; offsetX < maxX && offsetY < maxY && offsetZ < maxZ; i++) {
      let block = position[offsetX][offsetY][offsetZ].block;
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
    let neighbourX = bx + 1;
    let neighbourY = by + 1;
    let neighbourZ = bz + 1;
    let faceVisible = true;
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
  getMapLocation (x: number, y: number) {
    // for (let serial in this.locations) {
    //   let location = this.locations[serial];
    //   if (location.x === x && location.y === y) return location;
    // }
  }
}