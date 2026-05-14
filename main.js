class LottoGenerator extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    const wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'wrapper ticket');

    const header = document.createElement('div');
    header.setAttribute('class', 'ticket-header');
    header.innerHTML = `
      <div class="pools-logo">SINGAPORE POOLS</div>
      <div class="toto-title">TOTO</div>
      <div class="ticket-info">ORDINARY ENTRY</div>
    `;

    const button = document.createElement('button');
    button.textContent = '🎲 DRAW NUMBERS';
    button.addEventListener('click', () => {
      this.generateNumbers();
      this.fireBurst();
    });

    const numbersDiv = document.createElement('div');
    numbersDiv.setAttribute('class', 'numbers');

    const footer = document.createElement('div');
    footer.setAttribute('class', 'ticket-footer');
    footer.innerHTML = `
      <div>${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</div>
      <div class="barcode">|| ||| || |||| | ||| |||</div>
    `;

    const style = document.createElement('style');
    style.textContent = `
      :host {
        width: 100%;
        max-width: 450px;
        margin: 20px auto;
        display: block;
      }
      .ticket {
        background-color: #fff;
        color: #000;
        padding: 40px 30px;
        position: relative;
        box-shadow: 0 10px 40px rgba(0,0,0,0.15);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
        font-family: 'Courier New', Courier, monospace;
        border-radius: 4px;
      }
      /* Jagged edge effect */
      .ticket::before, .ticket::after {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        height: 10px;
        background-size: 20px 20px;
        background-repeat: repeat-x;
      }
      .ticket::before {
        top: -10px;
        background-image: radial-gradient(circle at 10px 15px, transparent 12px, #fff 13px);
      }
      .ticket::after {
        bottom: -10px;
        background-image: radial-gradient(circle at 10px -5px, transparent 12px, #fff 13px);
      }

      [data-theme="dark"] .ticket {
        background-color: #f8f8f8; /* Keep ticket light for authentic look even in dark mode */
      }

      .ticket-header {
        text-align: center;
        border-bottom: 2px dashed #ccc;
        width: 100%;
        padding-bottom: 15px;
      }
      .pools-logo {
        color: #e31b23;
        font-weight: 900;
        font-size: 1.2rem;
        letter-spacing: 1px;
      }
      .toto-title {
        font-size: 2.5rem;
        font-weight: 900;
        margin: 5px 0;
        color: #000;
      }
      .ticket-info {
        font-size: 0.9rem;
        color: #666;
      }

      .numbers {
        display: flex;
        flex-wrap: nowrap;
        justify-content: center;
        gap: 12px;
        margin: 20px 0;
        width: 100%;
      }
      .number {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 50px;
        height: 50px;
        border: 2px solid #000;
        font-size: 20px;
        font-weight: bold;
        background: transparent;
        opacity: 0;
        transform: translateY(10px);
        animation: printIn 0.3s forwards;
      }
      @keyframes printIn {
        to { opacity: 1; transform: translateY(0); }
      }

      button {
        padding: 12px 24px;
        background-color: #e31b23;
        color: white;
        border: none;
        border-radius: 8px;
        font-family: sans-serif;
        font-weight: bold;
        cursor: pointer;
        transition: transform 0.2s, background-color 0.2s;
        box-shadow: 0 4px 0 #9e1318;
      }
      button:hover {
        background-color: #c4181f;
        transform: translateY(-2px);
      }
      button:active {
        transform: translateY(2px);
        box-shadow: none;
      }

      .ticket-footer {
        width: 100%;
        text-align: center;
        border-top: 2px dashed #ccc;
        padding-top: 15px;
        font-size: 0.8rem;
        color: #666;
      }
      .barcode {
        font-size: 1.5rem;
        letter-spacing: -2px;
        margin-top: 10px;
        color: #000;
      }

      @media (max-width: 480px) {
        .number {
          width: 40px;
          height: 40px;
          font-size: 16px;
        }
        .numbers { gap: 8px; }
      }
    `;

    shadow.appendChild(style);
    shadow.appendChild(wrapper);
    wrapper.appendChild(header);
    wrapper.appendChild(numbersDiv);
    wrapper.appendChild(button);
    wrapper.appendChild(footer);

    this.numbersDiv = numbersDiv;
  }

  connectedCallback() {
    this.generateNumbers();
  }

  fireBurst() {
    const burstContainer = document.createElement('div');
    burstContainer.style.position = 'fixed';
    burstContainer.style.top = '0';
    burstContainer.style.left = '0';
    burstContainer.style.width = '100vw';
    burstContainer.style.height = '100vh';
    burstContainer.style.pointerEvents = 'none';
    burstContainer.style.zIndex = '9999';
    document.body.appendChild(burstContainer);

    const colors = ['#e31b23', '#ffd700', '#ff4500', '#ffffff'];
    for (let i = 0; i < 100; i++) {
      const particle = document.createElement('div');
      const size = Math.random() * 8 + 4;
      particle.style.position = 'absolute';
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.borderRadius = '2px';
      
      const startX = window.innerWidth / 2;
      const startY = window.innerHeight / 2;
      
      particle.style.left = `${startX}px`;
      particle.style.top = `${startY}px`;
      
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 15 + 5;
      const dx = Math.cos(angle) * velocity;
      const dy = Math.sin(angle) * velocity;
      
      burstContainer.appendChild(particle);
      
      let x = startX;
      let y = startY;
      let opacity = 1;
      let gravity = 0.2;
      let vY = dy;

      const animate = () => {
        x += dx;
        vY += gravity;
        y += vY;
        opacity -= 0.01;
        
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.opacity = opacity;
        
        if (opacity > 0) {
          requestAnimationFrame(animate);
        } else {
          particle.remove();
        }
      };
      requestAnimationFrame(animate);
    }

    setTimeout(() => burstContainer.remove(), 2500);
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

