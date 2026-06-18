/**
 * RE9 Guide — Language Switcher
 * 所有页面共享的双语切换模块
 *
 * 用法：
 * 1. 在每个需要翻译的元素上添加 data-en="..." data-zh="..." 属性
 * 2. 在页面底部引入此脚本：<script src="lang.js"></script>
 * 3. 导航栏加入 .lang-switcher 按钮（见 nav-template 注释）
 */

const RE9Lang = (function() {

  const LANG_KEY = 're9_lang';

  // ── 核心切换函数 ──────────────────────────────────────────
  function setLang(lang) {
    // 1. 保存偏好
    localStorage.setItem(LANG_KEY, lang);

    // 2. body class（用于字体切换）
    document.body.classList.toggle('lang-zh', lang === 'zh');

    // 3. html lang 属性（对SEO有益）
    document.documentElement.lang = lang === 'zh' ? 'zh-CN' : 'en';

    // 4. 翻译所有带 data-en / data-zh 属性的元素
    document.querySelectorAll('[data-en],[data-zh]').forEach(el => {
      const text = el.getAttribute('data-' + lang);
      if (text === null) return;
      if (text.includes('<')) {
        el.innerHTML = text;
      } else {
        el.textContent = text;
      }
    });

    // 5. 页面 title 和 meta description
    const titleEl = document.querySelector('title[data-en][data-zh]');
    if (titleEl) document.title = titleEl.getAttribute('data-' + lang) || document.title;

    const metaDesc = document.querySelector('meta[name="description"][data-en][data-zh]');
    if (metaDesc) {
      const d = metaDesc.getAttribute('data-' + lang);
      if (d) metaDesc.setAttribute('content', d);
    }

    // 6. 导航Logo
    const logo = document.querySelector('.nav-logo');
    if (logo) {
      logo.innerHTML = lang === 'zh'
        ? '生化危机9<span>攻略</span>'
        : 'RE<span>9</span>GUIDE';
    }

    // 7. 语言按钮高亮
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    // 8. 当前激活的导航链接文字也同步
    document.querySelectorAll('.nav-links a[data-en][data-zh]').forEach(a => {
      const t = a.getAttribute('data-' + lang);
      if (t && !t.includes('<')) a.textContent = t;
    });
  }

  // ── 获取当前语言 ──────────────────────────────────────────
  function getLang() {
    return localStorage.getItem(LANG_KEY) || 'en';
  }

  // ── 自动检测初始语言 ──────────────────────────────────────
  function init() {
    const saved = localStorage.getItem(LANG_KEY);
    const browser = (navigator.language || navigator.userLanguage || '').toLowerCase();
    const lang = saved
      ? saved
      : browser.startsWith('zh') ? 'zh' : 'en';
    setLang(lang);
  }

  // 页面加载后自动执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  return { setLang, getLang };

})();
