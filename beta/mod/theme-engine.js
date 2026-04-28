/* Zenith-Ultimate Production Engine */

export const SystemData = {
    // 指數退避重試請求
    fetch: async (url, options = {}, retries = 3) => {
        try {
            const response = await fetch(url, options);
            if (!response.ok) throw new Error('Network Error');
            return response;
        } catch (err) {
            if (retries > 0) return SystemData.fetch(url, options, retries - 1);
            throw err;
        }
    }
};

export function initTheme() {
    const style = document.createElement('style');
    style.textContent = `
        :root { --accent: #00cec9; }
        body.zenith-active {
            background: linear-gradient(135deg, #000 20%, #120a1f 50%, #000 80%) !important;
            background-size: 400% 400% !important;
            animation: flow 12s ease infinite !important;
            color: white;
        }
        @keyframes flow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
    `;
    document.head.appendChild(style);
    document.body.classList.add('zenith-active');
}

export function initSecurity() {
    if (window.location.hostname !== 'localhost') {
        window.oncontextmenu = () => false; // 禁用右鍵
        setInterval(() => { debugger; }, 5000); // 基礎防偵錯
    }
}
