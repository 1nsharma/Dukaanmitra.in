const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

if (!html.includes('gtag/js?id=')) {
  const gaSnippet = `
    <!-- Google Analytics (GA4) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=%VITE_GA_MEASUREMENT_ID%"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '%VITE_GA_MEASUREMENT_ID%');
    </script>
    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>`;
    
  html = html.replace('<script src="https://checkout.razorpay.com/v1/checkout.js"></script>', gaSnippet);
  fs.writeFileSync('index.html', html);
  console.log('Added GA4 tag to index.html');
} else {
  console.log('GA4 tag already present in index.html');
}
