// 3號：啟動畫面系統封裝
export function showSplash(imgUrl) {
    const splash = document.createElement('div');
    splash.id = 'ms-splash';
    splash.style.cssText = `position:fixed; inset:0; background:#000 url('${imgUrl}') center/cover; z-index:10000; transition:opacity 0.8s;`;
    document.body.appendChild(splash);

    window.addEventListener('load', () => {
        setTimeout(() => {
            splash.style.opacity = '0';
            setTimeout(() => splash.remove(), 800);
        }, 1000);
    });
}
