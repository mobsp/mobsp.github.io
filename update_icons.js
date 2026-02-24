const fs = require('fs');
const path = require('path');

const svgDir = './assets/icon/svg';
const jsonPath = './data/svg.json';

const categoryMap = {
  "系統控制": /settings|server|database|power|lock|login|trash|save|edit|undo/,
  "通訊社群": /mail|chat|phone|paperplane|share|facebook|instagram|twitter/,
  "多媒體": /play|pause|stop|video|volume|mic|music|camera|image/,
  "天氣自然": /sun|cloud|rainbow|rain|drop|mountain|lemon/,
  "硬體裝置": /desktop|laptop|mobile|monitor|keyboard|battery|bluetooth/,
  "導航位置": /home|map|pin|location|route|globe|compass/,
  "金融商務": /bank|dollar|percent|receipt|tag|calculator|gift|medal/,
  "圖形介面": /grid|view|box|bezier|crop|slider|circle|square|chev|arrow/
};

function autoUpdate() {
  if (!fs.existsSync(svgDir)) return;
  const files = fs.readdirSync(svgDir).filter(f => f.endsWith('.svg'));
  const categorized = {};
  files.forEach(file => {
    let assigned = false;
    for (const [cat, regex] of Object.entries(categoryMap)) {
      if (regex.test(file.toLowerCase())) {
        if (!categorized[cat]) categorized[cat] = [];
        categorized[cat].push(file);
        assigned = true; break;
      }
    }
    if (!assigned) { if (!categorized["未分類"]) categorized["未分類"] = []; categorized["未分類"].push(file); }
  });
  if (!fs.existsSync('./data')) fs.mkdirSync('./data');
  fs.writeFileSync(jsonPath, JSON.stringify(categorized, null, 2));
  console.log('✅ 自動化清單已更新');
}
autoUpdate();
