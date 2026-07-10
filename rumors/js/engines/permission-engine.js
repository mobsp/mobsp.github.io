export default class PermissionEngine {
    constructor() {
        this.rolesPath = './config/roles.json';
        this.rolesData = null;
        this.currentUserRole = 'guest';
        this.currentTier = 'free';
    }

    async initialize() {
        try {
            const res = await fetch(this.rolesPath);
            this.rolesData = await res.json();
            console.log('[PermissionEngine] RBAC Rules loaded.');
        } catch (error) {
            console.error('[PermissionEngine] Failed to load RBAC rules:', error);
        }
    }

    setUser(role, tier) {
        if (this.rolesData.roles[role]) {
            this.currentUserRole = role;
        }
        if (this.rolesData.membership_tiers[tier]) {
            this.currentTier = tier;
        }
    }

    // 檢查是否有足夠的等級權限 (Level-based RBAC)
    hasPermission(requiredRole) {
        if (!this.rolesData) return false;
        
        const userLevel = this.rolesData.roles[this.currentUserRole].level;
        const requiredLevel = this.rolesData.roles[requiredRole].level;
        
        return userLevel >= requiredLevel;
    }

    // 檢查會員層級功能開關 (Feature Flag)
    canAccessFeature(featureKey) {
        if (!this.rolesData) return false;
        
        const tierConfig = this.rolesData.membership_tiers[this.currentTier];
        return tierConfig[featureKey] === true || tierConfig[featureKey] === -1; 
        // -1 represents unlimited in our system
    }

    getReadQuota() {
        if (!this.rolesData) return 0;
        return this.rolesData.membership_tiers[this.currentTier].max_articles_read;
    }
}
