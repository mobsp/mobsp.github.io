async function fetchDir(repo, path = "", parentUl) {
  const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}`;
  
  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error('API 請求失敗');
    const data = await res.json();

    // 清空舊內容（如果是重新載入）
    parentUl.innerHTML = '';

    for (const item of data) {
      const li = document.createElement("li");
      
      // 建立一個存放名稱的容器，避免點擊子選單時觸發父層事件
      const itemLabel = document.createElement("span");
      itemLabel.textContent = (item.type === "dir" ? "📁 " : "📄 ") + item.name;
      itemLabel.className = "item-label";
      li.appendChild(itemLabel);

      if (item.type === "file") {
        itemLabel.onclick = async (e) => {
          e.stopPropagation();
          const fileRes = await fetch(item.download_url);
          const text = await fileRes.text();
          document.getElementById("file-content").textContent = text;
          
          // 標記當前選中檔案
          document.querySelectorAll('.item-label').forEach(el => el.classList.remove('active'));
          itemLabel.classList.add('active');
        };
      } else if (item.type === "dir") {
        li.classList.add("folder");
        const subUl = document.createElement("ul");
        subUl.style.display = "none"; // 預設隱藏
        li.appendChild(subUl);

        itemLabel.onclick = (e) => {
          e.stopPropagation();
          if (subUl.childElementCount === 0) {
            fetchDir(repo, item.path, subUl);
          }
          // 切換展開/縮合狀態
          const isHidden = subUl.style.display === "none";
          subUl.style.display = isHidden ? "block" : "none";
          itemLabel.textContent = (isHidden ? "📂 " : "📁 ") + item.name;
        };
      }
      parentUl.appendChild(li);
    }
  } catch (err) {
    console.error("載入出錯:", err);
  }
}

document.getElementById("load-btn").onclick = () => {
  const repo = document.getElementById("repo-input").value.trim();
  if (!repo) return;
  const tree = document.getElementById("file-tree");
  tree.innerHTML = "<li>載入中...</li>";
  fetchDir(repo, "", tree);
};
