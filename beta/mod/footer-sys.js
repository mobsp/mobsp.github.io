// 6號：頁尾區塊系統封裝
export function initFooter() {
    const style = document.createElement('style');
    style.textContent = `
        .ms-footer { padding: 40px 20px 100px; background: rgba(30, 30, 30, 0.5); text-align: center; border-top: 1px solid rgba(255,255,255,0.05); }
        .social-icons { display: flex; justify-content: center; gap: 25px; margin-bottom: 20px; font-size: 20px; color: #888; }
        .social-icons i:active { color: #00cec9; transform: scale(1.2); transition: 0.1s; }
        .footer-brand { font-weight: bold; color: #00cec9; letter-spacing: 2px; font-size: 14px; }
        .copyright { font-size: 10px; color: #555; margin-top: 10px; line-height: 1.5; }
    `;
    document.head.appendChild(style);

    const footer = document.createElement('footer');
    footer.className = 'ms-footer';
    footer.innerHTML = `
        <div class="social-icons">
            <i class="fa-brands fa-facebook"></i>
            <i class="fa-brands fa-instagram"></i>
            <i class="fa-brands fa-twitter"></i>
            <i class="fa-brands fa-line"></i>
        </div>
        <div class="footer-brand">Ⲙ𝔬ⲃ¡ⳝ𝔭ⲁ𝔠ⲉ</div>
        <p class="copyright">莫比空間｜Ⲙ𝔬ⲃ¡ⳝ𝔭ⲁ𝔠ⲉ Ⓒ 2023-2026<br>資源整合與數位服務入口網</p>
    `;
    document.body.appendChild(footer);
}
