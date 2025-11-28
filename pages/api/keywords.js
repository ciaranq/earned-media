// API endpoint for Keyword Research
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    console.log(`Performing keyword research for: ${url}`);

    try {
      const research = await performKeywordResearch(url);
      return res.status(200).json(research);
    } catch (researchError) {
      console.error('Research error:', researchError);
      return res.status(500).json({
        error: 'Research failed',
        message: researchError.message,
        stack: process.env.NODE_ENV === 'development' ? researchError.stack : undefined
      });
    }
  } catch (error) {
    console.error('Request handling error:', error);
    return res.status(500).json({
      error: 'Server error',
      message: error.message
    });
  }
}

async function performKeywordResearch(url) {
  const axios = require('axios');
  const cheerio = require('cheerio');

  try {
    console.log(`Fetching URL: ${url}`);

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SEOAgent/1.0)'
      },
      timeout: 10000,
      maxRedirects: 5
    });

    console.log(`Successfully fetched URL: ${url}, status: ${response.status}`);

    const $ = cheerio.load(response.data);

    // Remove script and style tags before extracting text
    $('script').remove();
    $('style').remove();
    $('noscript').remove();
    $('svg').remove();
    $('[class*="icon"]').remove();
    $('[class*="entypo"]').remove();
    $('[class*="fontello"]').remove();
    $('[class*="avia"]').remove();

    // Extract text content
    const title = $('title').text().trim();
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    const h1Text = $('h1').map((i, el) => $(el).text().trim()).get();
    const h2Text = $('h2').map((i, el) => $(el).text().trim()).get();

    // Clean body text - remove code-like content
    let bodyText = $('body').text().replace(/\s+/g, ' ').trim();

    // Remove common code/technical patterns from text
    bodyText = bodyText
      .replace(/document\.[a-zA-Z]+/gi, ' ')
      .replace(/window\.[a-zA-Z]+/gi, ' ')
      .replace(/\b(entypo|fontello|avia|glyphicon|dashicon)[a-z-]*/gi, ' ')
      .replace(/\b(icon-[a-z-]+|fa-[a-z-]+)/gi, ' ')
      .replace(/\b[a-z]+Icon\b/gi, ' ')
      .replace(/\b(getElementById|querySelector|className|classList)\b/gi, ' ')
      .replace(/\{[^}]*\}/g, ' ')  // Remove CSS-like blocks
      .replace(/\[[^\]]*\]/g, ' ')  // Remove bracket content
      .replace(/[a-zA-Z]+\([^)]*\)/g, ' ')  // Remove function calls
      .replace(/\b\d+px\b/gi, ' ')  // Remove pixel values
      .replace(/\b(rgba?|hsla?)\([^)]+\)/gi, ' ')  // Remove color functions
      .replace(/\s+/g, ' ')
      .trim();
    const metaKeywords = $('meta[name="keywords"]').attr('content') || '';

    // Combine all text for analysis
    const allText = [title, metaDescription, ...h1Text, ...h2Text].join(' ').toLowerCase();
    const fullText = bodyText.toLowerCase();

    // Extract domain and likely industry
    const domain = new URL(url).hostname.replace('www.', '');
    const industry = inferIndustry(title, metaDescription, allText);
    const topics = extractTopics(h1Text, h2Text);

    // Extract keywords from content (pass domain to filter brand names)
    const words = extractWords(fullText, domain);
    const wordFrequency = calculateWordFrequency(words);
    const phrases = extractPhrases(fullText, domain);
    const phraseFrequency = calculatePhraseFrequency(phrases);

    // Identify primary keywords (high frequency, meaningful terms)
    const primaryKeywords = identifyPrimaryKeywords(wordFrequency, phraseFrequency, allText);

    // Identify secondary keywords
    const secondaryKeywords = identifySecondaryKeywords(wordFrequency, phraseFrequency, primaryKeywords);

    // Generate long-tail keyword suggestions
    const longTailKeywords = generateLongTailKeywords(phrases, phraseFrequency, primaryKeywords);

    // Identify opportunities
    const opportunities = identifyOpportunities(url, title, metaDescription, primaryKeywords, industry);

    // Generate recommendations
    const recommendations = generateRecommendations(primaryKeywords, secondaryKeywords, industry);

    console.log(`Keyword research complete for ${url}`);

    return {
      url,
      industry,
      topics,
      primaryKeywords,
      secondaryKeywords,
      longTailKeywords,
      opportunities,
      recommendations
    };
  } catch (error) {
    console.error(`Error researching keywords for ${url}:`, error.message);
    if (error.code === 'ECONNABORTED') {
      throw new Error(`Timeout when connecting to ${url}`);
    }
    if (error.response) {
      throw new Error(`Failed to research keywords for ${url}: Received status ${error.response.status}`);
    }
    throw new Error(`Failed to research keywords for ${url}: ${error.message}`);
  }
}

