const fs = require('fs');

let blogContent = fs.readFileSync('components/Blog.tsx', 'utf8');
blogContent = blogContent.replace(/<img[^>]*src=\{`https:\/\/picsum\.photos\/seed\/\$\{post\.slug\}\/600\/400\?webp=1`\}[^>]*\/>/g, `<BlogThumbnail slug={post.slug} />`);
fs.writeFileSync('components/Blog.tsx', blogContent);

let blogPostContent = fs.readFileSync('components/BlogPost.tsx', 'utf8');
blogPostContent = blogPostContent.replace(/<img[^>]*src=\{`https:\/\/picsum\.photos\/seed\/\$\{slug\}\/1200\/600\?webp=1`\}[^>]*\/>/g, `<BlogThumbnail slug={slug} />`);
fs.writeFileSync('components/BlogPost.tsx', blogPostContent);
console.log("Patched Blog images 2");
