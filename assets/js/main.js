/**
 * Main JavaScript - 초기화 및 공통 기능
 */

document.addEventListener('DOMContentLoaded', function() {
  initScrollTop();
  initSmoothScroll();
  initNavHighlight();
  initSideNavVisibility();
  initMobileMenu();
  initMobileHeaderScroll();
});

/**
 * 모바일 메뉴
 */
function initMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-header__menu-btn');
  const heroMenuBtn = document.querySelector('.hero__menu-btn');
  const menu = document.getElementById('mobileMenu');
  const closeBtn = document.querySelector('.mobile-menu__close');
  const menuLinks = document.querySelectorAll('.mobile-menu__link');
  
  if (!menu) return;
  
  // 메뉴 열기 함수
  function openMenu() {
    menu.classList.add('mobile-menu--open');
    document.body.style.overflow = 'hidden';
  }
  
  // 메뉴 닫기 함수
  function closeMenu() {
    menu.classList.remove('mobile-menu--open');
    document.body.style.overflow = '';
  }
  
  // 모바일 헤더 버튼
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', openMenu);
  }
  
  // 데스크톱 hero 헤더 버튼
  if (heroMenuBtn) {
    heroMenuBtn.addEventListener('click', openMenu);
  }
  
  // 닫기 버튼
  if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
  }
  
  // 메뉴 링크 클릭시 닫기 (이벤트 위임 - 동적 로드 대응)
  const menuList = document.querySelector('.mobile-menu__list');
  if (menuList) {
    menuList.addEventListener('click', function(e) {
      const link = e.target.closest('.mobile-menu__link');
      if (link && link.getAttribute('href') && link.getAttribute('href').startsWith('#')) {
        closeMenu();
      }
    });
  }
}

/**
 * 스크롤 탑 버튼
 */
function initScrollTop() {
  const scrollTopBtn = document.querySelector('.scroll-top');
  if (!scrollTopBtn) return;
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('scroll-top--visible');
    } else {
      scrollTopBtn.classList.remove('scroll-top--visible');
    }
  });
  
  scrollTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * 부드러운 스크롤
 */
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('a[href^="#"]');
  
  navLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * 네비게이션 하이라이트
 */
function initNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.side-nav__link');
  
  if (sections.length === 0 || navLinks.length === 0) return;
  
  window.addEventListener('scroll', function() {
    let current = '';
    
    sections.forEach(function(section) {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(function(link) {
      link.classList.remove('side-nav__link--active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('side-nav__link--active');
      }
    });
  });
}

/**
 * 사이드 네비게이션 표시/숨김
 */
function initSideNavVisibility() {
  const sideNav = document.getElementById('sideNav');
  
  if (!sideNav) return;
  
  window.addEventListener('scroll', function() {
    // 화면 높이만큼 스크롤하면 표시 (Hero 지나면)
    if (window.scrollY > window.innerHeight * 0.8) {
      sideNav.classList.add('side-nav--visible');
    } else {
      sideNav.classList.remove('side-nav--visible');
    }
  });
}


/**
 * 모바일 헤더 스크롤 시 배경색 변경
 */
function initMobileHeaderScroll() {
  const mobileHeader = document.querySelector('.mobile-header');
  const aboutSection = document.getElementById('about');
  
  if (!mobileHeader || !aboutSection) return;
  
  function checkScroll() {
    const heroSection = document.getElementById('main');
    const heroHeight = heroSection ? heroSection.offsetHeight : window.innerHeight;
    
    if (window.scrollY >= heroHeight - 100) {
      mobileHeader.classList.add('mobile-header--scrolled');
    } else {
      mobileHeader.classList.remove('mobile-header--scrolled');
    }
  }
  
  // 초기 상태 체크
  checkScroll();
  
  // 스크롤 이벤트
  window.addEventListener('scroll', checkScroll);
}
