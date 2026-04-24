// SPA 切換邏輯
document.querySelectorAll("#tabbar button").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.target;

    // 切換頁面
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(target).classList.add("active");

    // 切換 tab 高亮
    document.querySelectorAll("#tabbar button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// 首頁互動按鈕
document.getElementById("home-btn").addEventListener("click", () => {
  alert("首頁互動成功！");
});

// 聊天功能
document.getElementById("chat-send").addEventListener("click", () => {
  const input = document.getElementById("chat-input");
  const msg = input.value.trim();
  if (msg) {
    const li = document.createElement("li");
    li.textContent = msg;
    document.getElementById("chat-list").appendChild(li);
    input.value = "";
  }
});

// 好友功能
document.querySelectorAll(".add-friend").forEach(btn => {
  btn.addEventListener("click", () => {
    alert("已加好友！");
  });
});

// 設定功能：切換主題
document.getElementById("toggle-theme").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});
