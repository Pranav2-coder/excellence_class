const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace text-slate, text-gray with pure black
  content = content.replace(/text-(?:slate|gray|zinc|neutral|stone)-[0-9]+/g, 'text-black');
  
  // Replace bg-slate, bg-gray with pure white
  content = content.replace(/bg-(?:slate|gray|zinc|neutral|stone)-[0-9]+/g, 'bg-white');
  
  // Replace border-slate, border-gray with pure black
  content = content.replace(/border-(?:slate|gray|zinc|neutral|stone)-[0-9]+/g, 'border-black');

  // Any remaining other colors to lime-500 (popti green)
  content = content.replace(/(?:text|bg|border)-(?:indigo|emerald|rose|orange|red|yellow|blue)-[0-9]+/g, (match) => {
    if (match.startsWith('text-')) return 'text-[#84cc16]'; // popti green text
    if (match.startsWith('bg-')) return 'bg-[#84cc16]'; // popti green bg
    if (match.startsWith('border-')) return 'border-[#84cc16]'; // popti green border
    return match;
  });

  // Ensure lime classes use the exact popti green hex #84cc16 for maximum pop
  content = content.replace(/lime-500/g, '[#84cc16]');
  content = content.replace(/lime-400/g, '[#84cc16]');
  content = content.replace(/lime-600/g, '[#84cc16]');
  content = content.replace(/lime-[0-9]+/g, '[#84cc16]');

  // Hex codes for black and white
  content = content.replace(/#16213E/gi, '#000000');
  content = content.replace(/#F8FAFC/gi, '#ffffff');
  
  fs.writeFileSync(filePath, content);
}

function walk(dir) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      walk(full);
    } else if (full.endsWith('.jsx') || full.endsWith('.js') || full.endsWith('.css') || full.endsWith('.html')) {
      replaceInFile(full);
    }
  }
}

walk(path.join(__dirname, 'src'));
console.log('Aggressive pure color replacement complete!');
