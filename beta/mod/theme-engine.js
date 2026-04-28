/* Zenith-Ultimate Production Engine (Standard Version) */
window.SystemData = {
    fetch: async (url, options = {}, retries = 3) => {
        try {
            const response = await fetch(url, options);
            if (!response.ok) throw new Error('Network Error');
            return response;
        } catch (err) {
            if (retries > 0) return window.SystemData.fetch(url, options, retries - 1);
            throw err;
        }
    }
};

window.initTheme = function() {
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
};

window.initSecurity = function() {
    if (window.location.hostname !== 'localhost' && window.location.protocol !== 'file:') {
        window.oncontextmenu = () => false;
        setInterval(() => { debugger; }, 5000);
    }
};
