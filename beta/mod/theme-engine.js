// 1號：五彩斑斕黑背景系統封裝
export function initTheme() {
    const style = document.createElement('style');
    style.textContent = `
        :root { --accent-color: #00cec9; }
        body.theme-1 {
            background: linear-gradient(135deg, #000 20%, #1a0b2e 50%, #000 80%);
            background-size: 400% 400%;
            animation: rainbow-flow 8s ease infinite;
        }
        @keyframes rainbow-flow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
    `;
    document.head.appendChild(style);
    document.body.classList.add('theme-1');
}
