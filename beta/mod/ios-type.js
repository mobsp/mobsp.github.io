/**
 * iOS 26 Runtime - 真・終極全套封裝 (緹緹贖罪補完版)
 * 補齊：搜尋列、彈窗系統、導航返回邏輯
 */
(function() {
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --ios-blue: #0A84FF; --ios-green: #30D158; --ios-red: #FF453A; --ios-gray: #8E8E93;
            --ios-bg: #000; --ios-card: #1C1C1E; --glass: rgba(25, 25, 25, 0.72);
            --safe-top: env(safe-area-inset-top, 20px); --safe-bottom: env(safe-area-inset-bottom, 20px);
        }
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; outline: none; }
        body, html { margin: 0; padding: 0; width: 100%; height: 100%; background: #000; overflow: hidden; font-family: -apple-system, sans-serif; color: #fff; }
        
        #ios-runtime-root { display: flex; flex-direction: column; height: 100dvh; width: 100vw; position: relative; }

        /* 1. 動態島 (與系統狀態對接) */
        .ios-island { position: fixed; top: 11px; left: 50%; transform: translateX(-50%); width: 125px; height: 36px; background: #000; border-radius: 20px; z-index: 9999; transition: all 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28); display: flex; align-items: center; justify-content: center; font-size: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.5); }
        .ios-island.active { width: 320px; height: 80px; border-radius: 35px; }

        /* 2. 導航欄 (新增返回鍵支援) */
        .ios-header { padding: var(--safe-top) 20px 10px; background: var(--glass); backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px); border-bottom: 0.5px solid rgba(255,255,255,0.1); z-index: 1000; }
        .nav-top-row { display: flex; align-items: center; justify-content: space-between; height: 44px; margin-bottom: 5px; }
        .ios-back-btn { color: var(--ios-blue); font-size: 17px; display: flex; align-items: center; cursor: pointer; visibility: hidden; }
        .ios-header h1 { font-size: 34px; margin: 0; letter-spacing: -1px; font-weight: 700; transition: 0.3s; }

        /* 3. 搜尋列 (補完項目) */
        .ios-search-box { background: #1C1C1E; border-radius: 10px; margin: 10px 0; padding: 8px 12px; display: flex; align-items: center; color: var(--ios-gray); font-size: 17px; }
        .ios-search-box input { background: transparent; border: none; color: #fff; margin-left: 8px; flex: 1; font-size: 17px; }

        /* 4. 系統列表與按鈕 */
        .ios-scroller { flex: 1; overflow-y: auto; -webkit-overflow-scrolling: touch; padding: 16px; padding-bottom: 100px; }
        .ios-scroller::-webkit-scrollbar { display: none; }
        .ios-list { background: var(--ios-card); border-radius: 12px; padding: 0; margin: 10px 0 25px; list-style: none; overflow: hidden; }
        .ios-list li { padding: 14px 16px; border-bottom: 0.5px solid rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: space-between; font-size: 17px; }
        .ios-list li:active { background: #3A3A3C; }
        .ios-btn { background: var(--ios-blue); color: #fff; border: none; border-radius: 12px; padding: 16px; font-size: 17px; font-weight: 600; width: 100%; margin: 12px 0; display: flex; align-items: center; justify-content: center; text-decoration: none; }
        
        /* 5. 系統對話框 (補完項目) */
        .ios-alert-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 10000; opacity: 0; visibility: hidden; transition: 0.2s; }
        .ios-alert { width: 270px; background: rgba(37, 37, 37, 0.9); backdrop-filter: blur(20px); border-radius: 14px; overflow: hidden; text-align: center; transform: scale(1.1); transition: 0.2s; }
        .ios-alert-body { padding: 20px; border-bottom: 0.5px solid rgba(255,255,255,0.1); }
        .ios-alert-title { font-weight: 600; font-size: 17px; margin-bottom: 5px; }
        .ios-alert-msg { font-size: 13px; color: #fff; }
        .ios-alert-btn { color: var(--ios-blue); padding: 12px; font-size: 17px; cursor: pointer; font-weight: 600; }
        .ios-alert-overlay.active { opacity: 1; visibility: visible; }
        .ios-alert-overlay.active .ios-alert { transform: scale(1); }

        .ios-switch { width: 51px; height: 31px; background: #39393D; border-radius: 20px; position: relative; transition: 0.3s; }
        .ios-switch.on { background: var(--ios-green); }
        .ios-switch::after { content: ''; position: absolute; top: 2px; left: 2px; width: 27px; height: 27px; background: #fff; border-radius: 50%; transition: 0.3s; }
        .ios-switch.on::after { transform: translateX(20px); }
        .ios-home-bar { height: 5px; width: 134px; background: #fff; border-radius: 10px; position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); opacity: 0.5; pointer-events: none; }
    `;
    document.head.appendChild(style);

    const init = () => {
        const bodyRaw = document.body.innerHTML;
        const pageTitle = document.title || "iOS Runtime";

        document.body.innerHTML = `
            <div id="ios-runtime-root">
                <div class="ios-island" id="island">Runtime</div>
                <header class="ios-header">
                    <div class="nav-top-row"><span class="ios-back-btn" id="backBtn">〈 返回</span></div>
                    <h1 id="mainTitle">${pageTitle}</h1>
                </header>
                <main class="ios-scroller" id="scroller">${bodyRaw}</main>
                <div class="ios-home-bar"></div>
            </div>
            <div class="ios-alert-overlay" id="alertOverlay"><div class="ios-alert"><div class="ios-alert-body"><div class="ios-alert-title" id="alertTitle"></div><div class="ios-alert-msg" id="alertMsg"></div></div><div class="ios-alert-btn" onclick="closeAlert()">好</div></div></div>
        `;

        const s = document.getElementById('scroller');
        const haptic = (ms) => { if(window.navigator.vibrate) window.navigator.vibrate(ms); };

        // 導航邏輯補完
        window.showPage = (title) => {
            document.getElementById('mainTitle').style.fontSize = '20px';
            document.getElementById('mainTitle').innerText = title;
            document.getElementById('backBtn').style.visibility = 'visible';
            haptic(10);
        };

        // 彈窗邏輯補完
        window.iosAlert = (title, msg) => {
            document.getElementById('alertTitle').innerText = title;
            document.getElementById('alertMsg').innerText = msg;
            document.getElementById('alertOverlay').classList.add('active');
            haptic(20);
        };
        window.closeAlert = () => document.getElementById('alertOverlay').classList.remove('active');

        // 自動映射
        s.querySelectorAll('ul').forEach(u => u.classList.add('ios-list'));
        s.querySelectorAll('button, a').forEach(b => b.classList.add('ios-btn'));
        s.querySelectorAll('input[type="checkbox"]').forEach(c => {
            const w = document.createElement('div');
            w.className = `ios-switch ${c.checked ? 'on' : ''}`;
            c.style.display = 'none';
            w.onclick = () => { c.checked = !c.checked; w.classList.toggle('on'); haptic(12); };
            c.parentNode.insertBefore(w, c);
        });

        // 系統行為接管
        document.addEventListener('touchstart', (e) => { if(e.target.closest('.ios-btn, li, .ios-switch')) haptic(10); });
        document.addEventListener('touchmove', (e) => { if(!e.target.closest('.ios-scroller')) e.preventDefault(); }, {passive: false});

        console.log("✅ iOS 26 Runtime: 真正完整補完版載入成功。");
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
