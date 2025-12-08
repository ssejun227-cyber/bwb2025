/**
 * Confer Admin Dashboard
 */

// 전역 데이터
let contentData = {};

// 초기화
document.addEventListener('DOMContentLoaded', function() {
  loadContent();
  initNavigation();
  initEventListeners();
});

/**
 * 콘텐츠 로드
 */
async function loadContent() {
  try {
    const response = await fetch('/api/content');
    contentData = await response.json();
    populateAllForms();
    showToast('데이터를 불러왔습니다.', 'success');
  } catch (error) {
    showToast('데이터 로드 실패', 'error');
    console.error(error);
  }
}

/**
 * 네비게이션 초기화
 */
function initNavigation() {
  const links = document.querySelectorAll('.sidebar__link');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // 활성 상태 변경
      links.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      
      // 패널 전환
      const section = this.dataset.section;
      showPanel(section);
    });
  });
}

/**
 * 패널 표시
 */
function showPanel(section) {
  const panels = document.querySelectorAll('.panel');
  panels.forEach(panel => panel.style.display = 'none');
  
  const targetPanel = document.getElementById(`${section}-panel`);
  if (targetPanel) {
    targetPanel.style.display = 'block';
  }
}

/**
 * 이벤트 리스너 초기화
 */
function initEventListeners() {
  // 전체 저장
  document.getElementById('saveAllBtn').addEventListener('click', saveAllContent);
  
  // SEO 생성
  document.getElementById('generateSeoBtn').addEventListener('click', generateSEO);
  
  // 미리보기
  document.getElementById('previewBtn').addEventListener('click', () => {
    window.open('/', '_blank');
  });
  
  // 이미지 업로드
  initImageUploads();
  
  // 아이템 추가 버튼들
  initAddButtons();
}

/**
 * 이미지 업로드 초기화
 */
function initImageUploads() {
  // Hero 로고
  document.getElementById('hero-logo-input').addEventListener('change', async function() {
    const path = await uploadImage(this.files[0]);
    if (path) {
      contentData.hero.logo = path;
      document.getElementById('hero-logo-preview').src = '/' + path;
    }
  });
  
  // About 이미지
  document.getElementById('about-image-input').addEventListener('change', async function() {
    const path = await uploadImage(this.files[0]);
    if (path) {
      contentData.about.image = path;
      document.getElementById('about-image-preview').src = '/' + path;
    }
  });
  
  // Gallery 로고
  document.getElementById('gallery-logo-input')?.addEventListener('change', async function() {
    const path = await uploadImage(this.files[0]);
    if (path) {
      if (!contentData.gallery) {
        contentData.gallery = { title: '', subtitle: '', logo: '', days: [] };
      }
      contentData.gallery.logo = path;
      document.getElementById('gallery-logo-preview').src = '/' + path;
    }
  });
}

/**
 * 이미지 업로드
 */
async function uploadImage(file) {
  if (!file) return null;
  
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    const result = await response.json();
    
    if (result.success) {
      showToast('이미지 업로드 완료', 'success');
      return result.path;
    }
  } catch (error) {
    showToast('이미지 업로드 실패', 'error');
  }
  return null;
}

/**
 * 추가 버튼 초기화
 */
function initAddButtons() {
  // 슬라이드 추가
  document.getElementById('addSlideBtn')?.addEventListener('click', () => {
    contentData.hero.slides.push('');
    renderSlides();
  });
  
  // 링크 추가
  document.getElementById('addLinkBtn')?.addEventListener('click', () => {
    contentData.links.push({ id: generateId(), text: '', url: '' });
    renderLinks();
  });
  
  // 문단 추가
  document.getElementById('addParagraphBtn')?.addEventListener('click', () => {
    contentData.about.paragraphs.push('');
    renderParagraphs();
  });
  
  // 연사 추가
  document.getElementById('addSpeakerBtn')?.addEventListener('click', () => {
    contentData.speakers.push({ id: generateId(), photo: '', name: '', desc: '' });
    renderSpeakers();
  });
  
  // 프로그램 추가
  document.getElementById('addProgramBtn')?.addEventListener('click', () => {
    contentData.program.push({
      id: generateId(),
      time: '',
      type: '',
      title: '',
      speakers: [],
      highlight: false
    });
    renderProgram();
  });
  
  // 갤러리 날짜 추가
  document.getElementById('addGalleryDayBtn')?.addEventListener('click', () => {
    if (!contentData.gallery) {
      contentData.gallery = { title: '', subtitle: '', logo: '', days: [] };
    }
    const dayNum = contentData.gallery.days.length + 1;
    contentData.gallery.days.push({
      id: generateId(),
      label: 'DAY' + dayNum,
      date: '',
      slides: [
        {
          id: generateId(),
          title: '세션 1',
          photos: []
        }
      ]
    });
    renderGalleryDays();
  });
}

