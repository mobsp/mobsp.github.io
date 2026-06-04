# file-list

這不是骨架版。這份壓縮檔已經內建 `data/files.json`，資料來自你上傳的 `Github儲存庫_mobsp.xlsx`。

## 放置方式

把整個 `file-list/` 放到 repo 根目錄：

```text
mobsp.github.io/
├─ index.html
├─ blog/
├─ browser/
└─ file-list/
```

## 主要頁面

- `file-list/index.html`
- `file-list/all-links.html`
- `file-list/detail.html`
- `file-list/saved.html`
- `file-list/settings.html`

## 目前已完成

- 123 筆真實資料
- 所有連結清單
- 即時搜尋
- 排序
- 顯示方式切換：卡片 / 緊湊 / 表格
- 資料夾 / 類型 / 風險篩選
- 收藏
- 詳情頁
- PWA / 離線頁

## 網址

部署後可用：

- `https://mobsp.qzz.io/file-list/`
- `https://mobsp.qzz.io/file-list/all-links.html`


## 自動更新（已包含）

這份最終包另外附了：

```text
.github/workflows/sync-file-list.yml
file-list/scripts/sync_from_repo.py
```

作用：

- 每次推送到 `main`
- 自動掃描 repo 檔案
- 重新產生 `file-list/data/files.json`
- 有變更就自動 commit 回 repo

### 注意
- 工作流程會略過 `file-list/` 自己，避免把站台自身檔案也混進清單
- 會保留既有 `files.json` 裡已有路徑的人工欄位，例如 `name`、`summary`、`improvements`、`risks`
- 新增的檔案會自動產生預設名稱、說明、風險等級

## 驗收網址

部署後至少檢查：

- `/file-list/`
- `/file-list/all-links.html`
- `/file-list/data/files.json`
- `/file-list/detail.html?id=app-yaml`
