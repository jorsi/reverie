/** Dependencies */
import ReverieElement from '../html/reverieElement';
import { default as WorldModel } from '../../common/models/world';
import { BIOMES } from '../../common/data/static/biomes';
import { html } from '../html/html';

export default class WorldOverview extends ReverieElement {
  canvas: HTMLCanvasElement = document.createElement('canvas');
  ctx: CanvasRenderingContext2D = this.canvas.getContext('2d')!;
  model: WorldModel;
  constructor  (model: WorldModel) {
    super();
    this.model = model;

    this.canvas.width = this.model.width;
    this.canvas.height = this.model.height;
  }
  connectedCallback () {
      super.connectedCallback();
  }

  render() {
    return html`
      <style>
        :host {
          position: absolute;
          z-index: 55;
          display: block;
          top: 0;
          right: 0;
          width: ${this.model.width}px;
          height: ${this.model.height}px;
        }
        canvas {
          display: inline-block;
          background-color: rgba(0,0,0,.6);
          width: 100%;
          height: 100%;
        }
      </style>
      `;
  }

  rendered = false;
  update (delta: number) {
    if (!this.rendered) {
      for (let y = 0; y < this.model.height; y++) {
        for (let x = 0; x < this.model.width; x++) {
          let location = this.model.map[x][y];
          if (!location.land) continue;

          let fill = `rgba(0,0,0,0)`;
          switch (location.biome) {
            case BIOMES.VOID:
              fill = `rgba(10,10,10,1)`;
              break;
            case BIOMES.TUNDRA:
              fill = `rgba(230,230,230,1)`;
              break;
            case BIOMES.DESERT:
              fill = `rgba(93,79,69,1)`;
              break;
            case BIOMES.FOREST:
              fill = `rgba(34,139,34,1)`;
              break;
            case BIOMES.GRASSLAND:
              fill = `rgba(124,252,0,1)`;
              break;
            case BIOMES.HEATHLAND:
              fill = `rgba(138,43,226,1)`;
              break;
            case BIOMES.SAVANNA:
              fill = `rgba(210,129,86,1)`;
              break;
            case BIOMES.MIRE:
              fill = `rgba(62,68,60,1)`;
              break;
            case BIOMES.RIVER:
              fill = `rgba(23,70,81,1)`;
              break;
            case BIOMES.LAKE:
              fill = `rgba(104,120,201,1)`;
              break;
            case BIOMES.SEA:
              fill = `rgba(0,105,148,1)`;
              break;
            case BIOMES.HILLS:
              fill = `rgba(102,204,0,1)`;
              break;
            case BIOMES.MOUNTAINS:
              fill = `rgba(150,141,153,1)`;
              break;
          }
          this.ctx.fillStyle = fill;
          this.ctx.fillRect(x, y, 1, 1);
        }
      }
      this.rendered = true;
    }
  }
}
customElements.define('reverie-land-grid', WorldOverview);