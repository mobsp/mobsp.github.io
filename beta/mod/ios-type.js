/**
 * iOS 26 Runtime - 真・終極實體作業系統 (部長專供完結版)
 * 包含：導航歷史棧、實作搜尋引擎、雙鈕對話框、動態島即時通知、震動引擎
 */
(function() {
    // 1. 注入全系統視覺 UI
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --ios-blue: #0A84FF; --ios-green: #30D158; --ios-red: #FF453A; --ios-gray: #8E8E93;
            --ios-bg: #000; --ios-card: #1C1C1E; --glass: rgba(25, 25, 25, 0.75);
            --safe-top: env(safe-area-inset-top, 20px); --safe-bottom: env(safe-area-inset-bottom, 20px);
        }
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; outline: none; transition: background 0.2s; }
        body, html { margin: 0; padding: 0; width: 100%; height: 100%; background: #000; overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif; color: #fff; }
        
        #ios-runtime-root { display: flex; flex-direction: column; height: 100dvh; width: 100vw; position: relative; overflow: hidden; }

        /* 動態島 - 實體功能化 */
        .ios-island { position: fixed; top: 11px; left: 50%; transform: translateX(-50%); width: 125px; height: 36px; background: #000; border-radius: 20px; z-index: 10000; transition: all 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.2); display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .ios-island.active { width: 350px; height: 80px; border-radius: 40px; border: 0.5px solid #333; }
        #island-content { opacity: 0; transition: 0.3s; font-size: 14px; padding: 0 20px; text-align: center; width: 100%; }

        /* 導航欄 */
        .ios-header { padding: var(--safe-top) 20px 10px; background: var(--glass); backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px); border-bottom: 0.5px solid rgba(255,255,255,0.1); z-index: 1000; }
        .nav-top-row { display: flex; align-items: center; justify-content: space-between; height: 30px; margin-bottom: 5px; }
        .ios-back-btn { color: var(--ios-blue); font-size: 17px; cursor: pointer; display: flex; align-items: center; opacity: 0; pointer-events: none; transition: 0.3s; }
        .ios-back-btn.show { opacity: 1; pointer-events: auto; }
        .ios-header h1 { font-size: 34px; margin: 0; letter-spacing: -1px; font-weight: 700; transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .ios-header.mini h1 { font-size: 18px; transform: translateY(-5px); text-align: center; width: 100%; padding-right: 40px; }

        /* 內容容器與物理回彈 */
        .ios-scroller { flex: 1; overflow-y: auto; -webkit-overflow-scrolling: touch; padding: 16px 16px 120px; position: relative; }
        .ios-scroller::-webkit-scrollbar { display: none; }

        /* 實體組件 */
        .ios-search-box { background: #1C1C1E; border-radius: 12px; margin: 8px 0 16px; padding: 10px 14px; display: flex; align-items: center; }
        .ios-search-box input { background: transparent; border: none; color: #fff; flex: 1; font-size: 17px; margin-left: 10px; }
        
        .ios-list { background: var(--ios-card); border-radius: 12px; padding: 0; margin: 10px 0 25px; list-style: none; overflow: hidden; }
        .ios-list li { padding: 14px 16px; border-bottom: 0.5px solid rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: space-between; font-size: 17px; }
        .ios-list li:active { background: #3A3A3C; }
        .ios-list li .val { color: var(--ios-gray); }

        .ios-btn { background: var(--ios-blue); color: #fff; border: none; border-radius: 14px; padding: 16px; font-size: 17px; font-weight: 600; width: 100%; margin: 12px 0; cursor: pointer; text-align: center; display: block; }
        .ios-btn:active { opacity: 0.7; transform: scale(0.97); }

        .ios-switch { width: 51px; height: 31px; background: #39393D; border-radius: 20px; position: relative; transition: 0.3s; cursor: pointer; }
        .ios-switch.on { background: var(--ios-green); }
        .ios-switch::after { content: ''; position: absolute; top: 2px; left: 2px; width: 27px; height: 27px; background: #fff; border-radius: 50%; transition: 0.3s; box-shadow: 0 2px 5px rgba(0,0,0,0.3); }
        .ios-switch.on::after { transform: translateX(20px); }

        /* 實作系統 Alert */
        .ios-alert-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: none; align-items: center; justify-content: center; z-index: 11000; backdrop-filter: blur(5px); }
        .ios-alert { width: 270px; background: rgba(30, 30, 30, 0.9); backdrop-filter: blur(25px); border-radius: 14px; overflow: hidden; animation: pop 0.25s cubic-bezier(0.2, 1, 0.2, 1); }
        .alert-info { padding: 20px; text-align: center; border-bottom: 0.5px solid rgba(255,255,255,0.1); }
        .alert-btns { display: flex; }
        .alert-btn { flex: 1; padding: 12px; color: var(--ios-blue); text-align: center; font-size: 17px; cursor: pointer; }
        .alert-btn:active { background: rgba(255,255,255,0.05); }
        .alert-btn.bold { font-weight: 600; border-left: 0.5px solid rgba(255,255,255,0.1); }
        @keyframes pop { from { transform: scale(1.2); opacity: 0; } to { transform: scale(1); opacity: 1; } }

        .ios-home-bar { height: 5px; width: 134px; background: #fff; border-radius: 10px; position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); opacity: 0.4; }
    `;
    document.head.appendChild(style);

    // 2. 系統實體 API
    window.ios = {
        _history: [],
        haptic: function(ms) { if(window.navigator.vibrate) window.navigator.vibrate(ms); },
        
        // 實體通知 (動態島)
        notify: function(msg) {
            const island = document.getElementById('island');
            const content = document.getElementById('island-content');
            content.innerText = msg;
            island.classList.add('active');
            setTimeout(() => content.style.opacity = '1', 200);
            this.haptic([15, 30, 15]);
            setTimeout(() => {
                content.style.opacity = '0';
                setTimeout(() => island.classList.remove('active'), 200);
            }, 3000);
        },

        // 實體彈窗 (帶有雙按鈕回呼)
        alert: function(title, msg, onConfirm, confirmText = "確認") {
            const overlay = document.getElementById('alertOverlay');
            document.getElementById('a-title').innerText = title;
            document.getElementById('a-msg').innerText = msg;
            document.getElementById('a-ok').innerText = confirmText;
            overlay.style.display = 'flex';
            this.haptic(20);

            document.getElementById('a-cancel').onclick = () => overlay.style.display = 'none';
            document.getElementById('a-ok').onclick = () => {
                overlay.style.display = 'none';
                if(onConfirm) onConfirm();
            };
        },

        // 實體導航系統 (真正的 Push/Pop)
        push: function(title, html) {
            const scroller = document.getElementById('scroller');
            this._history.push({ title: document.getElementById('mainTitle').innerText, html: scroller.innerHTML });
            
            scroller.style.transition = '0.3s';
            scroller.style.transform = 'translateX(-20px)';
            scroller.style.opacity = '0';
            
            setTimeout(() => {
                scroller.innerHTML = html;
                document.getElementById('mainTitle').innerText = title;
                document.getElementById('backBtn').classList.add('show');
                document.querySelector('.ios-header').classList.add('mini');
                scroller.style.transform = 'translateX(0)';
                scroller.style.opacity = '1';
                window.ios._map();
                scroller.scrollTop = 0;
                this.haptic(10);
            }, 300);
        },

        pop: function() {
            if(this._history.length === 0) return;
            const last = this._history.pop();
            const scroller = document.getElementById('scroller');
            
            scroller.style.opacity = '0';
            setTimeout(() => {
                scroller.innerHTML = last.html;
                document.getElementById('mainTitle').innerText = last.title;
                if(this._history.length === 0) {
                    document.getElementById('backBtn').classList.remove('show');
                    document.querySelector('.ios-header').classList.remove('mini');
                }
                scroller.style.opacity = '1';
                window.ios._map();
                this.haptic(10);
            }, 300);
        },

        // 實體搜尋過濾邏輯
        filter: function(query) {
            const items = document.querySelectorAll('.ios-list li');
            items.forEach(item => {
                const text = item.innerText.toLowerCase();
                item.style.display = text.includes(query.toLowerCase()) ? 'flex' : 'none';
            });
        },

        _map: function() {
            const s = document.getElementById('scroller');
            s.querySelectorAll('ul').forEach(u => { if(!u.classList.contains('ios-list')) u.classList.add('ios-list'); });
            s.querySelectorAll('button, a').forEach(b => { if(!b.classList.contains('ios-btn') && !b.classList.contains('no-ios')) b.classList.add('ios-btn'); });
            s.querySelectorAll('input[type="checkbox"]').forEach(c => {
                if(c.dataset.mapped) return;
                const w = document.createElement('div');
                w.className = `ios-switch ${c.checked ? 'on' : ''}`;
                c.style.display = 'none';
                c.dataset.mapped = "true";
                w.onclick = () => { c.checked = !c.checked; w.classList.toggle('on'); window.ios.haptic(12); c.dispatchEvent(new Event('change')); };
                c.parentNode.insertBefore(w, c);
            });
        }
    };

    const init = () => {
        const raw = document.body.innerHTML;
        const title = document.title || "Ⲙ𝔬ⲃ¡ⳝ𝔭ⲁ𝔠ⲉ";

        document.body.innerHTML = `
            <div id="ios-runtime-root">
                <div class="ios-island" id="island"><div id="island-content"></div></div>
                <header class="ios-header">
                    <div class="nav-top-row"><span class="ios-back-btn" id="backBtn">〈 返回</span></div>
                    <h1 id="mainTitle">${title}</h1>
                </header>
                <main class="ios-scroller" id="scroller">${raw}</main>
                <div class="ios-home-bar"></div>
            </div>
            <div class="ios-alert-overlay" id="alertOverlay">
                <div class="ios-alert">
                    <div class="alert-info"><div id="a-title" style="font-weight:600"></div><div id="a-msg" style="font-size:13px;margin-top:5px"></div></div>
                    <div class="alert-btns"><div class="alert-btn" id="a-cancel">取消</div><div class="alert-btn bold" id="a-ok">確認</div></div>
                </div>
            </div>
        `;

        document.getElementById('backBtn').onclick = () => window.ios.pop();
        window.ios._map();

        // 觸覺反饋接管
        document.addEventListener('touchstart', (e) => { if(e.target.closest('.ios-btn, li, .ios-switch')) window.ios.haptic(10); });
        console.log("💎 iOS 26 Runtime: 真・終極實體版已啟動。");
    };

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
