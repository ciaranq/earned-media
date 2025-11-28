#!/usr/bin/env ts-node

/**
 * Keyword Analysis Script for SEO Agent
 *
 * This script crawls a website and performs comprehensive keyword analysis:
 * - Keyword frequency and density
 * - Meta tags analysis
 * - Heading structure (H1-H6)
 * - Keyword mapping and visualization
 * - SEO recommendations
 *
 * Usage: npm run analyze-keywords <domain>
 * Example: npm run analyze-keywords visory.com.au
 */

import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import { URL } from 'url';
// @ts-ignore
import nlp from 'compromise';

// Configuration
const MAX_PAGES = 50;
const DEFAULT_PAGES = 20;
const CONCURRENT_REQUESTS = 3;
const REQUEST_DELAY = 500; // ms between requests

interface KeywordData {
  keyword: string;
  frequency: number;
  density: number;
  positions: string[]; // Where it appears (title, h1, h2, body, etc.)
}

interface PageData {
  url: string;
  title: string;
  metaDescription: string;
  metaKeywords: string;
  h1: string[];
  h2: string[];
  h3: string[];
  h4: string[];
  h5: string[];
  h6: string[];
  wordCount: number;
  keywords: KeywordData[];
}

interface AnalysisReport {
  domain: string;
  analyzedAt: string;
  totalPages: number;
  totalWords: number;
  topKeywords: KeywordData[];
  headingDistribution: {
    h1: number;
    h2: number;
    h3: number;
    h4: number;
    h5: number;
    h6: number;
  };
  metaAnalysis: {
    pagesWithTitle: number;
    pagesWithDescription: number;
    pagesWithKeywords: number;
    avgTitleLength: number;
    avgDescriptionLength: number;
  };
  pages: PageData[];
  recommendations: string[];
}

// Stopwords to filter out common words
const STOPWORDS = new Set([
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
  'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
  'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their',
  'what', 'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go',
  'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know',
  'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them',
  'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over',
  'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work',
  'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these',
  'give', 'day', 'most', 'us', 'is', 'was', 'are', 'been', 'has', 'had',
  'were', 'said', 'did', 'having', 'may', 'should'
]);

/**
 * Normalize domain (remove protocol, www, trailing slash)
 */
function normalizeDomain(input: string): string {
  return input
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '');
}

/**
 * Sleep function for rate limiting
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Extract all internal links from a page
 */
function extractLinks(html: string, baseUrl: string): string[] {
  const $ = cheerio.load(html);
  const links: Set<string> = new Set();
  const baseDomain = new URL(baseUrl).hostname;

  $('a[href]').each((_, element) => {
    const href = $(element).attr('href');
    if (!href) return;

    try {
      const absoluteUrl = new URL(href, baseUrl).href;
      const linkDomain = new URL(absoluteUrl).hostname;

      // Only include internal links
      if (linkDomain === baseDomain && !absoluteUrl.includes('#')) {
        links.add(absoluteUrl);
      }
    } catch (e) {
      // Invalid URL, skip
    }
  });

  return Array.from(links);
}

/**
 * Extract text content and analyze keywords
 */
function analyzeKeywords(text: string, totalWords: number): KeywordData[] {
  // Use Compromise for better keyword extraction
  const doc = nlp(text);

  // Extract meaningful terms (nouns, verbs, adjectives)
  const terms = doc.terms().out('array');

  // Count word frequencies
  const wordFreq: Map<string, number> = new Map();

  terms.forEach((term: string) => {
    const normalized = term.toLowerCase().trim();
    if (normalized.length > 2 && !STOPWORDS.has(normalized)) {
      wordFreq.set(normalized, (wordFreq.get(normalized) || 0) + 1);
    }
  });

  // Convert to KeywordData array
  const keywords: KeywordData[] = Array.from(wordFreq.entries())
    .map(([keyword, frequency]) => ({
      keyword,
      frequency,
      density: totalWords > 0 ? (frequency / totalWords) * 100 : 0,
      positions: []
    }))
    .sort((a, b) => b.frequency - a.frequency);

  return keywords;
}

/**
 * Analyze a single page
 */