/**
 * 모든 폼 채우기
 */
function populateAllForms() {
  // 사이트 설정
  if (contentData.site) {
    document.getElementById('site-title').value = contentData.site.title || '';
    document.getElementById('site-description').value = contentData.site.description || '';
    document.getElementById('site-keywords').value = (contentData.site.keywords || []).join(', ');
  }
  
  // Hero
  if (contentData.hero) {
    document.getElementById('hero-subtitle').value = contentData.hero.subtitle || '';
    document.getElementById('hero-title').value = contentData.hero.title || '';
    document.getElementById('hero-slogan').value = contentData.hero.slogan || '';
    document.getElementById('hero-date').value = contentData.hero.date || '';
    document.getElementById('hero-venue').value = contentData.hero.venue || '';
    
    if (contentData.hero.logo) {
      document.getElementById('hero-logo-preview').src = '/' + contentData.hero.logo;
    }
    
    renderSlides();
  }
  
  // 링크
  if (contentData.links) {
    renderLinks();
  }
  
  // About
  if (contentData.about) {
    document.getElementById('about-sloganSub').value = contentData.about.sloganSub || '';
    document.getElementById('about-sloganMain').value = contentData.about.sloganMain || '';
    
    if (contentData.about.image) {
      document.getElementById('about-image-preview').src = '/' + contentData.about.image;
    }
    
    renderParagraphs();
  }
  
  // Footer
  if (contentData.footer) {
    document.getElementById('footer-officeName').value = contentData.footer.officeName || '';
    document.getElementById('footer-phone').value = contentData.footer.phone || '';
    document.getElementById('footer-email').value = contentData.footer.email || '';
    document.getElementById('footer-address').value = contentData.footer.address || '';
    document.getElementById('footer-copyright').value = contentData.footer.copyright || '';
  }
  
  // 연사
  if (contentData.speakers) {
    renderSpeakers();
  }
  
  // 프로그램
  if (contentData.program) {
    renderProgram();
  }
  
  // 갤러리
  if (contentData.gallery) {
    document.getElementById('gallery-title').value = contentData.gallery.title || '';
    document.getElementById('gallery-subtitle').value = contentData.gallery.subtitle || '';
    if (contentData.gallery.logo) {
      document.getElementById('gallery-logo-preview').src = '/' + contentData.gallery.logo;
    }
    renderGalleryDays();
  }
}

/**
 * 슬라이드 렌더링
 */
function renderSlides() {
  const container = document.getElementById('hero-slides-list');
  container.innerHTML = '';
  
  contentData.hero.slides.forEach((slide, index) => {
    container.innerHTML += `
      <div class="item-card">
        <div class="item-card__header">
          <span class="item-card__title">슬라이드 ${index + 1}</span>
          <button class="btn btn--danger btn--small" onclick="removeSlide(${index})">삭제</button>
        </div>
        <div class="image-upload">
          <img src="${slide ? '/' + slide : ''}" class="image-preview" alt="">
          <input type="file" accept="image/*" class="file-input" onchange="updateSlideImage(${index}, this)">
          <button class="btn btn--small" onclick="this.previousElementSibling.click()">파일 선택</button>
        </div>
      </div>
    `;
  });
}

/**
 * 슬라이드 이미지 업데이트
 */
async function updateSlideImage(index, input) {
  const path = await uploadImage(input.files[0]);
  if (path) {
    contentData.hero.slides[index] = path;
    renderSlides();
  }
}

