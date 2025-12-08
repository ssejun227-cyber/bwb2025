/**
 * Gallery Page - JavaScript
 * 갤러리 데이터 로드 및 슬라이더 기능
 */

document.addEventListener('DOMContentLoaded', () => {
  loadGalleryData();
  initScrollTop();
  initMobileMenu();
});

/**
 * 갤러리 데이터 로드
 */
async function loadGalleryData() {
  try {
    const response = await fetch('/data/content.json');
    const data = await response.json();
    
    // 헤더 로고 설정 (갤러리 전용 로고 우선, 없으면 hero 로고)
    const headerLogo = document.getElementById('headerLogo');
    const menuLogo = document.getElementById('menuLogo');
    if (headerLogo) {
      const logoPath = data.gallery?.logo || data.hero?.logo;
      if (logoPath) {
        headerLogo.src = '/' + logoPath;
        if (menuLogo) menuLogo.src = '/' + logoPath;
      }
    }
    
    // 갤러리 타이틀 설정
    const galleryTitle = document.getElementById('galleryTitle');
    const gallerySubtitle = document.getElementById('gallerySubtitle');
    
    if (data.gallery) {
      if (galleryTitle) galleryTitle.textContent = data.gallery.title;
      if (gallerySubtitle) gallerySubtitle.textContent = data.gallery.subtitle;
      
      // 날짜별 섹션 렌더링
      renderGalleryDays(data.gallery.days);
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
    console.error('갤러리 데이터 로드 실패:', error);
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
      <a href="${item.url.startsWith('http') ? item.url : '/' + item.url}" class="mobile-menu__link"${item.external ? ' target="_blank"' : ''}>
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
 * 날짜별 갤러리 섹션 렌더링
 */
function renderGalleryDays(days) {
  const container = document.getElementById('galleryContent');
  if (!container || !days) return;
  
  container.innerHTML = days.map((day) => `
    <section class="gallery-day" data-day="${day.id}">
      <div class="gallery-day__watermark">${day.label}</div>
      
      <div class="gallery-day__content">
        ${day.slides.map((slide, slideIndex) => `
          <div class="gallery-slide-group">
            <div class="gallery-day__tab">
              <span class="gallery-day__tab-title">${slide.title}</span>
              <span class="gallery-day__tab-date">${day.date}</span>
            </div>
            
            <div class="gallery-slider" data-slider="${day.id}-${slideIndex}">
              <div class="gallery-slider__track">
                ${slide.photos.map(photo => `
                  <div class="gallery-slider__slide">
                    <img src="/${photo}" alt="${slide.title}" loading="lazy">
                  </div>
                `).join('')}
              </div>
              
              ${slide.photos.length > 1 ? `
                <button class="gallery-slider__arrow gallery-slider__arrow--prev" data-dir="prev">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                
                <button class="gallery-slider__arrow gallery-slider__arrow--next" data-dir="next">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </button>
                
                <div class="gallery-slider__dots">
                  ${slide.photos.map((_, i) => `
                    <span class="gallery-slider__dot${i === 0 ? ' gallery-slider__dot--active' : ''}" data-index="${i}"></span>
                  `).join('')}
                </div>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    </section>
  `).join('');
  
  // 슬라이더 초기화
  initSliders();
}

/**
 * 모든 슬라이더 초기화
 */
function initSliders() {
  const sliders = document.querySelectorAll('.gallery-slider');
  
  sliders.forEach(slider => {
    const track = slider.querySelector('.gallery-slider__track');
    const slides = slider.querySelectorAll('.gallery-slider__slide');
    const dots = slider.querySelectorAll('.gallery-slider__dot');
    const prevBtn = slider.querySelector('.gallery-slider__arrow--prev');
    const nextBtn = slider.querySelector('.gallery-slider__arrow--next');
    
    let currentIndex = 0;
    const totalSlides = slides.length;
    
    // 슬라이드 이동 함수
    function goToSlide(index) {
      if (index < 0) index = totalSlides - 1;
      if (index >= totalSlides) index = 0;
      
      currentIndex = index;
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      
      // 인디케이터 업데이트
      dots.forEach((dot, i) => {
        dot.classList.toggle('gallery-slider__dot--active', i === currentIndex);
      });
    }
    
    // 화살표 클릭
    prevBtn?.addEventListener('click', () => goToSlide(currentIndex - 1));
    nextBtn?.addEventListener('click', () => goToSlide(currentIndex + 1));
    
    // 인디케이터 클릭
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => goToSlide(i));
    });
    
    // 터치/스와이프 지원
    let startX = 0;
    let endX = 0;
    
    slider.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });
    
    slider.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      const diff = startX - endX;
      
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          goToSlide(currentIndex + 1);
        } else {
          goToSlide(currentIndex - 1);
        }
      }
    }, { passive: true });
  });
}

/**
 * 스크롤 탑 버튼 초기화
 */
function renderFooter(footer) {
  const container = document.getElementById('galleryFooter');
  if (!container || !footer) return;
  
  container.innerHTML = `
    <div class="gallery-footer__inner">
      <div class="gallery-footer__info">
        <p class="gallery-footer__office">${footer.officeName || ''}</p>
        ${footer.phone ? `
          <p class="gallery-footer__row">
            <span class="gallery-footer__label">| 전화번호</span>
            <span class="gallery-footer__value">${footer.phone}</span>
          </p>
        ` : ''}
        ${footer.email ? `
          <p class="gallery-footer__row">
            <span class="gallery-footer__label">| 이메일</span>
            <span class="gallery-footer__value">${footer.email}</span>
          </p>
        ` : ''}
        ${footer.address ? `
          <p class="gallery-footer__row">
            <span class="gallery-footer__label">| 주소</span>
            <span class="gallery-footer__value">${footer.address}</span>
          </p>
        ` : ''}
      </div>
      <p class="gallery-footer__copyright">${footer.copyright || ''}</p>
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
  const menuClose = document.getElementById('menuClose');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (!menuOpen || !menuClose || !mobileMenu) return;
  
  menuOpen.addEventListener('click', () => {
    mobileMenu.classList.add('mobile-menu--open');
    document.body.style.overflow = 'hidden';
  });
  
  menuClose.addEventListener('click', () => {
    mobileMenu.classList.remove('mobile-menu--open');
    document.body.style.overflow = '';
  });
}
