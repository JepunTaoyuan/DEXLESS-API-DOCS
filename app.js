// DEXLESS API Documentation App with Multi-language Support

class DocsApp {
  constructor() {
    this.currentLang = localStorage.getItem('dexless-docs-lang') || 'en';
    this.currentTheme = localStorage.getItem('dexless-docs-theme') || 'light';
    this.currentPage = 'introduction';
    this.searchIndex = {};
    this.translations = {
      en: {
        searchPlaceholder: 'Search API...',
        loading: 'Loading...',
        tocTitle: 'On This Page',
        tocEmpty: 'No headings on this page',
        gettingStarted: 'Getting Started',
        restAPI: 'REST API',
        websocketAPI: 'WebSocket API',
        orderManagement: 'Order Management',
        algoOrders: 'Algo Orders',
        positionLeverage: 'Position & Leverage',
        marketInfo: 'Market Info',
        publicMarketData: 'Public Market Data',
        privateUserData: 'Private User Data'
      },
      'zh-CN': {
        searchPlaceholder: '搜索 API...',
        loading: '加载中...',
        tocTitle: '本页目录',
        tocEmpty: '此页面没有标题',
        gettingStarted: '开始使用',
        restAPI: 'REST API',
        websocketAPI: 'WebSocket API',
        orderManagement: '订单管理',
        algoOrders: '算法订单',
        positionLeverage: '仓位与杠杆',
        marketInfo: '市场信息',
        publicMarketData: '公开市场数据',
        privateUserData: '私有用户数据'
      }
    };
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.applyTheme(this.currentTheme);
    this.updateLanguage(this.currentLang, false);
    this.loadPageFromHash();
    this.renderPage(this.currentPage);
    this.generateNavigation();
  }

  getDocsData() {
    switch (this.currentLang) {
      case 'en':
        return typeof docsDataEN !== 'undefined' ? docsDataEN : {};
      case 'zh-CN':
        return typeof docsDataZhCN !== 'undefined' ? docsDataZhCN : {};
      default:
        return typeof docsDataEN !== 'undefined' ? docsDataEN : {};
    }
  }

  t(key) {
    return this.translations[this.currentLang]?.[key] || this.translations['en'][key] || key;
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(this.currentTheme);
    localStorage.setItem('dexless-docs-theme', this.currentTheme);
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.currentTheme = theme;
  }