function extractWords(text, domain = '') {
  // Comprehensive stop words list - words that don't help define page content
  const stopWords = new Set([
    // Basic stop words
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be',
    'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
    'would', 'should', 'could', 'may', 'might', 'can', 'this', 'that',
    'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'them',
    'their', 'what', 'which', 'who', 'when', 'where', 'why', 'how', 'all',
    'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such',
    'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very',

    // Pronouns and possessives
    'your', 'yours', 'our', 'ours', 'my', 'mine', 'his', 'her', 'hers', 'its',
    'myself', 'yourself', 'himself', 'herself', 'itself', 'ourselves', 'themselves',

    // Common verbs (non-descriptive)
    'get', 'got', 'getting', 'make', 'makes', 'made', 'making', 'take', 'takes',
    'took', 'taking', 'come', 'comes', 'came', 'coming', 'go', 'goes', 'went',
    'going', 'know', 'knows', 'knew', 'knowing', 'think', 'thinks', 'thought',
    'see', 'sees', 'saw', 'seeing', 'want', 'wants', 'wanted', 'wanting',
    'use', 'uses', 'used', 'using', 'find', 'finds', 'found', 'finding',
    'give', 'gives', 'gave', 'giving', 'tell', 'tells', 'told', 'telling',
    'say', 'says', 'said', 'saying', 'let', 'lets', 'need', 'needs', 'needed',
    'keep', 'keeps', 'kept', 'keeping', 'put', 'puts', 'putting', 'set', 'sets',
    'seem', 'seems', 'seemed', 'try', 'tries', 'tried', 'trying', 'ask', 'asks',
    'work', 'works', 'worked', 'working', 'call', 'calls', 'called', 'calling',
    'feel', 'feels', 'felt', 'become', 'becomes', 'became', 'leave', 'leaves',
    'begin', 'begins', 'began', 'show', 'shows', 'showed', 'shown', 'hear', 'heard',
    'play', 'plays', 'played', 'run', 'runs', 'ran', 'move', 'moves', 'moved',
    'live', 'lives', 'lived', 'believe', 'believes', 'bring', 'brings', 'brought',
    'happen', 'happens', 'happened', 'write', 'writes', 'wrote', 'written',
    'provide', 'provides', 'provided', 'sit', 'sits', 'sat', 'stand', 'stands',
    'lose', 'loses', 'lost', 'pay', 'pays', 'paid', 'meet', 'meets', 'met',
    'include', 'includes', 'included', 'continue', 'continues', 'continued',
    'learn', 'learns', 'learned', 'change', 'changes', 'changed', 'lead', 'leads',
    'understand', 'understands', 'understood', 'watch', 'watches', 'watched',
    'follow', 'follows', 'followed', 'stop', 'stops', 'stopped', 'create', 'creates',
    'speak', 'speaks', 'spoke', 'read', 'reads', 'allow', 'allows', 'allowed',
    'add', 'adds', 'added', 'spend', 'spends', 'spent', 'grow', 'grows', 'grew',
    'open', 'opens', 'opened', 'walk', 'walks', 'walked', 'win', 'wins', 'won',
    'offer', 'offers', 'offered', 'remember', 'remembers', 'love', 'loves', 'loved',
    'consider', 'considers', 'considered', 'appear', 'appears', 'appeared',
    'buy', 'buys', 'bought', 'wait', 'waits', 'waited', 'serve', 'serves', 'served',
    'die', 'dies', 'died', 'send', 'sends', 'sent', 'expect', 'expects', 'expected',
    'build', 'builds', 'built', 'stay', 'stays', 'stayed', 'fall', 'falls', 'fell',
    'cut', 'cuts', 'reach', 'reaches', 'reached', 'kill', 'kills', 'killed',
    'remain', 'remains', 'remained', 'suggest', 'suggests', 'suggested',
    'raise', 'raises', 'raised', 'pass', 'passes', 'passed', 'sell', 'sells', 'sold',
    'require', 'requires', 'required', 'report', 'reports', 'reported',
    'decide', 'decides', 'decided', 'pull', 'pulls', 'pulled',

    // Common adjectives/adverbs (non-descriptive)
    'new', 'good', 'great', 'best', 'better', 'right', 'well', 'just', 'now',
    'even', 'also', 'back', 'after', 'first', 'last', 'long', 'little', 'much',
    'still', 'big', 'small', 'high', 'low', 'old', 'young', 'early', 'late',
    'next', 'sure', 'real', 'really', 'true', 'full', 'able', 'many', 'way',
    'any', 'part', 'over', 'again', 'once', 'never', 'always', 'often', 'ever',
    'yet', 'already', 'soon', 'hard', 'easy', 'possible', 'likely', 'simply',
    'actually', 'probably', 'perhaps', 'maybe', 'certainly', 'definitely',
    'especially', 'exactly', 'directly', 'rather', 'quite', 'almost', 'enough',
    'less', 'least', 'whether', 'however', 'therefore', 'thus', 'hence',
    'although', 'though', 'unless', 'while', 'since', 'until', 'before',
    'during', 'within', 'without', 'through', 'between', 'among', 'against',
    'toward', 'towards', 'upon', 'into', 'onto', 'about', 'above', 'below',
    'under', 'over', 'behind', 'beyond', 'along', 'across', 'around', 'near',

    // Common nouns (non-descriptive)
    'thing', 'things', 'way', 'ways', 'time', 'times', 'year', 'years',
    'day', 'days', 'week', 'weeks', 'month', 'months', 'today', 'tomorrow',
    'people', 'person', 'man', 'men', 'woman', 'women', 'child', 'children',
    'world', 'life', 'hand', 'hands', 'place', 'places', 'case', 'cases',
    'point', 'points', 'fact', 'facts', 'group', 'groups', 'problem', 'problems',
    'number', 'numbers', 'part', 'parts', 'area', 'areas', 'end', 'ends',
    'word', 'words', 'example', 'examples', 'side', 'sides', 'kind', 'kinds',
    'head', 'heads', 'home', 'house', 'room', 'story', 'stories', 'lot', 'lots',
    'line', 'lines', 'name', 'names', 'member', 'members', 'power', 'state',
    'order', 'level', 'office', 'door', 'anything', 'everything', 'something',
    'nothing', 'someone', 'anyone', 'everyone', 'nobody', 'everybody',

    // Technical/URL terms to filter out
    'www', 'http', 'https', 'com', 'org', 'net', 'edu', 'gov', 'html', 'htm',
    'php', 'asp', 'aspx', 'jsp', 'css', 'jpg', 'jpeg', 'png', 'gif', 'svg',
    'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'xml', 'json',
    'url', 'uri', 'src', 'href', 'alt', 'img', 'div', 'span', 'class', 'style',
    'width', 'height', 'margin', 'padding', 'border', 'font', 'color', 'size',
    'wp', 'wordpress', 'content', 'uploads', 'themes', 'plugins', 'admin',
    'page', 'pages', 'post', 'posts', 'category', 'categories', 'tag', 'tags',
    'blog', 'archive', 'archives', 'sidebar', 'footer', 'header', 'nav',
    'menu', 'menus', 'widget', 'widgets', 'script', 'scripts', 'link', 'links',
    'button', 'buttons', 'form', 'forms', 'input', 'inputs', 'submit', 'reset',
    'search', 'login', 'logout', 'register', 'signup', 'signin', 'password',
    'email', 'username', 'user', 'users', 'profile', 'account', 'accounts',
    'settings', 'options', 'config', 'configuration', 'default', 'defaults',
    'index', 'main', 'app', 'application', 'module', 'modules', 'component',
    'file', 'files', 'folder', 'folders', 'directory', 'path', 'image', 'images',
    'icon', 'icons', 'logo', 'logos', 'banner', 'banners', 'slider', 'sliders',
    'click', 'clicks', 'view', 'views', 'download', 'downloads', 'upload',
    'share', 'shares', 'like', 'likes', 'comment', 'comments', 'reply', 'replies',
    'load', 'loads', 'loading', 'loaded', 'display', 'displays', 'displayed',
    'hide', 'hides', 'hidden', 'toggle', 'toggles', 'active', 'inactive',
    'enable', 'enables', 'enabled', 'disable', 'disables', 'disabled',
    'true', 'false', 'null', 'undefined', 'var', 'let', 'const', 'function',
    'return', 'export', 'import', 'require', 'async', 'await', 'promise',

    // Website/UI common terms
    'website', 'site', 'sites', 'web', 'online', 'internet', 'click', 'here',
    'read', 'more', 'learn', 'contact', 'us', 'about', 'terms', 'privacy',
    'policy', 'copyright', 'reserved', 'rights', 'disclaimer', 'sitemap',
    'home', 'back', 'top', 'bottom', 'left', 'right', 'center', 'middle',
    'previous', 'prev', 'next', 'first', 'last', 'start', 'end', 'close',
    'open', 'show', 'hide', 'expand', 'collapse', 'toggle', 'select', 'selected',
    'check', 'checked', 'uncheck', 'unchecked', 'enter', 'exit', 'cancel',
    'save', 'delete', 'remove', 'edit', 'update', 'refresh', 'reload',

    // Common filler words
    'also', 'just', 'like', 'even', 'well', 'really', 'actually', 'basically',
    'simply', 'literally', 'obviously', 'clearly', 'definitely', 'certainly',
    'probably', 'possibly', 'perhaps', 'maybe', 'sometimes', 'always', 'never',
    'often', 'usually', 'generally', 'typically', 'normally', 'especially',
    'particularly', 'specifically', 'exactly', 'absolutely', 'completely',
    'totally', 'entirely', 'fully', 'highly', 'extremely', 'incredibly',
    'amazing', 'awesome', 'fantastic', 'wonderful', 'excellent', 'perfect',

    // Australian/regional terms that aren't keywords
    'australia', 'australian', 'aussie', 'sydney', 'melbourne', 'brisbane',
    'perth', 'adelaide', 'zealand', 'auckland', 'wellington',

    // Icon fonts, CSS frameworks, and theme-related terms
    'entypo', 'fontello', 'fontawesome', 'glyphicon', 'glyphicons', 'dashicons',
    'icon', 'icons', 'avia', 'avada', 'flavor', 'flavour', 'flavicon', 'favicon',
    'divi', 'elementor', 'enfold', 'theme', 'themes', 'template', 'templates',
    'shortcode', 'shortcodes', 'widget', 'widgets', 'plugin', 'plugins',

    // JavaScript/DOM terms
    'document', 'documentelement', 'getelementbyid', 'getelementsbyclassname',
    'queryselector', 'queryselectorall', 'innerhtml', 'innertext', 'textcontent',
    'classname', 'classlist', 'addeventlistener', 'removeeventlistener',
    'appendchild', 'removechild', 'parentnode', 'parentelement', 'childnodes',
    'firstchild', 'lastchild', 'nextsibling', 'previoussibling', 'nodetype',
    'nodevalue', 'nodename', 'createelement', 'createtextnode', 'clonenode',
    'insertbefore', 'replacechild', 'haschildnodes', 'normalize', 'isconnected',
    'contains', 'comparedocumentposition', 'getrootnode', 'hasattribute',
    'getattribute', 'setattribute', 'removeattribute', 'getattributenames',
    'toggleattribute', 'hasattributes', 'closest', 'matches', 'webkitmatches',
    'dataset', 'offsetwidth', 'offsetheight', 'offsettop', 'offsetleft',
    'offsetparent', 'scrolltop', 'scrollleft', 'scrollwidth', 'scrollheight',
    'clienttop', 'clientleft', 'clientwidth', 'clientheight', 'innerwidth',
    'innerheight', 'outerwidth', 'outerheight', 'window', 'navigator',
    'location', 'history', 'screen', 'localstorage', 'sessionstorage',
    'console', 'alert', 'confirm', 'prompt', 'settimeout', 'setinterval',
    'cleartimeout', 'clearinterval', 'requestanimationframe', 'fetch',
    'xmlhttprequest', 'ajax', 'jquery', 'angular', 'react', 'vuejs', 'svelte',
    'webpack', 'babel', 'eslint', 'prettier', 'typescript', 'javascript',
    'ecmascript', 'nodejs', 'expressjs', 'nextjs', 'nuxtjs', 'gatsby',

    // CSS terms
    'rgba', 'hsla', 'flexbox', 'grid', 'inline', 'block', 'flex', 'none',
    'absolute', 'relative', 'fixed', 'sticky', 'static', 'zindex', 'opacity',
    'visibility', 'overflow', 'hidden', 'visible', 'scroll', 'auto',
    'transform', 'translate', 'rotate', 'scale', 'skew', 'matrix', 'transition',
    'animation', 'keyframes', 'ease', 'linear', 'cubic', 'bezier',
    'webkit', 'moz', 'webkit', 'msie', 'trident', 'gecko', 'presto', 'blink',
    'media', 'query', 'breakpoint', 'responsive', 'viewport', 'retina',
    'pseudoelement', 'pseudoclass', 'hover', 'focus', 'active', 'visited',
    'before', 'after', 'first', 'last', 'nth', 'child', 'sibling',

    // WordPress/CMS specific
    'wordpress', 'woocommerce', 'yoast', 'jetpack', 'akismet', 'gravatar',
    'trackback', 'pingback', 'xmlrpc', 'wpengine', 'wpbakery', 'visualcomposer',
    'gutenberg', 'customizer', 'metabox', 'postmeta', 'usermeta', 'termmeta',
    'taxonomy', 'taxonomies', 'permalink', 'permalinks', 'rewrite', 'htaccess',
    'wpconfig', 'wpcontent', 'wpincludes', 'wpadmin', 'wpjson', 'restapi',

    // Common list/UI class names
    'list', 'item', 'items', 'wrapper', 'container', 'section', 'row', 'column',
    'col', 'cols', 'grid', 'card', 'cards', 'box', 'boxes', 'panel', 'panels',
    'modal', 'modals', 'popup', 'popups', 'dropdown', 'dropdowns', 'accordion',
    'tabs', 'tab', 'pane', 'panes', 'carousel', 'slide', 'slides', 'slider',
    'hero', 'banner', 'jumbotron', 'alert', 'alerts', 'badge', 'badges',
    'breadcrumb', 'breadcrumbs', 'pagination', 'pager', 'progress', 'spinner',
    'loader', 'loading', 'skeleton', 'placeholder', 'tooltip', 'tooltips',
    'popover', 'popovers', 'toast', 'toasts', 'notification', 'notifications'
  ]);

  // Extract domain-related terms to filter (brand name variations)
  const domainParts = domain.toLowerCase().replace(/[^a-z]/g, ' ').split(' ')
    .filter(part => part.length >= 3);

  // Add domain parts and common variations to stop words
  domainParts.forEach(part => {
    stopWords.add(part);
    // Add partial matches (e.g., 'visor' from 'visory')
    if (part.length > 4) {
      stopWords.add(part.substring(0, part.length - 1));
      stopWords.add(part.substring(0, part.length - 2));
    }
  });

  const words = text
    .toLowerCase()
    .match(/\b[a-z]{4,}\b/g) || []; // Minimum 4 characters instead of 3

  return words.filter(word => {
    // Filter out stop words
    if (stopWords.has(word)) return false;

    // Filter out words that are too short
    if (word.length < 4) return false;

    // Filter out words that look like technical terms (all consonants, repeated chars, etc.)
    if (!/[aeiou]/.test(word)) return false; // Must have a vowel
    if (/(.)\1{2,}/.test(word)) return false; // No 3+ repeated characters

    // Filter out words that are just numbers spelled out or very common
    const tooGeneric = ['also', 'just', 'like', 'very', 'much', 'many', 'some'];
    if (tooGeneric.includes(word)) return false;

    return true;
  });
}

