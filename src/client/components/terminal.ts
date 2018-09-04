let template = document.createElement('template');
template.innerHTML = `
<style>
  :host {
    display: block;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    line-height: 1em;
    font-family: 'Courier New';
    padding: 8px;
    whitespace: nowrap;
    overflow: hidden;
    box-sizing: border-box;
  }
</style>
<buffer></buffer>
`;

export default class Terminal extends HTMLElement {
  _historyIndex = -1;
  _history: string[] = [];
  _buffer = '';
  //region Attributes
  static get observedAttributes() {
    return ['key'];
  }
  get key (): string {
    return this.getAttribute('key')
  }
  set key (char: string) {
    this.setAttribute('key', char);
  }
  attributeChangedCallback (name: string, oldValue: string, newValue: string) {
    console.log('attribute change', name, oldValue, newValue);
    switch (name) {
        case 'key':
          if (this._buffer.length <= 100) {
            this._buffer += newValue;
            this.render();
          } 
          break;
    }
}
  //endregion
  constructor () {
    super();
    let shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(template.content.cloneNode(true));
  }
  connectedCallback () {}
  render() {
    console.log('render', this._buffer);
    this.shadowRoot.querySelector('buffer').textContent = this._buffer;
  }
  onKey (key: string) {
    if (key === 'ArrowUp') {
      this.prevHistory();
    }
    if (key === 'ArrowDown') {
      this.nextHistory();
    }
    if (key === 'Backspace') {
      this._buffer = this._buffer.slice(0, -1);
    }
    if (key === 'Enter') {
      this.submit();
    }
    if (key.length === 1 && this._buffer.length <= 100) {
      // limit of 100 characters
      this._buffer += key;
    }
  }
  prevHistory () {
    if (this._history.length > 0 && this._historyIndex < this._history.length - 1) {
      this._historyIndex++;
      this._buffer = this._history[this._historyIndex];
    }
  }
  nextHistory  () {
    if (this._history.length > 0 && this._historyIndex > -1) {
      this._historyIndex--;
      if (this._historyIndex === -1) {
        this._buffer = '';
      } else {
        this._buffer = this._history[this._historyIndex];
      }
    }
  }
  submit () {
    // check if input is not empty
    if (this._buffer !== '') {
      // update terminal history if it's not the same
      // as last input
      if (this._history[0] !== this._buffer) {
        this._history.unshift(this._buffer);
      }
      // history should old be 10 items long
      if (this._history.length > 10) {
        this._history.pop();
      }
      this._historyIndex = -1;

      // emit message event
      this.dispatchEvent(new CustomEvent('terminal-message', {
          detail: this._buffer
        })
      );

      this._buffer = '';
      this.render();
    }
  }
}
customElements.define('reverie-terminal', Terminal);