/**
 * 슬라이드 삭제
 */
function removeSlide(index) {
  contentData.hero.slides.splice(index, 1);
  renderSlides();
}

/**
 * 링크 렌더링
 */
function renderLinks() {
  const container = document.getElementById('links-list');
  container.innerHTML = '';
  
  contentData.links.forEach((link, index) => {
    container.innerHTML += `
      <div class="item-card">
        <div class="item-card__header">
          <span class="item-card__title">링크 ${index + 1}</span>
          <button class="btn btn--danger btn--small" onclick="removeLink(${index})">삭제</button>
        </div>
        <div class="item-card__body">
          <div class="form-group">
            <label>텍스트</label>
            <input type="text" class="form-input" value="${link.text}" 
              onchange="contentData.links[${index}].text = this.value">
          </div>
          <div class="form-group">
            <label>URL</label>
            <input type="text" class="form-input" value="${link.url}" 
              onchange="contentData.links[${index}].url = this.value">
          </div>
        </div>
      </div>
    `;
  });
}

/**
 * 링크 삭제
 */
function removeLink(index) {
  contentData.links.splice(index, 1);
  renderLinks();
}

/**
 * 문단 렌더링
 */
function renderParagraphs() {
  const container = document.getElementById('about-paragraphs-list');
  container.innerHTML = '';
  
  contentData.about.paragraphs.forEach((para, index) => {
    container.innerHTML += `
      <div class="item-card">
        <div class="item-card__header">
          <span class="item-card__title">문단 ${index + 1}</span>
          <button class="btn btn--danger btn--small" onclick="removeParagraph(${index})">삭제</button>
        </div>
        <div class="item-card__body item-card__body--full">
          <div class="form-group">
            <textarea class="form-textarea" 
              onchange="contentData.about.paragraphs[${index}] = this.value">${para}</textarea>
          </div>
        </div>
      </div>
    `;
  });
}

/**
 * 문단 삭제
 */
function removeParagraph(index) {
  contentData.about.paragraphs.splice(index, 1);
  renderParagraphs();
}

/**
 * 연사 렌더링
 */
function renderSpeakers() {
  const container = document.getElementById('speakers-list');
  container.innerHTML = '';
  
  contentData.speakers.forEach((speaker, index) => {
    container.innerHTML += `
      <div class="item-card">
        <div class="item-card__header">
          <span class="item-card__title">${speaker.name || '연사 ' + (index + 1)}</span>
          <button class="btn btn--danger btn--small" onclick="removeSpeaker(${index})">삭제</button>
        </div>
        <div class="item-card__body">
          <div class="form-group">
            <label>사진</label>
            <div class="image-upload">
              <img src="${speaker.photo ? '/' + speaker.photo : ''}" class="image-preview" alt="">
              <input type="file" accept="image/*" class="file-input" onchange="updateSpeakerPhoto(${index}, this)">
              <button class="btn btn--small" onclick="this.previousElementSibling.click()">파일 선택</button>
            </div>
          </div>
          <div class="form-group">
            <label>이름</label>
            <input type="text" class="form-input" value="${speaker.name}" 
              onchange="contentData.speakers[${index}].name = this.value">
          </div>
          <div class="form-group">
            <label>설명</label>
            <input type="text" class="form-input" value="${speaker.desc}" 
              onchange="contentData.speakers[${index}].desc = this.value">
          </div>
        </div>
      </div>
    `;
  });
}

/**
 * 연사 사진 업데이트
 */
async function updateSpeakerPhoto(index, input) {
  const path = await uploadImage(input.files[0]);
  if (path) {
    contentData.speakers[index].photo = path;
    renderSpeakers();
  }
}

/**
 * 연사 삭제
 */
function removeSpeaker(index) {
  contentData.speakers.splice(index, 1);
  renderSpeakers();
}

/**
 * 프로그램 렌더링
 */