  setupEventListeners() {
    // 語言切換按鈕
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const lang = btn.getAttribute('data-lang');
        this.updateLanguage(lang);
      });
    });

    // 深色模式切換按鈕
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        this.toggleTheme();
      });
    }

    // 搜索功能
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.placeholder = this.t('searchPlaceholder');
      searchInput.addEventListener('input', (e) => {
        this.handleSearch(e.target.value);
      });
    }

    // 處理瀏覽器的返回/前進按鈕
    window.addEventListener('hashchange', () => {
      this.loadPageFromHash();
    });

    // 滾動時更新 TOC 高亮
    const contentContainer = document.querySelector('.content');
    if (contentContainer) {
      contentContainer.addEventListener('scroll', () => {
        this.updateTOCHighlight();
      });
    }
  }

  updateLanguage(lang, reload = true) {
    this.currentLang = lang;
    localStorage.setItem('dexless-docs-lang', lang);
    
    // 更新語言按鈕狀態
    document.querySelectorAll('.lang-btn').forEach(btn => {
      if (btn.getAttribute('data-lang') === lang) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // 更新 HTML lang 屬性
    document.documentElement.lang = lang;

    // 更新搜索框佔位符
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.placeholder = this.t('searchPlaceholder');
      searchInput.value = '';
    }

    // 更新 TOC 標題
    const tocTitle = document.getElementById('toc-title');
    if (tocTitle) {
      tocTitle.textContent = this.t('tocTitle');
    }

    if (reload) {
      // 重建搜索索引
      this.searchIndex = this.buildSearchIndex();
      
      // 重新生成導航
      this.generateNavigation();
      
      // 重新渲染當前頁面
      this.renderPage(this.currentPage);
    }
  }

  generateNavigation() {
    const sidebarNav = document.getElementById('sidebar-nav');
    if (!sidebarNav) return;

    const docsData = this.getDocsData();
    if (!docsData || Object.keys(docsData).length === 0) {
      sidebarNav.innerHTML = '<p style="padding: 1rem; color: var(--text-muted);">No documentation available</p>';
      return;
    }

    sidebarNav.innerHTML = `
      <div class="nav-section">
        <h3 class="nav-title">${this.t('gettingStarted')}</h3>
        <ul class="nav-list">
          <li class="nav-item" data-section="getting-started">
            <a href="#introduction" class="nav-link">${docsData.introduction?.title || 'Introduction'}</a>
          </li>
        </ul>
      </div>

      <div class="nav-section">
        <h3 class="nav-title">${this.t('restAPI')}</h3>
        <ul class="nav-list">
          <li class="nav-item" data-section="rest">
            <a href="#rest-api-authentication" class="nav-link">${docsData['rest-api-authentication']?.title || 'API Authentication'}</a>
          </li>
          <li class="nav-item" data-section="rest">
            <a href="#rest-error-codes" class="nav-link">${docsData['rest-error-codes']?.title || 'Error Codes'}</a>
          </li>
        </ul>
        
        <div class="nav-subsection">
          <h4 class="nav-subtitle">${this.t('orderManagement')}</h4>
          <ul class="nav-list">
            <li class="nav-item" data-section="rest">
              <a href="#rest-create-order" class="nav-link">${docsData['rest-create-order']?.title || 'Create Order'}</a>
            </li>
            <li class="nav-item" data-section="rest">
              <a href="#rest-cancel-order" class="nav-link">${docsData['rest-cancel-order']?.title || 'Cancel Order'}</a>
            </li>
            <li class="nav-item" data-section="rest">
              <a href="#rest-edit-order" class="nav-link">${docsData['rest-edit-order']?.title || 'Edit Order'}</a>
            </li>
            <li class="nav-item" data-section="rest">
              <a href="#rest-batch-create-order" class="nav-link">${docsData['rest-batch-create-order']?.title || 'Batch Create Order'}</a>
            </li>
          </ul>
        </div>

        <div class="nav-subsection">
          <h4 class="nav-subtitle">${this.t('algoOrders')}</h4>
          <ul class="nav-list">
            <li class="nav-item" data-section="rest">
              <a href="#rest-create-algo-order" class="nav-link">${docsData['rest-create-algo-order']?.title || 'Create Algo Order'}</a>
            </li>
            <li class="nav-item" data-section="rest">
              <a href="#rest-cancel-algo-order" class="nav-link">${docsData['rest-cancel-algo-order']?.title || 'Cancel Algo Order'}</a>
            </li>
            <li class="nav-item" data-section="rest">
              <a href="#rest-edit-algo-order" class="nav-link">${docsData['rest-edit-algo-order']?.title || 'Edit Algo Order'}</a>
            </li>
          </ul>
        </div>

        <div class="nav-subsection">
          <h4 class="nav-subtitle">${this.t('positionLeverage')}</h4>
          <ul class="nav-list">
            <li class="nav-item" data-section="rest">
              <a href="#rest-get-all-positions-info" class="nav-link">${docsData['rest-get-all-positions-info']?.title || 'Get All Positions Info'}</a>
            </li>
            <li class="nav-item" data-section="rest">
              <a href="#rest-get-position-history" class="nav-link">${docsData['rest-get-position-history']?.title || 'Get Position History'}</a>
            </li>
            <li class="nav-item" data-section="rest">
              <a href="#rest-get-leverage-setting" class="nav-link">${docsData['rest-get-leverage-setting']?.title || 'Get Leverage Setting'}</a>
            </li>
            <li class="nav-item" data-section="rest">
              <a href="#rest-update-leverage-setting" class="nav-link">${docsData['rest-update-leverage-setting']?.title || 'Update Leverage Setting'}</a>
            </li>
          </ul>
        </div>

        <div class="nav-subsection">
          <h4 class="nav-subtitle">${this.t('marketInfo')}</h4>
          <ul class="nav-list">
            <li class="nav-item" data-section="rest">
              <a href="#rest-get-available-symbols" class="nav-link">${docsData['rest-get-available-symbols']?.title || 'Get Available Symbols'}</a>
            </li>
            <li class="nav-item" data-section="rest">
              <a href="#rest-get-predicted-funding-rates-for-all-markets" class="nav-link">${docsData['rest-get-predicted-funding-rates-for-all-markets']?.title || 'Get All Funding Rates'}</a>
            </li>
            <li class="nav-item" data-section="rest">
              <a href="#rest-get-predicted-funding-rate-for-one-market" class="nav-link">${docsData['rest-get-predicted-funding-rate-for-one-market']?.title || 'Get One Funding Rate'}</a>
            </li>
          </ul>
        </div>
      </div>

      <div class="nav-section">
        <h3 class="nav-title">${this.t('websocketAPI')}</h3>
        <ul class="nav-list">
          <li class="nav-item" data-section="websocket">
            <a href="#ws-introduction" class="nav-link">${docsData['ws-introduction']?.title || 'Introduction'}</a>
          </li>
          <li class="nav-item" data-section="websocket">
            <a href="#ws-authentication" class="nav-link">${docsData['ws-authentication']?.title || 'Authentication'}</a>
          </li>
          <li class="nav-item" data-section="websocket">
            <a href="#ws-ping-pong" class="nav-link">${docsData['ws-ping-pong']?.title || 'PING/PONG'}</a>
          </li>
          <li class="nav-item" data-section="websocket">
            <a href="#ws-error-response" class="nav-link">${docsData['ws-error-response']?.title || 'Error Response'}</a>
          </li>
        </ul>

        <div class="nav-subsection">
          <h4 class="nav-subtitle">${this.t('publicMarketData')}</h4>
          <ul class="nav-list">
            <li class="nav-item" data-section="websocket">
              <a href="#ws-orderbook" class="nav-link">${docsData['ws-orderbook']?.title || 'Orderbook'}</a>
            </li>
            <li class="nav-item" data-section="websocket">
              <a href="#ws-order-book-update" class="nav-link">${docsData['ws-order-book-update']?.title || 'Order Book Update'}</a>
            </li>
            <li class="nav-item" data-section="websocket">
              <a href="#ws-trade" class="nav-link">${docsData['ws-trade']?.title || 'Trade'}</a>
            </li>
            <li class="nav-item" data-section="websocket">
              <a href="#ws-bbo" class="nav-link">${docsData['ws-bbo']?.title || 'BBO'}</a>
            </li>
            <li class="nav-item" data-section="websocket">
              <a href="#ws-bbos" class="nav-link">${docsData['ws-bbos']?.title || 'BBOs'}</a>
            </li>
            <li class="nav-item" data-section="websocket">
              <a href="#ws-request-orderbook" class="nav-link">${docsData['ws-request-orderbook']?.title || 'Request Orderbook'}</a>
            </li>
          </ul>
        </div>

        <div class="nav-subsection">
          <h4 class="nav-subtitle">${this.t('privateUserData')}</h4>
          <ul class="nav-list">
            <li class="nav-item" data-section="websocket">
              <a href="#ws-account" class="nav-link">${docsData['ws-account']?.title || 'Account'}</a>
            </li>
            <li class="nav-item" data-section="websocket">
              <a href="#ws-balance" class="nav-link">${docsData['ws-balance']?.title || 'Balance'}</a>
            </li>
            <li class="nav-item" data-section="websocket">
              <a href="#ws-position-push" class="nav-link">${docsData['ws-position-push']?.title || 'Position Push'}</a>
            </li>
            <li class="nav-item" data-section="websocket">
              <a href="#ws-execution-report" class="nav-link">${docsData['ws-execution-report']?.title || 'Execution Report'}</a>
            </li>
          </ul>
        </div>
      </div>
    `;

    // 重新綁定導航連結事件
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          const pageId = href.substring(1);
          this.navigateToPage(pageId);
        }
      });
    });
  }

  loadPageFromHash() {
    const hash = window.location.hash.substring(1);
    const docsData = this.getDocsData();
    if (hash && docsData[hash]) {
      this.currentPage = hash;
      this.renderPage(hash);
    } else if (hash) {
      this.navigateToPage('introduction');
    }
  }

  navigateToPage(pageId) {
    const docsData = this.getDocsData();
    if (docsData[pageId]) {
      this.currentPage = pageId;
      window.location.hash = pageId;
      this.renderPage(pageId);
      this.updateActiveNavLink(pageId);
      
      const contentContainer = document.querySelector('.content');
      if (contentContainer) {
        contentContainer.scrollTop = 0;
      }
    }
  }

  renderPage(pageId) {
    const docsData = this.getDocsData();
    const page = docsData[pageId];
    if (!page) return;

    const contentContainer = document.getElementById('content-container');
    if (!contentContainer) return;

    const html = marked.parse(page.content);
    contentContainer.innerHTML = `<article class="article">${html}</article>`;

    this.applySyntaxHighlighting();
    this.generateTOC();
    this.updateActiveNavLink(pageId);
    document.title = `${page.title} - DEXLESS API Documentation`;
  }

  applySyntaxHighlighting() {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block);
    });
  }

  generateTOC() {
    const article = document.querySelector('.article');
    const tocNav = document.getElementById('toc-nav');
    
    if (!article || !tocNav) return;

    const headings = article.querySelectorAll('h2, h3');
    
    if (headings.length === 0) {
      tocNav.innerHTML = `<p class="toc-empty">${this.t('tocEmpty')}</p>`;
      return;
    }

    tocNav.innerHTML = '';
    
    headings.forEach((heading, index) => {
      if (!heading.id) {
        heading.id = `heading-${index}`;
      }

      const link = document.createElement('a');
      link.href = `#${heading.id}`;
      link.textContent = heading.textContent;
      link.className = 'toc-link';
      
      if (heading.tagName === 'H3') {
        link.style.paddingLeft = '1.5rem';
      }

      link.addEventListener('click', (e) => {
        e.preventDefault();
        heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        document.querySelectorAll('.toc-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      });

      tocNav.appendChild(link);
    });
  }

  updateTOCHighlight() {
    const article = document.querySelector('.article');
    if (!article) return;

    const headings = article.querySelectorAll('h2, h3');
    const tocLinks = document.querySelectorAll('.toc-link');
    
    if (headings.length === 0 || tocLinks.length === 0) return;

    let currentHeading = null;
    const scrollPosition = document.querySelector('.content').scrollTop + 100;

    headings.forEach((heading) => {
      if (heading.offsetTop <= scrollPosition) {
        currentHeading = heading;
      }
    });

    if (currentHeading) {
      tocLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentHeading.id}`) {
          link.classList.add('active');
        }
      });
    }
  }

  updateActiveNavLink(pageId) {
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
    });

    const activeLink = document.querySelector(`.nav-link[href="#${pageId}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
      activeLink.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  buildSearchIndex() {
    const index = [];
    const docsData = this.getDocsData();
    
    for (const [id, page] of Object.entries(docsData)) {
      index.push({
        id: id,
        title: page.title,
        content: page.content,
        searchText: (page.title + ' ' + page.content).toLowerCase()
      });
    }
    
    return index;
  }

  handleSearch(query) {
    if (!query || query.trim().length < 2) {
      this.showAllNavItems();
      return;
    }

    const searchTerm = query.toLowerCase().trim();
    const results = this.searchIndex.filter(item => 
      item.searchText && item.searchText.includes(searchTerm)
    );

    this.highlightSearchResults(results);

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.onkeypress = (e) => {
        if (e.key === 'Enter' && results.length > 0) {
          this.navigateToPage(results[0].id);
          searchInput.value = '';
          this.showAllNavItems();
        }
      };
    }
  }

  highlightSearchResults(results) {
    const resultIds = new Set(results.map(r => r.id));
    
    document.querySelectorAll('.nav-item').forEach(item => {
      const link = item.querySelector('.nav-link');
      if (link) {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          const pageId = href.substring(1);
          
          if (resultIds.has(pageId)) {
            item.style.display = '';
            link.style.backgroundColor = 'rgba(37, 99, 235, 0.1)';
          } else {
            item.style.display = 'none';
          }
        }
      }
    });

    if (results.length === 0) {
      this.showAllNavItems();
    }
  }

  showAllNavItems() {
    document.querySelectorAll('.nav-item').forEach(item => {
      item.style.display = '';
      const link = item.querySelector('.nav-link');
      if (link && !link.classList.contains('active')) {
        link.style.backgroundColor = '';
      }
    });
  }
}

// 配置 marked
marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(code, { language: lang }).value;
      } catch (err) {
        console.error('Highlight error:', err);
      }
    }
    return hljs.highlightAuto(code).value;
  },
  breaks: true,
  gfm: true
});

