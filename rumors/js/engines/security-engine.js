import XSSGuard from '../security/xss-guard.js';

export default class SecurityEngine {
    constructor() {
        this.xssGuard = new XSSGuard();
        this.rateLimitMap = new Map();
        console.log('[SecurityEngine] Engine initialized.');
    }

    / 啟動 Content Security Policy (僅支援由 Meta Tag 模擬或 Backend Header 發送)
    enforceCSP() {
        const meta = document.createElement('meta');
        meta.httpEquiv = 'Content-Security-Policy';
        / 嚴格模式：僅允許自身資源與特定圖床
        meta.content = "default-src 'self'; img-src 'self' https://images.unsplash.com data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-eval'; connect-src 'self' https://api.rumors-platform.com;";
        document.head.appendChild(meta);
        console.log('[SecurityEngine] Basic CSP Rules Enforced.');
    }

    / 輸入過濾 (Sanitization)
    sanitizeInput(rawString) {
        return this.xssGuard.escapeHTML(rawString);
    }

    / 客戶端模擬 Rate Limit (防止暴力點擊)
    checkRateLimit(actionKey, maxRequests = 3, timeWindowMs = 5000) {
        const now = Date.now();
        const record = this.rateLimitMap.get(actionKey) || { count: 0, firstTime: now };

        if (now - record.firstTime > timeWindowMs) {
            record.count = 1;
            record.firstTime = now;
            this.rateLimitMap.set(actionKey, record);
            return true;
        }

        if (record.count >= maxRequests) {
            console.warn(`[SecurityEngine] Rate limit exceeded for action: ${actionKey}`);
            return false;
        }

        record.count++;
        this.rateLimitMap.set(actionKey, record);
        return true;
    }
}
