#!/usr/bin/env node
/**
 * SVG 圖標自動分類工具
 * 功能: 掃描 ./assets/icon/svg 目錄，自動分類SVG檔案
 * 輸出: ./data/svg.json (分類索引)
 * 用途: 支持圖標庫快速查找與管理
 */

const fs = require('fs');
const path = require('path');

/ ============ 配置 ============
const SVG_DIR = './assets/icon/svg';
const JSON_OUTPUT_PATH = './data/svg.json';

/**
 * 分類規則映射
 * key: 分類名稱
 * value: 正則表達式 (檔名匹配規則)
 */
const CATEGORY_MAP = {
  "系統控制": /settings|server|database|power|lock|login|trash|save|edit|undo/i,
  "通訊社群": /mail|chat|phone|paperplane|share|facebook|instagram|twitter/i,
  "多媒體": /play|pause|stop|video|volume|mic|music|camera|image/i,
  "天氣自然": /sun|cloud|rainbow|rain|drop|mountain|lemon/i,
  "硬體裝置": /desktop|laptop|mobile|monitor|keyboard|battery|bluetooth/i,
  "導航位置": /home|map|pin|location|route|globe|compass/i,
  "金融商務": /bank|dollar|percent|receipt|tag|calculator|gift|medal/i,
  "圖形介面": /grid|view|box|bezier|crop|slider|circle|square|chev|arrow/i
};

/**
 * 自動掃描並分類SVG檔案
 */
function autoUpdate() {
  / 驗證來源目錄存在
  if (!fs.existsSync(SVG_DIR)) {
    console.error(`❌ 錯誤: SVG目錄不存在 (${SVG_DIR})`);
    return;
  }

  try {
    / 讀取SVG檔案列表
    const files = fs.readdirSync(SVG_DIR).filter(f => f.toLowerCase().endsWith('.svg'));
    
    if (files.length === 0) {
      console.warn(`⚠️ 警告: 未找到SVG檔案 (${SVG_DIR})`);
      return;
    }

    / 初始化分類容器
    const categorized = {};

    / 分類每個SVG檔案
    files.forEach(file => {
      let assigned = false;

      / 按優先順序匹配分類
      for (const [category, regex] of Object.entries(CATEGORY_MAP)) {
        if (regex.test(file)) {
          if (!categorized[category]) {
            categorized[category] = [];
          }
          categorized[category].push(file);
          assigned = true;
          break;  / 只分配一個分類
        }
      }

      / 未分類的檔案放入"未分類"
      if (!assigned) {
        if (!categorized["未分類"]) {
          categorized["未分類"] = [];
        }
        categorized["未分類"].push(file);
      }
    });

    / 建立輸出目錄
    const outputDir = path.dirname(JSON_OUTPUT_PATH);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    / 寫入JSON檔案
    fs.writeFileSync(
      JSON_OUTPUT_PATH,
      JSON.stringify(categorized, null, 2),
      'utf-8'
    );

    / 統計信息
    const totalFiles = files.length;
    const categoriesCount = Object.keys(categorized).length;
    console.log(`✅ SVG分類完成`);
    console.log(`   📊 總檔案數: ${totalFiles}`);
    console.log(`   📁 分類數: ${categoriesCount}`);
    console.log(`   💾 輸出: ${JSON_OUTPUT_PATH}`);

  } catch (error) {
    console.error(`❌ 執行錯誤: ${error.message}`);
    process.exit(1);
  }
}

/ ============ 主程序 ============
if (require.main === module) {
  autoUpdate();
}

module.exports = { autoUpdate, CATEGORY_MAP };
