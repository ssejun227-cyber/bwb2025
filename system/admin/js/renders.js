/**
 * Admin Renders
 * 각 섹션 렌더링 함수
 */

const sectionLabels = {
  about: 'About',
  hosts: '주최/주관/후원',
  organization: 'Organization',
  sponsor: 'Sponsor',
  speakers: 'Speakers',
  program: 'Program'
};

/**
 * 섹션 관리 렌더링
 */
function renderSections() {
  const container = document.getElementById('sections-list');
  if (!container || !contentData.sections) return;
  
  container.innerHTML = '';
  
  Object.keys(sectionLabels).forEach(key => {
    const section = contentData.sections[key] || { visible: true, title: sectionLabels[key] };
    container.innerHTML += `
      <div class="item-card">
        <div class="item-card__body">
          <div class="form-group">
            <label class="checkbox-group">
              <input type="checkbox" ${section.visible ? 'checked' : ''} 
                onchange="contentData.sections['${key}'].visible = this.checked">
              표시
            </label>
          </div>
          <div class="form-group">
            <label>${sectionLabels[key]} 섹션 제목</label>
            <input type="text" class="form-input" value="${section.title || ''}" 
              onchange="contentData.sections['${key}'].title = this.value">
          </div>
        </div>
      </div>
    `;
  });
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
            <div class="markup-toolbar">
              <button type="button" class="markup-btn" onclick="insertMarkup(${index}, '**', '**')" title="색깔 + 굵은글씨">
                <strong style="color:#E63370;">B</strong>
              </button>
              <button type="button" class="markup-btn" onclick="insertMarkup(${index}, '@@', '@@')" title="검은색 + 굵은글씨">
                <strong>B</strong>
              </button>
              <button type="button" class="markup-btn" onclick="insertMarkup(${index}, '&lt;br class=&quot;br-mobile&quot;&gt;', '')" title="모바일 줄바꿈">
                ↵
              </button>
            </div>
            <textarea class="form-textarea" id="para-textarea-${index}"
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
  const container = document.getElementById('speakers-groups-list');
  if (!container || !contentData.speakerGroups) return;
  
  container.innerHTML = '';
  
  contentData.speakerGroups.forEach((item, itemIndex) => {
    // 여백 타입
    if (item.type === 'spacer') {
      container.innerHTML += `
        <div class="item-card" style="background:#f0f0f0;">
          <div class="item-card__header">
            <span class="item-card__title">── 여백 ──</span>
            <button class="btn btn--danger btn--small" onclick="removeSpeakerGroup(${itemIndex})">삭제</button>
          </div>
        </div>
      `;
      return;
    }
    
    // 그룹 타입
    const membersHtml = (item.members || []).map((member, memberIndex) => {
      // descs 배열이 없으면 기존 desc를 배열로 변환
      if (!member.descs) {
        member.descs = member.desc ? [member.desc] : [''];
      }
      
      // 설명 필드들 생성
      const descsHtml = member.descs.map((desc, descIndex) => `
        <div class="form-group">
          <label>소속/직책 ${descIndex + 1} ${member.descs.length > 1 ? `<button class="btn btn--danger btn--small" style="margin-left:10px;padding:2px 8px;font-size:11px;" onclick="removeSpeakerMemberDesc(${itemIndex}, ${memberIndex}, ${descIndex})">삭제</button>` : ''}</label>
          <input type="text" class="form-input" value="${desc || ''}" placeholder="예: OO기업 대표"
            onchange="contentData.speakerGroups[${itemIndex}].members[${memberIndex}].descs[${descIndex}] = this.value">
        </div>
      `).join('');
      
      return `
      <div class="item-card" style="background:#fff;">
        <div class="item-card__header">
          <span class="item-card__title">${member.name || '연사 ' + (memberIndex + 1)}</span>
          <div class="item-card__actions">
            <button class="btn btn--small" onclick="moveSpeakerMemberUp(${itemIndex}, ${memberIndex})" title="위로">▲</button>
            <button class="btn btn--small" onclick="moveSpeakerMemberDown(${itemIndex}, ${memberIndex})" title="아래로">▼</button>
            <button class="btn btn--danger btn--small" onclick="removeSpeakerMember(${itemIndex}, ${memberIndex})">삭제</button>
          </div>
        </div>
        <div class="item-card__body">
          <div class="form-group">
            <label>사진</label>
            <div class="image-upload">
              <img src="${member.photo ? '/' + member.photo : ''}" class="image-preview" alt="">
              <input type="file" accept="image/*" class="file-input" onchange="updateSpeakerMemberPhoto(${itemIndex}, ${memberIndex}, this)">
              <button class="btn btn--small" onclick="this.previousElementSibling.click()">파일 선택</button>
            </div>
          </div>
          <div class="form-group">
            <label>이름</label>
            <input type="text" class="form-input" value="${member.name || ''}" 
              onchange="contentData.speakerGroups[${itemIndex}].members[${memberIndex}].name = this.value">
          </div>
          ${descsHtml}
          <div class="form-group">
            <button class="btn btn--small" onclick="addSpeakerMemberDesc(${itemIndex}, ${memberIndex})">+ 소속/직책 추가</button>
          </div>
        </div>
      </div>
    `}).join('');

    container.innerHTML += `
      <div class="item-card">
        <div class="item-card__header">
          <span class="item-card__title">${item.title || '그룹 ' + (itemIndex + 1)}</span>
          <button class="btn btn--danger btn--small" onclick="removeSpeakerGroup(${itemIndex})">삭제</button>
        </div>
        <div class="item-card__body item-card__body--full">
          <div class="form-group">
            <label>그룹 제목</label>
            <input type="text" class="form-input" value="${item.title || ''}" 
              onchange="contentData.speakerGroups[${itemIndex}].title = this.value">
          </div>
          <div class="form-group">
            <label>서브타이틀</label>
            <input type="text" class="form-input" value="${item.subtitle || ''}" 
              onchange="contentData.speakerGroups[${itemIndex}].subtitle = this.value">
          </div>
          <div class="form-group">
            <label>연사</label>
            <div class="items-list" style="margin-bottom:10px;">
              ${membersHtml}
            </div>
            <button class="btn btn--small" onclick="addSpeakerMember(${itemIndex})">+ 연사 추가</button>
          </div>
        </div>
      </div>
    `;
  });
}