// 自定義 marked 渲染器
const renderer = new marked.Renderer();

renderer.code = function(code, language) {
  const validLang = language && hljs.getLanguage(language) ? language : 'plaintext';
  const highlighted = hljs.highlight(code, { language: validLang }).value;
  
  const langLabels = {
    'en': { json: 'JSON', javascript: 'JavaScript', python: 'Python', bash: 'Bash', code: 'Code', copy: 'Copy', copied: 'Copied!' },
    'zh-CN': { json: 'JSON', javascript: 'JavaScript', python: 'Python', bash: 'Bash', code: '代码', copy: '复制', copied: '已复制！' }
  };
  
  const currentLang = localStorage.getItem('dexless-docs-lang') || 'en';
  const labels = langLabels[currentLang] || langLabels['en'];
  
  return `
    <div class="code-example">
      <div class="code-header">
        <span class="code-title">${language || labels.code}</span>
        <button class="copy-button" onclick="copyToClipboard(this)" data-lang="${currentLang}">${labels.copy}</button>
      </div>
      <pre><code class="hljs language-${validLang}">${highlighted}</code></pre>
    </div>
  `;
};

renderer.table = function(header, body) {
  return `
    <div style="overflow-x: auto;">
      <table>
        <thead>${header}</thead>
        <tbody>${body}</tbody>
      </table>
    </div>
  `;
};

