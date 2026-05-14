class LottoGenerator extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'wrapper');

    const button = document.createElement('button');
    button.textContent = '🎲 Generate New Numbers';
    button.addEventListener('click', () => this.generateNumbers());

    const numbersDiv = document.createElement('div');
    numbersDiv.setAttribute('class', 'numbers');

    const style = document.createElement('style');
    style.textContent = `
      :host {
        width: 100%;
        max-width: 500px;
        margin: 20px auto;
      }
      .wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 30px;
        padding: 40px;
        border: 1px solid var(--border-color);
        border-radius: 24px;
        background-color: var(--surface-color);
        box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1), 0 20px 60px -20px rgba(0,0,0,0.1);
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      }
      [data-theme="dark"] .wrapper {
        box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5), 0 20px 60px -20px rgba(0,0,0,0.3);
      }
      .numbers {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 15px;
        min-height: 60px;
      }
      .number {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--number-bg), var(--bg-color));
        border: 2px solid var(--border-color);
        color: var(--text-color);
        font-size: 24px;
        font-weight: 800;
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
        opacity: 0;
        transform: scale(0.5) translateY(20px);
        animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
      }
      @keyframes popIn {
        to {
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }
      button {
        padding: 16px 32px;
        border: none;
        border-radius: 16px;
        background-color: var(--accent-color);
        color: white;
        font-size: 18px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 15px var(--accent-color);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        align-items: center;
        gap: 8px;
      }
      button:hover {
        background-color: var(--accent-hover);
        transform: translateY(-2px);
        box-shadow: 0 8px 25px var(--accent-color);
      }
      button:active {
        transform: translateY(0);
      }
    `;

    shadow.appendChild(style);
    shadow.appendChild(wrapper);
    wrapper.appendChild(numbersDiv);
    wrapper.appendChild(button);

    this.numbersDiv = numbersDiv;
  }

  connectedCallback() {
    this.generateNumbers();
  }

  generateNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
      numbers.add(Math.floor(Math.random() * 49) + 1);
    }

    this.displayNumbers(Array.from(numbers).sort((a, b) => a - b));
  }

  displayNumbers(numbers) {
    this.numbersDiv.innerHTML = '';
    numbers.forEach((number, index) => {
      const numberDiv = document.createElement('div');
      numberDiv.setAttribute('class', 'number');
      numberDiv.style.animationDelay = `${index * 0.1}s`;
      numberDiv.textContent = number;
      this.numbersDiv.appendChild(numberDiv);
    });
  }
}

customElements.define('toto-generator', LottoGenerator);

class ThemeToggle extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.initTheme();
  }

  initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'system';
    this.applyTheme(savedTheme);
    this.shadowRoot.querySelector('select').value = savedTheme;

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (localStorage.getItem('theme') === 'system' || !localStorage.getItem('theme')) {
        this.applyTheme('system');
      }
    });
  }

  applyTheme(theme) {
    let effectiveTheme = theme;
    if (theme === 'system') {
      effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    if (effectiveTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  handleThemeChange(e) {
    const theme = e.target.value;
    localStorage.setItem('theme', theme);
    this.applyTheme(theme);
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          position: fixed;
          top: 20px;
          right: 20px;
        }
        select {
          padding: 8px 12px;
          border-radius: 20px;
          border: 1px solid var(--border-color);
          background-color: var(--surface-color);
          color: var(--text-color);
          font-family: inherit;
          cursor: pointer;
          outline: none;
          transition: all 0.3s;
        }
        select:hover {
          border-color: var(--accent-color);
        }
      </style>
      <select id="theme-select">
        <option value="light">☀️ Light</option>
        <option value="dark">🌙 Dark</option>
        <option value="system">💻 System</option>
      </select>
    `;

    this.shadowRoot.querySelector('select').addEventListener('change', (e) => this.handleThemeChange(e));
  }
}

customElements.define('theme-toggle', ThemeToggle);