/**
 * Speakers 그룹 삭제
 */
function removeSpeakerGroup(groupIndex) {
  contentData.speakerGroups.splice(groupIndex, 1);
  renderSpeakers();
}

/**
 * Speakers 멤버 추가
 */
function addSpeakerMember(groupIndex) {
  if (!contentData.speakerGroups[groupIndex].members) {
    contentData.speakerGroups[groupIndex].members = [];
  }
  contentData.speakerGroups[groupIndex].members.push({
    id: generateId(),
    photo: '',
    name: '',
    desc: ''
  });
  renderSpeakers();
}

/**
 * Speakers 멤버 삭제
 */
function removeSpeakerMember(groupIndex, memberIndex) {
  contentData.speakerGroups[groupIndex].members.splice(memberIndex, 1);
  renderSpeakers();
}


/**
 * Speakers 멤버 위로 이동
 */
function moveSpeakerMemberUp(groupIndex, memberIndex) {
  if (moveItemUp(contentData.speakerGroups[groupIndex].members, memberIndex)) {
    renderSpeakers();
  }
}

/**
 * Speakers 멤버 아래로 이동
 */
function moveSpeakerMemberDown(groupIndex, memberIndex) {
  if (moveItemDown(contentData.speakerGroups[groupIndex].members, memberIndex)) {
    renderSpeakers();
  }
}

/**
 * Speakers 멤버 설명 추가
 */
function addSpeakerMemberDesc(groupIndex, memberIndex) {
  if (!contentData.speakerGroups[groupIndex].members[memberIndex].descs) {
    contentData.speakerGroups[groupIndex].members[memberIndex].descs = [''];
  }
  contentData.speakerGroups[groupIndex].members[memberIndex].descs.push('');
  renderSpeakers();
}