async function analyzePage(url: string): Promise<PageData | null> {
  try {
    console.log(`  Analyzing: ${url}`);

    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SEO-Agent-Keyword-Analyzer/1.0)'
      }
    });

    const $ = cheerio.load(response.data);

    // Remove script and style tags
    $('script, style, noscript').remove();

    // Extract meta information
    const title = $('title').text().trim();
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const metaKeywords = $('meta[name="keywords"]').attr('content') || '';

    // Extract headings
    const h1 = $('h1').map((_, el) => $(el).text().trim()).get();
    const h2 = $('h2').map((_, el) => $(el).text().trim()).get();
    const h3 = $('h3').map((_, el) => $(el).text().trim()).get();
    const h4 = $('h4').map((_, el) => $(el).text().trim()).get();
    const h5 = $('h5').map((_, el) => $(el).text().trim()).get();
    const h6 = $('h6').map((_, el) => $(el).text().trim()).get();

    // Extract body text
    const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
    const words = bodyText.split(/\s+/);
    const wordCount = words.length;

    // Analyze keywords
    const keywords = analyzeKeywords(bodyText, wordCount);

    return {
      url,
      title,
      metaDescription,
      metaKeywords,
      h1,
      h2,
      h3,
      h4,
      h5,
      h6,
      wordCount,
      keywords: keywords.slice(0, 50) // Top 50 keywords per page
    };
  } catch (error: any) {
    console.error(`  Error analyzing ${url}:`, error.message);
    return null;
  }
}

/**
 * Crawl website and collect pages
 */
async function crawlWebsite(startUrl: string, maxPages: number): Promise<string[]> {
  const visited: Set<string> = new Set();
  const toVisit: string[] = [startUrl];
  const allUrls: string[] = [];

  console.log(`\nCrawling ${startUrl} (max ${maxPages} pages)...\n`);

  while (toVisit.length > 0 && allUrls.length < maxPages) {
    const url = toVisit.shift()!;

    if (visited.has(url)) continue;
    visited.add(url);
    allUrls.push(url);

    console.log(`[${allUrls.length}/${maxPages}] Crawling: ${url}`);

    try {
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SEO-Agent-Crawler/1.0)'
        }
      });

      const links = extractLinks(response.data, url);

      // Add new links to queue
      links.forEach(link => {
        if (!visited.has(link) && !toVisit.includes(link)) {
          toVisit.push(link);
        }
      });

      // Rate limiting
      await sleep(REQUEST_DELAY);
    } catch (error: any) {
      console.error(`  Error crawling ${url}:`, error.message);
    }
  }

  console.log(`\nFound ${allUrls.length} pages to analyze\n`);
  return allUrls;
}

/**
 * Generate SEO recommendations based on analysis
 */
function generateRecommendations(report: AnalysisReport): string[] {
  const recommendations: string[] = [];

  // Meta tags recommendations
  const metaPercentage = (report.metaAnalysis.pagesWithDescription / report.totalPages) * 100;
  if (metaPercentage < 90) {
    recommendations.push(
      `${Math.round(100 - metaPercentage)}% of pages are missing meta descriptions. Add unique, compelling descriptions to improve CTR.`
    );
  }

  if (report.metaAnalysis.avgTitleLength < 30 || report.metaAnalysis.avgTitleLength > 60) {
    recommendations.push(
      `Average title length is ${Math.round(report.metaAnalysis.avgTitleLength)} characters. Optimal length is 50-60 characters.`
    );
  }

  if (report.metaAnalysis.avgDescriptionLength < 120 || report.metaAnalysis.avgDescriptionLength > 160) {
    recommendations.push(
      `Average meta description length is ${Math.round(report.metaAnalysis.avgDescriptionLength)} characters. Optimal length is 150-160 characters.`
    );
  }

  // Heading structure recommendations
  const pagesWithoutH1 = report.pages.filter(p => p.h1.length === 0).length;
  if (pagesWithoutH1 > 0) {
    recommendations.push(
      `${pagesWithoutH1} pages are missing H1 tags. Every page should have exactly one H1 tag.`
    );
  }

  const pagesWithMultipleH1 = report.pages.filter(p => p.h1.length > 1).length;
  if (pagesWithMultipleH1 > 0) {
    recommendations.push(
      `${pagesWithMultipleH1} pages have multiple H1 tags. Use only one H1 per page for better SEO.`
    );
  }

  // Keyword recommendations
  const topKeyword = report.topKeywords[0];
  if (topKeyword) {
    recommendations.push(
      `Top keyword "${topKeyword.keyword}" appears ${topKeyword.frequency} times across all pages. Consider creating dedicated landing pages for high-frequency keywords.`
    );
  }

  // Content recommendations
  const avgWordsPerPage = report.totalWords / report.totalPages;
  if (avgWordsPerPage < 300) {
    recommendations.push(
      `Average page content is ${Math.round(avgWordsPerPage)} words. Consider expanding thin content pages to 300+ words for better SEO performance.`
    );
  }

  // Keyword density recommendations
  const highDensityKeywords = report.topKeywords.filter(k => k.density > 3);
  if (highDensityKeywords.length > 0) {
    recommendations.push(
      `${highDensityKeywords.length} keywords have density >3%, which may appear as keyword stuffing. Aim for 1-2% density for target keywords.`
    );
  }

  return recommendations;
}

