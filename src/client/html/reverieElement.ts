export default abstract class ReverieElement extends HTMLElement {
    private _hasStateChanage: boolean = false;
    private _shadow: ShadowRoot;
    static get observedAttributes () {
        return ['id'];
    }
    constructor () {
        super();
        this._shadow = this.attachShadow({mode: 'open'});
    }
    connectedCallback () {
        this._shadow.appendChild(this.render());
    }
    disconnectedCallback () {}
    adoptedCallback() {}
    attributeChangedCallback (name: string, oldValue: string, newValue: string) {}
    /**
     * Renders any changes to custom element if its state has changed.
     */
    abstract render (): Node;
}