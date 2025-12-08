/**
 * SEO 관련 기능
 */

/**
 * SEO 폼 채우기
 */
function fillSeoForm() {
  if (!contentData.seo) return;
  
  document.getElementById('seo-title').value = contentData.seo.title || '';
  document.getElementById('seo-description').value = contentData.seo.description || '';
  document.getElementById('seo-keywords').value = contentData.seo.keywords || '';
  document.getElementById('seo-ogImage').value = contentData.seo.ogImage || '';
  document.getElementById('seo-url').value = contentData.seo.url || '';
  document.getElementById('seo-ogTitle').value = contentData.seo.ogTitle || '';
  document.getElementById('seo-ogDescription').value = contentData.seo.ogDescription || '';
  document.getElementById('seo-ogType').value = contentData.seo.ogType || 'website';
  document.getElementById('seo-lang').value = contentData.seo.lang || 'ko';
  document.getElementById('seo-favicon').value = contentData.seo.favicon || '';
  document.getElementById('seo-gaId').value = contentData.seo.gaId || '';
}

/**
 * SEO 폼 데이터 수집
 */
function collectSeoData() {
  if (!contentData.seo) contentData.seo = {};
  
  contentData.seo.title = document.getElementById('seo-title').value;
  contentData.seo.description = document.getElementById('seo-description').value;
  contentData.seo.keywords = document.getElementById('seo-keywords').value;
  contentData.seo.ogImage = document.getElementById('seo-ogImage').value;
  contentData.seo.url = document.getElementById('seo-url').value;
  contentData.seo.ogTitle = document.getElementById('seo-ogTitle').value;
  contentData.seo.ogDescription = document.getElementById('seo-ogDescription').value;
  contentData.seo.ogType = document.getElementById('seo-ogType').value;
  contentData.seo.lang = document.getElementById('seo-lang').value;
  contentData.seo.favicon = document.getElementById('seo-favicon').value;
  contentData.seo.gaId = document.getElementById('seo-gaId').value;
}

/**
 * index.html 생성
 */
