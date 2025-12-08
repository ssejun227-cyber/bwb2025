/**
 * Data Loader - JSON 데이터를 페이지에 동적으로 로딩
 */

/**
 * 간단한 마크다운 변환
 * **굵은글씨** → <strong>굵은글씨</strong>
 * *기울임* → <em>기울임</em>
 */
function parseMarkdown(text) {
  if (!text) return '';
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
}

/**
 * 섹션 표시/숨김 및 제목 적용
 */
function renderSectionVisibility(sectionId, sectionConfig, sectionData, renderFunc) {
  const sectionEl = document.querySelector(`.${sectionId}`);
  if (!sectionEl) return;
  
  // 표시 여부
  if (sectionConfig && sectionConfig.visible === false) {
    sectionEl.style.display = 'none';
    return;
  }
  
  sectionEl.style.display = '';
  
  // 제목 변경 (일반 타이틀 + 세로 타이틀 모두)
  if (sectionConfig && sectionConfig.title) {
    const titleEl = sectionEl.querySelector('.section__title');
    if (titleEl) titleEl.textContent = sectionConfig.title;
    
    const verticalTitleEl = sectionEl.querySelector('.section__title--vertical');
    if (verticalTitleEl) verticalTitleEl.textContent = sectionConfig.title;
  }
  
  // 콘텐츠 렌더링
  if (renderFunc && sectionData) {
    renderFunc(sectionData);
  }
}

/**
 * 섹션 표시/숨김 (세로 타이틀 없는 단순 섹션용)
 */
function renderSectionVisibilitySimple(sectionId, sectionConfig, sectionData, renderFunc) {
  const sectionEl = document.querySelector(`.${sectionId}`);
  if (!sectionEl) return;
  
  // 표시 여부
  if (sectionConfig && sectionConfig.visible === false) {
    sectionEl.style.display = 'none';
    return;
  }
  
  sectionEl.style.display = '';
  
  // 콘텐츠 렌더링
  if (renderFunc && sectionData) {
    renderFunc(sectionData);
  }
}

document.addEventListener('DOMContentLoaded', function() {
  loadPageContent();
});

/**
 * 페이지 콘텐츠 로드
 */
async function loadPageContent() {
  try {
    const response = await fetch('data/content.json');
    const data = await response.json();
    
    // 사이트 메타 정보
    if (data.site) {
      document.title = data.site.title || 'Conference';
      const descMeta = document.querySelector('meta[name="description"]');
      const keywordsMeta = document.querySelector('meta[name="keywords"]');
      if (descMeta) descMeta.content = data.site.description || '';
      if (keywordsMeta) keywordsMeta.content = (data.site.keywords || []).join(', ');
    }
    
    renderHero(data.hero);
    renderLinks(data.links);
    
    // 섹션별 표시/숨김 및 제목 적용
    const sections = data.sections || {};
    
    renderSectionVisibility('about', sections.about, data.about, renderAbout);
    renderSectionVisibilitySimple('hosts', sections.hosts, data.hosts, renderHosts);
    renderSectionVisibility('org', sections.organization, data.organization, renderOrganization);
    renderSectionVisibility('sponsor', sections.sponsor, data.sponsor, renderSponsor);
    renderSectionVisibility('speaker', sections.speakers, { groups: data.speakerGroups, section: data.speakersSection }, renderSpeakers);
    renderSectionVisibility('program', sections.program, data.programData, renderProgram);
    
    renderFooter(data.footer);
    renderNavigation(data.navigation, sections);
    renderMobileMenu(data.navigation, sections, data.mobileMenu);
    renderExtraMenu(data.extraMenu);
    
    console.log('Content loaded successfully');
    
  } catch (error) {
    console.error('Failed to load content:', error);
  }
}

/**
 * Hero 섹션 렌더링
 */