/**
 * Speakers 멤버 설명 삭제
 */
function removeSpeakerMemberDesc(groupIndex, memberIndex, descIndex) {
  contentData.speakerGroups[groupIndex].members[memberIndex].descs.splice(descIndex, 1);
  if (contentData.speakerGroups[groupIndex].members[memberIndex].descs.length === 0) {
    contentData.speakerGroups[groupIndex].members[memberIndex].descs = [''];
  }
  renderSpeakers();
}

/**
 * Speakers 멤버 사진 업데이트
 */
async function updateSpeakerMemberPhoto(groupIndex, memberIndex, input) {
  const path = await uploadImage(input.files[0]);
  if (path) {
    contentData.speakerGroups[groupIndex].members[memberIndex].photo = path;
    renderSpeakers();
  }
}

/**
 * 프로그램 렌더링
 */
function renderProgram() {
  const container = document.getElementById('program-days-list');
  if (!container || !contentData.programData?.days) return;
  
  container.innerHTML = '';
  
  contentData.programData.days.forEach((day, dayIndex) => {
    // 프로그램 아이템들
    const itemsHtml = (day.items || []).map((item, itemIndex) => `
      <div class="item-card" style="background:${item.highlight ? '#e3f2fd' : '#fff'};">
        <div class="item-card__header">
          <span class="item-card__title">${item.time || ''} ${item.title || '프로그램 ' + (itemIndex + 1)}</span>
          <div class="item-card__actions">
            <button class="btn btn--small" onclick="moveProgramItemUp(${dayIndex}, ${itemIndex})" title="위로">▲</button>
            <button class="btn btn--small" onclick="moveProgramItemDown(${dayIndex}, ${itemIndex})" title="아래로">▼</button>
            <button class="btn btn--danger btn--small" onclick="removeProgramItem(${dayIndex}, ${itemIndex})">삭제</button>
          </div>
        </div>
        <div class="item-card__body">
          <div class="form-group">
            <label>시간</label>
            <input type="text" class="form-input" value="${item.time || ''}" placeholder="예: 11:00 -"
              onchange="contentData.programData.days[${dayIndex}].items[${itemIndex}].time = this.value">
          </div>
          <div class="form-group">
            <label>제목</label>
            <input type="text" class="form-input" value="${item.title || ''}" placeholder="예: 오프닝"
              onchange="contentData.programData.days[${dayIndex}].items[${itemIndex}].title = this.value">
          </div>
          <div class="form-group">
            <label>서브제목 (제목 옆에 표시)</label>
            <input type="text" class="form-input" value="${item.subtitle || ''}" placeholder="예: 1. 시장감시 : 거래소의 리스크 매니지먼트"
              onchange="contentData.programData.days[${dayIndex}].items[${itemIndex}].subtitle = this.value">
          </div>
          <div class="form-group">
            <label>발표자 (줄바꿈으로 구분)</label>
            <textarea class="form-input" rows="3" placeholder="이름 (소속)&#10;이름 (소속)"
              onchange="contentData.programData.days[${dayIndex}].items[${itemIndex}].speakers = this.value">${item.speakers || ''}</textarea>
          </div>
          <div class="form-group">
            <label>추가 정보</label>
            <input type="text" class="form-input" value="${item.note || ''}" placeholder="예: * 오프닝 영상 상영"
              onchange="contentData.programData.days[${dayIndex}].items[${itemIndex}].note = this.value">
          </div>
          <div class="form-group">
            <label>배경 스타일</label>
            <select class="form-input" onchange="contentData.programData.days[${dayIndex}].items[${itemIndex}].highlight = this.value; renderProgram();">
              <option value="" ${!item.highlight ? 'selected' : ''}>기본 (연한 회색)</option>
              <option value="blue" ${item.highlight === 'blue' || item.highlight === true ? 'selected' : ''}>파란색</option>
              <option value="navy" ${item.highlight === 'navy' ? 'selected' : ''}>남색</option>
              <option value="red" ${item.highlight === 'red' ? 'selected' : ''}>빨간색</option>
              <option value="gray" ${item.highlight === 'gray' ? 'selected' : ''}>진한 회색</option>
            </select>
          </div>
        </div>
      </div>
    `).join('');

    container.innerHTML += `
      <div class="item-card">
        <div class="item-card__header">
          <span class="item-card__title">${day.label || 'Day ' + (dayIndex + 1)}</span>
          <button class="btn btn--danger btn--small" onclick="removeProgramDay(${dayIndex})">Day 삭제</button>
        </div>
        <div class="item-card__body item-card__body--full">
          <div class="form-group">
            <label>탭 이름</label>
            <input type="text" class="form-input" value="${day.label || ''}" placeholder="예: Day 1"
              onchange="contentData.programData.days[${dayIndex}].label = this.value">
          </div>
          <div class="form-group">
            <label>날짜 (왼쪽 세로 표시)</label>
            <input type="text" class="form-input" value="${day.date || ''}" placeholder="예: 28/10 MON"
              onchange="contentData.programData.days[${dayIndex}].date = this.value">
          </div>
          <div class="form-group">
            <label>프로그램</label>
            <div class="items-list" style="margin-bottom:10px;">
              ${itemsHtml}
            </div>
            <button class="btn btn--small" onclick="addProgramItem(${dayIndex})">+ 프로그램 추가</button>
          </div>
        </div>
      </div>
    `;
  });
}

