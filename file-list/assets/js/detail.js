document.addEventListener('DOMContentLoaded', async () => {
  const data = await loadDataset();
  const id = new URLSearchParams(location.search).get('id');
  const item = data.items.find(entry => entry.id === id);

  if (!item) {
    qs('#detail-root').innerHTML = `
      <div class="empty-state panel">
        <h2>找不到這筆資料</h2>
        <p>請從清單頁重新進入。</p>
        <a class="btn primary" href="./all-links.html">回到所有連結清單</a>
      </div>
    `;
    return;
  }

  document.title = `${item.name} | file-list`;

  qs('#detail-root').innerHTML = `
    <section class="detail-layout">
      <section class="detail-section panel">
        <div class="meta">
          ${badge(item.folder, 'folder')}
          ${badge(fmtType(item.type))}
          ${badge(`風險 ${item.riskLevel}`, `risk-${item.riskLevel}`)}
          ${item.mediaCategory !== 'none' ? badge(item.mediaCategory === 'image' ? '圖檔' : item.mediaCategory === 'audio' ? '音訊' : '影片', `media-${item.mediaCategory}`) : ''}
        </div>

        <h1>${escapeHtml(item.name)}</h1>
        <p class="detail-lead">${escapeHtml(item.summary || '尚未提供說明')}</p>

        <div class="card-actions">
          <a class="btn primary" href="${escapeHtml(item.url)}" target="_blank" rel="noopener">開啟原始連結</a>
          <a class="btn" href="${escapeHtml(item.githubBlobUrl)}" target="_blank" rel="noopener">GitHub 檢視</a>
          <a class="btn" href="${escapeHtml(item.githubEditUrl)}" target="_blank" rel="noopener">GitHub 編輯</a>
          <button class="btn save-btn" data-id="${escapeHtml(item.id)}" type="button">${isSaved(item.id) ? '取消收藏' : '收藏'}</button>
          <button class="btn" id="copy-link" type="button">複製網址</button>
        </div>

        <div class="detail-tabs">
          <button class="tab-btn active" type="button" data-tab="overview">概覽</button>
          <button class="tab-btn" type="button" data-tab="source">原始碼 / 預覽</button>
          <button class="tab-btn" type="button" data-tab="suggestions">建議</button>
          <button class="tab-btn" type="button" data-tab="risks">風險</button>
        </div>

        <div class="tab-panel active" data-panel="overview">
          <div class="detail-section surface-soft" style="margin-top:16px">
            <h2>檔案說明</h2>
            <p>${escapeHtml(item.summary || '尚未提供說明')}</p>
          </div>

          <div class="detail-section surface-soft" style="margin-top:16px">
            <h2>其它</h2>
            <p>${escapeHtml(item.notes || '—')}</p>
          </div>
        </div>

        <div class="tab-panel" data-panel="source">
          <div class="code-toolbar">
            <button class="btn" id="load-source" type="button">載入內容</button>
            <button class="btn" id="toggle-edit" type="button" disabled>切換編輯</button>
            <button class="btn" id="copy-code" type="button" disabled>複製內容</button>
            <button class="btn" id="download-code" type="button" disabled>下載內容</button>
            <button class="btn" id="reset-code" type="button" disabled>重置內容</button>
          </div>
          <div id="source-root">
            <div class="code-empty">尚未載入內容。點上方「載入內容」。</div>
          </div>
        </div>

        <div class="tab-panel" data-panel="suggestions">
          <div class="detail-section surface-soft" style="margin-top:16px">
            <h2>進階 / 優化建議</h2>
            <p>${escapeHtml(item.improvements || '目前沒有補充建議')}</p>
          </div>
        </div>

        <div class="tab-panel" data-panel="risks">
          <div class="detail-section surface-soft" style="margin-top:16px">
            <h2>風險 / 安全 / 隱私 / 注意事項</h2>
            <p>${escapeHtml(item.risks || '目前沒有補充風險說明')}</p>
          </div>
        </div>
      </section>

      <aside class="detail-section panel">
        <h2>檔案資訊</h2>
        <div class="kv">
          <div class="kv-row">
            <div class="kv-key">檔案路徑</div>
            <div class="mono">${escapeHtml(item.path)}</div>
          </div>
          <div class="kv-row">
            <div class="kv-key">網站連結</div>
            <div><a href="${escapeHtml(item.url)}" target="_blank" rel="noopener">${escapeHtml(item.url)}</a></div>
          </div>
          <div class="kv-row">
            <div class="kv-key">Pretty URL</div>
            <div><a href="${escapeHtml(item.prettyUrl)}" target="_blank" rel="noopener">${escapeHtml(item.prettyUrl)}</a></div>
          </div>
          <div class="kv-row">
            <div class="kv-key">副檔名</div>
            <div>${escapeHtml(item.extension || '—')}</div>
          </div>
          <div class="kv-row">
            <div class="kv-key">資料夾</div>
            <div>${escapeHtml(item.folder)}</div>
          </div>
          <div class="kv-row">
            <div class="kv-key">類型</div>
            <div>${escapeHtml(fmtType(item.type))}</div>
          </div>
          <div class="kv-row">
            <div class="kv-key">可公開頁面</div>
            <div>${item.publicPage ? '是' : '否'}</div>
          </div>
          <div class="kv-row">
            <div class="kv-key">媒體分類</div>
            <div>${item.mediaCategory === 'none' ? '一般檔案' : escapeHtml(item.mediaCategory)}</div>
          </div>
          <div class="kv-row">
            <div class="kv-key">原始碼預覽</div>
            <div>${item.isCodeFile ? '可用' : '不適用'}</div>
          </div>
        </div>
      </aside>
    </section>
  `;

  wireSaveButtons(qs('#detail-root'));

  qs('#copy-link').onclick = async () => {
    try {
      await navigator.clipboard.writeText(item.url);
      qs('#copy-link').textContent = '已複製';
      setTimeout(() => {
        qs('#copy-link').textContent = '複製網址';
      }, 1200);
    } catch {}
  };

  qsa('.tab-btn').forEach(btn => {
    btn.onclick = () => {
      const tab = btn.dataset.tab;
      qsa('.tab-btn').forEach(el => el.classList.toggle('active', el === btn));
      qsa('.tab-panel').forEach(panel => panel.classList.toggle('active', panel.dataset.panel === tab));
    };
  });

  let sourceLoaded = false;
  let editMode = false;
  let originalContent = '';
  let currentContent = '';

  const sourceRoot = qs('#source-root');
  const loadBtn = qs('#load-source');
  const toggleEditBtn = qs('#toggle-edit');
  const copyCodeBtn = qs('#copy-code');
  const downloadCodeBtn = qs('#download-code');
  const resetCodeBtn = qs('#reset-code');

  function renderSourceView() {
    if (!sourceLoaded) {
      sourceRoot.innerHTML = `<div class="code-empty">尚未載入內容。點上方「載入內容」。</div>`;
      return;
    }

    if (item.mediaCategory === 'image') {
      sourceRoot.innerHTML = `
        <div class="media-preview">
          <img src="${escapeHtml(item.url)}" alt="${escapeHtml(item.name)}">
          <div class="preview-note">圖檔類型不進入程式碼編輯器，已改用圖片預覽。</div>
        </div>
      `;
      return;
    }

    if (item.mediaCategory === 'audio') {
      sourceRoot.innerHTML = `
        <div class="media-preview">
          <audio controls src="${escapeHtml(item.url)}"></audio>
          <div class="preview-note">音訊類型不進入程式碼編輯器，已改用播放器預覽。</div>
        </div>
      `;
      return;
    }

    if (item.mediaCategory === 'video') {
      sourceRoot.innerHTML = `
        <div class="media-preview">
          <video controls src="${escapeHtml(item.url)}"></video>
          <div class="preview-note">影片類型不進入程式碼編輯器，已改用播放器預覽。</div>
        </div>
      `;
      return;
    }

    if (!item.isCodeFile) {
      sourceRoot.innerHTML = `
        <div class="code-empty">
          這個檔案類型目前不提供站內編輯。請使用「GitHub 檢視」或「GitHub 編輯」。
        </div>
      `;
      return;
    }

    if (editMode) {
      sourceRoot.innerHTML = `
        <div class="editor-wrap">
          <textarea id="editor" class="textarea mono" spellcheck="false">${escapeHtml(currentContent)}</textarea>
        </div>
      `;
      qs('#editor').value = currentContent;
      qs('#editor').addEventListener('input', event => {
        currentContent = event.target.value;
      });
      return;
    }

    sourceRoot.innerHTML = `
      <div class="code-box">
        <pre><code>${escapeHtml(currentContent)}</code></pre>
      </div>
    `;
  }

  async function loadSource() {
    if (sourceLoaded) {
      renderSourceView();
      return;
    }

    loadBtn.disabled = true;
    loadBtn.textContent = '載入中…';

    try {
      if (item.mediaCategory === 'image' || item.mediaCategory === 'audio' || item.mediaCategory === 'video') {
        sourceLoaded = true;
        toggleEditBtn.disabled = true;
        copyCodeBtn.disabled = true;
        downloadCodeBtn.disabled = true;
        resetCodeBtn.disabled = true;
        renderSourceView();
        loadBtn.textContent = '已載入';
        return;
      }

      if (!item.isCodeFile) {
        sourceLoaded = true;
        toggleEditBtn.disabled = true;
        copyCodeBtn.disabled = true;
        downloadCodeBtn.disabled = true;
        resetCodeBtn.disabled = true;
        renderSourceView();
        loadBtn.textContent = '已載入';
        return;
      }

      const response = await fetch(item.githubRawUrl, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error('raw 內容讀取失敗');
      }

      originalContent = await response.text();
      currentContent = originalContent;
      sourceLoaded = true;

      toggleEditBtn.disabled = false;
      copyCodeBtn.disabled = false;
      downloadCodeBtn.disabled = false;
      resetCodeBtn.disabled = false;

      renderSourceView();
      loadBtn.textContent = '已載入';
    } catch {
      sourceRoot.innerHTML = `
        <div class="code-empty">
          讀取內容失敗。可改用「GitHub 檢視」或直接開啟原始連結。
        </div>
      `;
      loadBtn.textContent = '重新載入';
      loadBtn.disabled = false;
    }
  }

  loadBtn.onclick = loadSource;

  toggleEditBtn.onclick = () => {
    if (!sourceLoaded || !item.isCodeFile) return;
    editMode = !editMode;
    toggleEditBtn.textContent = editMode ? '切回檢視' : '切換編輯';
    renderSourceView();
  };

  copyCodeBtn.onclick = async () => {
    if (!sourceLoaded || !item.isCodeFile) return;
    try {
      await navigator.clipboard.writeText(currentContent);
      copyCodeBtn.textContent = '已複製';
      setTimeout(() => {
        copyCodeBtn.textContent = '複製內容';
      }, 1200);
    } catch {}
  };

  downloadCodeBtn.onclick = () => {
    if (!sourceLoaded || !item.isCodeFile) return;
    triggerDownload(item.path.split('/').pop() || 'download.txt', currentContent);
  };

  resetCodeBtn.onclick = () => {
    if (!sourceLoaded || !item.isCodeFile) return;
    currentContent = originalContent;
    renderSourceView();
  };
});