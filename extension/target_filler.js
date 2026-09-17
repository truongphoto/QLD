(() => {
  const TYPE_LABELS = {
    ban_le: 'Cơ sở bán lẻ',
    ban_buon: 'Cơ sở bán buôn',
    chuoi_nha_thuoc: 'Chuỗi nhà thuốc'
  };

  const FIELD_META = {
    province: {label:'Tỉnh/Thành phố', aliases:['tỉnh/thành phố','tỉnh thành phố']},
    ward: {label:'Xã/Phường', aliases:['xã/phường','xã phường']},
    drugBusinessCertificateNumber: {
      label:'Số giấy chứng nhận đủ điều kiện sản xuất/kinh doanh thuốc',
      aliases:['số giấy chứng nhận đủ điều kiện sản xuất/kinh doanh thuốc','số giấy chứng nhận đủ điều kiện sản xuất kinh doanh thuốc','số giấy chứng nhận đủ điều kiện kinh doanh dược']
    },
    facilitySubtype: {label:'Loại hình cơ sở', aliases:['loại hình cơ sở']},
    facilityName: {label:'Tên cơ sở', aliases:['tên cơ sở']},
    taxCode: {label:'Mã số thuế', aliases:['mã số thuế']},
    hasBusinessLocationCode: {label:'Có mã địa điểm kinh doanh', aliases:['có mã địa điểm kinh doanh']},
    organizationIdentifier: {label:'Số định danh cơ quan, tổ chức', aliases:['số định danh cơ quan, tổ chức','số định danh cơ quan tổ chức']},
    contactEmail: {label:'Thư điện tử liên hệ', aliases:['email liên hệ','thư điện tử liên hệ']},
    businessAddress: {label:'Địa chỉ kinh doanh', aliases:['địa chỉ kinh doanh']},
    headOfficeAddress: {label:'Địa chỉ trụ sở', aliases:['địa chỉ trụ sở']},
    drugBusinessCertificateIssueDate: {label:'Ngày cấp giấy chứng nhận đủ điều kiện kinh doanh dược', aliases:['ngày cấp giấy chứng nhận đủ điều kiện kinh doanh dược']},
    drugBusinessCertificateIssuer: {label:'Nơi cấp giấy chứng nhận đủ điều kiện kinh doanh dược', aliases:['nơi cấp giấy chứng nhận đủ điều kiện kinh doanh dược']},
    responsibleProfessionalName: {label:'Người chịu trách nhiệm chuyên môn về dược của cơ sở', aliases:['người chịu trách nhiệm chuyên môn về dược của cs','người chịu trách nhiệm chuyên môn về dược của cơ sở']},
    contactPhone: {label:'Điện thoại liên hệ', aliases:['điện thoại liên hệ']},
    qualification: {label:'Trình độ chuyên môn', aliases:['trình độ chuyên môn']},
    practiceCertificateNumber: {label:'Số chứng chỉ hành nghề', aliases:['số chứng chỉ hành nghề']},
    practiceCertificateIssueDate: {label:'Ngày cấp chứng chỉ hành nghề', aliases:['ngày cấp chứng chỉ hành nghề']},
    practiceCertificateIssuer: {label:'Nơi cấp chứng chỉ hành nghề', aliases:['nơi cấp chứng chỉ hành nghề']}
  };

  const FILL_ORDER = [
    'province','ward','drugBusinessCertificateNumber','facilitySubtype','facilityName','taxCode',
    'hasBusinessLocationCode','organizationIdentifier','contactEmail','businessAddress','headOfficeAddress',
    'drugBusinessCertificateIssueDate','drugBusinessCertificateIssuer','responsibleProfessionalName',
    'contactPhone','qualification','practiceCertificateNumber','practiceCertificateIssueDate','practiceCertificateIssuer'
  ];

  function norm(value = '') {
    return String(value)
      .normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/gi,'d')
      .toLowerCase().replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
  }

  function scoreText(text, aliases) {
    const candidate = norm(text);
    if (!candidate) return 0;
    let best = 0;
    for (const rawAlias of aliases) {
      const alias = norm(rawAlias);
      if (!alias) continue;
      if (candidate === alias) best = Math.max(best, 140);
      else if (candidate.startsWith(alias) || candidate.endsWith(alias)) best = Math.max(best, 105);
      else if (candidate.includes(alias)) best = Math.max(best, 85);
      else {
        const tokens = alias.split(' ');
        const matched = tokens.filter(token => candidate.includes(token)).length;
        best = Math.max(best, Math.round((matched / tokens.length) * 50));
      }
    }
    return best;
  }

  function visible(element) {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
  }

  function contextTexts(element) {
    const texts = [
      element.getAttribute('name'), element.id, element.getAttribute('placeholder'),
      element.getAttribute('aria-label'), element.getAttribute('data-label'), element.title
    ].filter(Boolean);

    // Các biểu mẫu thực tế có thể dùng label không gắn bằng label[for].
    // Vì vậy phải hỗ trợ cả aria-labelledby, nhãn gần ô nhập và nhãn trong khối trường.
    if (element.getAttribute('aria-labelledby')) {
      for (const id of element.getAttribute('aria-labelledby').split(/\s+/)) {
        const node = document.getElementById(id);
        if (node?.textContent) texts.push(node.textContent);
      }
    }

    if (element.id) {
      try {
        const label = document.querySelector(`label[for="${CSS.escape(element.id)}"]`);
        if (label) texts.push(label.textContent);
      } catch {}
    }

    const ownLabel = element.closest('label');
    if (ownLabel) texts.push(ownLabel.textContent);

    // Tìm nhãn có vị trí thực tế gần ô nhập. Đây là phần quan trọng với
    // trang CSDL Dược vì nhiều nhãn là div/span thay vì label[for].
    try {
      const rect = element.getBoundingClientRect();
      const labelNodes = [...document.querySelectorAll(
        'label, [class*="label"], [class*="Label"], [class*="form-label"], [class*="field-label"]'
      )];
      for (const label of labelNodes) {
        const text = String(label.textContent || '').trim();
        if (!text || text.length > 220 || !visible(label)) continue;
        const lr = label.getBoundingClientRect();
        const verticalGap = Math.min(Math.abs(lr.bottom - rect.top), Math.abs(rect.bottom - lr.top));
        const horizontalGap = Math.min(Math.abs(lr.left - rect.right), Math.abs(rect.left - lr.right));
        if (verticalGap <= 90 || (verticalGap <= 180 && horizontalGap <= 260)) texts.push(text);
      }
    } catch {}

    let node = element.parentElement;
    for (let depth = 0; node && depth < 6; depth++, node = node.parentElement) {
      const direct = [...node.children].slice(0, 12);
      for (const child of direct) {
        if (child === element || child.contains(element)) continue;
        const text = String(child.textContent || '').trim();
        if (text && text.length <= 220) texts.push(text);
      }
      const previous = node.previousElementSibling;
      if (previous) {
        const text = String(previous.textContent || '').trim();
        if (text && text.length <= 220) texts.push(text);
      }
    }

    return texts.filter(Boolean).map(text => String(text).trim()).filter(Boolean);
  }

  function candidates() {
    return [...document.querySelectorAll('input:not([type="hidden"]):not([type="file"]), select, textarea, [role="combobox"]')]
      .filter(element => !element.disabled && !element.readOnly && visible(element));
  }

  function findField(meta) {
    let best = null;
    let bestScore = 0;
    for (const element of candidates()) {
      const texts = contextTexts(element);
      const current = Math.max(0, ...texts.map(text => scoreText(text, meta.aliases)));
      if (current > bestScore) {
        best = element;
        bestScore = current;
      }
    }
    return bestScore >= 70 ? {element:best, score:bestScore} : null;
  }

  function nativeValueSetter(element, value) {
    const proto = element.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
    if (setter) setter.call(element, value); else element.value = value;
  }

  function emitEvents(element) {
    for (const name of ['input','change','blur']) element.dispatchEvent(new Event(name,{bubbles:true}));
  }

  function dateForElement(value, element) {
    const raw = String(value || '').trim();
    const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return raw;
    if (element.type === 'date') return raw;
    return `${match[3]}/${match[2]}/${match[1]}`;
  }

  async function setValue(element, value) {
    if (element.type === 'checkbox') {
      element.checked = Boolean(value);
      emitEvents(element);
      return true;
    }

    if (element.tagName === 'SELECT') {
      const wanted = norm(value);
      const options = [...element.options];
      const exact = options.find(option => norm(option.textContent) === wanted || norm(option.value) === wanted);
      const partial = options.find(option => norm(option.textContent).includes(wanted) || wanted.includes(norm(option.textContent)));
      const chosen = exact || partial;
      if (!chosen) return false;
      element.value = chosen.value;
      emitEvents(element);
      return true;
    }

    const isCustomCombobox = element.getAttribute('role') === 'combobox' && !['INPUT','TEXTAREA'].includes(element.tagName);
    if (isCustomCombobox) {
      element.click();
      await sleep(180);
      const wanted = norm(value);
      const options = [...document.querySelectorAll('[role="option"], [role="listbox"] li, .ng-option, .ant-select-item-option, li')]
        .filter(visible)
        .filter(option => {
          const text = norm(option.textContent);
          return text === wanted || text.includes(wanted) || wanted.includes(text);
        });
      if (!options[0]) return false;
      options[0].click();
      await sleep(180);
      return true;
    }

    const finalValue = dateForElement(value, element);
    element.focus();
    nativeValueSetter(element, finalValue);
    emitEvents(element);

    if (element.getAttribute('role') === 'combobox' || element.getAttribute('aria-autocomplete')) {
      await sleep(250);
      const wanted = norm(value);
      const options = [...document.querySelectorAll('[role="option"], .ng-option, .ant-select-item-option, li')]
        .filter(visible)
        .filter(option => norm(option.textContent).includes(wanted) || wanted.includes(norm(option.textContent)));
      if (options[0]) {
        options[0].click();
        await sleep(120);
      }
    }
    return true;
  }

  function comparable(value = '') {
    const raw = String(value).trim();
    let match = raw.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
    if (match) return `${match[3]}-${match[2].padStart(2,'0')}-${match[1].padStart(2,'0')}`;
    match = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
    if (match) return `${match[1]}-${match[2].padStart(2,'0')}-${match[3].padStart(2,'0')}`;
    return norm(raw);
  }

  function isCorrect(element, expected) {
    if (element.type === 'checkbox') return element.checked === Boolean(expected);
    if (element.tagName === 'SELECT') {
      const selected = element.options[element.selectedIndex];
      return comparable(selected?.textContent) === comparable(expected) || comparable(element.value) === comparable(expected);
    }
    return comparable(element.value) === comparable(expected);
  }

  function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

  async function getPendingPayload() {
    return await new Promise(resolve => {
      chrome.runtime.sendMessage({type:'GET_PENDING'}, response => {
        if (chrome.runtime.lastError || !response?.ok) return resolve(null);
        resolve(response.payload || null);
      });
    });
  }

  async function clearPendingPayload() {
    return await new Promise(resolve => {
      chrome.runtime.sendMessage({type:'CLEAR_PENDING'}, () => resolve());
    });
  }

  function detectFormType() {
    const text = norm(document.body?.innerText || '');
    if (!text.includes(norm('ĐĂNG KÝ TÀI KHOẢN'))) return null;
    if (text.includes(norm('Địa chỉ trụ sở')) || text.includes(norm('Giấy chứng nhận đăng ký mã địa điểm kinh doanh'))) return 'chuoi_nha_thuoc';
    if (text.includes(norm('Loại hình cơ sở'))) return 'ban_le';
    if (text.includes(norm('Có mã địa điểm kinh doanh')) && text.includes(norm('Người chịu trách nhiệm chuyên môn về dược'))) return 'ban_buon';
    return null;
  }

  async function waitForDetectedType(timeoutMs = 10000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const detected = detectFormType();
      if (detected) return detected;
      await sleep(400);
    }
    return null;
  }

  function removePanel() { document.getElementById('truong-gpp-panel')?.remove(); }

  function panelShell(title, bodyHtml, actionsHtml = '') {
    removePanel();
    const panel = document.createElement('div');
    panel.id = 'truong-gpp-panel';
    panel.innerHTML = `
      <div class="gpp-head"><strong>${title}</strong><button class="gpp-close" title="Đóng">×</button></div>
      <div class="gpp-body">${bodyHtml}${actionsHtml ? `<div class="gpp-actions">${actionsHtml}</div>` : ''}</div>`;
    document.documentElement.appendChild(panel);
    panel.querySelector('.gpp-close')?.addEventListener('click', removePanel);
    return panel;
  }

  function showWaiting(message) {
    panelShell('TRƯỜNG GPP – Đang chuẩn bị', `<div class="gpp-summary">${message}</div>`);
  }

  function showTypeMismatch(expected, detected) {
    const panel = panelShell(
      'TRƯỜNG GPP – Chưa đúng loại hồ sơ',
      `<div class="gpp-warning"><strong>Chưa thể tự điền để tránh nhầm dữ liệu.</strong>Hồ sơ đã chọn: <b>${TYPE_LABELS[expected]}</b>.<br>Biểu mẫu đang hiển thị: <b>${detected ? TYPE_LABELS[detected] : 'chưa xác định'}</b>.<br><br>Hãy chuyển CSDL Dược sang đúng loại hồ sơ. Dữ liệu vẫn được giữ tạm trong phiên trình duyệt.</div>`,
      '<button class="gpp-btn" data-retry>Thử điền lại</button>'
    );
    panel.querySelector('[data-retry]')?.addEventListener('click', () => attemptPendingFill(true));
  }

  function showResults(results, payload) {
    const successCount = results.filter(item => item.status === 'ok').length;
    const problemCount = results.length - successCount;
    const uploadItems = (payload.manualUploads || []).map(item => `<li>${escapeHtml(item)}</li>`).join('');
    const rows = results.map(item => `
      <li class="gpp-item ${item.status === 'ok' ? 'ok' : item.status === 'missing' ? 'warn' : 'bad'}">
        <span>${item.status === 'ok' ? '✓' : item.status === 'missing' ? '!' : '×'}</span>
        <span><strong>${escapeHtml(item.label)}</strong><br>${escapeHtml(item.message)}</span>
      </li>`).join('');
    panelShell(
      'TRƯỜNG GPP – Kết quả điền',
      `<div class="gpp-summary"><strong>Đã xử lý ${results.length} mục:</strong> ${successCount} mục thành công, ${problemCount} mục cần kiểm tra.</div>
       <ul class="gpp-list">${rows}</ul>
       <div class="gpp-handoff"><strong>Phần tự động đã hoàn tất.</strong><br>Bây giờ bạn tự thực hiện các bước còn lại:<ol>${uploadItems}<li>Nhập mã xác nhận</li><li>Kiểm tra lại toàn bộ thông tin</li><li>Bấm Đăng ký</li></ol></div>`
    );
  }

  function escapeHtml(value = '') {
    return String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  }

  async function fillOne(key, value) {
    const meta = FIELD_META[key];
    if (!meta) return null;
    const found = findField(meta);
    if (!found) return {status:'missing', label:meta.label, message:'Không tìm thấy ô tương ứng. Bạn nhập thủ công mục này.'};

    try {
      const wrote = await setValue(found.element, value);
      await sleep(key === 'province' ? 700 : 90);
      const correct = wrote && isCorrect(found.element, value);
      if (!correct) {
        found.element.style.outline = '2px solid #f59e0b';
        return {status:'error', label:meta.label, message:'Đã tìm thấy ô nhưng giá trị chưa khớp. Vui lòng kiểm tra thủ công.'};
      }
      return {status:'ok', label:meta.label, message:'Đã điền và kiểm tra lại.'};
    } catch {
      return {status:'error', label:meta.label, message:'Không thể điền tự động. Vui lòng nhập thủ công mục này.'};
    }
  }

  let running = false;
  async function attemptPendingFill(force = false) {
    if (running) return;
    if (!location.href.startsWith('https://csdlduoc.com.vn/')) return;
    const payload = await getPendingPayload();
    if (!payload) return;

    running = true;
    try {
      showWaiting('Đang kiểm tra biểu mẫu CSDL Dược và chuẩn bị điền thông tin…');
      const detected = await waitForDetectedType(force ? 3000 : 10000);
      if (detected !== payload.registrationType) {
        showTypeMismatch(payload.registrationType, detected);
        return;
      }

      const results = [];
      for (const key of FILL_ORDER) {
        if (!Object.prototype.hasOwnProperty.call(payload.values || {}, key)) continue;
        const result = await fillOne(key, payload.values[key]);
        if (result) results.push(result);
      }
      await clearPendingPayload();
      showResults(results, payload);
    } finally {
      running = false;
    }
  }

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message?.type === 'TRUONG_GPP_PENDING_CHANGED') {
      setTimeout(() => attemptPendingFill(false), 150);
      sendResponse?.({ok:true});
      return true;
    }
    if (message?.type === 'TRUONG_GPP_FILL_NOW' && message.payload) {
      setTimeout(() => attemptPendingFillWithPayload(message.payload), 0);
      sendResponse?.({ok:true});
      return true;
    }
    return false;
  });

  async function attemptPendingFillWithPayload(payload) {
    if (running || !payload) return;
    running = true;
    try {
      showWaiting('Đang kiểm tra biểu mẫu CSDL Dược và chuẩn bị điền thông tin…');
      const detected = await waitForDetectedType(10000);
      if (detected !== payload.registrationType) {
        showTypeMismatch(payload.registrationType, detected);
        return;
      }
      const results = [];
      for (const key of FILL_ORDER) {
        if (!Object.prototype.hasOwnProperty.call(payload.values || {}, key)) continue;
        const result = await fillOne(key, payload.values[key]);
        if (result) results.push(result);
      }
      await clearPendingPayload();
      showResults(results, payload);
    } finally {
      running = false;
    }
  }

  setTimeout(() => attemptPendingFill(false), 300);
})();
