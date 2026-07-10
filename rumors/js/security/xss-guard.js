export default class XSSGuard {
    constructor() {
        this.escapeMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2F;',
            '`': '&grave;',
            '=': '&#x3D;'
        };
    }

    / 基礎 HTML 跳脫
    escapeHTML(string) {
        if (!string) return '';
        const reg = /[&<>"'/`=]/ig;
        return String(string).replace(reg, (match) => (this.escapeMap[match]));
    }

    / 反跳脫 (用於安全環境下的渲染)
    unescapeHTML(string) {
        if (!string) return '';
        return String(string)
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#x27;/g, "'")
            .replace(/&#x2F;/g, "/")
            .replace(/&grave;/g, '`')
            .replace(/&#x3D;/g, '=');
    }

    / 驗證 URL 是否為安全協定 (防止 javascript: 攻擊)
    isSafeURL(url) {
        const safePattern = /^(https?:\/\/|\/|\.\/|\.\.\/)/i;
        return safePattern.test(url);
    }
}
