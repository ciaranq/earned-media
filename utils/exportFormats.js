/**
 * Export Utilities
 * Generate reports in multiple formats (JSON, CSV, HTML)
 */

/**
 * Export analysis results as JSON
 * @param {object} data - Analysis data to export
 * @param {string} filename - Output filename
 * @returns {string} - JSON string
 */
function exportAsJSON(data, filename = 'analysis.json') {
  const json = JSON.stringify(data, null, 2);
  return json;
}

/**
 * Export technical audit results as CSV
 * @param {object} auditData - Technical audit data
 * @returns {string} - CSV formatted string
 */
function exportTechnicalAuditAsCSV(auditData) {
  let csv = 'Category,Issue,Severity,Message,Recommendation\n';

  const allIssues = [
    ...(auditData.crawling?.issues || []).map(i => ({ ...i, category: 'Crawling & Indexing' })),
    ...(auditData.onPage?.issues || []).map(i => ({ ...i, category: 'On-Page SEO' })),
    ...(auditData.performance?.issues || []).map(i => ({ ...i, category: 'Performance' })),
    ...(auditData.content?.issues || []).map(i => ({ ...i, category: 'Content' })),
    ...(auditData.security?.issues || []).map(i => ({ ...i, category: 'Security' })),
  ];

  allIssues.forEach(issue => {
    const escapedMessage = (issue.message || '').replace(/"/g, '""');
    const escapedRecommendation = (issue.recommendation || '').replace(/"/g, '""');
    csv += `"${issue.category}","${issue.type || ''}","${issue.severity}","${escapedMessage}","${escapedRecommendation}"\n`;
  });

  return csv;
}

/**
 * Export keyword research as CSV
 * @param {object} keywordData - Keyword research data
 * @returns {string} - CSV formatted string
 */
function exportKeywordsAsCSV(keywordData) {
  let csv = 'Keyword,Type,Frequency,Search Intent,Difficulty,Volume Estimate,Notes\n';

  const allKeywords = [
    ...(keywordData.primaryKeywords || []).map(k => ({ ...k, type: 'Primary' })),
    ...(keywordData.secondaryKeywords || []).map(k => ({ ...k, type: 'Secondary' })),
    ...(keywordData.longTailKeywords || []).map(k => ({ ...k, type: 'Long-Tail' })),
  ];

  allKeywords.forEach(keyword => {
    const escapedKeyword = (keyword.keyword || keyword).replace(/"/g, '""');
    const notes = (keyword.notes || '').replace(/"/g, '""');
    csv += `"${escapedKeyword}","${keyword.type}","${keyword.frequency || 0}","${keyword.intent || 'N/A'}","${keyword.difficulty || 'N/A'}","${keyword.volume || 'N/A'}","${notes}"\n`;
  });

  return csv;
}

/**
 * Export SEO strategy as CSV
 * @param {object} strategyData - Strategy generation data
 * @returns {string} - CSV formatted string
 */
function exportStrategyAsCSV(strategyData) {
  let csv = 'Month,Week,Action Item,Team,Priority,Expected Outcome,Status\n';

  strategyData.months?.forEach((month, monthIdx) => {
    month.weeks?.forEach((week, weekIdx) => {
      week.actionItems?.forEach(item => {
        const escapedItem = (item.item || '').replace(/"/g, '""');
        const escapedOutcome = (item.expectedOutcome || '').replace(/"/g, '""');
        csv += `"Month ${monthIdx + 1}","Week ${weekIdx + 1}","${escapedItem}","${item.team || 'N/A'}","${item.priority || 'Medium'}","${escapedOutcome}","Pending"\n`;
      });
    });
  });

  return csv;
}

/**
 * Generate HTML report from analysis data
 * @param {object} analysisData - Complete analysis data
 * @param {string} domain - Domain being analyzed
 * @returns {string} - HTML formatted report
 */
function generateHTMLReport(analysisData, domain) {
  const timestamp = new Date().toLocaleString();
  const score = analysisData.score || 0;

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SEO Analysis Report - ${domain}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 20px;
      background: #f5f5f5;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    h1 { color: #ea401d; margin-top: 0; }
    h2 { color: #22988d; border-bottom: 2px solid #fd9c2c; padding-bottom: 10px; }
    .score-box {
      font-size: 48px;
      font-weight: bold;
      color: ${score >= 80 ? '#28a745' : score >= 60 ? '#ffc107' : '#dc3545'};
      background: ${score >= 80 ? '#d4edda' : score >= 60 ? '#fff3cd' : '#f8d7da'};
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      text-align: center;
    }
    .issues-list {
      list-style: none;
      padding: 0;
    }
    .issue-item {
      padding: 10px;
      margin: 5px 0;
      border-left: 4px solid #999;
      border-radius: 4px;
    }
    .issue-critical { border-left-color: #dc3545; background: #f8d7da; }
    .issue-high { border-left-color: #fd7e14; background: #fff3cd; }
    .issue-medium { border-left-color: #ffc107; background: #fff3cd; }
    .issue-low { border-left-color: #17a2b8; background: #d1ecf1; }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin: 20px 0;
    }
    .metric-card {
      padding: 15px;
      background: #f9f9f9;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .metric-label { font-weight: bold; color: #666; font-size: 12px; }
    .metric-value { font-size: 20px; color: #22988d; margin-top: 5px; }
    footer {
      text-align: center;
      color: #999;
      font-size: 12px;
      margin-top: 40px;
      border-top: 1px solid #ddd;
      padding-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>SEO Analysis Report</h1>
    <p><strong>Domain:</strong> ${domain}</p>
    <p><strong>Generated:</strong> ${timestamp}</p>

    <h2>Overall Score</h2>
    <div class="score-box">${score}/100</div>

    <h2>Key Metrics</h2>
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-label">Title</div>
        <div class="metric-value">${analysisData.title ? 'Present' : 'Missing'}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Meta Description</div>
        <div class="metric-value">${analysisData.metaDescription ? 'Present' : 'Missing'}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Word Count</div>
        <div class="metric-value">${analysisData.metrics?.wordCount || 0}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Images</div>
        <div class="metric-value">${analysisData.metrics?.imgCount || 0}</div>
      </div>
    </div>
`;

  if (analysisData.issues && analysisData.issues.length > 0) {
    html += `
    <h2>Issues Found</h2>
    <ul class="issues-list">
`;
    analysisData.issues.forEach(issue => {
      html += `      <li class="issue-item issue-${issue.severity}">${issue.message}</li>\n`;
    });
    html += `    </ul>\n`;
  }

  html += `
    <footer>
      <p>Generated by SEO Agent for Earned Media</p>
      <p>Report ID: ${Date.now()}</p>
    </footer>
  </div>
</body>
</html>`;

  return html;
}

/**
 * Download helper - creates blob and triggers download
 * @param {string} content - File content
 * @param {string} filename - Filename for download
 * @param {string} contentType - MIME type
 */
function downloadFile(content, filename, contentType = 'text/plain') {
  const blob = new Blob([content], { type: contentType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

module.exports = {
  exportAsJSON,
  exportTechnicalAuditAsCSV,
  exportKeywordsAsCSV,
  exportStrategyAsCSV,
  generateHTMLReport,
  downloadFile,
};
