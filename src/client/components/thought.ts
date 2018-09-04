import ReverieElement from '../html/reverieElement';
import { html } from '../html/html';

export default class Thought extends ReverieElement {
  static DELAY: number = 5000;
  createdAt: number;
  constructor (public text: string) {
    super();
    this.createdAt = new Date().getTime();
  }
  connectedCallback () {
    super.connectedCallback();
    requestAnimationFrame(() => this.run());
  }

  render () {
    return html`
      <style>
        :host {
          display: block;
          margin-bottom: 4px;
          padding: 0 8px;
        }
      </style>
      <span>${this.text}</span>
    `;
  }
  run() {
    let now = new Date().getTime();
    let delta = now - this.createdAt;
    this.style.opacity = (1 - (delta / Thought.DELAY)).toString();
    if (now - this.createdAt > Thought.DELAY) {
      this.dispatchEvent(new CustomEvent('thought-finished', {
        bubbles: true,
        composed: true,
        detail: this
      }));
    } else {
      requestAnimationFrame(() => this.run());
    }
  }
}
customElements.define('reverie-thought', Thought);