/**
 * Day 삭제
 */
function removeProgramDay(dayIndex) {
  contentData.programData.days.splice(dayIndex, 1);
  renderProgram();
}

/**
 * 프로그램 아이템 추가
 */
function addProgramItem(dayIndex) {
  if (!contentData.programData.days[dayIndex].items) {
    contentData.programData.days[dayIndex].items = [];
  }
  contentData.programData.days[dayIndex].items.push({
    id: generateId(),
    time: '',
    title: '',
    speakers: '',
    note: '',
    highlight: false
  });
  renderProgram();
}

/**
 * 프로그램 아이템 삭제
 */
function removeProgramItem(dayIndex, itemIndex) {
  contentData.programData.days[dayIndex].items.splice(itemIndex, 1);
  renderProgram();
}


/**
 * Program 아이템 위로 이동
 */
function moveProgramItemUp(dayIndex, itemIndex) {
  if (moveItemUp(contentData.programData.days[dayIndex].items, itemIndex)) {
    renderProgram();
  }
}

/**
 * Program 아이템 아래로 이동
 */
function moveProgramItemDown(dayIndex, itemIndex) {
  if (moveItemDown(contentData.programData.days[dayIndex].items, itemIndex)) {
    renderProgram();
  }
}

/**
 * 주최/주관/후원 렌더링
 */
function renderHosts() {
  renderHostType('host', 'hosts-host-list');
  renderHostType('organizer', 'hosts-organizer-list');
  renderHostType('support', 'hosts-support-list');
}

function renderHostType(type, containerId) {
  const container = document.getElementById(containerId);
  if (!container || !contentData.hosts?.[type]) return;
  
  container.innerHTML = '';
  
  contentData.hosts[type].forEach((item, index) => {
    container.innerHTML += `
      <div class="item-card">
        <div class="item-card__header">
          <span class="item-card__title">${item.name || '항목 ' + (index + 1)}</span>
          <button class="btn btn--danger btn--small" onclick="removeHostItem('${type}', ${index})">삭제</button>
        </div>
        <div class="item-card__body">
          <div class="form-group">
            <label>로고</label>
            <div class="image-upload">
              <img src="${item.logo ? '/' + item.logo : ''}" class="image-preview" alt="">
              <input type="file" accept="image/*" class="file-input" onchange="updateHostLogo('${type}', ${index}, this)">
              <button class="btn btn--small" onclick="this.previousElementSibling.click()">파일 선택</button>
            </div>
          </div>
          <div class="form-group">
            <label>이름</label>
            <input type="text" class="form-input" value="${item.name || ''}" 
              onchange="contentData.hosts['${type}'][${index}].name = this.value">
          </div>
        </div>
      </div>
    `;
  });
}

