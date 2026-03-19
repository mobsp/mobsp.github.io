const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 設定文章存放路徑
const ARTICLE_DIR = path.join(__dirname, 'blog/p/list');
if (!fs.existsSync(ARTICLE_DIR)) fs.mkdirSync(ARTICLE_DIR, { recursive: true });

app.post('/api/grab', async (req, res) => {
    const { url } = req.body;
    try {
        console.log(`🚀 執行抓取任務: ${url}`);
        const { data } = await axios.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        const $ = cheerio.load(data);
        
        const title = $('h1').first().text().trim() || "未命名文章";
        let contentHtml = "";
        
        // 抓取全文段落，確保不刪減
        $('p').each((i, el) => {
            const text = $(el).text().trim();
            if (text) contentHtml += `<p>${text}</p>\n                `;
        });

        // 生成部長專屬「流光設定版」模板
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
        .glass-bg { position: fixed; inset: 0; background: radial-gradient(circle at 20% 30%, #1a1a2e 0%, #000 50%); z-index: -1; }
        .article-container { max-width: 480px; margin: 0 auto; padding: 40px 20px 150px; }
        .post-header { margin-bottom: 25px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; }
        .post-content { font-size: var(--article-font-size); color: var(--article-text-color); transition: 0.1s; }
        .post-content p { margin-bottom: 20px; text-align: justify; }
        .mobi-btn { position: fixed; bottom: 30px; right: 20px; width: 50px; height: 50px; background: rgba(44,44,46,0.9); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; cursor: pointer; z-index: 1000; border: 1px solid rgba(255,255,255,0.1); }
        .mobi-panel { position: fixed; bottom: 0; left: 0; width: 100%; background: rgba(30,30,30,0.95); backdrop-filter: blur(20px); border-top-left-radius: 20px; border-top-right-radius: 20px; padding: 25px 20px 50px; transform: translateY(100%); transition: 0.3s; z-index: 999; border-top: 1px solid rgba(255,255,255,0.1); }
        .mobi-panel.show { transform: translateY(0); }
        input[type="range"] { -webkit-appearance: none; width: 100%; height: 6px; background: #333; border-radius: 3px; outline: none; margin: 15px 0; }
        input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; background: #fff; border-radius: 50%; border: 2px solid #000; cursor: pointer; }
    </style>
</head>
<body>
    <div class="glass-bg"></div>
    <div class="mobi-btn" onclick="document.getElementById('p').classList.toggle('show')"><i class="fa-solid fa-gear"></i></div>
    <div class="mobi-panel" id="p">
        <div style="display:flex; justify-content:space-between; color:#fff; font-weight:bold;"><span>閱讀設定</span><span onclick="document.getElementById('p').classList.remove('show')" style="color:var(--accent-color);cursor:pointer;">完成</span></div>
        <div style="margin-top:20px; color:#8e8e93; font-size:14px;">顏色 (白↔黑)</div>
        <input type="range" min="0" max="255" value="0" oninput="uC(this.value)" style="background:linear-gradient(to right, #fff, #000)">
        <div style="color:#8e8e93; font-size:14px;">大小</div>
        <input type="range" min="14" max="30" value="17" oninput="uS(this.value)">
    </div>
    <div class="article-container">
        <div class="post-header"><h1>${title}</h1></div>
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

app.listen(3000, () => console.log('✅ 後台已啟動'));
