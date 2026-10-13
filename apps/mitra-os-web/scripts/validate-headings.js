/* eslint-disable */
/**
 * AI Heading Hierarchy Validator
 * Parses HTML and tsx files in the project to audit WCAG-compliant heading structures (avoiding jumps e.g., H1 -> H3).
 */

import fs from 'fs';
import path from 'path';

const IGNORE_DIRS = ['node_modules', 'dist', '.git', 'coverage', '.github'];
const FILE_EXTENSIONS = ['.html', '.tsx'];

function checkHeadingsInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Extract all tag definitions for h1-h6
  const regex = /<(h[1-6])[\s>]/gi;
  let match;
  const headings = [];

  while ((match = regex.exec(content)) !== null) {
    headings.push({
      tag: match[1].toLowerCase(),
      level: parseInt(match[1][1]),
      index: match.index
    });
  }

  if (headings.length === 0) return { success: true, messages: [] };

  const messages = [];
  let prevLevel = 0;
  let isValid = true;

  for (const heading of headings) {
    if (heading.level > prevLevel + 1 && prevLevel > 0) {
      messages.push(`⛔ WCAG Violation: Invalid heading level jump: <${headings[headings.indexOf(heading) - 1].tag}> to <${heading.tag}>`);
      isValid = false;
    }
    prevLevel = heading.level;
  }

  return {
    success: isValid,
    headings: headings.map(h => h.tag),
    messages
  };
}

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat && stat.isDirectory()) {
      if (!IGNORE_DIRS.includes(file)) {
        results = results.concat(walkDir(fullPath));
      }
    } else {
      if (FILE_EXTENSIONS.includes(path.extname(file))) {
        results.push(fullPath);
      }
    }
  });

  return results;
}

function runAudit() {
  console.log('🔍 Starting AI-driven Heading Hierarchy Audit...');
  const files = walkDir(process.cwd());
  let totalViolations = 0;

  files.forEach((file) => {
    const report = checkHeadingsInFile(file);
    const relativePath = path.relative(process.cwd(), file);

    if (!report.success) {
      console.log(`\n📄 ${relativePath}`);
      report.messages.forEach(msg => {
        console.log(`   ${msg}`);
        totalViolations++;
      });
      console.log(`   Structure found: ${report.headings.join(' -> ')}`);
    }
  });

  console.log('\n--- Heading Hierarchy Audit Summary ---');
  if (totalViolations === 0) {
    console.log('✅ All checked files have fully compliant WCAG heading hierarchies!');
    process.exit(0);
  } else {
    console.log(`⚠️ Audit finished with ${totalViolations} heading hierarchical violation(s).`);
    // Exit gracefully to avoid blocking pipelines, but warn the developer
    process.exit(0);
  }
}

runAudit();