/**
 * 주최/주관/후원 로고 업데이트
 */
async function updateHostLogo(type, index, input) {
  const path = await uploadImage(input.files[0]);
  if (path) {
    contentData.hosts[type][index].logo = path;
    renderHosts();
  }
}

/**
 * 주최/주관/후원 항목 삭제
 */
function removeHostItem(type, index) {
  contentData.hosts[type].splice(index, 1);
  renderHosts();
}

/**
 * Organization 그룹 렌더링
 */
function renderOrganization() {
  const container = document.getElementById('organization-groups-list');
  if (!container || !contentData.organization?.groups) return;
  
  container.innerHTML = '';
  
  contentData.organization.groups.forEach((group, groupIndex) => {
    const membersHtml = (group.members || []).map((member, memberIndex) => {
      // descs 배열이 없으면 기존 desc를 배열로 변환
      if (!member.descs) {
        member.descs = member.desc ? [member.desc] : [''];
      }
      
      // 설명 필드들 생성
      const descsHtml = member.descs.map((desc, descIndex) => `
        <div class="form-group">
          <label>설명 ${descIndex + 1} ${member.descs.length > 1 ? `<button class="btn btn--danger btn--small" style="margin-left:10px;padding:2px 8px;font-size:11px;" onclick="removeOrgMemberDesc(${groupIndex}, ${memberIndex}, ${descIndex})">삭제</button>` : ''}</label>
          <input type="text" class="form-input" value="${desc || ''}" placeholder="예: 소속/직책"
            onchange="contentData.organization.groups[${groupIndex}].members[${memberIndex}].descs[${descIndex}] = this.value">
        </div>
      `).join('');
      
      return `
      <div class="item-card" style="background:#fff;">
        <div class="item-card__header">
          <span class="item-card__title">${member.name || '멤버 ' + (memberIndex + 1)}</span>
          <div class="item-card__actions">
            <button class="btn btn--small" onclick="moveOrgMemberUp(${groupIndex}, ${memberIndex})" title="위로">▲</button>
            <button class="btn btn--small" onclick="moveOrgMemberDown(${groupIndex}, ${memberIndex})" title="아래로">▼</button>
            <button class="btn btn--danger btn--small" onclick="removeOrgMember(${groupIndex}, ${memberIndex})">삭제</button>
          </div>
        </div>
        <div class="item-card__body">
          <div class="form-group">
            <label>사진</label>
            <div class="image-upload">
              <img src="${member.photo ? '/' + member.photo : ''}" class="image-preview" alt="">
              <input type="file" accept="image/*" class="file-input" onchange="updateOrgMemberPhoto(${groupIndex}, ${memberIndex}, this)">
              <button class="btn btn--small" onclick="this.previousElementSibling.click()">파일 선택</button>
            </div>
          </div>
          <div class="form-group">
            <label>이름</label>
            <input type="text" class="form-input" value="${member.name || ''}" 
              onchange="contentData.organization.groups[${groupIndex}].members[${memberIndex}].name = this.value">
          </div>
          <div class="form-group">
            <label>역할 <span style="font-size:11px;color:#888;">(이름 위에 표시)</span></label>
            <input type="text" class="form-input" value="${member.role || ''}" 
              onchange="contentData.organization.groups[${groupIndex}].members[${memberIndex}].role = this.value">
          </div>
          ${descsHtml}
          <div class="form-group">
            <button class="btn btn--small" onclick="addOrgMemberDesc(${groupIndex}, ${memberIndex})">+ 설명 추가</button>
          </div>
        </div>
      </div>
    `}).join('');

    // 로고 목록 HTML
    const logosHtml = (group.logos || []).map((logo, logoIndex) => `
      <div class="item-card" style="background:#fff;padding:10px;margin-bottom:8px;">
        <div class="item-card__header" style="margin-bottom:8px;">
          <span class="item-card__title">${logo.name || '로고 ' + (logoIndex + 1)}</span>
          <button class="btn btn--danger btn--small" onclick="removeOrgLogo(${groupIndex}, ${logoIndex})">삭제</button>
        </div>
        <div class="form-group">
          <label>로고 이미지</label>
          <div class="image-upload">
            <img src="${logo.logo ? '/' + logo.logo : ''}" class="image-preview" alt="" style="max-height:60px;">
            <input type="file" accept="image/*" class="file-input" onchange="updateOrgLogo(${groupIndex}, ${logoIndex}, this)">
            <button class="btn btn--small" onclick="this.previousElementSibling.click()">파일 선택</button>
          </div>
        </div>
        <div class="form-group">
          <label>로고 이름</label>
          <input type="text" class="form-input" value="${logo.name || ''}" 
            onchange="contentData.organization.groups[${groupIndex}].logos[${logoIndex}].name = this.value">
        </div>
      </div>
    `).join('');

    container.innerHTML += `
      <div class="item-card">
        <div class="item-card__header">
          <span class="item-card__title">${group.title || '그룹 ' + (groupIndex + 1)}</span>
          <button class="btn btn--danger btn--small" onclick="removeOrgGroup(${groupIndex})">그룹 삭제</button>
        </div>
        <div class="item-card__body item-card__body--full">
          <div class="form-group">
            <label>그룹 제목</label>
            <input type="text" class="form-input" value="${group.title || ''}" 
              onchange="contentData.organization.groups[${groupIndex}].title = this.value">
          </div>
          <div class="form-group">
            <label>로고 (멤버 위에 표시)</label>
            <div class="items-list" style="margin-bottom:10px;">
              ${logosHtml || '<p style="color:#888;font-size:12px;">등록된 로고가 없습니다.</p>'}
            </div>
            <button class="btn btn--small" onclick="addOrgLogo(${groupIndex})">+ 로고 추가</button>
          </div>
          <div class="form-group">
            <label>멤버</label>
            <div class="items-list" style="margin-bottom:10px;">
              ${membersHtml}
            </div>
            <button class="btn btn--small" onclick="addOrgMember(${groupIndex})">+ 멤버 추가</button>
          </div>
        </div>
      </div>
    `;
  });
}

