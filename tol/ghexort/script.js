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
