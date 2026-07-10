export default class ModeEngine {
    constructor() {
        this.configPath = './config/backend-mode.json';
        this.config = null;
        this.currentMode = null;
        this.endpoints = {};
    }

    async boot() {
        try {
            const response = await fetch(this.configPath);
            if (!response.ok) throw new Error('Failed to load mode configuration.');
            
            this.config = await response.json();
            this.currentMode = this.config.architecture.active_mode;
            
            this.configureEnvironment();
            return true;
        } catch (error) {
            console.error('[ModeEngine] Boot error:', error);
            // Fallback to GitHub Native Mode
            this.currentMode = 'mode_a_github';
            return false;
        }
    }

    configureEnvironment() {
        const settings = this.config.mode_configuration[this.currentMode];
        if (!settings) throw new Error(`Invalid mode: ${this.currentMode}`);

        if (this.currentMode === 'mode_a_github') {
            this.endpoints.api = settings.api_endpoint;
            console.log('[ModeEngine] Operating in Static GitHub Native Mode.');
        } 
        else if (this.currentMode === 'mode_b_backend') {
            this.endpoints.api = settings.api_endpoint;
            this.endpoints.graphql = settings.graphql_endpoint;
            console.log('[ModeEngine] Operating in Full Backend Server Mode.');
        }
        else if (this.currentMode === 'mode_c_hybrid') {
            this.endpoints.publicApi = settings.api_endpoint_public;
            this.endpoints.privateApi = settings.api_endpoint_private;
            console.log('[ModeEngine] Operating in Hybrid Fusion Mode.');
        }

        // 將特性寫入 DOM 供 CSS/JS 判斷
        document.documentElement.setAttribute('data-arch-mode', this.currentMode);
    }

    getFeatures() {
        return this.config?.mode_configuration[this.currentMode]?.features || {};
    }
}
