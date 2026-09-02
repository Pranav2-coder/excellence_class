const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace main colors
  content = content.replace(/#16213E/gi, '#000000'); // Navy to Pure Black
  content = content.replace(/#0d152a/gi, '#000000'); // Navy gradient to Pure Black
  
  // Make background pure white
  content = content.replace(/#F8FAFC/gi, '#ffffff'); // Slate-50 background to Pure White
  content = content.replace(/bg-\[\#F8FAFC\]/gi, 'bg-white'); 
  
  // Replace accent colors to Popti Green (Tailwind 'lime')
  content = content.replace(/blue-50/g, 'lime-50');
  content = content.replace(/blue-100/g, 'lime-100');
  content = content.replace(/blue-200/g, 'lime-200');
  content = content.replace(/blue-300/g, 'lime-300');
  content = content.replace(/blue-400/g, 'lime-400');
  content = content.replace(/blue-500/g, 'lime-500');
  content = content.replace(/blue-600/g, 'lime-600');
  content = content.replace(/blue-800/g, 'lime-800');
  content = content.replace(/blue-900/g, 'lime-900');
  
  content = content.replace(/indigo-50/g, 'lime-50');
  content = content.replace(/indigo-100/g, 'lime-100');
  content = content.replace(/indigo-400/g, 'lime-400');
  content = content.replace(/indigo-500/g, 'lime-500');
  content = content.replace(/indigo-600/g, 'lime-600');
  
  content = content.replace(/emerald-50/g, 'lime-50');
  content = content.replace(/emerald-100/g, 'lime-100');
  content = content.replace(/emerald-400/g, 'lime-400');
  content = content.replace(/emerald-500/g, 'lime-500');
  content = content.replace(/emerald-600/g, 'lime-600');

  // Let's also enforce pure black on elements that were slate-800 for absolute contrast
  content = content.replace(/text-slate-800/g, 'text-black');
  
  fs.writeFileSync(filePath, content);
}

function walk(dir) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walk(full);
    } else if (full.endsWith('.jsx') || full.endsWith('.js') || full.endsWith('.css')) {
      replaceInFile(full);
    }
  }
}

walk(path.join(__dirname, 'src'));
console.log('Color replacement complete!');
