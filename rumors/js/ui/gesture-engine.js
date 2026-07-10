export default class GestureEngine {
    constructor(element, options = {}) {
        this.element = element;
        this.options = Object.assign({
            onSwipeDown: null,
            onSwipeRight: null,
            threshold: 50,
            allowScroll: true
        }, options);

        this.touchStartY = 0;
        this.touchStartX = 0;
        this.touchMoveY = 0;
        this.touchMoveX = 0;

        this.bindEvents();
    }

    bindEvents() {
        this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
        this.element.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: !this.options.allowScroll });
        this.element.addEventListener('touchend', this.handleTouchEnd.bind(this));
    }

    handleTouchStart(e) {
        this.touchStartY = e.changedTouches[0].screenY;
        this.touchStartX = e.changedTouches[0].screenX;
    }

    handleTouchMove(e) {
        this.touchMoveY = e.changedTouches[0].screenY;
        this.touchMoveX = e.changedTouches[0].screenX;

        / 處理 Sheet 下拉的彈性阻尼效果 (Rubber band effect)
        if (this.options.onSwipeDown && this.element.scrollTop <= 0) {
            const deltaY = this.touchMoveY - this.touchStartY;
            if (deltaY > 0) {
                const damping = 0.4;
                this.element.style.transform = `translateY(${deltaY * damping}px)`;
            }
        }
    }

    handleTouchEnd() {
        const deltaY = this.touchMoveY - this.touchStartY;
        const deltaX = this.touchMoveX - this.touchStartX;

        / 恢復原位動畫
        this.element.style.transition = 'transform var(--transition-spring)';
        this.element.style.transform = 'translateY(0)';
        
        setTimeout(() => {
            this.element.style.transition = '';
        }, 400);

        / 判斷 Swipe Down (類似 iOS 關閉 Sheet)
        if (this.options.onSwipeDown && deltaY > this.options.threshold) {
            this.options.onSwipeDown();
        }

        / 判斷 Swipe Right (類似 iOS 返回上一頁)
        if (this.options.onSwipeRight && deltaX > this.options.threshold && Math.abs(deltaY) < 30) {
            this.options.onSwipeRight();
        }
    }
}
