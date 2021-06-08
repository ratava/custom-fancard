export const LitElement = customElements.get('home-assistant-main')
  ? Object.getPrototypeOf(customElements.get('home-assistant-main'))
  : Object.getPrototypeOf(customElements.get('hui-view'));

export const { html } = LitElement.prototype;
export const { css } = LitElement.prototype;

class Card extends LitElement {
  static get properties() {
    return {
      hass: {},
      config: {},
    };
  }

  constructor() {
    super();
    this.speed = 'off';
  }

  render() {
    return html`
    <ha-card>
      <div class="card-header">${this.config.title}</div>
      <div class="content clear speed-${this.speed} ${this.theme}">
        <div class="button" light="toggle" @click="${this._changeLight}"></div>
        <div class="button" data-speed="off" @click="${this._changeSpeed}"></div>
        <div class="button" data-speed="low" @click="${this._changeSpeed}"></div>
        <div class="button" data-speed="medium" @click="${this._changeSpeed}"></div>
        <div class="button" data-speed="high" @click="${this._changeSpeed}"></div>
        <span light="toggle">Light</span>
        <span data-speed="off">Off</span>
        <span data-speed="low">Low</span>
        <span data-speed="medium">Medium</span>
        <span data-speed="high">High</span>
      </div>
    </ha-card>
    `;
  }

  _changeSpeed(e) {
    this.hass.callService('fan', 'set_speed', {
      entity_id: this.config.entity,
      speed: e.currentTarget.dataset.speed,
    });
    this.speed = e.currentTarget.dataset.speed;
  }

  _checkSpeed() {
    if (this.hass.states[this.config.entity].state === 'on') {
      this.speed = this.hass.states[this.config.entity].attributes.speed;
    } else {
      this.speed = this.hass.states[this.config.entity].state;
    }
  }

  _changeLight(e) {
    this.hass.callService('light', 'toggle', {
      entity_id: this.config.lightentity
    });
  } 

 updated() {
    this._checkSpeed();
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error('You need to define an entity');
    } else if (!config.title) {
      throw new Error('You need to define a title');
     } else if (!config.lightentity) {
      throw new Error('You need to define a Light Entity');  }
    try {
      if (config.theme === 'dark') { this.theme = 'dark'; }
    } catch {
      this.theme = 'light';
    }
    this.config = config;
  }

  getCardSize() {
    return 4;
  }

  static get styles() {
    return css`
      :host {
        box-sizing: border-box;
      }
      
      .clear:after {
        content: "";
        display: table;
        clear: both;
      }
      
      .hidden {
        display: none;
      }
      
      .content {
        padding: 0px 16px 16px
      }
      
      .button {
        display: block;
        position: relative;
        float: left;
        height: auto;
        width: 17%;
        margin-left: 5%;
        padding-bottom: 25%;
        background-repeat: none;
        height: auto;
        cursor: pointer;
        overflow: hidden;
        background-color: rgba(0, 0, 0, 0.5);
        mask-repeat: no-repeat;
        -webkit-mask-repeat: no-repeat;
      }
      
      .dark .button {
        background-color: rgba(255, 255, 255, 0.5);
      }
      
      .button:first-of-type {
        margin-left: 0;
      }
      
      div[light="toggle"] {
        mask-image: url('/local/community/custom-fancard/lightbulb.svg');
        -webkit-mask-image: url('/local/community/custom-fancard/lightbulb.svg');
      }
			
      div[data-speed="off"] {
        mask-image: url('/local/community/custom-fancard/off.svg');
        -webkit-mask-image: url('/local/community/custom-fancard/off.svg');
      }
      
      div[data-speed="low"] {
        mask-image: url('/local/community/custom-fancard/low.svg');
        -webkit-mask-image: url('/local/community/custom-fancard/low.svg');
      }
      
      div[data-speed="medium"] {
        mask-image: url('/local/community/custom-fancard/medium.svg');
        -webkit-mask-image: url('/local/community/custom-fancard/medium.svg');
      }
      
      div[data-speed="high"] {
        mask-image: url('/local/community/custom-fancard/high.svg');
        -webkit-mask-image: url('/local/community/custom-fancard/high.svg');
      }
      
      .light div[light="toggle"],
			.speed-off div[data-speed="off"],
      .speed-low div[data-speed="low"],
      .speed-medium div[data-speed="medium"],
      .speed-high div[data-speed="high"] {
        background-color: var(--accent-color);
      }
      
      .light div[light="toggle"],
			.speed-off span[data-speed="off"],
      .speed-low span[data-speed="low"],
      .speed-medium span[data-speed="medium"],
      .speed-high span[data-speed="high"] {
        font-weight: bold;
        opacity: 1;
      }
      
      span {
        display: block;
        text-align: center;
        font-size: 1rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 17%;
        margin-left: 5%;
        text-align: center;
        line-height: 20px;
        height: 20px;
        display: block;
        float: left;
        opacity: 0.7;
      }
      
      span:first-of-type {
        margin-left: 0;
      }
      `;
  }
}

customElements.define('custom-fancard', Card);

// entity: fan.ifan03
// lightentity: light.ifan03
// theme: dark
// title: Ceiling fan
// type: 'custom:custom-fancard'
