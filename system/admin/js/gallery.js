/**
 * Admin Gallery
 * 갤러리 전용 렌더링 및 관리 함수
 */

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