/**
 * Organization 그룹 삭제
 */
function removeOrgGroup(groupIndex) {
  contentData.organization.groups.splice(groupIndex, 1);
  renderOrganization();
}

/**
 * Organization 멤버 추가
 */
function addOrgMember(groupIndex) {
  if (!contentData.organization.groups[groupIndex].members) {
    contentData.organization.groups[groupIndex].members = [];
  }
  contentData.organization.groups[groupIndex].members.push({
    id: generateId(),
    photo: '',
    name: '',
    role: '',
    desc: ''
  });
  renderOrganization();
}

/**
 * Organization 멤버 삭제
 */
function removeOrgMember(groupIndex, memberIndex) {
  contentData.organization.groups[groupIndex].members.splice(memberIndex, 1);
  renderOrganization();
}


/**
 * Organization 멤버 위로 이동
 */
function moveOrgMemberUp(groupIndex, memberIndex) {
  if (moveItemUp(contentData.organization.groups[groupIndex].members, memberIndex)) {
    renderOrganization();
  }
}

/**
 * Organization 멤버 아래로 이동
 */
function moveOrgMemberDown(groupIndex, memberIndex) {
  if (moveItemDown(contentData.organization.groups[groupIndex].members, memberIndex)) {
    renderOrganization();
  }
}

/**
 * Organization 멤버 설명 추가
 */
function addOrgMemberDesc(groupIndex, memberIndex) {
  if (!contentData.organization.groups[groupIndex].members[memberIndex].descs) {
    contentData.organization.groups[groupIndex].members[memberIndex].descs = [''];
  }
  contentData.organization.groups[groupIndex].members[memberIndex].descs.push('');
  renderOrganization();
}

/**
 * Organization 멤버 설명 삭제
 */
