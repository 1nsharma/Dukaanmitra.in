const fs = require('fs');

const wrapTable = (file) => {
  let content = fs.readFileSync(file, 'utf8');
  // Only wrap if not already wrapped
  if (content.includes('<div className="overflow-x-auto">\\n            <table')) return;
  content = content.replace(/<table/g, '<div className="overflow-x-auto pb-4"><table');
  content = content.replace(/<\/table>/g, '</table></div>');
  fs.writeFileSync(file, content);
};

wrapTable('components/ComparisonPage.tsx');
wrapTable('components/AdminDashboard.tsx');
wrapTable('components/SeoDashboard.tsx');
wrapTable('components/BlogPost.tsx');

console.log("Patched tables for responsiveness");