function extractPhrases(text, domain = '') {
  // Stop words that make phrases non-valuable for SEO
  const phraseStopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'be',
    'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
    'would', 'should', 'could', 'may', 'might', 'can', 'this', 'that',
    'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'them',
    'their', 'your', 'our', 'my', 'his', 'her', 'its', 'all', 'any', 'some',
    'www', 'http', 'https', 'com', 'org', 'net', 'wp', 'content', 'uploads',
    'click', 'here', 'read', 'more', 'learn', 'us', 'about', 'get', 'got',
    'make', 'made', 'take', 'took', 'go', 'went', 'come', 'came', 'see', 'saw',
    'know', 'knew', 'think', 'thought', 'just', 'also', 'very', 'really',
    'like', 'want', 'need', 'use', 'using', 'find', 'give', 'tell', 'new'
  ]);

  // Add domain parts to stop words
  const domainParts = domain.toLowerCase().replace(/[^a-z]/g, ' ').split(' ')
    .filter(part => part.length >= 3);
  domainParts.forEach(part => {
    phraseStopWords.add(part);
    if (part.length > 4) {
      phraseStopWords.add(part.substring(0, part.length - 1));
    }
  });

  // Extract 2-4 word phrases
  const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
  const phrases = [];

  for (let i = 0; i < words.length - 1; i++) {
    // 2-word phrases
    const phrase2 = words.slice(i, i + 2);
    if (!phrase2.some(w => phraseStopWords.has(w))) {
      phrases.push(phrase2.join(' '));
    }

    // 3-word phrases (allow one stop word in middle)
    if (i < words.length - 2) {
      const phrase3 = words.slice(i, i + 3);
      const stopCount = phrase3.filter(w => phraseStopWords.has(w)).length;
      if (stopCount <= 1 && !phraseStopWords.has(phrase3[0]) && !phraseStopWords.has(phrase3[2])) {
        phrases.push(phrase3.join(' '));
      }
    }

    // 4-word phrases (stricter - no more than 1 stop word)
    if (i < words.length - 3) {
      const phrase4 = words.slice(i, i + 4);
      const stopCount = phrase4.filter(w => phraseStopWords.has(w)).length;
      if (stopCount <= 1 && !phraseStopWords.has(phrase4[0]) && !phraseStopWords.has(phrase4[3])) {
        phrases.push(phrase4.join(' '));
      }
    }
  }

  return phrases;
}

