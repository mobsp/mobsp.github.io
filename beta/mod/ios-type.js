/**
 * iOS 26 Runtime - Pro Complete Edition
 * 增強功能：自動樣式注入、Action Sheet (底部選單)、Loading 狀態、多級震動反饋
 */
(function() {
    // 1. 自動注入系統級進階 CSS (無需在 HTML 手動添加)
    const injectStyles = () => {
        if(document.getElementById('ios-runtime-styles')) return;
        const style = document.createElement('style');
        style.id = 'ios-runtime-styles';
        style.textContent = `
            /* Action Sheet 底部選單 */
            .ios-action-sheet-ov { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 12000; opacity: 0; visibility: hidden; transition: 0.3s; display: flex; flex-direction: column; justify-content: flex-end; padding: 10px; backdrop-filter: blur(4px); }
            .ios-action-sheet-ov.show { opacity: 1; visibility: visible; }
            .ios-as-group { background: rgba(35,35,35,0.9); border-radius: 14px; margin-bottom: 8px; overflow: hidden; backdrop-filter: blur(10px); transform: translateY(100%); transition: transform 0.4s cubic-bezier(0.1, 0.8, 0.2, 1); }
            .ios-action-sheet-ov.show .ios-as-group { transform: translateY(0); }
            .ios-as-btn { padding: 18px; text-align: center; font-size: 19px; color: #0A84FF; border-bottom: 0.5px solid rgba(255,255,255,0.1); user-select: none; transition: 0.2s; }
            .ios-as-btn:active { background: rgba(255,255,255,0.1); }
            .ios-as-btn:last-child { border-bottom: none; }
            .ios-as-btn.danger { color: #FF453A; }
            .ios-as-btn.cancel { font-weight: 600; }
            
            /* Loading Spinner */
            .ios-loading-ov { position: fixed; inset: 0; z-index: 13000; display: none; align-items: center; justify-content: center; }
            .ios-loading-box { background: rgba(30,30,30,0.8); padding: 25px; border-radius: 16px; backdrop-filter: blur(10px); display: flex; flex-direction: column; align-items: center; }
            .ios-spinner { width: 30px; height: 30px; border: 3px solid rgba(255,255,255,0.2); border-top-color: #fff; border-radius: 50%; animation: ios-spin 1s linear infinite; }
            @keyframes ios-spin { to { transform: rotate(360deg); } }
        `;
        document.head.appendChild(style);
    };

    window.ios = {
        _history: [],
        
        // 2. 多級觸感反饋 (支援不同情境)
        haptic: (type = 'light') => {
            if(!window.navigator.vibrate) return;
            const patterns = {
                light: 10,           // 一般點擊
                medium: 20,          // 開關切換
                heavy: 30,           // 警告/重要操作
                success: [10, 50, 10], // 成功連續震動
                error: [20, 40, 20, 40, 20] // 失敗震動
            };
            window.navigator.vibrate(patterns[type] || patterns.light);
        },
        
        // 3. 動態島通知 (增強)
        notify: (msg) => {
            const island = document.getElementById('island');
            const txt = document.getElementById('island-msg');
            if(!island || !txt) return console.warn("未找到動態島 DOM");
            
            txt.innerText = msg;
            island.classList.add('active');
            window.ios.haptic('success');
            
            setTimeout(() => txt.style.opacity = '1', 200);
            setTimeout(() => {
                txt.style.opacity = '0';
                setTimeout(() => island.classList.remove('active'), 200);
            }, 2500);
        },

        // 4. 系統級彈窗 (Alert)
        alert: (title, msg, onOk, okText = '確認', cancelText = '取消') => {
            const ov = document.getElementById('alertOv');
            if(!ov) return;
            document.getElementById('a-t').innerText = title;
            document.getElementById('a-m').innerText = msg;
            document.getElementById('a-cancel').innerText = cancelText;
            document.getElementById('a-ok').innerText = okText;
            
            window.ios.haptic('heavy');
            ov.style.display = 'flex';
            
            document.getElementById('a-cancel').onclick = () => { ov.style.display = 'none'; };
            document.getElementById('a-ok').onclick = () => { 
                ov.style.display = 'none'; 
                if(onOk) onOk(); 
            };
        },

        // 5. [新增] 底部操作選單 (Action Sheet)
        actionSheet: (buttons) => {
            window.ios.haptic('medium');
            let ov = document.getElementById('ios-as-container');
            if(!ov) {
                ov = document.createElement('div');
                ov.id = 'ios-as-container';
                ov.className = 'ios-action-sheet-ov';
                document.body.appendChild(ov);
            }
            
            let html = `<div class="ios-as-group">`;
            buttons.forEach(btn => {
                if(btn.role === 'cancel') {
                    html += `</div><div class="ios-as-group">
                             <div class="ios-as-btn cancel" data-idx="${btn.id}">${btn.text}</div></div>`;
                } else {
                    const colorClass = btn.role === 'destructive' ? 'danger' : '';
                    html += `<div class="ios-as-btn ${colorClass}" data-idx="${btn.id}">${btn.text}</div>`;
                }
            });

            ov.innerHTML = html;
            ov.classList.add('show');

            // 綁定點擊事件
            ov.onclick = (e) => {
                if(e.target.classList.contains('ios-as-btn')) {
                    const btnId = e.target.getAttribute('data-idx');
                    const targetBtn = buttons.find(b => b.id == btnId);
                    if(targetBtn && targetBtn.onClick) targetBtn.onClick();
                }
                ov.classList.remove('show');
                setTimeout(() => ov.innerHTML = '', 300); // 清除 DOM
            };
        },

        // 6. [新增] 全域載入狀態 (Loading)
        loading: (show) => {
            let ov = document.getElementById('ios-loading-container');
            if(!ov) {
                ov = document.createElement('div');
                ov.id = 'ios-loading-container';
                ov.className = 'ios-loading-ov';
                ov.innerHTML = `<div class="ios-loading-box"><div class="ios-spinner"></div></div>`;
                document.body.appendChild(ov);
            }
            ov.style.display = show ? 'flex' : 'none';
        },

        // 7. 多層級導航 (Push/Pop)
        push: (title, html) => {
            const sc = document.getElementById('scroller');
            window.ios._history.push({ 
                t: document.getElementById('mainTitle').innerText, 
                h: sc.innerHTML 
            });
            
            sc.style.transform = 'scale(0.95)';
            sc.style.opacity = '0';
            
            setTimeout(() => {
                sc.innerHTML = html;
                document.getElementById('mainTitle').innerText = title;
                document.getElementById('back').classList.add('show');
                document.getElementById('header').classList.add('mini');
                window.ios._render();
                
                sc.style.transform = 'scale(1)';
                sc.style.opacity = '1';
                sc.scrollTop = 0;
            }, 250);
        },

        pop: () => {
            if(window.ios._history.length === 0) return;
            const last = window.ios._history.pop();
            const sc = document.getElementById('scroller');
            
            sc.style.transform = 'translateX(20px)';
            sc.style.opacity = '0';
            
            setTimeout(() => {
                sc.innerHTML = last.h;
                document.getElementById('mainTitle').innerText = last.t;
                if(window.ios._history.length === 0) {
                    document.getElementById('back').classList.remove('show');
                    document.getElementById('header').classList.remove('mini');
                }
                window.ios._render();
                sc.style.transform = 'translateX(0)';
                sc.style.opacity = '1';
            }, 250);
        },

        // 8. 搜尋過濾
        filter: (q) => {
            document.querySelectorAll('.ios-list li').forEach(li => {
                const text = li.innerText.toLowerCase();
                li.style.display = text.includes(q.toLowerCase()) ? 'flex' : 'none';
            });
        },

        // 9. 實體 DOM 渲染器
        _render: () => {
            const sc = document.getElementById('scroller');
            if(!sc) return;
            sc.querySelectorAll('input[type="checkbox"]').forEach(c => {
                if(c.dataset.done) return;
                const sw = document.createElement('div');
                sw.className = `ios-switch ${c.checked ? 'on' : ''}`;
                c.style.display = 'none'; 
                c.dataset.done = "1";
                sw.onclick = (e) => { 
                    e.stopPropagation();
                    c.checked = !c.checked; 
                    sw.classList.toggle('on'); 
                    window.ios.haptic('medium'); 
                    c.dispatchEvent(new Event('change')); 
                };
                c.parentNode.insertBefore(sw, c);
            });
        }
    };

    // 系統初始化執行
    injectStyles();
    
    // 邊緣滑動返回手勢
    let startX = 0;
    document.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    document.addEventListener('touchend', e => {
        if (startX < 30 && e.changedTouches[0].clientX > 100) window.ios.pop();
    });

})();
