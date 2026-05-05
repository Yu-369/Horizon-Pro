class M3Switch extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._pressed = false;
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
          --_track-width: 42px;
          --_track-height: 24px;
          --_thumb-size: 18px;
          --_track-shape: 12px;
          --_thumb-shape: 9px;
        }
        .switch-container {
          position: relative; display: inline-flex; align-items: center;
          cursor: pointer; outline: none; -webkit-tap-highlight-color: transparent;
          user-select: none;
        }
        .track {
          position: relative; width: var(--_track-width); height: var(--_track-height);
          border-radius: var(--_track-shape); background-color: #1d1b20;
          opacity: 0.38; transition: background-color 0.2s, opacity 0.2s; overflow: hidden;
        }
        .switch-container.checked .track { background-color: #ff000dff; opacity: 1; }
        .thumb {
          position: absolute; top: 3px; left: 3px; width: var(--_thumb-size); height: var(--_thumb-size);
          border-radius: var(--_thumb-shape); background-color: #e6e0e9;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
          transition: transform 0.2s cubic-bezier(0.2,0,0,1), background-color 0.2s;
          display: flex; align-items: center; justify-content: center; z-index: 1;
        }
        .switch-container.checked .thumb {
          transform: translateX(calc(var(--_track-width) - var(--_thumb-size) - 6px));
          background-color: #ffffff;
        }
        .switch-container.pressed .thumb { transform: scale(0.95); }
        .switch-container.checked.pressed .thumb {
          transform: translateX(calc(var(--_track-width) - var(--_thumb-size) - 6px)) scale(0.95);
        }
        .checkmark {
          width: 12px; height: 12px; color: #FF0000; opacity: 0; transform: scale(0);
          transition: opacity 0.2s, transform 0.2s;
        }
        .switch-container.checked .checkmark { opacity: 1; transform: scale(1); }
      </style>
      <div class="switch-container" role="switch" tabindex="0">
        <div class="track">
          <div class="thumb">
            <svg class="checkmark" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
            </svg>
          </div>
        </div>
      </div>
    `;

    this.container = this.shadowRoot.querySelector('.switch-container');

    this.container.addEventListener('click', (e) => {
      e.preventDefault();
      this.checked = !this.checked;
      this.dispatchEvent(new CustomEvent('switch-change', {
        bubbles: true, composed: true, detail: { checked: this.checked }
      }));
      this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    });

    this.container.addEventListener('mousedown', () => this.container.classList.add('pressed'));
    this.container.addEventListener('mouseup', () => this.container.classList.remove('pressed'));
    this.container.addEventListener('mouseleave', () => this.container.classList.remove('pressed'));
  }

  get checked() { return this.hasAttribute('checked'); }
  set checked(val) {
    if (val) this.setAttribute('checked', '');
    else this.removeAttribute('checked');
    this._updateUI();
  }

  connectedCallback() { this._updateUI(); }
  attributeChangedCallback() { this._updateUI(); }
  static get observedAttributes() { return ['checked']; }

  _updateUI() {
    if (this.checked) {
      this.container.classList.add('checked');
      this.container.setAttribute('aria-checked', 'true');
    } else {
      this.container.classList.remove('checked');
      this.container.setAttribute('aria-checked', 'false');
    }
  }
}
customElements.define('m3-switch', M3Switch);