function calculateWordFrequency(words) {
  const frequency = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });
  return frequency;
}

function calculatePhraseFrequency(phrases) {
  const frequency = {};
  phrases.forEach(phrase => {
    frequency[phrase] = (frequency[phrase] || 0) + 1;
  });
  return frequency;
}

function identifyPrimaryKeywords(wordFreq, phraseFreq, importantText) {
  const keywords = [];

  // Get top words by frequency (appearing in important text areas)
  const sortedWords = Object.entries(wordFreq)
    .filter(([word, freq]) => freq >= 3 && importantText.includes(word))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  sortedWords.forEach(([word, freq]) => {
    keywords.push({
      keyword: word,
      relevance: freq > 10 ? 'High' : freq > 5 ? 'Medium' : 'Low',
      searchIntent: inferSearchIntent(word),
      difficulty: 'Medium'
    });
  });

  // Get top phrases
  const sortedPhrases = Object.entries(phraseFreq)
    .filter(([phrase, freq]) => freq >= 2 && phrase.split(' ').length <= 3)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  sortedPhrases.forEach(([phrase, freq]) => {
    keywords.push({
      keyword: phrase,
      relevance: freq > 5 ? 'High' : freq > 3 ? 'Medium' : 'Low',
      searchIntent: inferSearchIntent(phrase),
      difficulty: 'Medium'
    });
  });

  return keywords.slice(0, 8);
}

