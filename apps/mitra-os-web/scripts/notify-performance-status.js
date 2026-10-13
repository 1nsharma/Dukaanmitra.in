/* eslint-disable */
/**
 * Performance Notification Alert Engine (Slack Integration)
 * Parses a Lighthouse audit JSON report and dispatches dynamic alerts if scores fall beneath specified WCAG thresholds.
 */

import fs from 'fs';
import path from 'path';

const THRESHOLD = 80;

async function sendSlackAlert(message) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.warn('⚠️ SLACK_WEBHOOK_URL is not set in environment. Logging alert content instead:');
    console.log(message);
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message }),
    });

    if (response.ok) {
      console.log('✅ Successfully dispatched Slack performance alert!');
    } else {
      console.error(`❌ Failed to send Slack alert. Status code: ${response.status}`);
    }
  } catch (error) {
    console.error('❌ Exception occurred while sending Slack notification:', error);
  }
}

function processLighthouseReport() {
  const args = process.argv.slice(2);
  const reportPath = args[0] || path.join(process.cwd(), 'reports', 'report.json');

  if (!fs.existsSync(reportPath)) {
    console.error(`❌ Lighthouse JSON report was not found at specified path: ${reportPath}`);
    process.exit(1);
  }

  try {
    const reportData = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    
    // Lighthouse V10+ standard JSON structure extracts
    const perfScore = Math.round((reportData.categories?.performance?.score || 0) * 100);
    const seoScore = Math.round((reportData.categories?.seo?.score || 0) * 100);
    const accScore = Math.round((reportData.categories?.accessibility?.score || 0) * 100);
    const bpScore = Math.round((reportData.categories?.['best-practices']?.score || 0) * 100);

    console.log(`📊 Recieved Audit Scores - Performance: ${perfScore}%, SEO: ${seoScore}%, Accessibility: ${accScore}%`);

    if (perfScore < THRESHOLD) {
      const alertMsg = `🚨 *DukaanMitra PageSpeed Degradation Alert* 🚨\n` +
        `The production endpoint performance score has fallen below the approved threshold:\n` +
        `• *Performance Score*: \`${perfScore}%\` (Threshold: ${THRESHOLD}%)\n` +
        `• *Accessibility*: \`${accScore}%\` | *SEO*: \`${seoScore}%\` | *Best Practices*: \`${bpScore}%\`\n` +
        `Please inspect the generated artifact report on the GitHub workflow audit to trace unminified files or blockage.`;
      
      sendSlackAlert(alertMsg);
    } else {
      console.log(`✅ Performance audit of ${perfScore}% is healthy (Threshold: ${THRESHOLD}%). No alert triggered.`);
    }

  } catch (error) {
    console.error('❌ Execution failed when processing Lighthouse telemetry:', error);
    process.exit(1);
  }
}

processLighthouseReport();
