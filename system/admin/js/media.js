/**
 * Admin Media
 * 언론보도 전용 렌더링 및 관리 함수
 */

/**
 * 주요 기사 렌더링
 */
function renderMediaFeatured() {
  const container = document.getElementById('media-featured-list');
  if (!container || !contentData.media?.featured) return;
  
  container.innerHTML = '';
  
  contentData.media.featured.forEach((item, index) => {
    container.innerHTML += `
      <div class="item-card">
        <div class="item-card__header">
          <span class="item-card__title">${item.title || '주요 기사 ' + (index + 1)}</span>
          <button class="btn btn--danger btn--small" onclick="removeMediaFeatured(${index})">삭제</button>
        </div>
        <div class="item-card__body item-card__body--full">
          <div class="form-group">
            <label>이미지</label>
            <div class="image-upload">
              <img src="${item.image ? '/' + item.image : ''}" class="image-preview" alt="">
              <input type="file" accept="image/*" class="file-input" onchange="updateMediaFeaturedImage(${index}, this)">
              <button class="btn btn--small" onclick="this.previousElementSibling.click()">파일 선택</button>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>제목</label>
              <input type="text" class="form-input" value="${item.title || ''}" 
                onchange="contentData.media.featured[${index}].title = this.value">
            </div>
            <div class="form-group">
              <label>URL</label>
              <input type="text" class="form-input" value="${item.url || ''}" 
                onchange="contentData.media.featured[${index}].url = this.value">
            </div>
          </div>
          <div class="form-group">
            <label>요약</label>
            <textarea class="form-textarea" 
              onchange="contentData.media.featured[${index}].summary = this.value">${item.summary || ''}</textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>출처</label>
              <input type="text" class="form-input" value="${item.source || ''}" 
                onchange="contentData.media.featured[${index}].source = this.value">
            </div>
            <div class="form-group">
              <label>날짜</label>
              <input type="text" class="form-input" value="${item.date || ''}" placeholder="2024-10-27"
                onchange="contentData.media.featured[${index}].date = this.value">
            </div>
          </div>
        </div>
      </div>
    `;
  });
}

/**
 * 주요 기사 이미지 업데이트
 */
async function updateMediaFeaturedImage(index, input) {
  const path = await uploadImage(input.files[0]);
  if (path) {
    contentData.media.featured[index].image = path;
    renderMediaFeatured();
  }
}

/**
 * 주요 기사 삭제
 */
function removeMediaFeatured(index) {
  contentData.media.featured.splice(index, 1);
  renderMediaFeatured();
}

/**
 * 기사 목록 렌더링
 */
function renderMediaArticles() {
  const container = document.getElementById('media-articles-list');
  if (!container || !contentData.media?.articles) return;
  
  container.innerHTML = '';
  
  contentData.media.articles.forEach((item, index) => {
    container.innerHTML += `
      <div class="item-card">
        <div class="item-card__header">
          <span class="item-card__title">${item.source || ''} - ${item.title || '기사 ' + (index + 1)}</span>
          <button class="btn btn--danger btn--small" onclick="removeMediaArticle(${index})">삭제</button>
        </div>
        <div class="item-card__body">
          <div class="form-group">
            <label>출처</label>
            <input type="text" class="form-input" value="${item.source || ''}" 
              onchange="contentData.media.articles[${index}].source = this.value">
          </div>
          <div class="form-group">
            <label>URL</label>
            <input type="text" class="form-input" value="${item.url || ''}" 
              onchange="contentData.media.articles[${index}].url = this.value">
          </div>
          <div class="form-group" style="grid-column: 1 / -1;">
            <label>제목</label>
            <input type="text" class="form-input" value="${item.title || ''}" 
              onchange="contentData.media.articles[${index}].title = this.value">
          </div>
        </div>
      </div>
    `;
  });
}

/**
 * 기사 삭제
 */
function removeMediaArticle(index) {
  contentData.media.articles.splice(index, 1);
  renderMediaArticles();
}
