// 4號：固定底部導覽列系統封裝
export function initBottomNav() {
    const style = document.createElement('style');
    style.textContent = `
        .bottom-nav { 
            position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
            width: 100%; max-width: 500px; height: calc(60px + env(safe-area-inset-bottom));
            background: rgba(17, 17, 17, 0.95); backdrop-filter: blur(10px);
            border-top: 1px solid rgba(255,255,255,0.1);
            display: flex; justify-content: space-around; align-items: center;
            padding-bottom: env(safe-area-inset-bottom); z-index: 1000;
        }
        .nav-item { display: flex; flex-direction: column; align-items: center; color: #888; text-decoration: none; font-size: 10px; gap: 4px; transition: 0.3s; }
        .nav-item.active { color: #00cec9; }
        .nav-item i { font-size: 18px; }
        .nav-item:active { transform: scale(0.9); }
    `;
    document.head.appendChild(style);

    const nav = document.createElement('nav');
    nav.className = 'bottom-nav';
    nav.innerHTML = `
        <a href="#" class="nav-item active"><i class="fa-solid fa-house"></i><span>首頁</span></a>
        <a href="https://mobsp.github.io/music/" class="nav-item"><i class="fa-solid fa-music"></i><span>音樂</span></a>
        <a href="https://mobsp.github.io/shorts/" class="nav-item"><i class="fa-brands fa-youtube"></i><span>Shorts</span></a>
        <a href="https://mobsp.github.io/setting" class="nav-item"><i class="fa-solid fa-gear"></i><span>設定</span></a>
    `;
    document.body.appendChild(nav);
}