marked.use({ renderer });

// 複製到剪貼板功能
function copyToClipboard(button) {
  const codeBlock = button.closest('.code-example').querySelector('code');
  const text = codeBlock.textContent;
  
  const lang = button.getAttribute('data-lang') || 'en';
  const labels = {
    'en': { copy: 'Copy', copied: 'Copied!', failed: 'Failed' },
    'zh-CN': { copy: '复制', copied: '已复制！', failed: '复制失败' }
  };
  const currentLabels = labels[lang] || labels['en'];
  
  navigator.clipboard.writeText(text).then(() => {
    const originalText = button.textContent;
    button.textContent = currentLabels.copied;
    button.style.backgroundColor = 'rgba(16, 185, 129, 0.2)';
    button.style.borderColor = '#10b981';
    button.style.color = '#10b981';
    
    setTimeout(() => {
      button.textContent = currentLabels.copy;
      button.style.backgroundColor = '';
      button.style.borderColor = '';
      button.style.color = '';
    }, 2000);
  }).catch(err => {
    console.error('Copy failed:', err);
    button.textContent = currentLabels.failed;
    setTimeout(() => {
      button.textContent = currentLabels.copy;
    }, 2000);
  });
}

// 初始化應用
document.addEventListener('DOMContentLoaded', () => {
  new DocsApp();
});

// 添加鍵盤快捷鍵
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.focus();
      searchInput.select();
    }
  }
  
  if (e.key === 'Escape') {
    const searchInput = document.getElementById('searchInput');
    if (searchInput && document.activeElement === searchInput) {
      searchInput.value = '';
      searchInput.blur();
      const app = new DocsApp();
      app.showAllNavItems();
    }
  }
});
