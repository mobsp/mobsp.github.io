window.onload = async function() {
    try {
        // 1. 讀取數據中心資料
        const response = await fetch('data/announcements.json');
        const data = await response.json();

        // 2. 處理隨機跑馬燈
        const marqueeBox = document.getElementById('marquee-text');
        if (marqueeBox && data.marquee.length > 0) {
            const randomIndex = Math.floor(Math.random() * data.marquee.length);
            marqueeBox.textContent = data.marquee[randomIndex];
        }

        // 3. 處理彈窗顯示邏輯
        const hasAgreed = localStorage.getItem('mobi_agreed_version');
        if (hasAgreed !== data.legal.version) {
            showModal(data.legal);
        }
    } catch (error) {
        console.error("資料讀取失敗:", error);
    }
};

function showModal(legalData) {
    const overlay = document.getElementById('overlay');
    const title = document.getElementById('modal-title');
    const content = document.getElementById('modal-content');
    
    title.textContent = legalData.title;
    content.textContent = legalData.content;
    overlay.style.display = 'flex';
}

function handleAgree() {
    // 記住版本號，下次進來不再彈出
    localStorage.setItem('mobi_agreed_version', '2024.1'); 
    document.getElementById('overlay').style.display = 'none';
}

function handleDisagree() {
    // 不同意則轉跳至 404
    window.location.href = '../404.html';
}

