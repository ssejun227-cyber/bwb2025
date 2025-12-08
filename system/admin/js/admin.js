/**
 * Confer Admin Dashboard
 * 메인 초기화 및 이벤트 바인딩
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
  // 언어 탭 전환
  document.querySelectorAll('.lang-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      switchLanguage(this.dataset.lang);
    });
  });
  
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
      if (!contentData.about.media) {
        contentData.about.media = { type: 'image', image: '', video: '', youtube: '' };
      }
      contentData.about.media.image = path;
      document.getElementById('about-image-preview').src = '/' + path;
    }
  });
  
  // About 동영상
  document.getElementById('about-video-input')?.addEventListener('change', async function() {
    const path = await uploadImage(this.files[0]);
    if (path) {
      if (!contentData.about.media) {
        contentData.about.media = { type: 'video', image: '', video: '', youtube: '' };
      }
      contentData.about.media.video = path;
      document.getElementById('about-video-preview').src = '/' + path;
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
  
  // Media 로고
  document.getElementById('media-logo-input')?.addEventListener('change', async function() {
    const path = await uploadImage(this.files[0]);
    if (path) {
      if (!contentData.media) {
        contentData.media = { title: '', subtitle: '', logo: '', featured: [], articles: [] };
      }
      contentData.media.logo = path;
      document.getElementById('media-logo-preview').src = '/' + path;
    }
  });
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
  
  // 주최 추가
  document.getElementById('addHostBtn')?.addEventListener('click', () => {
    if (!contentData.hosts) contentData.hosts = { host: [], organizer: [], support: [] };
    if (!contentData.hosts.host) contentData.hosts.host = [];
    contentData.hosts.host.push({ id: generateId(), name: '', logo: '' });
    renderHosts();
  });
  
  // 주관 추가
  document.getElementById('addOrganizerBtn')?.addEventListener('click', () => {
    if (!contentData.hosts) contentData.hosts = { host: [], organizer: [], support: [] };
    if (!contentData.hosts.organizer) contentData.hosts.organizer = [];
    contentData.hosts.organizer.push({ id: generateId(), name: '', logo: '' });
    renderHosts();
  });
  
  // 후원 추가
  document.getElementById('addSupportBtn')?.addEventListener('click', () => {
    if (!contentData.hosts) contentData.hosts = { host: [], organizer: [], support: [] };
    if (!contentData.hosts.support) contentData.hosts.support = [];
    contentData.hosts.support.push({ id: generateId(), name: '', logo: '' });
    renderHosts();
  });
  
  // Speakers 그룹 추가
  document.getElementById('addSpeakerGroupBtn')?.addEventListener('click', () => {
    if (!contentData.speakerGroups) {
      contentData.speakerGroups = [];
    }
    contentData.speakerGroups.push({
      id: generateId(),
      type: 'group',
      title: '',
      subtitle: '',
      members: []
    });
    renderSpeakers();
  });
  
  // Speakers 여백 추가
  document.getElementById('addSpeakerSpacerBtn')?.addEventListener('click', () => {
    if (!contentData.speakerGroups) {
      contentData.speakerGroups = [];
    }
    contentData.speakerGroups.push({
      id: generateId(),
      type: 'spacer'
    });
    renderSpeakers();
  });
  
  // Program Day 추가
  document.getElementById('addProgramDayBtn')?.addEventListener('click', () => {
    if (!contentData.programData) {
      contentData.programData = { days: [] };
    }
    if (!contentData.programData.days) {
      contentData.programData.days = [];
    }
    contentData.programData.days.push({
      id: generateId(),
      label: 'Day ' + (contentData.programData.days.length + 1),
      date: '',
      items: []
    });
    renderProgram();
  });
  
  // Organization 그룹 추가
  document.getElementById('addOrgGroupBtn')?.addEventListener('click', () => {
    if (!contentData.organization) {
      contentData.organization = { groups: [] };
    }
    contentData.organization.groups.push({
      id: generateId(),
      title: '',
      members: []
    });
    renderOrganization();
  });
  
  // Sponsor 로고 추가
  document.getElementById('addSponsorLogoBtn')?.addEventListener('click', () => {
    if (!contentData.sponsor) {
      contentData.sponsor = { logos: [], members: [] };
    }
    if (!contentData.sponsor.logos) contentData.sponsor.logos = [];
    contentData.sponsor.logos.push({
      id: generateId(),
      name: '',
      logo: ''
    });
    renderSponsorLogos();
  });
  
  // Sponsor 멤버 추가
  document.getElementById('addSponsorMemberBtn')?.addEventListener('click', () => {
    if (!contentData.sponsor) {
      contentData.sponsor = { logos: [], members: [] };
    }
    if (!contentData.sponsor.members) contentData.sponsor.members = [];
    contentData.sponsor.members.push({
      id: generateId(),
      photo: '',
      name: '',
      desc: ''
    });
    renderSponsorMembers();
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
  
  // 주요 기사 추가
  document.getElementById('addMediaFeaturedBtn')?.addEventListener('click', () => {
    if (!contentData.media) {
      contentData.media = { title: '', subtitle: '', logo: '', featured: [], articles: [] };
    }
    contentData.media.featured.push({
      id: generateId(),
      image: '',
      title: '',
      summary: '',
      source: '',
      date: '',
      url: '#'
    });
    renderMediaFeatured();
  });
  
  // 기사 추가
  document.getElementById('addMediaArticleBtn')?.addEventListener('click', () => {
    if (!contentData.media) {
      contentData.media = { title: '', subtitle: '', logo: '', featured: [], articles: [] };
    }
    contentData.media.articles.push({
      id: generateId(),
      source: '',
      title: '',
      url: '#'
    });
    renderMediaArticles();
  });
}
