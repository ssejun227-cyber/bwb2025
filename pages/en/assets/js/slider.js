/**
 * Hero Slider - 이미지 슬라이드 기능
 */

let heroSliderInterval = null;
let currentSlide = 0;

/**
 * Hero 슬라이더 시작 (외부 호출용)
 */
function startHeroSlider() {
  // 이미 실행 중이면 중복 방지
  if (heroSliderInterval) return;
  
  const slides = document.querySelectorAll('.hero__slide');
  if (slides.length <= 1) return;
  
  const slideInterval = 3000; // 3초
  
  heroSliderInterval = setInterval(function() {
    goToSlide((currentSlide + 1) % slides.length);
  }, slideInterval);
  
  // 버튼 이벤트 등록
  initSliderButtons();
}

/**
 * 특정 슬라이드로 이동
 */
function goToSlide(index) {
  const slides = document.querySelectorAll('.hero__slide');
  if (slides.length === 0) return;
  
  slides[currentSlide].classList.remove('hero__slide--active');
  currentSlide = index;
  if (currentSlide < 0) currentSlide = slides.length - 1;
  if (currentSlide >= slides.length) currentSlide = 0;
  slides[currentSlide].classList.add('hero__slide--active');
}

/**
 * 슬라이드 버튼 초기화
 */
function initSliderButtons() {
  const prevBtn = document.querySelector('.hero__slider-btn--prev');
  const nextBtn = document.querySelector('.hero__slider-btn--next');
  const slides = document.querySelectorAll('.hero__slide');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      // 자동 슬라이드 리셋
      resetSliderInterval();
      goToSlide(currentSlide - 1);
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      // 자동 슬라이드 리셋
      resetSliderInterval();
      goToSlide(currentSlide + 1);
    });
  }
}

/**
 * 자동 슬라이드 타이머 리셋
 */
function resetSliderInterval() {
  if (heroSliderInterval) {
    clearInterval(heroSliderInterval);
    heroSliderInterval = null;
  }
  
  const slides = document.querySelectorAll('.hero__slide');
  if (slides.length <= 1) return;
  
  heroSliderInterval = setInterval(function() {
    goToSlide((currentSlide + 1) % slides.length);
  }, 3000);
}
