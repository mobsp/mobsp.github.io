document.addEventListener('DOMContentLoaded', async () => {
  const infoRoot = qs('#dataset-info');
  const exportBtn = qs('#export-json');
  const clearBtn = qs('#clear-saved');

  const data = await loadDataset();

  const folders = new Set(data.items.map(item => item.folder)).size;
  const publicPages = data.items.filter(item => item.publicPage).length;
  const codeFiles = data.items.filter(item => item.isCodeFile).length;
  const imageFiles = data.items.filter(item => item.isImage).length;
  const audioFiles = data.items.filter(item => item.isAudio).length;
  const videoFiles = data.items.filter(item => item.isVideo).length;
  const highRisk = data.items.filter(item => item.riskLevel === '高').length;
  const mediumRisk = data.items.filter(item => item.riskLevel === '中').length;
  const lowRisk = data.items.filter(item => item.riskLevel === '低').length;
  const savedCount = getSavedIds().length;

  infoRoot.innerHTML = `
    <div class="kv">
      <div class="kv-row">
        <div class="kv-key">資料來源</div>
        <div>${escapeHtml(data.sourceWorkbook || 'files.json')}</div>
      </div>
      <div class="kv-row">
        <div class="kv-key">站點基底</div>
        <div><a href="${escapeHtml(data.siteBase || './')}" target="_blank" rel="noopener">${escapeHtml(data.siteBase || './')}</a></div>
      </div>
      <div class="kv-row">
        <div class="kv-key">產生時間</div>
        <div>${escapeHtml(data.generatedAt || '未知')}</div>
      </div>
      <div class="kv-row">
        <div class="kv-key">總項目</div>
        <div>${data.items.length}</div>
      </div>
      <div class="kv-row">
        <div class="kv-key">資料夾數量</div>
        <div>${folders}</div>
      </div>
      <div class="kv-row">
        <div class="kv-key">公開頁面</div>
        <div>${publicPages}</div>
      </div>
      <div class="kv-row">
        <div class="kv-key">程式碼檔</div>
        <div>${codeFiles}</div>
      </div>
      <div class="kv-row">
        <div class="kv-key">圖檔</div>
        <div>${imageFiles}</div>
      </div>
      <div class="kv-row">
        <div class="kv-key">音訊</div>
        <div>${audioFiles}</div>
      </div>
      <div class="kv-row">
        <div class="kv-key">影片</div>
        <div>${videoFiles}</div>
      </div>
      <div class="kv-row">
        <div class="kv-key">高風險</div>
        <div>${highRisk}</div>
      </div>
      <div class="kv-row">
        <div class="kv-key">中風險</div>
        <div>${mediumRisk}</div>
      </div>
      <div class="kv-row">
        <div class="kv-key">低風險</div>
        <div>${lowRisk}</div>
      </div>
      <div class="kv-row">
        <div class="kv-key">目前收藏</div>
        <div>${savedCount}</div>
      </div>
    </div>
  `;

  exportBtn.onclick = () => {
    triggerDownload('files.json', JSON.stringify(data, null, 2), 'application/json;charset=utf-8');
  };

  clearBtn.onclick = () => {
    localStorage.removeItem('file-list:saved');
    document.dispatchEvent(new CustomEvent('saved:changed'));
    clearBtn.textContent = '已清除';
    setTimeout(() => {
      clearBtn.textContent = '清除收藏';
      location.reload();
    }, 800);
  };
});