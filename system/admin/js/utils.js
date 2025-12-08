/**
 * Admin Utils
 * 유틸리티 함수
 */

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

/**
 * 배열 아이템 위로 이동
 */
function moveItemUp(array, index) {
  if (index > 0) {
    const temp = array[index];
    array[index] = array[index - 1];
    array[index - 1] = temp;
    return true;
  }
  return false;
}

/**
 * 배열 아이템 아래로 이동
 */
function moveItemDown(array, index) {
  if (index < array.length - 1) {
    const temp = array[index];
    array[index] = array[index + 1];
    array[index + 1] = temp;
    return true;
  }
  return false;
}

/**
 * About 미디어 타입 토글
 */
function toggleAboutMedia() {
  const type = document.getElementById('about-media-type').value;
  
  document.getElementById('about-media-image').style.display = type === 'image' ? 'block' : 'none';
  document.getElementById('about-media-video').style.display = type === 'video' ? 'block' : 'none';
  document.getElementById('about-media-youtube').style.display = type === 'youtube' ? 'block' : 'none';
}
