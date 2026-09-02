const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'src', 'index.css');
let css = fs.readFileSync(cssPath, 'utf8');

// Replace slate/gray colors
css = css.replace(/#f8f9fa/gi, '#ffffff');
css = css.replace(/#dee2e6/gi, '#000000');
css = css.replace(/#adb5bd/gi, '#000000');
css = css.replace(/#f1f5f9/gi, '#ffffff');
css = css.replace(/#e2e8f0/gi, '#000000');
css = css.replace(/#64748b/gi, '#000000');
css = css.replace(/#94a3b8/gi, '#000000');
css = css.replace(/#cbd5e1/gi, '#000000');

// Replace purples with popti green
css = css.replace(/#6366f1/gi, '#84cc16');
css = css.replace(/#4f46e5/gi, '#84cc16');
css = css.replace(/#4338ca/gi, '#84cc16');
css = css.replace(/#7175f3/gi, '#84cc16');
css = css.replace(/#5a52e8/gi, '#84cc16');

// Shadow colors
css = css.replace(/rgba\(22,\s*33,\s*62/g, 'rgba(0, 0, 0');
css = css.replace(/rgba\(99,\s*102,\s*241/g, 'rgba(132, 204, 22');

fs.writeFileSync(cssPath, css);
console.log('CSS fixed');
