/**
 * @class MobSpaceEngine
 * @version 3.0.0
 * @description 莫比空間：全方位數位資源整合與導航入口 - 核心渲染引擎
 */
class MobSpaceEngine {
    constructor({ container, brandName = "Ⲙ𝔬ⲃ¡ⳝ𝔭ⲁ𝔠ⲉ", assets = null }) {
        this.container = container;
        this.brandName = brandName;
        this.assets = assets;
        this.plugins = {}; / 存放黑科技插件：圖書館、實驗室、多媒體、轉換器
        
        / 修正：自動偵測 GitHub Pages 路徑地雷
        this.baseUrl = window.location.hostname.includes('github.io') 
            ? `/${window.location.pathname.split('/')[1]}/` 
            : '/';
    }

    /**
     * 核心：自動辨識格式並渲染 (支援 OpenAI 格式與自定義極簡格式)
     */
    render(data) {
        this.container.innerHTML = ""; / 清空容器
        
        / 判斷是單一檔案還是打包後的「1.json」索引格式
        const conversations = this.identifyAndNormalize(data);
        
        conversations.forEach(conv => {
            const wrapper = this.createConversationWrapper(conv.title);
            const messages = conv.messages || []; / 經過正規化後的統一訊息陣列
            
            messages.forEach(msg => {
                wrapper.appendChild(this.createMessageBubble(msg));
            });
            this.container.appendChild(wrapper);
        });
    }

    /**
     * 強化：格式自動辨識與正規化邏輯
     */
    identifyAndNormalize(data) {
        / 1. 如果是 OpenAI 的 mapping 結構
        if (data.mapping || (Array.isArray(data) && data[0].mapping)) {
            const list = Array.isArray(data) ? data : [data];
            return list.map(item => ({
                title: item.title,
                messages: Object.values(item.mapping)
                    .filter(n => n.message && n.message.content)
                    .sort((a, b) => (a.message.create_time || 0) - (b.message.create_time || 0))
                    .map(n => ({
                        role: n.message.author.role,
                        text: n.message.content.parts.join('\n'),
                        id: n.message.id
                    }))
            }));
        }
        / 2. 如果是簡單的 [{role, text}] 格式
        if (Array.isArray(data) && data[0].role) {
            return [{ title: "快速對話", messages: data }];
        }
        return [];
    }

    /**
     * 修正：對話泡泡生成邏輯 (支援 HTML、多媒體預覽與工具接口)
     */
    createMessageBubble(msg) {
        const bubble = document.createElement("div");
        bubble.className = `brand-msg-wrapper role-${msg.role}`;

        const label = document.createElement("div");
        label.className = "brand-msg-label";
        label.textContent = msg.role === 'user' ? 'USER' : this.brandName;

        const content = document.createElement("div");
        content.className = "brand-msg-content";
        
        / 修改：使用 innerHTML 支援 .md 內的 HTML 語法，並偵測數位資源關鍵字
        content.innerHTML = this.processContent(msg.text);

        bubble.append(label, content);
        
        / 呼叫「多媒體融合」插件：偵測是否有圖檔、影音或 3D 資源需要預覽
        if (this.assets && this.assets[msg.id]) {
            bubble.appendChild(this.renderMediaPreview(this.assets[msg.id]));
        }

        return bubble;
    }

    /**
     * 黑科技處理器：處理文字、指令與執行按鈕
     */
    processContent(text) {
        let html = text;
        
        / 1. 基本安全過濾 (Sanitize)
        html = html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gms, "");

        / 2. 插件觸發：即時代碼實驗室 (Code Sandbox)
        / 偵測到程式碼區塊時，自動注入「🚀 執行」按鈕
        if (html.includes("```html") || html.includes("```javascript")) {
            html += `<div class="sandbox-trigger" onclick="runLab()">🚀 啟動實驗室預覽</div>`;
        }

        return html;
    }

    /**
     * 多媒體融合：實現正確的預覽 (圖片、閱讀、觀賞、聆聽)
     */
    renderMediaPreview(fileList) {
        const area = document.createElement("div");
        area.className = "brand-media-area";
        
        fileList.forEach(fileName => {
            const ext = fileName.split('.').pop().toLowerCase();
            const filePath = `${this.baseUrl}${fileName}`;

            if (['jpg', 'png', 'svg', 'webp'].includes(ext)) {
                area.innerHTML += `<img src="${filePath}" class="preview-img" title="點擊放大圖片">`;
            } else if (['mp4', 'webm'].includes(ext)) {
                area.innerHTML += `<video controls class="preview-video"><source src="${filePath}"></video>`;
            } else if (['mp3', 'wav'].includes(ext)) {
                area.innerHTML += `<audio controls class="preview-audio"><source src="${filePath}"></audio>`;
            } else {
                area.innerHTML += `<a href="${filePath}" class="file-link">📎 閱讀文檔: ${fileName}</a>`;
            }
        });
        return area;
    }

    createConversationWrapper(title) {
        const section = document.createElement("section");
        section.className = "brand-conv-section";
        section.innerHTML = `<h3 class="brand-conv-title">${title || "Ⲙ𝔬ⲃ¡ⳝ𝔭ⲁ𝔠ⲉ 導航紀錄"}</h3>`;
        return section;
    }
}
