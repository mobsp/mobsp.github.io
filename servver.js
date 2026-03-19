const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

// --- 1. 讓 server 也能顯示您的控制頁面 ---
// 當您訪問 http://...-3000.app.github.dev/ 時，直接顯示 dash
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'tol/dash/index.html'));
});

// 設定文章存放路徑
const ARTICLE_DIR = path.join(__dirname, 'blog/p/list');
if (!fs.existsSync(ARTICLE_DIR)) fs.mkdirSync(ARTICLE_DIR, { recursive: true });

// --- 2. 抓取 API ---
app.post('/api/grab', async (req, res) => {
    const { url } = req.body;
    try {
        const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const $ = cheerio.load(data);
        const title = $('h1').first().text().trim() || "未命名文章";
        
        let contentHtml = "";
        $('p').each((i, el) => {
            const text = $(el).text().trim();
            if (text) contentHtml += `<p>${text}</p>\n                `;
        });

        // 注入部長的流光設定版模板
        const template = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>${title} | Ⲙ𝔬ⲃ¡ⳝ𝔭ⲁ𝔠ⲉ</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root { --ios-bg: #000; --article-text-color: #ffffff; --article-font-size: 17px; --accent-color: #00cec9; }
        body { font-family: -apple-system, sans-serif; background: var(--ios-bg); color: #fff; line-height: 1.7; margin: 0; }
        .article-container { max-width: 480px; margin: 0 auto; padding: 40px 20px 150px; }
        .post-content { font-size: var(--article-font-size); color: var(--article-text-color); }
        .post-content p { margin-bottom: 20px; text-align: justify; }
        /* 設定滑塊控制項 */
        .mobi-btn { position: fixed; bottom: 30px; right: 20px; width: 50px; height: 50px; background: rgba(44,44,46,0.9); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; z-index: 1000; border: 1px solid rgba(255,255,255,0.1); }
        .mobi-panel { position: fixed; bottom: 0; left: 0; width: 100%; background: rgba(30,30,30,0.95); backdrop-filter: blur(20px); border-top-left-radius: 20px; border-top-right-radius: 20px; padding: 25px 20px 50px; transform: translateY(100%); transition: 0.3s; z-index: 999; }
        .mobi-panel.show { transform: translateY(0); }
    </style>
</head>
<body>
    <div class="mobi-btn" onclick="document.getElementById('p').classList.toggle('show')"><i class="fa-solid fa-gear"></i></div>
    <div class="mobi-panel" id="p">
        <div style="display:flex;justify-content:space-between;color:#fff;"><span>設定</span><span onclick="document.getElementById('p').classList.remove('show')">完成</span></div>
        <input type="range" min="0" max="255" value="0" oninput="uC(this.value)" style="width:100%;margin:20px 0;">
        <input type="range" min="14" max="30" value="17" oninput="uS(this.value)" style="width:100%;">
    </div>
    <div class="article-container">
        <h1>${title}</h1>
        <div class="post-content">${contentHtml}</div>
    </div>
    <script>
        function uC(v){const c=255-v; const h=c.toString(16).padStart(2,'0'); document.documentElement.style.setProperty('--article-text-color','#'+h+h+h);}
        function uS(v){document.documentElement.style.setProperty('--article-font-size',v+'px');}
    </script>
</body>
</html>`;

        const fileName = `post-${Date.now()}.html`;
        fs.writeFileSync(path.join(ARTICLE_DIR, fileName), template);
        res.json({ success: true, fileName, title });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(3000, () => console.log('✅ 手機專用服務已啟動'));
