export default class DashboardView {
    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'module-dashboard view-fade-in';
    }

    async render() {
        this.container.innerHTML = `
            <div style="padding: var(--space-md);">
                <h2 class="text-title-1" style="margin-bottom: var(--space-lg);">CMS 後台</h2>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: var(--space-lg);">
                    <div class="liquid-glass-panel" style="padding: var(--space-md); border-radius: 16px;">
                        <div class="text-caption-1" style="color: var(--color-text-secondary);">總文章數</div>
                        <div class="text-title-1" style="color: var(--color-primary); margin-top: 4px;">1,204</div>
                    </div>
                    <div class="liquid-glass-panel" style="padding: var(--space-md); border-radius: 16px;">
                        <div class="text-caption-1" style="color: var(--color-text-secondary);">活躍會員</div>
                        <div class="text-title-1" style="color: var(--color-success); margin-top: 4px;">892</div>
                    </div>
                </div>

                <div class="liquid-glass-panel" style="border-radius: 16px; overflow: hidden;">
                    <ul style="margin: 0; padding: 0;">
                        ${this.renderSettingsCell('管理文章', '編輯與發布', 'text-doc')}
                        ${this.renderSettingsCell('會員權限', 'RBAC 設定', 'users')}
                        ${this.renderSettingsCell('系統日誌', 'Audit Log', 'activity')}
                        ${this.renderSettingsCell('模式切換', 'Mode C (Hybrid)', 'cpu', true)}
                    </ul>
                </div>
            </div>
        `;
        return this.container;
    }

    renderSettingsCell(title, subtitle, icon, isLast = false) {
        const borderStyle = isLast ? '' : 'border-bottom: 0.5px solid var(--color-divider);';
        return `
            <li style="display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: var(--color-bg-surface); ${borderStyle}">
                <div style="display: flex; align-items: center;">
                    <div style="width: 28px; height: 28px; border-radius: 6px; background: var(--color-primary); display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; margin-right: 12px;">
                        <!-- Icon Placeholder -->★
                    </div>
                    <div>
                        <div class="text-body">${title}</div>
                    </div>
                </div>
                <div style="display: flex; align-items: center;">
                    <span class="text-subhead" style="color: var(--color-text-secondary); margin-right: 8px;">${subtitle}</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-tertiary)" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
            </li>
        `;
    }

    mount() {}
    destroy() {}
}
