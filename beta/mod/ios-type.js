/**
 * iOS 26 Runtime - 實體功能商用版
 * 特點：全功能響應、真實導航、真實彈窗邏輯
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

        /* 動態島 */
        .ios-island { position: fixed; top: 11px; left: 50%; transform: translateX(-50%); width: 125px; height: 36px; background: #000; border-radius: 20px; z-index: 9999; transition: all 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28); display: flex; align-items: center; justify-content: center; font-size: 12px; }
        .ios-island.active { width: 300px; height: 60px; border-radius: 30px; }

        /* 導航欄 */
        .ios-header { padding: var(--safe-top) 20px 10px; background: var(--glass); backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px); border-bottom: 0.5px solid rgba(255,255,255,0.1); z-index: 1000; transition: 0.3s; }
        .nav-top-row { display: flex; align-items: center; justify-content: space-between; height: 30px; }
        .ios-back-btn { color: var(--ios-blue); font-size: 17px; cursor: pointer; display: none; opacity: 0; transition: 0.3s; }
        .ios-back-btn.show { display: block; opacity: 1; }
        .ios-header h1 { font-size: 34px; margin: 0; letter-spacing: -1px; font-weight: 700; transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
        .ios-header.scrolled h1 { font-size: 20px; text-align: center; transform: translateY(-5px); }

        /* 內容區 */
        .ios-scroller { flex: 1; overflow-y: auto; -webkit-overflow-scrolling: touch; padding: 16px; transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .ios-scroller::-webkit-scrollbar { display: none; }

        /* 真實組件樣式 */
        .ios-search-box { background: #1C1C1E; border-radius: 10px; margin: 10px 0; padding: 8px 12px; display: flex; align-items: center; }
        .ios-search-box input { background: transparent; border: none; color: #fff; flex: 1; font-size: 17px; margin-left: 8px; }
        
        .ios-list { background: var(--ios-card); border-radius: 12px; padding: 0; margin: 10px 0 25px; list-style: none; overflow: hidden; }
        .ios-list li { padding: 14px 16px; border-bottom: 0.5px solid rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: space-between; font-size: 17px; cursor: pointer; }
        .ios-list li:active { background: #3A3A3C; }
        .ios-list li span { color: var(--ios-gray); }

        .ios-btn { background: var(--ios-blue); color: #fff; border: none; border-radius: 12px; padding: 16px; font-size: 17px; font-weight: 600; width: 100%; margin: 12px 0; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .ios-btn:active { opacity: 0.7; transform: scale(0.98); }

        /* 實體彈窗 Alert */
        .ios-alert-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: none; align-items: center; justify-content: center; z-index: 10000; }
        .ios-alert { width: 270px; background: rgba(30, 30, 30, 0.95); backdrop-filter: blur(20px); border-radius: 14px; overflow: hidden; animation: alertPop 0.2s ease-out; }
        .ios-alert-content { padding: 20px; border-bottom: 0.5px solid rgba(255,255,255,0.1); text-align: center; }
        .ios-alert-btn { color: var(--ios-blue); padding: 12px; text-align: center; font-weight: 600; cursor: pointer; }
        @keyframes alertPop { from { transform: scale(1.2); opacity: 0; } to { transform: scale(1); opacity: 1; } }

        .ios-home-bar { height: 5px; width: 134px; background: #fff; border-radius: 10px; position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); opacity: 0.5; pointer-events: none; }
    `;
    document.head.appendChild(style);

    // 全域實體 API
    window.ios = {
        // 實體彈窗：支援傳入 Callback
        alert: function(title, msg, onConfirm) {
            const overlay = document.getElementById('ios-alert-wrap');
            document.getElementById('ios-alert-title').innerText = title;
            document.getElementById('ios-alert-msg').innerText = msg;
            overlay.style.display = 'flex';
            const btn = document.getElementById('ios-alert-ok');
            btn.onclick = () => {
                overlay.style.display = 'none';
                if(onConfirm) onConfirm();
            };
        },
        // 實體導航：模擬跳轉
        push: function(title, htmlContent) {
            const scroller = document.getElementById('scroller');
            const header = document.querySelector('.ios-header');
            const backBtn = document.getElementById('backBtn');
            
            // 紀錄當前狀態以便返回
            this._prevContent = scroller.innerHTML;
            this._prevTitle = document.getElementById('mainTitle').innerText;

            scroller.style.transform = 'translateX(-100%)';
            setTimeout(() => {
                scroller.innerHTML = htmlContent;
                document.getElementById('mainTitle').innerText = title;
                header.classList.add('scrolled');
                backBtn.classList.add('show');
                scroller.style.transform = 'translateX(0)';
                scroller.scrollTop = 0;
            }, 200);
        },
        pop: function() {
            const scroller = document.getElementById('scroller');
            const header = document.querySelector('.ios-header');
            const backBtn = document.getElementById('backBtn');
            
            scroller.style.transform = 'translateX(100%)';
            setTimeout(() => {
                scroller.innerHTML = this._prevContent;
                document.getElementById('mainTitle').innerText = this._prevTitle;
                header.classList.remove('scrolled');
                backBtn.classList.remove('show');
                scroller.style.transform = 'translateX(0)';
                // 重新綁定映射
                window.ios._map();
            }, 200);
        },
        _map: function() {
            const s = document.getElementById('scroller');
            s.querySelectorAll('ul').forEach(u => u.classList.add('ios-list'));
            s.querySelectorAll('button, a').forEach(b => { if(!b.classList.contains('no-ios')) b.classList.add('ios-btn'); });
        }
    };

    const init = () => {
        const bodyRaw = document.body.innerHTML;
        const pageTitle = document.title || "iOS 26";

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
            <div class="ios-alert-overlay" id="ios-alert-wrap">
                <div class="ios-alert">
                    <div class="ios-alert-content"><div style="font-weight:600" id="ios-alert-title"></div><div style="font-size:13px" id="ios-alert-msg"></div></div>
                    <div class="ios-alert-btn" id="ios-alert-ok">好</div>
                </div>
            </div>
        `;

        document.getElementById('backBtn').onclick = () => window.ios.pop();
        
        // 滾動標題動畫
        document.getElementById('scroller').onscroll = function(e) {
            const header = document.querySelector('.ios-header');
            if(this.scrollTop > 20) header.classList.add('scrolled');
            else if(!document.getElementById('backBtn').classList.contains('show')) header.classList.remove('scrolled');
        };

        window.ios._map();
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