function renderHero(hero) {
  if (!hero) return;
  
  // 로고
  const logo = document.querySelector('.hero__logo');
  if (logo && hero.logo) {
    logo.src = hero.logo;
  }
  
  // 모바일 헤더 로고
  const mobileLogo = document.querySelector('.mobile-header__logo');
  if (mobileLogo && hero.logo) {
    mobileLogo.src = hero.logo;
  }
  
  // 모바일 메뉴 로고
  const mobileMenuLogo = document.querySelector('.mobile-menu__logo');
  if (mobileMenuLogo && hero.logo) {
    mobileMenuLogo.src = hero.logo;
  }
  
  // 텍스트
  const subtitle = document.querySelector('.hero__subtitle');
  const title = document.querySelector('.hero__title');
  const slogan = document.querySelector('.hero__slogan');
  const info = document.querySelector('.hero__info');
  
  if (subtitle) subtitle.textContent = hero.subtitle;
  if (title) title.textContent = hero.title;
  if (slogan) slogan.innerHTML = hero.slogan.replace(/\n/g, '<br>');
  if (info) info.textContent = `${hero.date} | ${hero.venue}`;
  
  // 슬라이드
  const slider = document.querySelector('.hero__slider');
  if (slider && hero.slides) {
    slider.innerHTML = '';
    hero.slides.forEach((slide, index) => {
      const div = document.createElement('div');
      div.className = 'hero__slide' + (index === 0 ? ' hero__slide--active' : '');
      div.style.backgroundImage = `url('${slide}')`;
      slider.appendChild(div);
    });
    
    // 슬라이드 생성 후 자동 재생 시작
    startHeroSlider();
  }
  
  // 소셜 링크
  if (hero.sns) {
    const instagram = document.querySelector('.hero__social-link[data-platform="instagram"]');
    const x = document.querySelector('.hero__social-link[data-platform="x"]');
    const youtube = document.querySelector('.hero__social-link[data-platform="youtube"]');
    
    if (instagram) {
      if (hero.sns.instagram) {
        instagram.href = hero.sns.instagram;
        instagram.style.display = 'flex';
      } else {
        instagram.style.display = 'none';
      }
    }
    if (x) {
      if (hero.sns.x) {
        x.href = hero.sns.x;
        x.style.display = 'flex';
      } else {
        x.style.display = 'none';
      }
    }
    if (youtube) {
      if (hero.sns.youtube) {
        youtube.href = hero.sns.youtube;
        youtube.style.display = 'flex';
      } else {
        youtube.style.display = 'none';
      }
    }
  }
}

/**
 * 링크 버튼 렌더링
 */
function renderLinks(links) {
  if (!links) return;
  
  const container = document.querySelector('.links-section__buttons');
  if (!container) return;
  
  container.innerHTML = '';
  links.forEach(link => {
    const a = document.createElement('a');
    a.href = link.url;
    a.className = 'btn btn--primary links-section__btn';
    a.textContent = link.text;
    container.appendChild(a);
  });
  
}

/**
 * About 섹션 렌더링
 */
function renderAbout(about) {
  if (!about) return;
  
  // 슬로건
  const sloganSub = document.querySelector('.section__slogan-sub');
  const sloganMain = document.querySelector('.section__slogan-main');
  
  if (sloganSub) sloganSub.textContent = about.sloganSub;
  if (sloganMain) sloganMain.innerHTML = about.sloganMain.replace(/\n/g, '<br>');
  
  // 본문
  const colRight = document.querySelector('.about .section__col-right');
  if (colRight && about.paragraphs) {
    // 기존 텍스트 제거
    const existingTexts = colRight.querySelectorAll('.about__text');
    existingTexts.forEach(el => el.remove());
    
    // 미디어 컨테이너 찾기
    const mediaContainer = colRight.querySelector('.about__media');
    
    // 새 텍스트 추가 (미디어 컨테이너 앞에)
    about.paragraphs.forEach((para, index) => {
      const p = document.createElement('p');
      // 마지막 문단은 강조 스타일 적용
      if (index === about.paragraphs.length - 1) {
        p.className = 'about__text about__text--highlight';
      } else {
        p.className = 'about__text';
      }
      p.innerHTML = parseMarkdown(para);
      if (mediaContainer) {
        colRight.insertBefore(p, mediaContainer);
      } else {
        colRight.appendChild(p);
      }
    });
  }
  
  // 미디어 (이미지/비디오/유튜브)
  const mediaContainer = document.querySelector('.about__media');
  if (mediaContainer && about.media) {
    mediaContainer.innerHTML = '';
    
    switch (about.media.type) {
      case 'image':
        if (about.media.image) {
          mediaContainer.innerHTML = `<img src="${about.media.image}" alt="About" class="about__image">`;
        }
        break;
      case 'video':
        if (about.media.video) {
          mediaContainer.innerHTML = `
            <video class="about__video" controls>
              <source src="${about.media.video}" type="video/mp4">
            </video>`;
        }
        break;
      case 'youtube':
        if (about.media.youtube) {
          const youtubeId = extractYoutubeId(about.media.youtube);
          if (youtubeId) {
            mediaContainer.innerHTML = `
              <iframe class="about__youtube" 
                src="https://www.youtube.com/embed/${youtubeId}" 
                frameborder="0" 
                allowfullscreen>
              </iframe>`;
          }
        }
        break;
      case 'none':
      default:
        // 미디어 없음
        break;
    }
  }
}

