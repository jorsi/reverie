// sub-components
import Thought from './thought';

let template = document.createElement('template');
template.innerHTML = `
<style>
  :host {
    display: block;
    position: absolute;
    bottom: 1.5em;
    left: 0;
    font-family: "Courier New";
  }
</style>
`;
export default class Conscience extends HTMLElement {
  constructor () {
    super();
    let shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(template.content.cloneNode(true));
  }
  connectedCallback () {
    this.addEventListener('thought-finished', (e: Event) => {
      console.log(e);
      (<CustomEvent>e).detail.remove();
    });
  }
  print (text: string) {
    let t = new Thought(text);
    this.shadowRoot.appendChild(t);
  }
}
customElements.define('reverie-conscience', Conscience);
