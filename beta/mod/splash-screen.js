// beta/mod/splash-screen.js
export function showSplash(imgUrl) {
    if (document.getElementById('ms-splash')) return;

    // 建立元素與樣式注入
    const splash = document.createElement('div');
    splash.id = 'ms-splash';
    const style = document.createElement('style');
    style.textContent = `
        #ms-splash {
            position: fixed; inset: 0;
            background: #000 url('${imgUrl}') center/cover no-repeat;
            z-index: 10000; display: flex; align-items: center; justify-content: center;
            transition: opacity 0.8s ease-out; opacity: 1;
        }
        #ms-splash::after {
            content: ""; width: 30px; height: 30px; 
            border: 3px solid rgba(255,255,255,0.2); border-top: 3px solid #00cec9;
            border-radius: 50%; animation: ms-spin 0.8s linear infinite;
        }
        @keyframes ms-spin { to { transform: rotate(360deg); } }
        .ms-hide { opacity: 0 !important; pointer-events: none; }
    `;
    document.head.appendChild(style);
    document.body.appendChild(splash);

    // 關閉邏輯
    const removeSplash = () => {
        splash.classList.add('ms-hide');
        setTimeout(() => splash.remove(), 850);
    };

    // 保險 1：網頁資源全數載入後關閉
    window.addEventListener('load', removeSplash);

    // 保險 2：3.5秒強制關閉 (防止卡死)
    setTimeout(() => {
        if (document.getElementById('ms-splash')) {
            console.log("[系統] 觸發啟動畫面強制退出");
            removeSplash();
        }
    }, 3500);
}
