const fs = require('fs');

let blogContent = fs.readFileSync('components/Blog.tsx', 'utf8');
blogContent = blogContent.replace(/<img\s+src=\{`https:\/\/picsum\.photos\/seed\/\$\{post\.slug\}\/600\/400\?webp=1`\}\s*alt=\{post\.title\}\s*className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"\s*\/>/g, `<BlogThumbnail slug={post.slug} />`);
if(!blogContent.includes('BlogThumbnail')) {
  blogContent = blogContent.replace(/import React/, `import { BlogThumbnail } from './ui/Mockups';\nimport React`);
} else {
  // If already imported, no issue
}
fs.writeFileSync('components/Blog.tsx', blogContent);

let blogPostContent = fs.readFileSync('components/BlogPost.tsx', 'utf8');
blogPostContent = blogPostContent.replace(/<img\s+src=\{`https:\/\/picsum\.photos\/seed\/\$\{slug\}\/1200\/600\?webp=1`\}\s*alt=\{post\.title\}\s*className="w-full h-full object-cover"\s*\/>/g, `<BlogThumbnail slug={slug} />`);
if(!blogPostContent.includes('BlogThumbnail')) {
  blogPostContent = blogPostContent.replace(/import React/, `import { BlogThumbnail } from './ui/Mockups';\nimport React`);
}
fs.writeFileSync('components/BlogPost.tsx', blogPostContent);
console.log("Patched Blog images");
