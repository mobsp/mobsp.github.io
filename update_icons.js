const fs = require('fs');
const path = require('path');

const svgDir = './assets/icon/svg';
const jsonPath = './data/svg.json';

// 自動分類關鍵字映射
const categoryMap = {
  "天氣": /sun|cloud|rain|snow|temp/,
  "通訊": /mail|chat|phone|share|send/,
  "系統": /setting|gear|server|database|power/,
  "裝置": /mobile|laptop|desktop|monitor|keyboard/,
  "形狀": /circle|square|triangle|heart|star/
};

function autoUpdate() {
  const files = fs.readdirSync(svgDir).filter(f => f.endsWith('.svg'));
  const categorized = {};

  files.forEach(file => {
    let assigned = false;
    for (const [cat, regex] of Object.entries(categoryMap)) {
      if (regex.test(file.toLowerCase())) {
        if (!categorized[cat]) categorized[cat] = [];
        categorized[cat].push(file);
        assigned = true;
        break;
      }
    }
    if (!assigned) {
      if (!categorized["其他"]) categorized["其他"] = [];
      categorized["其他"].push(file);
    }
  });

  fs.writeFileSync(jsonPath, JSON.stringify(categorized, null, 2));
  console.log('✅ JSON 已自動分類更新！');
}

autoUpdate();
