/**
 * Admin API
 * API 호출 및 이미지 업로드 함수
 */

// 현재 언어
let currentLang = 'ko';

/**
 * 언어 변경
 */
function switchLanguage(lang) {
  currentLang = lang;
  
  // 탭 활성화 변경
  document.querySelectorAll('.lang-tab').forEach(tab => {
    tab.classList.toggle('lang-tab--active', tab.dataset.lang === lang);
  });
  
  // 데이터 다시 로드
  loadContent();
}

/**
 * 콘텐츠 로드
 */
async function loadContent() {
  try {
    const endpoint = currentLang === 'ko' ? '/api/content' : '/api/content/en';
    const response = await fetch(endpoint);
    contentData = await response.json();
    populateAllForms();
    showToast(currentLang === 'ko' ? '데이터를 불러왔습니다.' : 'Data loaded.', 'success');
  } catch (error) {
    showToast('데이터 로드 실패', 'error');
    console.error(error);
  }
}

/**
 * 전체 저장
 */
async function saveAllContent() {
  collectFormData();
  
  try {
    const endpoint = currentLang === 'ko' ? '/api/content' : '/api/content/en';
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contentData)
    });
    const result = await response.json();
    
    if (result.success) {
      showToast(currentLang === 'ko' ? '저장 완료' : 'Saved!', 'success');
    } else {
      showToast('저장 실패', 'error');
    }
  } catch (error) {
    showToast('저장 실패', 'error');
    console.error(error);
  }
}

/**
 * 이미지 업로드
 */
async function uploadImage(file) {
  if (!file) return null;
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('lang', currentLang);
  
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
 * SEO 파일 생성
 */
async function generateSEO() {
  try {
    const endpoint = currentLang === 'ko' ? '/api/generate-seo' : '/api/generate-seo/en';
    const response = await fetch(endpoint, {
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
