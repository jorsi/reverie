
/** Services */
import ReverieElement from './html/reverieElement';
import { html } from './html/html';
import * as server from './reverieServer';

/** Components */
import './components/terminal';
import './components/conscience';

/** Data */
import MessagePacket from '../common/data/net/client/message';
import { default as ServerMessagePacket } from '../common/data/net/client/message';
import ClientEntityPacket from '../common/data/net/server/clientEntity';
import Terminal from './components/terminal';

export default class Reverie extends ReverieElement {
    static TICKS_PER_SECOND = 30;
    static TICK_MS = 1000 / Reverie.TICKS_PER_SECOND;
    state: any = {};
    client: any = {};
    lastUpdate: number = 0;
    ticks: number = 0;
    accumulator: number = 0;

    //region Attributes
    static get observedAttributes() {
      return ['running'];
    }
    get running(): boolean {
        return this.hasAttribute('running');
    }
    set running(val: boolean) {
        if (val) {
            this.setAttribute('running', '');
        } else {
            this.removeAttribute('running');
        }
    }
    get connected(): boolean {
        return this.hasAttribute('running');
    }
    set connected(val: boolean) {
        if (val) {
            this.setAttribute('connected', '');
        } else {
            this.removeAttribute('connected');
        }
    }
    attributeChangedCallback (name: string, oldValue: string, newValue: string) {
        switch (name) {
            case 'running':
                if (this.running) {
                    this.lastUpdate = new Date().getTime();
                    this.update();
                }
                break;
        }
    }
    //endregion

    constructor () {
        super();
    }

    private testing = 'help';
    private testingAgain = 'again';
    private attribution = 'testtttttt';
    render () {
        return html`
            <style>
                :host {
                    display: block;
                    width: 100vw;
                    height: 100vh;
                    color: #f5f5f5;
                    background-color: #0a0a0a;
                }
            </style>
            <main>${ this.testing }</main>
            <div>${ this.testing }</div>
            <p>${ this.testingAgain }</p>
            <reverie-terminal testing="${ this.attribution }"></reverie-terminal>
            <button onclick="${ this.click }">Push!</button>
        `;
    }

    click() {
        console.log('hi!');
    }
    //region life-cycle
    connectedCallback () {
        super.connectedCallback();
        // register browser events
        this.setupBrowserEvents();
        this.setupServerEvents();
        this.setupChildEvents();
        this.running = true;
    }
    disconnectedCallback() {
        this.shadowRoot.querySelector('reverie-terminal').removeEventListener('terminal-message', this.onTerminalMessage);
    }
    //endregion

    //region Event Setup
    setupBrowserEvents () {
        window.addEventListener('keypress', this.onKeyPress.bind(this));
        window.addEventListener('keydown', this.onKeyDown.bind(this));
        window.addEventListener('keyup', this.onKeyUp.bind(this));
        window.addEventListener('mousedown', this.onMouseDown.bind(this));
        window.addEventListener('mouseup', this.onMouseUp.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        window.addEventListener('click', this.onClick.bind(this));
        window.addEventListener('dblclick', this.onDoubleClick.bind(this));
        window.addEventListener('wheel', this.onWheel.bind(this));
    }
    setupServerEvents () {
        // register server events
        server.on('connect', this.onConnect.bind(this));
        server.on('disconnect', this.onDisconnect.bind(this));
        server.on('client/entity', this.onClientEntity.bind(this));
        server.on('server/message', this.onServerMessage.bind(this));
    }
    setupChildEvents () {
        // listen to children
        this.shadowRoot.querySelector('reverie-terminal').addEventListener('terminal-message', this.onTerminalMessage);
    }
    //endregion

    //region Browser Events Handler
    onKeyPress (e: KeyboardEvent) {
        if (e.ctrlKey) {

        } else if (e.altKey) {
        } else if (e.metaKey) {
        } else if (e.keyCode === 13) {
            (<Terminal>this.shadowRoot.querySelector('reverie-terminal')).submit();
        } else if (e.key.length === 1) {
            this.shadowRoot.querySelector('reverie-terminal').setAttribute('key', e.key);
        } else {

        }
    }
    onKeyDown (e: KeyboardEvent) {}
    onKeyUp (e: KeyboardEvent) {}
    onMouseDown (e: MouseEvent) {}
    onMouseUp (e: MouseEvent) {}
    onMouseMove (e: MouseEvent) {}
    onClick (e: MouseEvent) {}
    onDoubleClick (e: MouseEvent) {}
    onWheel (e: WheelEvent) {}
    //endregion

    //region Server Event Handlers
    onConnect (s: SocketIOClient.Socket) {
        console.log('connected');
        this.client.connected = true;
        this.connected = true;
    }
    onDisconnect (s: SocketIOClient.Socket) {
        this.client.connected = false;
        this.connected = false;
    }
    onClientEntity (p: ClientEntityPacket) {
        this.client.entitySerial = p.serial
    }
    onServerMessage (p: ServerMessagePacket) {
        this.shadowRoot.querySelector('reverie-conscience').setAttribute('messages', p.message);
    }
    onTerminalMessage (e: Event) {
        server.send(new MessagePacket((<CustomEvent>e).detail));
    }
    //endregion
    update () {
        // timing
        this.ticks++;
        const now = new Date().getTime();
        const delta = now - this.lastUpdate;
        this.lastUpdate = now;

        if (this.ticks % 100 === 0) {
            console.log(`update >> delta: ${delta}ms, acc: ${this.accumulator}`);
        }

        // update state -- 30tps
        this.accumulator += delta;
        while (this.accumulator > Reverie.TICK_MS) {
            // this.state.current.update(delta);
            this.accumulator -= Reverie.TICK_MS;
        }

        // render
        // this.state.current.render(delta / Reverie.TICK_MS);

        // loop
        if (this.running) requestAnimationFrame(() => this.update());
        }
}
customElements.define('reverie-app', Reverie);