function removeOrgMemberDesc(groupIndex, memberIndex, descIndex) {
  contentData.organization.groups[groupIndex].members[memberIndex].descs.splice(descIndex, 1);
  if (contentData.organization.groups[groupIndex].members[memberIndex].descs.length === 0) {
    contentData.organization.groups[groupIndex].members[memberIndex].descs = [''];
  }
  renderOrganization();
}

/**
 * Organization 멤버 사진 업데이트
 */
async function updateOrgMemberPhoto(groupIndex, memberIndex, input) {
  const path = await uploadImage(input.files[0]);
  if (path) {
    contentData.organization.groups[groupIndex].members[memberIndex].photo = path;
    renderOrganization();
  }
}

/**
 * Organization 로고 추가
 */
function addOrgLogo(groupIndex) {
  if (!contentData.organization.groups[groupIndex].logos) {
    contentData.organization.groups[groupIndex].logos = [];
  }
  contentData.organization.groups[groupIndex].logos.push({
    id: 'orglogo_' + Date.now(),
    name: '',
    logo: ''
  });
  renderOrganization();
}

/**
 * Organization 로고 삭제
 */
function removeOrgLogo(groupIndex, logoIndex) {
  contentData.organization.groups[groupIndex].logos.splice(logoIndex, 1);
  renderOrganization();
}

/**
 * Organization 로고 이미지 업데이트
 */
async function updateOrgLogo(groupIndex, logoIndex, input) {
  const path = await uploadImage(input.files[0]);
  if (path) {
    contentData.organization.groups[groupIndex].logos[logoIndex].logo = path;
    renderOrganization();
  }
}

/**
 * Sponsor 로고 렌더링
 */
function renderSponsorLogos() {
  const container = document.getElementById('sponsor-logos-list');
  if (!container || !contentData.sponsor?.logos) return;
  
  container.innerHTML = '';
  
  contentData.sponsor.logos.forEach((item, index) => {
    container.innerHTML += `
      <div class="item-card">
        <div class="item-card__header">
          <span class="item-card__title">${item.name || '로고 ' + (index + 1)}</span>
          <button class="btn btn--danger btn--small" onclick="removeSponsorLogo(${index})">삭제</button>
        </div>
        <div class="item-card__body">
          <div class="form-group">
            <label>로고</label>
            <div class="image-upload">
              <img src="${item.logo ? '/' + item.logo : ''}" class="image-preview" alt="">
              <input type="file" accept="image/*" class="file-input" onchange="updateSponsorLogo(${index}, this)">
              <button class="btn btn--small" onclick="this.previousElementSibling.click()">파일 선택</button>
            </div>
          </div>
          <div class="form-group">
            <label>이름</label>
            <input type="text" class="form-input" value="${item.name || ''}" 
              onchange="contentData.sponsor.logos[${index}].name = this.value">
          </div>
        </div>
      </div>
    `;
  });
}

/**
 * Sponsor 로고 업데이트
 */
async function updateSponsorLogo(index, input) {
  const path = await uploadImage(input.files[0]);
  if (path) {
    contentData.sponsor.logos[index].logo = path;
    renderSponsorLogos();
  }
}

/**
 * Sponsor 로고 삭제
 */
function removeSponsorLogo(index) {
  contentData.sponsor.logos.splice(index, 1);
  renderSponsorLogos();
}

/**
 * Sponsor 멤버 렌더링
 */