/**
 * Generate HTML report
 */
function generateHTMLReport(report: AnalysisReport): string {
  const topKeywordsHTML = report.topKeywords.slice(0, 50).map((kw, index) => `
    <tr class="${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}">
      <td class="px-6 py-4 text-sm font-medium text-gray-900">${index + 1}</td>
      <td class="px-6 py-4 text-sm text-gray-900">${kw.keyword}</td>
      <td class="px-6 py-4 text-sm text-gray-700">${kw.frequency}</td>
      <td class="px-6 py-4 text-sm text-gray-700">${kw.density.toFixed(2)}%</td>
      <td class="px-6 py-4">
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div class="bg-blue-600 h-2 rounded-full" style="width: ${Math.min(kw.density * 20, 100)}%"></div>
        </div>
      </td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Keyword Analysis Report - ${report.domain}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @media print {
      .no-print { display: none; }
    }
  </style>
</head>
<body class="bg-gray-50">
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Header -->
    <div class="bg-white rounded-lg shadow-md p-8 mb-6">
      <div class="flex justify-between items-start mb-4">
        <div>
          <h1 class="text-4xl font-bold text-gray-900 mb-2">Keyword Analysis Report</h1>
          <p class="text-xl text-gray-600">${report.domain}</p>
          <p class="text-sm text-gray-500 mt-2">Generated: ${new Date(report.analyzedAt).toLocaleString()}</p>
        </div>
        <button onclick="window.print()" class="no-print bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
          Print Report
        </button>
      </div>

      <!-- Summary Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div class="text-3xl font-bold text-blue-600">${report.totalPages}</div>
          <div class="text-sm text-gray-600 mt-1">Pages Analyzed</div>
        </div>
        <div class="bg-green-50 rounded-lg p-4 border border-green-200">
          <div class="text-3xl font-bold text-green-600">${report.totalWords.toLocaleString()}</div>
          <div class="text-sm text-gray-600 mt-1">Total Words</div>
        </div>
        <div class="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div class="text-3xl font-bold text-purple-600">${report.topKeywords.length}</div>
          <div class="text-sm text-gray-600 mt-1">Unique Keywords</div>
        </div>
        <div class="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <div class="text-3xl font-bold text-orange-600">${Math.round(report.totalWords / report.totalPages)}</div>
          <div class="text-sm text-gray-600 mt-1">Avg Words/Page</div>
        </div>
      </div>
    </div>

    <!-- Meta Analysis -->
    <div class="bg-white rounded-lg shadow-md p-8 mb-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">Meta Tags Analysis</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div class="text-sm text-gray-600 mb-2">Pages with Title Tags</div>
          <div class="flex items-center">
            <div class="text-2xl font-bold text-gray-900">${report.metaAnalysis.pagesWithTitle}</div>
            <div class="text-sm text-gray-500 ml-2">/ ${report.totalPages}</div>
            <div class="ml-auto text-sm font-semibold ${report.metaAnalysis.pagesWithTitle === report.totalPages ? 'text-green-600' : 'text-orange-600'}">
              ${Math.round((report.metaAnalysis.pagesWithTitle / report.totalPages) * 100)}%
            </div>
          </div>
          <div class="text-xs text-gray-500 mt-1">Avg length: ${Math.round(report.metaAnalysis.avgTitleLength)} chars</div>
        </div>
        <div>
          <div class="text-sm text-gray-600 mb-2">Pages with Meta Description</div>
          <div class="flex items-center">
            <div class="text-2xl font-bold text-gray-900">${report.metaAnalysis.pagesWithDescription}</div>
            <div class="text-sm text-gray-500 ml-2">/ ${report.totalPages}</div>
            <div class="ml-auto text-sm font-semibold ${report.metaAnalysis.pagesWithDescription === report.totalPages ? 'text-green-600' : 'text-orange-600'}">
              ${Math.round((report.metaAnalysis.pagesWithDescription / report.totalPages) * 100)}%
            </div>
          </div>
          <div class="text-xs text-gray-500 mt-1">Avg length: ${Math.round(report.metaAnalysis.avgDescriptionLength)} chars</div>
        </div>
        <div>
          <div class="text-sm text-gray-600 mb-2">Pages with Meta Keywords</div>
          <div class="flex items-center">
            <div class="text-2xl font-bold text-gray-900">${report.metaAnalysis.pagesWithKeywords}</div>
            <div class="text-sm text-gray-500 ml-2">/ ${report.totalPages}</div>
            <div class="ml-auto text-sm font-semibold text-gray-500">
              ${Math.round((report.metaAnalysis.pagesWithKeywords / report.totalPages) * 100)}%
            </div>
          </div>
          <div class="text-xs text-gray-500 mt-1">Meta keywords are deprecated</div>
        </div>
      </div>
    </div>

    <!-- Heading Distribution -->
    <div class="bg-white rounded-lg shadow-md p-8 mb-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">Heading Structure Distribution</h2>
      <div class="grid grid-cols-2 md:grid-cols-6 gap-4">
        ${['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(heading => `
          <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div class="text-xs text-gray-600 uppercase mb-1">${heading.toUpperCase()}</div>
            <div class="text-2xl font-bold text-gray-900">${report.headingDistribution[heading as keyof typeof report.headingDistribution]}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Top Keywords -->
    <div class="bg-white rounded-lg shadow-md p-8 mb-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">Top 50 Keywords</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">#</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Keyword</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Frequency</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Density</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Visual</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            ${topKeywordsHTML}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Recommendations -->
    <div class="bg-white rounded-lg shadow-md p-8 mb-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">SEO Recommendations</h2>
      <div class="space-y-3">
        ${report.recommendations.map((rec, index) => `
          <div class="flex items-start p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div class="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
              ${index + 1}
            </div>
            <p class="text-gray-700 leading-relaxed">${rec}</p>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Page Details -->
    <div class="bg-white rounded-lg shadow-md p-8 mb-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">Page Details</h2>
      <div class="space-y-4">
        ${report.pages.slice(0, 20).map((page, index) => `
          <div class="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-lg font-semibold text-gray-900">${page.title || 'No Title'}</h3>
              <span class="text-sm text-gray-500">${page.wordCount} words</span>
            </div>
            <a href="${page.url}" class="text-sm text-blue-600 hover:underline block mb-2" target="_blank">${page.url}</a>
            ${page.metaDescription ? `<p class="text-sm text-gray-600 mb-2">${page.metaDescription}</p>` : '<p class="text-sm text-orange-600 mb-2">Missing meta description</p>'}
            <div class="flex gap-2 flex-wrap text-xs">
              ${page.h1.length > 0 ? `<span class="bg-green-100 text-green-800 px-2 py-1 rounded">H1: ${page.h1.length}</span>` : '<span class="bg-red-100 text-red-800 px-2 py-1 rounded">No H1</span>'}
              ${page.h2.length > 0 ? `<span class="bg-blue-100 text-blue-800 px-2 py-1 rounded">H2: ${page.h2.length}</span>` : ''}
              ${page.h3.length > 0 ? `<span class="bg-purple-100 text-purple-800 px-2 py-1 rounded">H3: ${page.h3.length}</span>` : ''}
            </div>
          </div>
        `).join('')}
        ${report.pages.length > 20 ? `<p class="text-sm text-gray-500 text-center pt-4">... and ${report.pages.length - 20} more pages</p>` : ''}
      </div>
    </div>

    <!-- Footer -->
    <div class="text-center text-sm text-gray-500 mt-8 pb-8">
      <p>Generated by SEO Agent for Earned Media</p>
      <p class="mt-1">Keyword Analysis Tool v1.0</p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: npm run analyze-keywords <domain>');
    console.error('Example: npm run analyze-keywords visory.com.au');
    process.exit(1);
  }

  const inputDomain = args[0];
  const domain = normalizeDomain(inputDomain);
  const startUrl = `https://${domain}`;
  const maxPages = args[1] ? Math.min(parseInt(args[1]), MAX_PAGES) : DEFAULT_PAGES;

  console.log('='.repeat(60));
  console.log('SEO Agent - Keyword Analysis Tool');
  console.log('='.repeat(60));
  console.log(`Domain: ${domain}`);
  console.log(`Max Pages: ${maxPages}`);
  console.log('='.repeat(60));

  // Step 1: Crawl website
  const urls = await crawlWebsite(startUrl, maxPages);

  if (urls.length === 0) {
    console.error('No pages found to analyze. Exiting.');
    process.exit(1);
  }

  // Step 2: Analyze pages
  console.log('\n' + '='.repeat(60));
  console.log('Analyzing Pages');
  console.log('='.repeat(60) + '\n');

  const pages: PageData[] = [];
  for (const url of urls) {
    const pageData = await analyzePage(url);
    if (pageData) {
      pages.push(pageData);
    }
    await sleep(REQUEST_DELAY);
  }

  // Step 3: Aggregate data
  console.log('\n' + '='.repeat(60));
  console.log('Aggregating Results');
  console.log('='.repeat(60) + '\n');

  const allKeywords: Map<string, KeywordData> = new Map();
  let totalWords = 0;
  const headingDistribution = { h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0 };
  let pagesWithTitle = 0;
  let pagesWithDescription = 0;
  let pagesWithKeywords = 0;
  let totalTitleLength = 0;
  let totalDescriptionLength = 0;

  pages.forEach(page => {
    totalWords += page.wordCount;

    // Count headings
    headingDistribution.h1 += page.h1.length;
    headingDistribution.h2 += page.h2.length;
    headingDistribution.h3 += page.h3.length;
    headingDistribution.h4 += page.h4.length;
    headingDistribution.h5 += page.h5.length;
    headingDistribution.h6 += page.h6.length;

    // Count meta tags
    if (page.title) {
      pagesWithTitle++;
      totalTitleLength += page.title.length;
    }
    if (page.metaDescription) {
      pagesWithDescription++;
      totalDescriptionLength += page.metaDescription.length;
    }
    if (page.metaKeywords) {
      pagesWithKeywords++;
    }

    // Aggregate keywords
    page.keywords.forEach(kw => {
      if (allKeywords.has(kw.keyword)) {
        const existing = allKeywords.get(kw.keyword)!;
        existing.frequency += kw.frequency;
      } else {
        allKeywords.set(kw.keyword, { ...kw });
      }
    });
  });

  // Recalculate densities for aggregated keywords
  const topKeywords = Array.from(allKeywords.values())
    .map(kw => ({
      ...kw,
      density: totalWords > 0 ? (kw.frequency / totalWords) * 100 : 0
    }))
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 50);

  // Create report
  const report: AnalysisReport = {
    domain,
    analyzedAt: new Date().toISOString(),
    totalPages: pages.length,
    totalWords,
    topKeywords,
    headingDistribution,
    metaAnalysis: {
      pagesWithTitle,
      pagesWithDescription,
      pagesWithKeywords,
      avgTitleLength: pagesWithTitle > 0 ? totalTitleLength / pagesWithTitle : 0,
      avgDescriptionLength: pagesWithDescription > 0 ? totalDescriptionLength / pagesWithDescription : 0
    },
    pages,
    recommendations: []
  };

  report.recommendations = generateRecommendations(report);

  // Step 4: Save results
  console.log('Saving results...\n');

  const reportsDir = path.join(process.cwd(), 'public', 'reports', domain);
  fs.mkdirSync(reportsDir, { recursive: true });

  // Save JSON
  const jsonPath = path.join(reportsDir, 'keywords.json');
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
  console.log(`✓ JSON saved to: ${jsonPath}`);

  // Save HTML
  const htmlPath = path.join(reportsDir, 'index.html');
  fs.writeFileSync(htmlPath, generateHTMLReport(report));
  console.log(`✓ HTML saved to: ${htmlPath}`);

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('Analysis Complete!');
  console.log('='.repeat(60));
  console.log(`Pages analyzed: ${report.totalPages}`);
  console.log(`Total words: ${totalWords.toLocaleString()}`);
  console.log(`Top keyword: "${topKeywords[0]?.keyword}" (${topKeywords[0]?.frequency} occurrences)`);
  console.log(`\nView report at: /reports/${domain}/index.html`);
  console.log('='.repeat(60) + '\n');
}

main().catch(console.error);