function renderProgram() {
  const container = document.getElementById('program-list');
  container.innerHTML = '';
  
  contentData.program.forEach((prog, index) => {
    const highlightClass = prog.highlight ? 'program-item--highlight' : '';
    container.innerHTML += `
      <div class="item-card program-item ${highlightClass}">
        <div class="item-card__header">
          <span class="item-card__title">${prog.time} - ${prog.title || '프로그램 ' + (index + 1)}</span>
          <button class="btn btn--danger btn--small" onclick="removeProgram(${index})">삭제</button>
        </div>
        <div class="item-card__body">
          <div class="form-group">
            <label>시간</label>
            <input type="text" class="form-input" value="${prog.time}" 
              onchange="contentData.program[${index}].time = this.value">
          </div>
          <div class="form-group">
            <label>타입</label>
            <input type="text" class="form-input" value="${prog.type}" placeholder="발제, 패널 등"
              onchange="contentData.program[${index}].type = this.value">
          </div>
          <div class="form-group">
            <label>제목</label>
            <input type="text" class="form-input" value="${prog.title}" 
              onchange="contentData.program[${index}].title = this.value">
          </div>
          <div class="form-group">
            <label class="checkbox-group">
              <input type="checkbox" ${prog.highlight ? 'checked' : ''} 
                onchange="contentData.program[${index}].highlight = this.checked; renderProgram();">
              강조 표시
            </label>
          </div>
        </div>
      </div>
    `;
  });
}

/**
 * 프로그램 삭제
 */
function removeProgram(index) {
  contentData.program.splice(index, 1);
  renderProgram();
}

/**
 * 갤러리 날짜별 렌더링
 */
function renderGalleryDays() {
  const container = document.getElementById('gallery-days-list');
  if (!container || !contentData.gallery?.days) return;
  
  container.innerHTML = '';
  
  contentData.gallery.days.forEach((day, dayIndex) => {
    const slidesHtml = (day.slides || []).map((slide, slideIndex) => `
      <div class="gallery-slide-card">
        <div class="gallery-slide-header">
          <input type="text" class="form-input form-input--inline" value="${slide.title}" placeholder="세션 제목"
            onchange="contentData.gallery.days[${dayIndex}].slides[${slideIndex}].title = this.value;">
          <button class="btn btn--danger btn--small" onclick="removeGallerySlide(${dayIndex}, ${slideIndex})">삭제</button>
        </div>
        <div class="gallery-photos-list" id="gallery-photos-${dayIndex}-${slideIndex}">
          ${slide.photos.map((photo, photoIndex) => `
            <div class="gallery-photo-item">
              <img src="/${photo}" class="gallery-photo-preview" alt="">
              <button class="btn btn--danger btn--small" onclick="removeGalleryPhoto(${dayIndex}, ${slideIndex}, ${photoIndex})">X</button>
            </div>
          `).join('')}
        </div>
        <input type="file" id="gallery-photo-input-${dayIndex}-${slideIndex}" accept="image/*" multiple class="file-input" 
          onchange="addGalleryPhotos(${dayIndex}, ${slideIndex}, this)">
        <button class="btn btn--small" onclick="document.getElementById('gallery-photo-input-${dayIndex}-${slideIndex}').click()">+ 사진 추가</button>
      </div>
    `).join('');

    container.innerHTML += `
      <div class="item-card gallery-day-card">
        <div class="item-card__header">
          <span class="item-card__title">${day.label}</span>
          <button class="btn btn--danger btn--small" onclick="removeGalleryDay(${dayIndex})">날짜 삭제</button>
        </div>
        <div class="item-card__body item-card__body--full">
          <div class="form-row">
            <div class="form-group">
              <label>레이블</label>
              <input type="text" class="form-input" value="${day.label}" 
                onchange="contentData.gallery.days[${dayIndex}].label = this.value; renderGalleryDays();">
            </div>
            <div class="form-group">
              <label>날짜</label>
              <input type="text" class="form-input" value="${day.date}" placeholder="10/28 MON"
                onchange="contentData.gallery.days[${dayIndex}].date = this.value;">
            </div>
          </div>
          <div class="form-group">
            <label>슬라이드 목록</label>
            <div class="gallery-slides-list">
              ${slidesHtml}
            </div>
            <button class="btn btn--small btn--secondary" onclick="addGallerySlide(${dayIndex})">+ 슬라이드 추가</button>
          </div>
        </div>
      </div>
    `;
  });
}

