/**
 * BrandChatRenderer - 品牌專用對話渲染引擎
 * 適用於：將 OpenAI 匯出的 JSON 格式轉換為品牌官網風格的 UI
 */
class BrandChatRenderer {
    /**
     * @param {Object} options 
     * @param {HTMLElement} options.container - 準備渲染對話的容器 DOM
     * @param {Object} options.assets - 檔案對照表 (assetsJson)
     * @param {String} options.brandName - 您的品牌 AI 名稱
     */
    constructor({ container, assets = null, brandName = "BRAND AI" }) {
        this.container = container;
        this.assets = assets;
        this.brandName = brandName;
    }

    /**
     * 核心啟動方法：渲染完整的 conversations.json
     * @param {Array} conversations - 傳入 JSON 陣列
     */
    render(conversations) {
        if (!Array.isArray(conversations)) {
            console.error("資料格式錯誤：需傳入 conversations 陣列");
            return;
        }

        this.container.innerHTML = ""; // 清空容器

        conversations.forEach(conv => {
            const convElement = this.createConversationWrapper(conv.title);
            
            // 關鍵邏輯：將 Mapping 轉換為有序數組並過濾有效訊息
            const messageNodes = this.parseMapping(conv.mapping);
            
            messageNodes.forEach(node => {
                if (this.isValidMessage(node)) {
                    const bubble = this.createMessageBubble(node);
                    convElement.appendChild(bubble);
                }
            });

            this.container.appendChild(convElement);
        });
    }

    /**
     * 解析 Mapping 樹：這部分是從原始 JS 邏輯優化而來
     */
    parseMapping(mapping) {
        return Object.values(mapping)
            .filter(node => node.message) // 排除掉沒有訊息的節點 (如 root)
            .sort((a, b) => (a.message.create_time || 0) - (b.message.create_time || 0));
    }

    /**
     * 檢查訊息是否包含可顯示的文字內容
     */
    isValidMessage(node) {
        const content = node.message.content;
        return content && content.parts && content.parts.some(p => typeof p === 'string' && p.trim() !== "");
    }

    /**
     * 生成品牌化的訊息泡泡 (DOM 操作)
     */
    createMessageBubble(node) {
        const msg = node.message;
        const role = msg.author.role;
        const text = msg.content.parts.join('\n');
        const msgId = msg.id;

        const bubbleDiv = document.createElement("div");
        bubbleDiv.className = `brand-msg-wrapper role-${role}`;

        // 品牌標籤渲染
        const label = document.createElement("div");
        label.className = "brand-msg-label";
        label.textContent = role === 'user' ? 'USER' : this.brandName;
        bubbleDiv.appendChild(label);

        // 內文渲染
        const contentDiv = document.createElement("div");
        contentDiv.className = "brand-msg-content";
        contentDiv.innerText = text; // 使用 innerText 防止 XSS 並保留換行
        bubbleDiv.appendChild(contentDiv);

        // 附件處理邏輯 (移植並優化)
        if (this.assets && this.assets[msgId]) {
            const files = this.assets[msgId];
            const fileContainer = document.createElement("div");
            fileContainer.className = "brand-attachment-area";
            
            files.forEach(fileName => {
                const link = document.createElement("a");
                link.href = `./${fileName}`; // 假設檔案與 HTML 同路徑
                link.className = "brand-file-link";
                link.innerHTML = `<span>📎</span> ${fileName}`;
                fileContainer.appendChild(link);
            });
            bubbleDiv.appendChild(fileContainer);
        }

        return bubbleDiv;
    }

    /**
     * 建立對話外層卡片
     */
    createConversationWrapper(title) {
        const section = document.createElement("section");
        section.className = "brand-conv-section";
        
        const h3 = document.createElement("h3");
        h3.className = "brand-conv-title";
        h3.textContent = title || "歷史對話";
        
        section.appendChild(h3);
        return section;
    }
}
