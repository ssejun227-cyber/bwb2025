/**
 * Admin Forms
 * 폼 데이터 채우기 및 수집
 */

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
  
  // 섹션 관리
  if (contentData.sections) {
    renderSections();
  }
  
  // Hero
  if (contentData.hero) {
    document.getElementById('hero-subtitle').value = contentData.hero.subtitle || '';
    document.getElementById('hero-title').value = contentData.hero.title || '';
    document.getElementById('hero-slogan').value = contentData.hero.slogan || '';
    document.getElementById('hero-date').value = contentData.hero.date || '';
    document.getElementById('hero-venue').value = contentData.hero.venue || '';
    
    // SNS
    if (contentData.hero.sns) {
      document.getElementById('hero-sns-instagram').value = contentData.hero.sns.instagram || '';
      document.getElementById('hero-sns-x').value = contentData.hero.sns.x || '';
      document.getElementById('hero-sns-youtube').value = contentData.hero.sns.youtube || '';
    }
    
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
    
    // 미디어
    if (contentData.about.media) {
      document.getElementById('about-media-type').value = contentData.about.media.type || 'none';
      toggleAboutMedia();
      
      if (contentData.about.media.image) {
        document.getElementById('about-image-preview').src = '/' + contentData.about.media.image;
      }
      if (contentData.about.media.video) {
        document.getElementById('about-video-preview').src = '/' + contentData.about.media.video;
      }
      if (contentData.about.media.youtube) {
        document.getElementById('about-youtube-url').value = contentData.about.media.youtube;
      }
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
  
  // 추가 메뉴
  if (contentData.extraMenu) {
    document.getElementById('extra-menu-title').value = contentData.extraMenu.title || '';
    document.getElementById('extra-menu-url').value = contentData.extraMenu.url || '';
    document.getElementById('extra-menu-subtitle').value = contentData.extraMenu.subtitle || '';
  }
  
  // SEO
  if (contentData.seo) {
    fillSeoForm();
  }
  
  // 주최/주관/후원
  if (contentData.hosts) {
    renderHosts();
  }
  
  // Organization
  if (contentData.organization) {
    renderOrganization();
  }
  
  // Sponsor
  if (contentData.sponsor) {
    document.getElementById('sponsor-logos-title').value = contentData.sponsor.logosTitle || '';
    document.getElementById('sponsor-members-title').value = contentData.sponsor.membersTitle || '';
    renderSponsorLogos();
    renderSponsorMembers();
  }
  
  // 연사
  if (contentData.speakersSection) {
    document.getElementById('speakers-section-title').value = contentData.speakersSection.title || '';
  }
  if (contentData.speakerGroups) {
    renderSpeakers();
  }
  
  // 프로그램
  if (contentData.programData) {
    document.getElementById('program-category').value = contentData.programData.category || '';
    document.getElementById('program-title').value = contentData.programData.title || '';
    document.getElementById('program-venue').value = contentData.programData.venue || '';
    document.getElementById('program-notice').value = contentData.programData.notice || '';
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
  
  // 미디어
  if (contentData.media) {
    document.getElementById('media-title').value = contentData.media.title || '';
    document.getElementById('media-subtitle').value = contentData.media.subtitle || '';
    if (contentData.media.logo) {
      document.getElementById('media-logo-preview').src = '/' + contentData.media.logo;
    }
    renderMediaFeatured();
    renderMediaArticles();
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
  
  // SNS
  if (!contentData.hero.sns) contentData.hero.sns = {};
  contentData.hero.sns.instagram = document.getElementById('hero-sns-instagram').value;
  contentData.hero.sns.x = document.getElementById('hero-sns-x').value;
  contentData.hero.sns.youtube = document.getElementById('hero-sns-youtube').value;
  
  // About
  contentData.about.sloganSub = document.getElementById('about-sloganSub').value;
  contentData.about.sloganMain = document.getElementById('about-sloganMain').value;
  
  // About 미디어
  if (!contentData.about.media) {
    contentData.about.media = { type: 'none', image: '', video: '', youtube: '' };
  }
  contentData.about.media.type = document.getElementById('about-media-type').value;
  contentData.about.media.youtube = document.getElementById('about-youtube-url').value;
  
  // Footer
  contentData.footer = {
    officeName: document.getElementById('footer-officeName').value,
    phone: document.getElementById('footer-phone').value,
    email: document.getElementById('footer-email').value,
    address: document.getElementById('footer-address').value,
    copyright: document.getElementById('footer-copyright').value
  };
  
  // 추가 메뉴
  contentData.extraMenu = {
    title: document.getElementById('extra-menu-title').value,
    url: document.getElementById('extra-menu-url').value,
    subtitle: document.getElementById('extra-menu-subtitle').value
  };
  
  // SEO
  collectSeoData();
  
  // Sponsor
  if (contentData.sponsor) {
    contentData.sponsor.logosTitle = document.getElementById('sponsor-logos-title').value;
    contentData.sponsor.membersTitle = document.getElementById('sponsor-members-title').value;
  }
  
  
  
  // Speakers 섹션 타이틀
  if (!contentData.speakersSection) contentData.speakersSection = {};
  contentData.speakersSection.title = document.getElementById('speakers-section-title').value;
  
  // Program
  if (!contentData.programData) contentData.programData = { days: [] };
  contentData.programData.category = document.getElementById('program-category').value;
  contentData.programData.title = document.getElementById('program-title').value;
  contentData.programData.venue = document.getElementById('program-venue').value;
  contentData.programData.notice = document.getElementById('program-notice').value;
  
  // Gallery
  if (contentData.gallery) {
    contentData.gallery.title = document.getElementById('gallery-title').value;
    contentData.gallery.subtitle = document.getElementById('gallery-subtitle').value;
  }
  
  // Media
  if (contentData.media) {
    contentData.media.title = document.getElementById('media-title').value;
    contentData.media.subtitle = document.getElementById('media-subtitle').value;
  }
}