/**
 * 유튜브 URL에서 ID 추출
 */
function extractYoutubeId(url) {
  if (!url) return null;
  // 이미 ID만 있는 경우
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
  // 일반 유튜브 URL
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

/**
 * 주최/주관/후원 렌더링
 */
function renderHosts(hosts) {
  if (!hosts) return;
  
  const container = document.querySelector('.hosts .section__content');
  if (!container) return;
  
  container.innerHTML = '';
  
  // 첫번째 줄: 주최 + 주관
  const hasHost = hosts.host && hosts.host.length > 0;
  const hasOrganizer = hosts.organizer && hosts.organizer.length > 0;
  
  if (hasHost || hasOrganizer) {
    let row1Html = '<div class="hosts__row">';
    
    if (hasHost) {
      row1Html += `
        <div class="hosts__group">
          <span class="hosts__label">주최</span>
          <div class="hosts__logos">
            ${hosts.host.map(h => `<img src="${h.logo}" alt="${h.name}" class="hosts__logo">`).join('')}
          </div>
        </div>
      `;
    }
    
    if (hasOrganizer) {
      row1Html += `
        <div class="hosts__group">
          <span class="hosts__label">주관</span>
          <div class="hosts__logos">
            ${hosts.organizer.map(o => `<img src="${o.logo}" alt="${o.name}" class="hosts__logo">`).join('')}
          </div>
        </div>
      `;
    }
    
    row1Html += '</div>';
    container.innerHTML += row1Html;
  }
  
  // 두번째 줄: 후원
  if (hosts.support && hosts.support.length > 0) {
    container.innerHTML += `
      <div class="hosts__row">
        <div class="hosts__group hosts__group--full">
          <span class="hosts__label">후원</span>
          <div class="hosts__logos">
            ${hosts.support.map(s => `<img src="${s.logo}" alt="${s.name}" class="hosts__logo">`).join('')}
          </div>
        </div>
      </div>
    `;
  }
}

/**
 * Organization 렌더링
 */
function renderOrganization(organization) {
  if (!organization || !organization.groups) return;
  
  const container = document.querySelector('.org .section__content');
  if (!container) return;
  
  container.innerHTML = '';
  
  organization.groups.forEach(group => {
    // 로고 섹션
    let logosHtml = '';
    if (group.logos && group.logos.length > 0) {
      logosHtml = `
        <div class="org__logos">
          ${group.logosTitle ? `<h4 class="org__logos-title">${group.logosTitle}</h4>` : ''}
          <div class="logo-grid">
            ${group.logos.map(l => `<img src="${l.logo}" alt="${l.name}" class="logo-grid__item">`).join('')}
          </div>
        </div>
      `;
    }
    
    container.innerHTML += `
      <div class="org__group">
        <h3 class="org__group-title">${group.title}</h3>
        ${logosHtml}
        <div class="grid grid--4cols">
          ${group.members.map(member => {
            // descs 배열 또는 기존 desc 지원
            let descLines = [];
            if (member.descs && member.descs.length > 0) {
              descLines = member.descs.filter(d => d);
            } else if (member.desc) {
              descLines = [member.desc];
            }
            const descHtml = descLines.join('<br>');
            return `
            <div class="card">
              <img src="${member.photo}" alt="${member.name}" class="card__image">
              ${member.role ? `<p class="card__role">${member.role}</p>` : ''}
              <p class="card__name">${member.name}</p>
              <p class="card__desc">${descHtml}</p>
            </div>
          `}).join('')}
        </div>
      </div>
    `;
  });
}

/**
 * Sponsor 렌더링
 */
function renderSponsor(sponsor) {
  if (!sponsor) return;
  
  const container = document.querySelector('.sponsor .section__content');
  if (!container) return;
  
  container.innerHTML = '';
  
  // 로고
  if (sponsor.logos && sponsor.logos.length > 0) {
    container.innerHTML += `
      <div class="sponsor__logos">
        ${sponsor.logosTitle ? `<h3 class="sponsor__title">${sponsor.logosTitle}</h3>` : ''}
        <div class="logo-grid">
          ${sponsor.logos.map(l => `<img src="${l.logo}" alt="${l.name}" class="logo-grid__item">`).join('')}
        </div>
      </div>
    `;
  }
  
  // 멤버
  if (sponsor.members && sponsor.members.length > 0) {
    container.innerHTML += `
      <div class="sponsor__members">
        ${sponsor.membersTitle ? `<h3 class="sponsor__title">${sponsor.membersTitle}</h3>` : ''}
        <div class="grid grid--4cols">
          ${sponsor.members.map(member => {
            // descs 배열 또는 기존 desc 지원
            let descLines = [];
            if (member.descs && member.descs.length > 0) {
              descLines = member.descs.filter(d => d);
            } else if (member.desc) {
              descLines = [member.desc];
            }
            const descHtml = descLines.join('<br>');
            return `
            <div class="card">
              <img src="${member.photo}" alt="${member.name}" class="card__image">
              ${member.role ? `<p class="card__role">${member.role}</p>` : ''}
              <p class="card__name">${member.name}</p>
              <p class="card__desc">${descHtml}</p>
            </div>
          `}).join('')}
        </div>
      </div>
    `;
  }
}

/**
 * Speakers 렌더링
 */
function renderSpeakers(data) {
  if (!data) return;
  
  const groups = data.groups || [];
  const section = data.section || {};
  
  const container = document.querySelector('.speaker .section__content');
  if (!container) return;
  
  let html = '';
  
  // 섹션 타이틀
  if (section.title) {
    html += `<h2 class="speaker__section-title">${section.title}</h2>`;
  }
  
  // 그룹들
  html += groups.map(item => {
    // 여백 타입
    if (item.type === 'spacer') {
      return `<div class="speaker__spacer"></div>`;
    }
    
    // 그룹 타입
    return `
      <div class="speaker__group">
        ${item.title ? `<h3 class="speaker__title">${item.title}</h3>` : ''}
        ${item.subtitle ? `<p class="speaker__subtitle">${item.subtitle}</p>` : ''}
        <div class="grid grid--5cols">
          ${(item.members || []).map(member => {
            // descs 배열 또는 기존 desc 지원
            let descLines = [];
            if (member.descs && member.descs.length > 0) {
              descLines = member.descs.filter(d => d);
            } else if (member.desc) {
              descLines = [member.desc];
            }
            const descHtml = descLines.join('<br>');
            return `
            <div class="card">
              <img src="${member.photo}" alt="${member.name}" class="card__image">
              <p class="card__name">${member.name}</p>
              <p class="card__desc">${descHtml}</p>
            </div>
          `}).join('')}
        </div>
      </div>
    `;
  }).join('');
  
  container.innerHTML = html;
}

/**
 * Program 렌더링
 */
function renderProgram(programData) {
  if (!programData) return;
  
  const container = document.querySelector('.program .section__content');
  if (!container) return;
  
  const days = programData.days || [];
  
  // 헤더 영역
  let html = `
    <div class="program__header">
      ${programData.category ? `<p class="program__category">${programData.category}</p>` : ''}
      ${programData.title ? `<h2 class="program__title">${programData.title}</h2>` : ''}
      ${programData.venue ? `<p class="program__venue">장소 : ${programData.venue}</p>` : ''}
      ${programData.notice ? `<p class="program__notice">${programData.notice}</p>` : ''}
    </div>
  `;
  
  // 탭 영역 (Day가 2개 이상일 때만)
  if (days.length > 1) {
    html += `
      <div class="program__tabs">
        ${days.map((day, i) => `
          <button class="program__tab ${i === 0 ? 'program__tab--active' : ''}" data-day="${i}">
            ${day.label || 'Day ' + (i + 1)}
          </button>
        `).join('')}
      </div>
    `;
  }
  
  // Day별 콘텐츠
  html += days.map((day, dayIndex) => `
    <div class="program__day ${dayIndex === 0 ? 'program__day--active' : ''}" data-day="${dayIndex}">
      <div class="program__day-wrapper">
        ${day.date ? `<div class="program__date">${day.date}</div>` : ''}
        <div class="program__list">
          ${(day.items || []).map(item => `
            <div class="program__item">
              ${item.time ? `<div class="program__time">${item.time}</div>` : ''}
              <div class="program__session ${item.highlight === 'blue' || item.highlight === true ? 'program__session--blue' : ''} ${item.highlight === 'navy' ? 'program__session--navy' : ''} ${item.highlight === 'red' ? 'program__session--red' : ''} ${item.highlight === 'gray' ? 'program__session--gray' : ''}">
                <span class="program__session-title">${item.title || ''}</span>
                ${item.subtitle ? `<span class="program__session-subtitle">${item.subtitle}</span>` : ''}
              </div>
              <div class="program__info">
                ${item.speakers ? `
                  <div class="program__speakers">
                    ${item.speakers.split('\n').map(s => `<p class="program__speaker">${parseMarkdown(s)}</p>`).join('')}
                  </div>
                ` : ''}
                ${item.note ? `<p class="program__note">${item.note}</p>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `).join('');
  
  container.innerHTML = html;
  
  // 탭 클릭 이벤트
  container.querySelectorAll('.program__tab').forEach(tab => {
    tab.addEventListener('click', function() {
      const dayIndex = this.dataset.day;
      
      // 탭 활성화
      container.querySelectorAll('.program__tab').forEach(t => t.classList.remove('program__tab--active'));
      this.classList.add('program__tab--active');
      
      // Day 콘텐츠 활성화
      container.querySelectorAll('.program__day').forEach(d => d.classList.remove('program__day--active'));
      container.querySelector(`.program__day[data-day="${dayIndex}"]`).classList.add('program__day--active');
    });
  });
}

/**
 * Footer 렌더링
 */
function renderFooter(footer) {
  if (!footer) return;
  
  const title = document.querySelector('.footer__title');
  const items = document.querySelectorAll('.footer__item');
  const copyright = document.querySelector('.footer__copyright');
  
  if (title) title.textContent = footer.officeName;
  if (items[0]) items[0].innerHTML = `<span class="footer__label">| 전화번호</span><span class="footer__value">${footer.phone}</span>`;
  if (items[1]) items[1].innerHTML = `<span class="footer__label">| 이메일</span><span class="footer__value">${footer.email}</span>`;
  if (items[2]) items[2].innerHTML = `<span class="footer__label">| 주소</span><span class="footer__value">${footer.address}</span>`;
  if (copyright) copyright.textContent = footer.copyright;
  
  // 모바일 메뉴 copyright도 동일하게 적용
  const mobileCopyright = document.querySelector('.mobile-menu__copyright');
  if (mobileCopyright && footer.copyright) {
    mobileCopyright.textContent = footer.copyright;
  }
}

/**
 * Navigation 렌더링
 */
function renderNavigation(navigation, sections) {
  if (!navigation) return;
  
  const container = document.querySelector('.side-nav__list');
  if (!container) return;
  
  container.innerHTML = '';
  navigation.forEach(nav => {
    // 섹션이 숨겨져 있으면 네비게이션에서도 제외
    const sectionId = nav.href.replace('#', '');
    if (sections && sections[sectionId] && sections[sectionId].visible === false) {
      return;
    }
    
    const li = document.createElement('li');
    // 섹션 제목이 변경되었으면 네비게이션 텍스트도 변경
    const navText = (sections && sections[sectionId] && sections[sectionId].title) || nav.text;
    li.innerHTML = `<a href="${nav.href}" class="side-nav__link">${navText}</a>`;
    container.appendChild(li);
  });
}


/**
 * 모바일 메뉴 렌더링
 */
function renderMobileMenu(navigation, sections, mobileMenu) {
  const container = document.querySelector('.mobile-menu__list');
  if (!container) return;
  
  container.innerHTML = '';
  
  // 1. 섹션 네비게이션 (Home, About, Organization 등)
  if (navigation && navigation.length > 0) {
    navigation.forEach(nav => {
      // 섹션이 숨겨져 있으면 제외
      const sectionId = nav.href.replace('#', '');
      if (sections && sections[sectionId] && sections[sectionId].visible === false) {
        return;
      }
      
      const li = document.createElement('li');
      const navText = (sections && sections[sectionId] && sections[sectionId].title) || nav.text;
      li.innerHTML = `
        <a href="${nav.href}" class="mobile-menu__link">
          <span class="mobile-menu__link-title">${navText}</span>
        </a>
      `;
      container.appendChild(li);
    });
  }
  
  // 2. 구분선
  if (mobileMenu && mobileMenu.length > 0) {
    const divider = document.createElement('li');
    divider.className = 'mobile-menu__divider';
    container.appendChild(divider);
  }
  
  // 3. 기존 mobileMenu (BDAN, BWB SUPPORTERS 등)
  if (mobileMenu && mobileMenu.length > 0) {
    mobileMenu.forEach(item => {
      // Home은 섹션 네비게이션에 있으므로 제외
      if (item.url === 'index.html' || item.url === '/' || item.title === 'HOME') {
        return;
      }
      
      const li = document.createElement('li');
      li.innerHTML = `
        <a href="${item.url}" class="mobile-menu__link" ${item.external ? 'target="_blank"' : ''}>
          <span class="mobile-menu__link-title">${item.title}</span>
          <span class="mobile-menu__link-sub">${item.subtitle || ''}</span>
        </a>
      `;
      container.appendChild(li);
    });
  }
}

/**
 * 추가 메뉴 렌더링 (기존 메뉴 뒤에 1개 추가)
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