function identifySecondaryKeywords(wordFreq, phraseFreq, primaryKeywords) {
  const primaryTerms = new Set(primaryKeywords.map(k => k.keyword.toLowerCase()));
  const keywords = [];

  // Get words that are frequent but not primary
  const sortedWords = Object.entries(wordFreq)
    .filter(([word, freq]) => freq >= 2 && !primaryTerms.has(word))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  sortedWords.forEach(([word, freq]) => {
    keywords.push({
      keyword: word,
      relevance: 'Medium',
      searchIntent: inferSearchIntent(word)
    });
  });

  return keywords.slice(0, 8);
}

function generateLongTailKeywords(phrases, phraseFreq, primaryKeywords) {
  const primaryTerms = new Set(primaryKeywords.map(k => k.keyword.toLowerCase()));
  const longTail = [];

  // Find 3-4 word phrases that include primary keywords
  Object.entries(phraseFreq)
    .filter(([phrase, freq]) => {
      const words = phrase.split(' ');
      return words.length >= 3 && words.length <= 4 &&
             words.some(word => primaryTerms.has(word));
    })
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([phrase]) => {
      longTail.push({ keyword: phrase });
    });

  return longTail;
}

function inferIndustry(title, description, text) {
  const industryKeywords = {
    'E-commerce': ['shop', 'store', 'buy', 'product', 'cart', 'checkout', 'price'],
    'Technology': ['software', 'tech', 'app', 'digital', 'cloud', 'platform', 'api'],
    'Healthcare': ['health', 'medical', 'doctor', 'patient', 'care', 'treatment', 'hospital'],
    'Finance': ['bank', 'financial', 'investment', 'loan', 'credit', 'insurance', 'money'],
    'Education': ['education', 'learning', 'course', 'student', 'teacher', 'school', 'university'],
    'Real Estate': ['property', 'real estate', 'home', 'house', 'apartment', 'rent', 'buy'],
    'Food & Beverage': ['restaurant', 'food', 'menu', 'recipe', 'cooking', 'dining', 'cafe'],
    'Travel': ['travel', 'hotel', 'booking', 'vacation', 'trip', 'destination', 'tour'],
    'Marketing': ['marketing', 'advertising', 'seo', 'content', 'brand', 'campaign', 'social media'],
    'Professional Services': ['service', 'consulting', 'business', 'professional', 'expert', 'solution']
  };

  const combinedText = (title + ' ' + description + ' ' + text).toLowerCase();

  let maxMatches = 0;
  let detectedIndustry = 'General';

  for (const [industry, keywords] of Object.entries(industryKeywords)) {
    const matches = keywords.filter(keyword => combinedText.includes(keyword)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      detectedIndustry = industry;
    }
  }

  return detectedIndustry;
}

