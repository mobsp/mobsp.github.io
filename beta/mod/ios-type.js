/**
 * iOS 26 Runtime - 真・極致實體系統 (核心版)
 */
(function() {
    window.ios = {
        _history: [],
        haptic: (ms) => { if(window.navigator.vibrate) window.navigator.vibrate(ms); },
        
        notify: (msg) => {
            const island = document.getElementById('island');
            const txt = document.getElementById('island-msg');
            if(!island || !txt) return;
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
            document.getElementById('a-ok').onclick = () => { 
                ov.style.display = 'none'; 
                if(onOk) onOk(); 
            };
        },

        push: (title, html) => {
            const sc = document.getElementById('scroller');
            window.ios._history.push({ 
                t: document.getElementById('mainTitle').innerText, 
                h: sc.innerHTML 
            });
            sc.style.opacity = '0';
            setTimeout(() => {
                sc.innerHTML = html;
                document.getElementById('mainTitle').innerText = title;
                document.getElementById('back').classList.add('show');
                document.getElementById('header').classList.add('mini');
                window.ios._render();
                sc.style.opacity = '1';
                sc.scrollTop = 0;
            }, 250);
        },

        pop: () => {
            if(window.ios._history.length === 0) return;
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
            }, 250);
        },

        filter: (q) => {
            document.querySelectorAll('.ios-list li').forEach(li => {
                const text = li.innerText.toLowerCase();
                li.style.display = text.includes(q.toLowerCase()) ? 'flex' : 'none';
            });
        },

        _render: () => {
            const sc = document.getElementById('scroller');
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
                    window.ios.haptic(10); 
                    c.dispatchEvent(new Event('change')); 
                };
                c.parentNode.insertBefore(sw, c);
            });
        }
    };

    document.addEventListener('touchstart', e => { window._startX = e.touches[0].clientX; });
    document.addEventListener('touchend', e => {
        if (window._startX < 40 && e.changedTouches[0].clientX > 120) window.ios.pop();
    });
})();
