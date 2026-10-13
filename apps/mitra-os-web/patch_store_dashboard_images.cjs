const fs = require('fs');
let content = fs.readFileSync('components/StoreDashboard.tsx', 'utf8');

content = content.replace(/https:\/\/picsum\.photos\/seed\/festival\/800\/1200/g, 'https://picsum.photos/seed/placeholder/800/1200'); // Let's use a Data URI SVG instead.

content = content.replace(/https:\/\/picsum\.photos\/seed\/15428381\/1200\/800\?auto=format&fit=crop&q=80&w=800/g, 
  `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4MDAgNjAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmNTRjIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGR5PSIuM2VtIiBmaWxsPSIjOWU5ZWE0IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iNDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkludmVudG9yeSBTY2FuPC90ZXh0Pjwvc3ZnPg==`);
  
content = content.replace(/setGeneratedPoster\("https:\/\/picsum\.photos\/seed\/placeholder\/800\/1200"\);/g, 
  `setGeneratedPoster("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4MDAgMTIwMCI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik00MDAgMzAwQTEwMCAxMDAgMCAwIDEgNTAwIDQwMEExMDAgMTAwIDAgMCAxIDQwMCA1MDBBMTAwIDEwMCAwIDAgMSA1MDAgMzAwWiIgZmlsbD0iI2U1ZTdlYiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkeT0iLjNlbSIgZmlsbD0iIzZiNzI4MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjYwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Qcm9tb3Rpb25hbCBQb3N0ZXI8L3RleHQ+PC9zdmc+");`);

fs.writeFileSync('components/StoreDashboard.tsx', content);
console.log("Patched StoreDashboard.tsx images");
