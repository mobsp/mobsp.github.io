// beta/mod/theme-engine.js
export function initTheme() {
    const style = document.createElement('style');
    style.textContent = `
        :root { --accent: #00cec9; }
        body.ms-theme-1 {
            background: linear-gradient(135deg, #000 20%, #1a0b2e 50%, #000 80%) !important;
            background-size: 400% 400% !important;
            animation: ms-rainbow-flow 10s ease infinite !important;
            color: white; min-height: 100vh; margin: 0;
        }
        @keyframes ms-rainbow-flow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
    `;
    document.head.appendChild(style);
    document.body.classList.add('ms-theme-1');
}
