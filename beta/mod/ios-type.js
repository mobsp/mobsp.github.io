/**
 * iOS 26 Runtime - 真・極致實體系統 (部長專用完結版)
 * 修正：動態 DOM 綁定、實體搜尋過濾、多層級導航歷史
 */
(function() {
    const style = document.createElement('style');
    style.textContent = `
        :root {
            --ios-blue: #0A84FF; --ios-green: #30D158; --ios-red: #FF453A; --ios-gray: #8E8E93;
            --glass: rgba(25, 25, 25, 0.75); --ios-card: #1C1C1E;
        }
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; outline: none; }
        body, html { margin: 0; padding: 0; width: 100%; height: 100%; background: #000; overflow: hidden; font-family: -apple-system, sans-serif; color: #fff; }
        #ios-root { display: flex; flex-direction: column; height: 100dvh; width: 100vw; position: relative; }

        /* 動態島 */
        .ios-island { position: fixed; top: 11px; left: 50%; transform: translateX(-50%); width: 125px; height: 36px; background: #000; border-radius: 20px; z-index: 10000; transition: all 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.2); display: flex; align-items: center; justify-content: center; }
        .ios-island.active { width: 320px; height: 65px; border-radius: 30px; }
        #island-msg { opacity: 0; font-size: 14px; transition: 0.3s; text-align: center; width: 100%; }

        /* 導航 */
        .ios-header { padding: env(safe-area-inset-top, 20px) 20px 10px; background: var(--glass); backdrop-filter: blur(30px); border-bottom: 0.5px solid rgba(255,255,255,0.1); z-index: 1000; }
        .nav-row { display: flex; align-items: center; height: 30px; margin-bottom: 5px; }
        .back-btn { color: var(--ios-blue); font-size: 17px; cursor: pointer; visibility: hidden; opacity: 0; transition: 0.3s; }
        .back-btn.show { visibility: visible; opacity: 1; }
        .ios-header h1 { font-size: 34px; margin: 0; letter-spacing: -1px; font-weight: 700; transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .ios-header.mini h1 { font-size: 18px; text-align: center; width: 100%; transform: translateY(-5px); margin-left: -40px; }

        /* 內容 */
        .ios-scroller { flex: 1; overflow-y: auto; -webkit-overflow-scrolling: touch; padding: 16px 16px 100px; }
        .ios-scroller::-webkit-scrollbar { display: none; }

        /* 組件實體樣式 */
        .ios-list { background: var(--ios-card); border-radius: 12px; padding: 0; margin: 10px 0 25px; list-style: none; overflow: hidden; }
        .ios-list li { padding: 14px 16px; border-bottom: 0.5px solid rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: space-between; font-size: 17px; }
        .ios-list li:active { background: #3A3A3C; }
        .ios-btn { background: var(--ios-blue); color: #fff; border: none; border-radius: 14px; padding: 16px; font-size: 17px; font-weight: 600; width: 100%; margin: 12px 0; cursor: pointer; }
        .ios-search-box { background: #1C1C1E; border-radius: 12px; margin: 10px 0; padding: 10px 15px; display: flex; align-items: center; }
        .ios-search-box input { background: transparent; border: none; color: #fff; flex: 1; font-size: 17px; }

        /* 實體開關 */
        .ios-switch { width: 51px; height: 31px; background: #39393D; border-radius: 20px; position: relative; transition: 0.3s; cursor: pointer; }
        .ios-switch.on { background: var(--ios-green); }
        .ios-switch::after { content: ''; position: absolute; top: 2px; left: 2px; width: 27px; height: 27px; background: #fff; border-radius: 50%; transition: 0.3s; }
        .ios-switch.on::after { transform: translateX(20px); }

        /* 彈窗 */
        .alert-ov { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: none; align-items: center; justify-content: center; z-index: 11000; backdrop-filter: blur(5px); }
        .alert-box { width: 270px; background: rgba(35, 35, 35, 0.9); border-radius: 14px; overflow: hidden; text-align: center; }
        .alert-body { padding: 20px; border-bottom: 0.5px solid #444; }
        .alert-btns { display: flex; }
        .alert-btn { flex: 1; padding: 12px; color: var(--ios-blue); font-weight: 600; cursor: pointer; }
        .alert-btn:first-child { border-right: 0.5px solid #444; font-weight: 400; }

        .home-bar { height: 5px; width: 134px; background: #fff; border-radius: 10px; position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); opacity: 0.4; }
    `;
    document.head.appendChild(style);

    window.ios = {
        _history: [],
        haptic: (ms) => { if(window.navigator.vibrate) window.navigator.vibrate(ms); },
        
        notify: (msg) => {
            const island = document.getElementById('island');
            const txt = document.getElementById('island-msg');
            txt.innerText = msg;
            island.classList.add('active');
            setTimeout(() => txt.style.opacity = '1', 200);
            window.ios.haptic([10, 30]);
            setTimeout(() => {
                txt.style.opacity = '0';
                setTimeout(() => island.classList.remove('active'), 200);
            }, 2500);
        },

        alert: (title, msg, onOk) => {
            const ov = document.getElementById('alertOv');
            document.getElementById('a-t').innerText = title;
            document.getElementById('a-m').innerText = msg;
            ov.style.display = 'flex';
            document.getElementById('a-cancel').onclick = () => ov.style.display = 'none';
            document.getElementById('a-ok').onclick = () => { ov.style.display = 'none'; if(onOk) onOk(); };
        },

        push: (title, html) => {
            const sc = document.getElementById('scroller');
            window.ios._history.push({ t: document.getElementById('mainTitle').innerText, h: sc.innerHTML });
            sc.style.opacity = '0';
            setTimeout(() => {
                sc.innerHTML = html;
                document.getElementById('mainTitle').innerText = title;
                document.getElementById('back').classList.add('show');
                document.getElementById('header').classList.add('mini');
                window.ios._render();
                sc.style.opacity = '1';
                sc.scrollTop = 0;
            }, 200);
        },

        pop: () => {
            const last = window.ios._history.pop();
            const sc = document.getElementById('scroller');
            sc.style.opacity = '0';
            setTimeout(() => {
                sc.innerHTML = last.h;
                document.getElementById('mainTitle').innerText = last.t;
                if(window.ios._history.length === 0) {
                    document.getElementById('back').classList.remove('show');
                    document.getElementById('header').classList.remove('mini');
                }
                window.ios._render();
                sc.style.opacity = '1';
            }, 200);
        },

        // 搜尋過濾
        filter: (q) => {
            document.querySelectorAll('.ios-list li').forEach(li => {
                li.style.display = li.innerText.toLowerCase().includes(q.toLowerCase()) ? 'flex' : 'none';
            });
        },

        // 重新渲染映射
        _render: () => {
            const sc = document.getElementById('scroller');
            sc.querySelectorAll('ul').forEach(u => u.classList.add('ios-list'));
            sc.querySelectorAll('button').forEach(b => b.classList.add('ios-btn'));
            sc.querySelectorAll('input[type="checkbox"]').forEach(c => {
                if(c.dataset.done) return;
                const sw = document.createElement('div');
                sw.className = `ios-switch ${c.checked ? 'on' : ''}`;
                c.style.display = 'none'; c.dataset.done = "1";
                sw.onclick = () => { c.checked = !c.checked; sw.classList.toggle('on'); window.ios.haptic(10); c.dispatchEvent(new Event('change')); };
                c.parentNode.insertBefore(sw, c);
            });
        }
    };

    const init = () => {
        const raw = document.body.innerHTML;
        document.body.innerHTML = `
            <div id="ios-root">
                <div class="ios-island" id="island"><div id="island-msg"></div></div>
                <header class="ios-header" id="header">
                    <div class="nav-row"><span class="back-btn" id="back">〈 返回</span></div>
                    <h1 id="mainTitle">${document.title}</h1>
                </header>
                <main class="ios-scroller" id="scroller">${raw}</main>
                <div class="home-bar"></div>
            </div>
            <div class="alert-ov" id="alertOv">
                <div class="alert-box">
                    <div class="alert-body"><div id="a-t" style="font-weight:600"></div><div id="a-m" style="font-size:13px;margin-top:5px"></div></div>
                    <div class="alert-btns"><div class="alert-btn" id="a-cancel">取消</div><div class="alert-btn" id="a-ok">確認</div></div>
                </div>
            </div>
        `;
        document.getElementById('back').onclick = () => window.ios.pop();
        window.ios._render();
    };

    window.onload = init;
})();
