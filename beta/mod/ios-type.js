/**
 * iOS 26 Runtime - Production Stable
 * 核心功能：導航管理、動態島、彈窗系統、觸感反饋、自動組件映射
 */
(function() {
    const injectStyles = () => {
        if(document.getElementById('ios-runtime-styles')) return;
        const style = document.createElement('style');
        style.id = 'ios-runtime-styles';
        style.textContent = `
            .ios-action-sheet-ov { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 12000; opacity: 0; visibility: hidden; transition: 0.3s; display: flex; flex-direction: column; justify-content: flex-end; padding: 10px; backdrop-filter: blur(8px); }
            .ios-action-sheet-ov.show { opacity: 1; visibility: visible; }
            .ios-as-group { background: rgba(30,30,30,0.9); border-radius: 14px; margin-bottom: 8px; overflow: hidden; transform: translateY(100%); transition: transform 0.4s cubic-bezier(0.1, 0.8, 0.2, 1); }
            .ios-action-sheet-ov.show .ios-as-group { transform: translateY(0); }
            .ios-as-btn { padding: 18px; text-align: center; font-size: 18px; color: #0A84FF; border-bottom: 0.5px solid rgba(255,255,255,0.1); user-select: none; }
            .ios-as-btn:active { background: rgba(255,255,255,0.1); }
            .ios-as-btn.danger { color: #FF453A; }
            .ios-as-btn.cancel { font-weight: 600; }
            .ios-loading-ov { position: fixed; inset: 0; z-index: 13000; display: none; align-items: center; justify-content: center; background: rgba(0,0,0,0.2); }
            .ios-spinner { width: 35px; height: 35px; border: 3px solid rgba(255,255,255,0.2); border-top-color: #fff; border-radius: 50%; animation: ios-spin 0.8s linear infinite; }
            @keyframes ios-spin { to { transform: rotate(360deg); } }
        `;
        document.head.appendChild(style);
    };

    window.ios = {
        _history: [],
        haptic: (type = 'light') => {
            if(!window.navigator.vibrate) return;
            const p = { light: 10, medium: 20, heavy: 30, success: [10, 30, 10], error: [20, 50, 20] };
            window.navigator.vibrate(p[type] || 10);
        },
        notify: (msg) => {
            const island = document.getElementById('island'), txt = document.getElementById('island-msg');
            if(!island || !txt) return;
            txt.innerText = msg;
            island.classList.add('active');
            window.ios.haptic('success');
            setTimeout(() => txt.style.opacity = '1', 200);
            setTimeout(() => {
                txt.style.opacity = '0';
                setTimeout(() => island.classList.remove('active'), 200);
            }, 2800);
        },
        alert: (title, msg, onOk) => {
            const ov = document.getElementById('alertOv');
            if(!ov) return;
            document.getElementById('a-t').innerText = title;
            document.getElementById('a-m').innerText = msg;
            ov.style.display = 'flex';
            window.ios.haptic('heavy');
            document.getElementById('a-cancel').onclick = () => ov.style.display = 'none';
            document.getElementById('a-ok').onclick = () => { ov.style.display = 'none'; if(onOk) onOk(); };
        },
        actionSheet: (btns) => {
            let ov = document.getElementById('ios-as-container') || document.createElement('div');
            ov.id = 'ios-as-container'; ov.className = 'ios-action-sheet-ov';
            document.body.appendChild(ov);
            let html = `<div class="ios-as-group">` + btns.map(b => 
                b.role === 'cancel' ? `</div><div class="ios-as-group"><div class="ios-as-btn cancel" data-id="${b.id}">${b.text}</div>` :
                `<div class="ios-as-btn ${b.role === 'destructive' ? 'danger' : ''}" data-id="${b.id}">${b.text}</div>`
            ).join('') + `</div>`;
            ov.innerHTML = html; ov.classList.add('show');
            ov.onclick = (e) => {
                const btnId = e.target.getAttribute('data-id');
                const b = btns.find(x => x.id == btnId);
                if(b && b.onClick) b.onClick();
                ov.classList.remove('show');
            };
        },
        loading: (show) => {
            let ov = document.getElementById('ios-ld') || document.createElement('div');
            ov.id = 'ios-ld'; ov.className = 'ios-loading-ov';
            ov.innerHTML = `<div class="ios-spinner"></div>`;
            if(!ov.parentNode) document.body.appendChild(ov);
            ov.style.display = show ? 'flex' : 'none';
        },
        push: (title, html) => {
            const sc = document.getElementById('scroller');
            window.ios._history.push({ t: document.getElementById('mainTitle').innerText, h: sc.innerHTML });
            sc.style.opacity = '0'; sc.style.transform = 'scale(0.96)';
            setTimeout(() => {
                sc.innerHTML = html;
                document.getElementById('mainTitle').innerText = title;
                document.getElementById('back').classList.add('show');
                document.getElementById('header').classList.add('mini');
                window.ios._render();
                sc.style.opacity = '1'; sc.style.transform = 'scale(1)';
            }, 250);
        },
        pop: () => {
            if(window.ios._history.length === 0) return;
            const last = window.ios._history.pop(), sc = document.getElementById('scroller');
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
            }, 250);
        },
        filter: (q) => {
            document.querySelectorAll('.ios-list li').forEach(li => {
                li.style.display = li.innerText.toLowerCase().includes(q.toLowerCase()) ? 'flex' : 'none';
            });
        },
        _render: () => {
            document.querySelectorAll('input[type="checkbox"]').forEach(c => {
                if(c.dataset.done) return;
                const sw = document.createElement('div');
                sw.className = `ios-switch ${c.checked ? 'on' : ''}`;
                c.style.display = 'none'; c.dataset.done = "1";
                sw.onclick = (e) => {
                    e.stopPropagation(); c.checked = !c.checked;
                    sw.classList.toggle('on'); window.ios.haptic('medium');
                    c.dispatchEvent(new Event('change'));
                };
                c.parentNode.insertBefore(sw, c);
            });
        }
    };

    injectStyles();
    let startX = 0;
    document.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, {passive:true});
    document.addEventListener('touchend', e => { if(startX < 40 && e.changedTouches[0].clientX > 100) window.ios.pop(); });
})();
