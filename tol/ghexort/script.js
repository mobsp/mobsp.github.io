async function fetchDir(repo, path = "", parentUl) {
  const apiUrl = `https://api.github.com/repos/${repo}/contents/${path}`;
  const res = await fetch(apiUrl);
  const data = await res.json();

  for (const item of data) {
    const li = document.createElement("li");
    li.textContent = item.name;

    if (item.type === "file") {
      li.onclick = async () => {
        const fileRes = await fetch(item.download_url);
        const text = await fileRes.text();
        document.getElementById("file-content").textContent = text;
      };
    } else if (item.type === "dir") {
      li.classList.add("folder");
      const subUl = document.createElement("ul");
      li.appendChild(subUl);
      li.onclick = () => {
        if (subUl.childElementCount === 0) {
          fetchDir(repo, item.path, subUl);
        }
        subUl.style.display = subUl.style.display === "none" ? "block" : "none";
      };
    }
    parentUl.appendChild(li);
  }
}

document.getElementById("load-btn").onclick = () => {
  const repo = document.getElementById("repo-input").value.trim();
  if (!repo) return;
  const tree = document.getElementById("file-tree");
  tree.innerHTML = "";
  fetchDir(repo, "", tree);
};
