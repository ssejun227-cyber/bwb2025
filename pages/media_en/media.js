/**
 * Media Page (English) - JavaScript
 * 언론보도 데이터 로드 및 렌더링
 */

document.addEventListener('DOMContentLoaded', () => {
  loadMediaData();
  initScrollTop();
  initMobileMenu();
});

/**
 * 언론보도 데이터 로드
 */
async function loadMediaData() {
  try {
    const response = await fetch('/pages/en/data/content.json');
    const data = await response.json();
    
    // 헤더 로고 설정
    const headerLogo = document.getElementById('headerLogo');
    const menuLogo = document.getElementById('menuLogo');
    if (headerLogo) {
      const logoPath = data.media?.logo || data.hero?.logo;
      if (logoPath) {
        headerLogo.src = '/' + logoPath;
        if (menuLogo) menuLogo.src = '/' + logoPath;
      }
    }
    
    // 타이틀 설정
    if (data.media) {
      const mediaTitle = document.getElementById('mediaTitle');
      const mediaSubtitle = document.getElementById('mediaSubtitle');
      
      if (mediaTitle) mediaTitle.textContent = data.media.title;
      if (mediaSubtitle) mediaSubtitle.textContent = data.media.subtitle;
      
      // 주요 기사 렌더링
      renderFeatured(data.media.featured);
      
      // 기사 목록 렌더링
      renderArticles(data.media.articles);
    }
    
    // 푸터 렌더링
    if (data.footer) {
      renderFooter(data.footer);
    }
    
    // 모바일 메뉴 렌더링
    if (data.mobileMenu) {
      renderMobileMenu(data.mobileMenu);
    }
    
    // 추가 메뉴 렌더링
    if (data.extraMenu) {
      renderExtraMenu(data.extraMenu);
    }
  } catch (error) {
    console.error('Media data load failed:', error);
  }
}

/**
 * 모바일 메뉴 렌더링
 */
function renderMobileMenu(mobileMenu) {
  const container = document.querySelector('.mobile-menu__list');
  if (!container || !mobileMenu) return;
  
  container.innerHTML = '';
  
  mobileMenu.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `
      <a href="${item.url.startsWith('http') ? item.url : '/pages/en/' + item.url}" class="mobile-menu__link"${item.external ? ' target="_blank"' : ''}>
        <span class="mobile-menu__link-title">${item.title}</span>
        <span class="mobile-menu__link-sub">${item.subtitle || ''}</span>
      </a>
    `;
    container.appendChild(li);
  });
}

/**
 * 추가 메뉴 렌더링
 */
function renderExtraMenu(extraMenu) {
  if (!extraMenu || !extraMenu.title || !extraMenu.url) return;
  
  const container = document.querySelector('.mobile-menu__list');
  if (!container) return;
  
  const li = document.createElement('li');
  li.innerHTML = `
    <a href="${extraMenu.url}" class="mobile-menu__link" target="_blank">
      <span class="mobile-menu__link-title">${extraMenu.title}</span>
      <span class="mobile-menu__link-sub">${extraMenu.subtitle || ''}</span>
    </a>
  `;
  container.appendChild(li);
}

/**
 * 주요 기사 렌더링
 */
function renderFeatured(featured) {
  const container = document.getElementById('mediaFeatured');
  if (!container || !featured || !featured.length) return;
  
  container.innerHTML = `
    <div class="media-featured__inner">
      ${featured.map(item => `
        <article class="media-featured__card">
          ${item.image ? `<img src="/${item.image}" alt="${item.title}" class="media-featured__image">` : ''}
          <div class="media-featured__content">
            <a href="${item.url}" class="media-featured__title" target="_blank">${item.title}</a>
            <p class="media-featured__summary">${item.summary}</p>
            <p class="media-featured__meta">${item.source}  ${item.date}</p>
          </div>
        </article>
      `).join('')}
    </div>
  `;
}

/**
 * 기사 목록 렌더링
 */
function renderArticles(articles) {
  const container = document.getElementById('mediaArticles');
  if (!container || !articles || !articles.length) return;
  
  container.innerHTML = `
    <div class="media-articles__list">
      ${articles.map(item => `
        <div class="media-articles__item">
          <span class="media-articles__source">${item.source}</span>
          <a href="${item.url}" class="media-articles__link" target="_blank">${item.title}</a>
        </div>
      `).join('')}
    </div>
  `;
}

/**
 * 푸터 렌더링
 */
function renderFooter(footer) {
  const container = document.getElementById('mediaFooter');
  if (!container || !footer) return;
  
  container.innerHTML = `
    <div class="media-footer__inner">
      <div class="media-footer__info">
        <p class="media-footer__office">${footer.officeName || ''}</p>
        ${footer.phone ? `
          <p class="media-footer__row">
            <span class="media-footer__label">| Phone</span>
            <span class="media-footer__value">${footer.phone}</span>
          </p>
        ` : ''}
        ${footer.email ? `
          <p class="media-footer__row">
            <span class="media-footer__label">| Email</span>
            <span class="media-footer__value">${footer.email}</span>
          </p>
        ` : ''}
        ${footer.address ? `
          <p class="media-footer__row">
            <span class="media-footer__label">| Address</span>
            <span class="media-footer__value">${footer.address}</span>
          </p>
        ` : ''}
      </div>
      <p class="media-footer__copyright">${footer.copyright || ''}</p>
    </div>
  `;
}

/**
 * 스크롤 탑 버튼 초기화
 */
function initScrollTop() {
  const scrollTopBtn = document.getElementById('scrollTop');
  if (!scrollTopBtn) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });
  
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/**
 * 모바일 메뉴 초기화
 */
function initMobileMenu() {
  const menuOpen = document.getElementById('menuOpen');
  const menuClose = document.querySelector('.mobile-menu__close');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (!mobileMenu) return;
  
  if (menuOpen) {
    menuOpen.addEventListener('click', () => {
      mobileMenu.classList.add('mobile-menu--open');
      document.body.style.overflow = 'hidden';
    });
  }
  
  if (menuClose) {
    menuClose.addEventListener('click', () => {
      mobileMenu.classList.remove('mobile-menu--open');
      document.body.style.overflow = '';
    });
  }
}