function extractTopics(h1Array, h2Array) {
  const topics = new Set();

  [...h1Array, ...h2Array].forEach(heading => {
    // Extract main topic from heading (simplified)
    const cleaned = heading.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .trim();
    if (cleaned && cleaned.split(' ').length <= 4) {
      topics.add(cleaned);
    }
  });

  return Array.from(topics).slice(0, 5);
}

function inferSearchIntent(keyword) {
  const transactional = ['buy', 'purchase', 'order', 'shop', 'price', 'deal', 'discount'];
  const informational = ['how', 'what', 'why', 'guide', 'tutorial', 'learn', 'tips'];
  const navigational = ['login', 'sign', 'account', 'contact', 'about'];

  const lower = keyword.toLowerCase();

  if (transactional.some(word => lower.includes(word))) return 'Transactional';
  if (informational.some(word => lower.includes(word))) return 'Informational';
  if (navigational.some(word => lower.includes(word))) return 'Navigational';

  return 'Informational';
}

function identifyOpportunities(url, title, description, primaryKeywords, industry) {
  const opportunities = [];

  // Check for missing keywords in title
  const titleLower = title.toLowerCase();
  const missingInTitle = primaryKeywords.filter(k => !titleLower.includes(k.keyword.toLowerCase()));
  if (missingInTitle.length > 0) {
    opportunities.push({
      title: 'Optimize Page Title',
      description: `Consider including primary keywords like "${missingInTitle[0].keyword}" in the title tag`
    });
  }

  // Check for missing keywords in meta description
  const descLower = description.toLowerCase();
  const missingInDesc = primaryKeywords.filter(k => !descLower.includes(k.keyword.toLowerCase()));
  if (missingInDesc.length > 0) {
    opportunities.push({
      title: 'Enhance Meta Description',
      description: `Add primary keywords like "${missingInDesc[0].keyword}" to meta description`
    });
  }

  // Industry-specific opportunities
  opportunities.push({
    title: `${industry} Content Expansion`,
    description: `Create comprehensive content targeting ${industry.toLowerCase()}-specific keywords`
  });

  // Long-tail opportunity
  opportunities.push({
    title: 'Target Long-tail Keywords',
    description: 'Develop content around long-tail variations of your primary keywords for easier ranking'
  });

  return opportunities;
}

function generateRecommendations(primaryKeywords, secondaryKeywords, industry) {
  const topPrimary = primaryKeywords.slice(0, 3).map(k => k.keyword).join(', ');

  return `Focus on optimizing content for primary keywords: ${topPrimary}. Create topic clusters around these terms to establish topical authority in the ${industry} space. Develop supporting content targeting secondary and long-tail variations to capture additional search traffic. Ensure keywords are naturally integrated into titles, headings, meta descriptions, and body content.`;
}
