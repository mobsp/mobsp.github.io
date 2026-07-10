export default class ChatMessageList {
    constructor() {
        this.container = document.createElement('div');
        this.container.className = 'module-chat view-fade-in';
        this.container.style.display = 'flex';
        this.container.style.flexDirection = 'column';
        this.container.style.height = '100%';
    }

    async render() {
        // LINE/iOS iMessage Style UI
        this.container.innerHTML = `
            <div id="chat-messages" style="flex: 1; padding: var(--space-md); overflow-y: auto; display: flex; flex-direction: column; gap: 12px; padding-bottom: 80px;">
                <div style="text-align: center; margin-bottom: 16px;">
                    <span style="font-size: 11px; color: var(--color-bg-surface); background: var(--color-text-tertiary); padding: 4px 12px; border-radius: 12px;">昨天 14:20</span>
                </div>
                
                <!-- Left Bubble (Other User) -->
                <div style="display: flex; align-items: flex-end; gap: 8px;">
                    <img src="./assets/images/avatars/default.svg" style="width: 32px; height: 32px; border-radius: 50%;">
                    <div style="background: var(--color-bg-surface-elevated); padding: 10px 14px; border-radius: 18px; border-bottom-left-radius: 4px; max-width: 70%; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                        <p class="text-body">這套系統的架構寫得如何？</p>
                    </div>
                </div>

                <!-- Right Bubble (Current User) -->
                <div style="display: flex; justify-content: flex-end;">
                    <div style="background: var(--color-primary); color: white; padding: 10px 14px; border-radius: 18px; border-bottom-right-radius: 4px; max-width: 70%; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                        <p class="text-body">完全不用 AI 技術，純手寫 PWA 加上 iOS 級別的 Design System，感覺很順。</p>
                    </div>
                </div>
            </div>

            <!-- Chat Input Bar -->
            <div class="chat-input-bar liquid-glass-header" style="position: absolute; bottom: 0; left: 0; right: 0; padding: 8px var(--space-md) calc(8px + var(--safe-bottom)) var(--space-md); display: flex; align-items: center; gap: 12px; border-top: 0.5px solid var(--color-border); border-bottom: none;">
                <button style="color: var(--color-primary); font-size: 24px;">+</button>
                <div style="flex: 1; background: var(--color-bg-surface); border: 1px solid var(--color-border); border-radius: 20px; padding: 6px 12px; display: flex; align-items: center;">
                    <input type="text" placeholder="Aa" style="width: 100%; border: none; background: transparent; font-size: 16px; outline: none;">
                </div>
                <button style="color: var(--color-primary); display: flex; align-items: center; justify-content: center; background: rgba(0, 122, 255, 0.1); border-radius: 50%; width: 32px; height: 32px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
            </div>
        `;
        return this.container;
    }

    mount() {
        const messagesArea = this.container.querySelector('#chat-messages');
        messagesArea.scrollTop = messagesArea.scrollHeight; // 自動滾動到底部
        
        // 隱藏全域 Tab Bar 讓出空間給輸入框
        const tabBar = document.querySelector('.tab-bar');
        if (tabBar) tabBar.style.display = 'none';
    }

    destroy() {
        // 恢復全域 Tab Bar
        const tabBar = document.querySelector('.tab-bar');
        if (tabBar) tabBar.style.display = 'flex';
        console.log('[ChatMessageList] Destroyed');
    }
}