/**
 * 갤러리 날짜 삭제
 */
function removeGalleryDay(dayIndex) {
  contentData.gallery.days.splice(dayIndex, 1);
  renderGalleryDays();
}

/**
 * 슬라이드 그룹 추가
 */
function addGallerySlide(dayIndex) {
  if (!contentData.gallery.days[dayIndex].slides) {
    contentData.gallery.days[dayIndex].slides = [];
  }
  contentData.gallery.days[dayIndex].slides.push({
    id: generateId(),
    title: '새 세션',
    photos: []
  });
  renderGalleryDays();
}

/**
 * 슬라이드 그룹 삭제
 */
function removeGallerySlide(dayIndex, slideIndex) {
  contentData.gallery.days[dayIndex].slides.splice(slideIndex, 1);
  renderGalleryDays();
}

/**
 * 갤러리 사진 추가
 */
async function addGalleryPhotos(dayIndex, slideIndex, input) {
  const files = input.files;
  if (!files.length) return;
  
  for (const file of files) {
    const path = await uploadImage(file);
    if (path) {
      contentData.gallery.days[dayIndex].slides[slideIndex].photos.push(path);
    }
  }
  
  renderGalleryDays();
  input.value = '';
}

/**
 * 갤러리 사진 삭제
 */
function removeGalleryPhoto(dayIndex, slideIndex, photoIndex) {
  contentData.gallery.days[dayIndex].slides[slideIndex].photos.splice(photoIndex, 1);
  renderGalleryDays();
}

/**
 * 전체 저장
 */
async function saveAllContent() {
  // 폼 데이터 수집
  collectFormData();
  
  try {
    const response = await fetch('/api/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contentData)
    });
    const result = await response.json();
    
    if (result.success) {
      showToast('저장 완료', 'success');
    } else {
      showToast('저장 실패', 'error');
    }
  } catch (error) {
    showToast('저장 실패', 'error');
    console.error(error);
  }
}

/**
 * 폼 데이터 수집
 */
function collectFormData() {
  // 사이트 설정
  contentData.site = {
    title: document.getElementById('site-title').value,
    description: document.getElementById('site-description').value,
    keywords: document.getElementById('site-keywords').value.split(',').map(k => k.trim()).filter(k => k)
  };
  
  // Hero
  contentData.hero.subtitle = document.getElementById('hero-subtitle').value;
  contentData.hero.title = document.getElementById('hero-title').value;
  contentData.hero.slogan = document.getElementById('hero-slogan').value;
  contentData.hero.date = document.getElementById('hero-date').value;
  contentData.hero.venue = document.getElementById('hero-venue').value;
  
  // About
  contentData.about.sloganSub = document.getElementById('about-sloganSub').value;
  contentData.about.sloganMain = document.getElementById('about-sloganMain').value;
  
  // Footer
  contentData.footer = {
    officeName: document.getElementById('footer-officeName').value,
    phone: document.getElementById('footer-phone').value,
    email: document.getElementById('footer-email').value,
    address: document.getElementById('footer-address').value,
    copyright: document.getElementById('footer-copyright').value
  };
  
  // Gallery
  if (contentData.gallery) {
    contentData.gallery.title = document.getElementById('gallery-title').value;
    contentData.gallery.subtitle = document.getElementById('gallery-subtitle').value;
    // logo는 이미지 업로드 시 자동 저장됨
  }
}

/**
 * SEO 파일 생성
 */
async function generateSEO() {
  try {
    const response = await fetch('/api/generate-seo', {
      method: 'POST'
    });
    const result = await response.json();
    
    if (result.success) {
      showToast('SEO 파일 생성 완료', 'success');
    } else {
      showToast('SEO 파일 생성 실패', 'error');
    }
  } catch (error) {
    showToast('SEO 파일 생성 실패', 'error');
  }
}

/**
 * 토스트 알림
 */
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

/**
 * ID 생성
 */
function generateId() {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}