function renderSponsorMembers() {
  const container = document.getElementById('sponsor-members-list');
  if (!container || !contentData.sponsor?.members) return;
  
  container.innerHTML = '';
  
  contentData.sponsor.members.forEach((member, index) => {
    // descs 배열이 없으면 기존 desc를 배열로 변환
    if (!member.descs) {
      member.descs = member.desc ? [member.desc] : [''];
    }
    
    // 설명 필드들 생성
    const descsHtml = member.descs.map((desc, descIndex) => `
          <div class="form-group">
            <label>설명 ${descIndex + 1} ${member.descs.length > 1 ? `<button class="btn btn--danger btn--small" style="margin-left:10px;padding:2px 8px;font-size:11px;" onclick="removeSponsorMemberDesc(${index}, ${descIndex})">삭제</button>` : ''}</label>
            <input type="text" class="form-input" value="${desc || ''}" placeholder="예: 해양수산부 장관"
              onchange="contentData.sponsor.members[${index}].descs[${descIndex}] = this.value">
          </div>
    `).join('');
    
    container.innerHTML += `
      <div class="item-card">
        <div class="item-card__header">
          <span class="item-card__title">${member.name || '멤버 ' + (index + 1)}</span>
          <div class="item-card__actions">
            <button class="btn btn--small" onclick="moveSponsorMemberUp(${index})" title="위로">▲</button>
            <button class="btn btn--small" onclick="moveSponsorMemberDown(${index})" title="아래로">▼</button>
            <button class="btn btn--danger btn--small" onclick="removeSponsorMember(${index})">삭제</button>
          </div>
        </div>
        <div class="item-card__body">
          <div class="form-group">
            <label>사진</label>
            <div class="image-upload">
              <img src="${member.photo ? '/' + member.photo : ''}" class="image-preview" alt="">
              <input type="file" accept="image/*" class="file-input" onchange="updateSponsorMemberPhoto(${index}, this)">
              <button class="btn btn--small" onclick="this.previousElementSibling.click()">파일 선택</button>
            </div>
          </div>
          <div class="form-group">
            <label>역할 <span style="font-size:11px;color:#888;">(연파란색으로 표시)</span></label>
            <input type="text" class="form-input" value="${member.role || ''}" placeholder="예: 공동주관"
              onchange="contentData.sponsor.members[${index}].role = this.value">
          </div>
          <div class="form-group">
            <label>이름</label>
            <input type="text" class="form-input" value="${member.name || ''}" 
              onchange="contentData.sponsor.members[${index}].name = this.value">
          </div>
          ${descsHtml}
          <div class="form-group">
            <button class="btn btn--small" onclick="addSponsorMemberDesc(${index})">+ 설명 추가</button>
          </div>
        </div>
      </div>
    `;
  });
}

/**
 * Sponsor 멤버 설명 추가
 */
function addSponsorMemberDesc(index) {
  if (!contentData.sponsor.members[index].descs) {
    contentData.sponsor.members[index].descs = [''];
  }
  contentData.sponsor.members[index].descs.push('');
  renderSponsorMembers();
}

/**
 * Sponsor 멤버 설명 삭제
 */
function removeSponsorMemberDesc(index, descIndex) {
  contentData.sponsor.members[index].descs.splice(descIndex, 1);
  if (contentData.sponsor.members[index].descs.length === 0) {
    contentData.sponsor.members[index].descs = [''];
  }
  renderSponsorMembers();
}

/**
 * Sponsor 멤버 역할 추가 (하위호환)
 */
function addSponsorMemberRole(index) {
  contentData.sponsor.members[index].role = '';
  renderSponsorMembers();
}

/**
 * Sponsor 멤버 역할 삭제
 */
function removeSponsorMemberRole(index) {
  delete contentData.sponsor.members[index].role;
  renderSponsorMembers();
}

/**
 * Sponsor 멤버 사진 업데이트
 */
async function updateSponsorMemberPhoto(index, input) {
  const path = await uploadImage(input.files[0]);
  if (path) {
    contentData.sponsor.members[index].photo = path;
    renderSponsorMembers();
  }
}

/**
 * Sponsor 멤버 삭제
 */
function removeSponsorMember(index) {
  contentData.sponsor.members.splice(index, 1);
  renderSponsorMembers();
}


/**
 * Sponsor 멤버 위로 이동
 */
function moveSponsorMemberUp(index) {
  if (moveItemUp(contentData.sponsor.members, index)) {
    renderSponsorMembers();
  }
}

/**
 * Sponsor 멤버 아래로 이동
 */
function moveSponsorMemberDown(index) {
  if (moveItemDown(contentData.sponsor.members, index)) {
    renderSponsorMembers();
  }
}