function generateIndexHtml() {
  collectSeoData();
  
  const seo = contentData.seo || {};
  const title = seo.title || '컨퍼런스 2025';
  const description = seo.description || '';
  const keywords = seo.keywords || '';
  const ogImage = seo.ogImage || '';
  const url = seo.url || '';
  const ogTitle = seo.ogTitle || title;
  const ogDescription = seo.ogDescription || description;
  const ogType = seo.ogType || 'website';
  const lang = seo.lang || 'ko';
  const favicon = seo.favicon || 'assets/images/favicon.ico';
  const gaId = seo.gaId || '';
  
  let gaScript = '';
  if (gaId) {
    gaScript = `
  <!-- Google Analytics -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=${gaId}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${gaId}');
  </script>`;
  }
  
  const html = `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- 기본 메타 태그 -->
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="keywords" content="${keywords}">
  
  <!-- Open Graph / SNS 공유 -->
  <meta property="og:type" content="${ogType}">
  <meta property="og:title" content="${ogTitle}">
  <meta property="og:description" content="${ogDescription}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:url" content="${url}">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${ogTitle}">
  <meta name="twitter:description" content="${ogDescription}">
  <meta name="twitter:image" content="${ogImage}">
  
  <!-- Favicon -->
  <link rel="icon" href="${favicon}">
  <link rel="apple-touch-icon" href="${favicon}">
  
  <!-- Canonical URL -->
  <link rel="canonical" href="${url}">
  ${gaScript}
  
  <!-- CSS -->
  <link rel="stylesheet" href="assets/css/base.css">
  <link rel="stylesheet" href="assets/css/layout.css">
  <link rel="stylesheet" href="assets/css/components.css">
  <link rel="stylesheet" href="assets/css/hero.css">
  <link rel="stylesheet" href="assets/css/sections.css">
</head>
<body>
  <section class="hero" id="main">
    <!-- 슬라이드 배경 -->
    <div class="hero__slider">
      <div class="hero__slide" style="background-image: url('assets/images/slide1.jpg');"></div>
      <div class="hero__slide" style="background-image: url('assets/images/slide2.jpg');"></div>
      <div class="hero__slide" style="background-image: url('assets/images/slide3.jpg');"></div>
    </div>
    <div class="hero__overlay"></div>
    
    <!-- 헤더 -->
    <header class="hero__header">
      <a href="index.html">
        <img src="assets/images/logo.png" alt="Logo" class="hero__logo">
      </a>
      <div class="hero__lang">
        <a href="pages/en/index.html" class="hero__lang-btn">ENGLISH</a>
        <button class="hero__menu-btn" aria-label="메뉴">☰</button>
      </div>
    </header>
    
    <!-- 콘텐츠 -->
    <div class="hero__content">
      <p class="hero__subtitle">Conference Name</p>
      <h1 class="hero__title">CONF 2025</h1>
      <p class="hero__slogan">From Innovation<br>To the World</p>
      <p class="hero__info">2025.00.00 | Venue Name</p>
    </div>
    
    <!-- 소셜 아이콘 -->
    <div class="hero__social">
      <a href="#" class="hero__social-link" aria-label="Instagram">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      </a>
      <a href="#" class="hero__social-link" aria-label="X">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </a>
      <a href="#" class="hero__social-link" aria-label="YouTube">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      </a>
    </div>
    
    <!-- 스크롤 다운 (마우스 모양) -->
    <a href="#about" class="hero__scroll" aria-label="스크롤 다운">
      <div class="hero__mouse">
        <div class="hero__mouse-wheel"></div>
      </div>
      <span class="hero__scroll-text">Scroll</span>
    </a>
  </section>
  
  <!-- Hero 높이만큼 공간 확보 -->
  <div class="hero-spacer"></div>
  
  <!-- 본문 콘텐츠 -->
  <main class="main-content">
  
  <!-- Links Section (버튼 영역) -->
  <section class="section links-section">
    <div class="container">
      <div class="links-section__buttons">
        <a href="#" class="btn btn--primary links-section__btn">현장 사진</a>
        <a href="#" class="btn btn--primary links-section__btn">언론보도</a>
      </div>
    </div>
  </section>
  
  <!-- About Section -->
  <section class="section section--vertical-title about" id="about">
    <div class="container">
      <h2 class="section__title section__title--vertical">About</h2>
      
      <div class="section__content section__content--2cols">
        <div class="section__col-left">
          <p class="section__slogan-sub">Conference Name</p>
          <p class="section__slogan-main">
            From<br>
            Innovative<br>
            City<br>
            to the<br>
            World
          </p>
        </div>
        
        <div class="section__col-right">
          <p class="about__text">
            혁신적인 도시가 혁신적인 국가를 만들어내고 혁신적 국가는 전 세계의 미래를 만듭니다.
          </p>
          <p class="about__text">
            <strong>Conference 2025</strong> 컨퍼런스는 이러한 변화를 이끌어낼 혁신적인 아이디어와 전략을 선보이며, 더 나은 미래를 위한 비전을 제시할 것입니다.
          </p>
          <p class="about__text">
            이러한 혁신과 비전을 전 세계에 확산하기 위해 글로벌 파트너들과 각국의 대표 전문가들이 한 자리에 모여 컨퍼런스를 진행합니다.
          </p>
          
          <div class="about__media">
            <!-- 동적으로 이미지/비디오/유튜브 삽입 -->
          </div>
        </div>
      </div>
    </div>
  </section>
  
  <!-- Hosts Section (주최/주관/후원) -->
  <section class="section hosts" id="hosts">
    <div class="container">
      <div class="section__content">
        <!-- 동적 생성 -->
      </div>
    </div>
  </section>
  
  <!-- Organization Section -->
  <section class="section section--vertical-title org" id="organization">
    <div class="container">
      <h2 class="section__title section__title--vertical">Organization</h2>
      
      <div class="section__content">
        <!-- 동적 생성 -->
      </div>
    </div>
  </section>
  
  <!-- Sponsor Section -->
  <section class="section section--vertical-title sponsor" id="sponsor">
    <div class="container">
      <h2 class="section__title section__title--vertical">Sponsor</h2>
      
      <div class="section__content">
        <!-- 동적 생성 -->
      </div>
    </div>
  </section>
  
  <!-- Speakers Section -->
  <section class="section section--vertical-title speaker" id="speakers">
    <div class="container">
      <h2 class="section__title section__title--vertical">Speakers</h2>
      
      <div class="section__content">
        <!-- 동적 생성 -->
      </div>
    </div>
  </section>
  
  <!-- Program Section -->
  <section class="section section--vertical-title program" id="program">
    <div class="container">
      <h2 class="section__title section__title--vertical">Program</h2>
      
      <div class="section__content">
        <!-- 동적 생성 -->
      </div>
    </div>
  </section>
  
  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <div class="footer__content">
        <div class="footer__info">
          <p class="footer__title">Conference 사무국</p>
          <p class="footer__item">| 전화번호 &nbsp;&nbsp; 000-000-0000</p>
          <p class="footer__item">| 이메일 &nbsp;&nbsp;&nbsp;&nbsp; official@conference.com</p>
          <p class="footer__item">| 주소 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 서울시 강남구 테헤란로 000 빌딩 0000호</p>
        </div>
        <p class="footer__copyright">©Conference2025</p>
      </div>
    </div>
  </footer>
  
  </main>
  <!-- /본문 콘텐츠 -->
  
  <!-- 사이드 네비게이션 -->
  <nav class="side-nav" id="sideNav">
    <ul class="side-nav__list">
      <li><a href="#about" class="side-nav__link">About</a></li>
      <li><a href="#organization" class="side-nav__link">Organization</a></li>
      <li><a href="#sponsor" class="side-nav__link">Sponsor</a></li>
      <li><a href="#speakers" class="side-nav__link">Speakers</a></li>
      <li><a href="#program" class="side-nav__link">Program</a></li>
    </ul>
  </nav>
  
  <!-- Scroll Top Button -->
  <button class="scroll-top" aria-label="맨 위로">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 19V5M5 12l7-7 7 7"/>
    </svg>
  </button>
  
  <!-- Scripts -->
  <script src="assets/js/slider.js"></script>
  <script src="assets/js/main.js"></script>
  <script src="assets/js/dataLoader.js"></script>
</body>
</html>`;

  return html;
}

/**
 * index.html 다운로드
 */
function downloadIndexHtml() {
  const html = generateIndexHtml();
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = 'index.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  alert('index.html 파일이 다운로드되었습니다.\n루트 폴더의 index.html을 이 파일로 교체하세요.');
}

// 이벤트 바인딩
document.addEventListener('DOMContentLoaded', function() {
  // SEO 패널의 생성 버튼
  document.getElementById('generateSeoBtn')?.addEventListener('click', downloadIndexHtml);
  
  // 사이드바 SEO 버튼 - SEO 패널로 이동
  document.getElementById('sidebarSeoBtn')?.addEventListener('click', function() {
    document.querySelectorAll('.sidebar__link').forEach(link => link.classList.remove('active'));
    document.querySelector('[data-section="seo"]').classList.add('active');
    document.querySelectorAll('.panel').forEach(panel => panel.style.display = 'none');
    document.getElementById('seo-panel').style.display = 'block';
  });
});
