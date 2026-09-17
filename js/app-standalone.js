(() => {
'use strict';

/* web/js/schema.js */
const TARGET_REGISTER_URL = 'https://csdlduoc.com.vn/auth/register';

const REGISTRATION_TYPES = [
  {
    id: 'ban_le',
    label: 'Cơ sở bán lẻ',
    description: 'Nhà thuốc hoặc quầy thuốc.',
    manualUploads: [
      'Giấy chứng nhận đủ điều kiện sản xuất/kinh doanh thuốc',
      'Chứng chỉ hành nghề',
      'Giấy chứng nhận đăng ký kinh doanh'
    ]
  },
  {
    id: 'ban_buon',
    label: 'Cơ sở bán buôn',
    description: 'Hồ sơ đăng ký tài khoản dành cho cơ sở bán buôn.',
    manualUploads: [
      'Giấy chứng nhận đủ điều kiện sản xuất/kinh doanh thuốc',
      'Chứng chỉ hành nghề',
      'Giấy chứng nhận đăng ký kinh doanh'
    ]
  },
  {
    id: 'chuoi_nha_thuoc',
    label: 'Chuỗi nhà thuốc',
    description: 'Hồ sơ đăng ký tài khoản dành cho chuỗi nhà thuốc.',
    manualUploads: [
      'Giấy chứng nhận đủ điều kiện sản xuất/kinh doanh thuốc',
      'Chứng chỉ hành nghề',
      'Giấy chứng nhận đăng ký kinh doanh',
      'Giấy chứng nhận đăng ký mã địa điểm kinh doanh'
    ]
  }
];

const COMMON_FIELDS = [
  {
    key: 'province', label: 'Tỉnh / Thành phố', type: 'text', required: true,
    aliases: ['tỉnh/thành phố', 'tỉnh thành phố', 'tỉnh', 'thành phố']
  },
  {
    key: 'district', label: 'Quận / Huyện', type: 'text', required: true, sendToTarget: false,
    aliases: ['quận/huyện', 'quận huyện', 'quận', 'huyện']
  },
  {
    key: 'ward', label: 'Xã / Phường', type: 'text', required: true,
    aliases: ['xã/phường', 'xã phường', 'phường', 'xã']
  },
  {
    key: 'drugBusinessCertificateNumber',
    label: 'Số Giấy chứng nhận',
    type: 'text', required: true,
    aliases: [
      'số giấy chứng nhận đủ điều kiện sản xuất/kinh doanh thuốc',
      'số giấy chứng nhận đủ điều kiện sản xuất kinh doanh thuốc',
      'số giấy chứng nhận đủ điều kiện kinh doanh dược'
    ]
  },
  {
    key: 'facilityName', label: 'Tên cơ sở', type: 'text', required: true,
    aliases: ['tên cơ sở']
  },
  {
    key: 'taxCode', label: 'Mã số thuế', type: 'text', required: true,
    aliases: ['mã số thuế']
  },
  {
    key: 'organizationIdentifier', label: 'Số định danh cơ quan, tổ chức', type: 'text',
    help: 'Có thể bỏ qua nếu không có.',
    aliases: ['số định danh cơ quan, tổ chức', 'số định danh cơ quan tổ chức']
  },
  {
    key: 'contactEmail', label: 'Email liên hệ', type: 'email', required: true,
    aliases: ['email liên hệ', 'thư điện tử liên hệ']
  },
  {
    key: 'businessAddress', label: 'Địa chỉ kinh doanh', type: 'text', required: true,
    help: 'Nhập số nhà, tên đường, khóm/ấp.',
    aliases: ['địa chỉ kinh doanh']
  },
  {
    key: 'drugBusinessCertificateIssueDate',
    label: 'Ngày cấp',
    type: 'date', required: true,
    aliases: ['ngày cấp giấy chứng nhận đủ điều kiện kinh doanh dược']
  },
  {
    key: 'drugBusinessCertificateIssuer',
    label: 'Nơi cấp',
    type: 'text', required: true,
    aliases: ['nơi cấp giấy chứng nhận đủ điều kiện kinh doanh dược']
  },
  {
    key: 'responsibleProfessionalName',
    label: 'Họ và tên người chịu trách nhiệm',
    type: 'text', required: true,
    aliases: ['người chịu trách nhiệm chuyên môn về dược của cs', 'người chịu trách nhiệm chuyên môn về dược của cơ sở']
  },
  {
    key: 'contactPhone', label: 'Số điện thoại', type: 'tel', required: true,
    aliases: ['điện thoại liên hệ', 'số điện thoại']
  },
  {
    key: 'qualification', label: 'Trình độ chuyên môn', type: 'text', required: true,
    aliases: ['trình độ chuyên môn']
  },
  {
    key: 'practiceCertificateNumber', label: 'Số chứng chỉ hành nghề', type: 'text', required: true,
    aliases: ['số chứng chỉ hành nghề']
  },
  {
    key: 'practiceCertificateIssueDate', label: 'Ngày cấp CCHN', type: 'date', required: true,
    aliases: ['ngày cấp chứng chỉ hành nghề']
  },
  {
    key: 'practiceCertificateIssuer', label: 'Nơi cấp CCHN', type: 'text', required: true,
    aliases: ['nơi cấp chứng chỉ hành nghề']
  }
];

const RETAIL_ONLY_FIELDS = [
  {
    key: 'facilitySubtype', label: 'Loại hình cơ sở', type: 'select', required: true,
    options: ['Nhà thuốc', 'Quầy thuốc'],
    aliases: ['loại hình cơ sở']
  }
];

const BUSINESS_LOCATION_CHECKBOX = {
  key: 'hasBusinessLocationCode', label: 'Có mã địa điểm kinh doanh', type: 'checkbox',
  aliases: ['có mã địa điểm kinh doanh']
};

const CHAIN_ONLY_FIELDS = [
  {
    key: 'headOfficeAddress', label: 'Địa chỉ trụ sở', type: 'text', required: true,
    aliases: ['địa chỉ trụ sở']
  }
];

function clone(field) {
  return {
    ...field,
    aliases: [...(field.aliases || [])],
    options: field.options ? [...field.options] : undefined
  };
}

function getFieldsForType(typeId) {
  const common = COMMON_FIELDS.map(clone);
  if (typeId === 'ban_le') {
    const nameIndex = common.findIndex(field => field.key === 'facilityName');
    return [
      ...common.slice(0, nameIndex),
      ...RETAIL_ONLY_FIELDS.map(clone),
      ...common.slice(nameIndex, 6),
      clone(BUSINESS_LOCATION_CHECKBOX),
      ...common.slice(6)
    ];
  }
  if (typeId === 'ban_buon') {
    const orgIndex = common.findIndex(field => field.key === 'organizationIdentifier');
    return [
      ...common.slice(0, orgIndex),
      clone(BUSINESS_LOCATION_CHECKBOX),
      ...common.slice(orgIndex)
    ];
  }
  if (typeId === 'chuoi_nha_thuoc') {
    const addressIndex = common.findIndex(field => field.key === 'businessAddress');
    return [
      ...common.slice(0, addressIndex + 1),
      ...CHAIN_ONLY_FIELDS.map(clone),
      ...common.slice(addressIndex + 1)
    ];
  }
  return [];
}

function getManualUploadsForType(typeId) {
  return [...(REGISTRATION_TYPES.find(item => item.id === typeId)?.manualUploads || [])];
}

function getRegistrationType(typeId) {
  return REGISTRATION_TYPES.find(item => item.id === typeId) || REGISTRATION_TYPES[0];
}

const ALL_FIELDS = [...new Map(
  REGISTRATION_TYPES.flatMap(type => getFieldsForType(type.id)).map(field => [field.key, field])
).values()];

const FIELD_BY_KEY = Object.fromEntries(ALL_FIELDS.map(field => [field.key, field]));

const FIELD_GROUP_DEFINITIONS = [
  {
    id: 'dinh_danh_co_so',
    label: 'Định danh cơ sở',
    description: 'Nhập thông tin nhận diện cơ bản của cơ sở.',
    keys: ['facilitySubtype', 'facilityName', 'taxCode', 'organizationIdentifier']
  },
  {
    id: 'vi_tri_dia_ly',
    label: 'Vị trí địa lý',
    description: 'Nhập địa chỉ theo thứ tự từ tỉnh/thành phố đến địa chỉ kinh doanh.',
    keys: ['province', 'district', 'ward', 'businessAddress', 'headOfficeAddress']
  },
  {
    id: 'thong_tin_lien_lac',
    label: 'Thông tin liên lạc',
    description: 'Chỉ cần số điện thoại và email đang sử dụng.',
    keys: ['contactPhone', 'contactEmail']
  },
  {
    id: 'giay_chung_nhan_kinh_doanh_duoc',
    label: 'Giấy chứng nhận đủ điều kiện kinh doanh dược',
    description: 'Nhập đúng số, ngày cấp và nơi cấp trên giấy chứng nhận.',
    keys: [
      'drugBusinessCertificateNumber',
      'drugBusinessCertificateIssueDate',
      'drugBusinessCertificateIssuer'
    ]
  },
  {
    id: 'nhan_than_nguoi_phu_trach',
    label: 'Nhân thân người phụ trách chuyên môn',
    description: 'Nhập họ tên và trình độ chuyên môn của người chịu trách nhiệm.',
    keys: ['responsibleProfessionalName', 'qualification']
  },
  {
    id: 'chung_chi_hanh_nghe',
    label: 'Chứng chỉ hành nghề dược (CCHN)',
    description: 'Nhập thông tin chứng chỉ hành nghề dược.',
    keys: [
      'practiceCertificateNumber',
      'practiceCertificateIssueDate',
      'practiceCertificateIssuer'
    ]
  }
];

function getFieldGroupsForType(typeId) {
  const fields = getFieldsForType(typeId);
  const byKey = new Map(fields.map(field => [field.key, field]));
  return FIELD_GROUP_DEFINITIONS.map(group => ({
    id: group.id,
    label: group.label,
    description: group.description,
    fields: group.keys.filter(key => byKey.has(key)).map(key => byKey.get(key))
  }));
}


/* web/js/validation.js */
function normalizePhone(value = '') {
  let digits = String(value).replace(/\D/g, '');
  if (digits.startsWith('84') && digits.length >= 10) digits = `0${digits.slice(2)}`;
  return digits;
}

function normalizeDate(value = '') {
  const raw = String(value).trim();
  let y, m, d;
  let match = raw.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (match) [, y, m, d] = match;
  else {
    match = raw.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
    if (!match) return '';
    [, d, m, y] = match;
  }
  const iso = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return '';
  if (date.getUTCFullYear() !== Number(y) || date.getUTCMonth() + 1 !== Number(m) || date.getUTCDate() !== Number(d)) return '';
  return iso;
}

function validateDossier(data = {}, registrationType = 'ban_le') {
  const errors = {};
  for (const field of getFieldsForType(registrationType)) {
    const raw = data[field.key];
    const value = field.type === 'checkbox' ? Boolean(raw) : String(raw ?? '').trim();
    if (field.required && !value) errors[field.key] = `${field.label} là thông tin bắt buộc.`;
    if (!value || field.type === 'checkbox') continue;
    if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errors[field.key] = 'Địa chỉ thư điện tử chưa đúng định dạng.';
    if (field.type === 'tel') {
      const phone = normalizePhone(value);
      if (phone.length < 9 || phone.length > 11) errors[field.key] = 'Số điện thoại chưa đúng định dạng.';
    }
    if (field.type === 'date' && !normalizeDate(value)) errors[field.key] = 'Ngày chưa đúng định dạng.';
  }
  return { isValid: Object.keys(errors).length === 0, errors };
}


/* web/js/state.js */
const STORAGE_KEY = 'truong_gpp_v1_draft';

function createFillPayload(data, registrationType) {
  const values = {};
  const allowed = new Map(getFieldsForType(registrationType).map(field => [field.key, field]));
  for (const [key, value] of Object.entries(data || {})) {
    const field = allowed.get(key);
    if (!field || field.sendToTarget === false) continue;
    if (typeof value === 'boolean') {
      if (value) values[key] = true;
      continue;
    }
    if (String(value ?? '').trim() !== '') values[key] = value;
  }
  return {
    type: 'TRUONG_GPP_START_FILL',
    schemaVersion: 1,
    runId: `gpp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    createdAt: new Date().toISOString(),
    targetUrl: TARGET_REGISTER_URL,
    registrationType,
    manualUploads: getManualUploadsForType(registrationType),
    values
  };
}

function exportDraftJson(data, registrationType) {
  return JSON.stringify({
    product: 'TRƯỜNG GPP',
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    registrationType,
    data: data || {}
  }, null, 2);
}

function importDraftJson(text) {
  const parsed = JSON.parse(text);
  if (!parsed || parsed.product !== 'TRƯỜNG GPP' || parsed.schemaVersion !== 1 || typeof parsed.data !== 'object') {
    throw new Error('Tệp hồ sơ không đúng định dạng TRƯỜNG GPP V1.');
  }
  if (!['ban_le','ban_buon','chuoi_nha_thuoc'].includes(parsed.registrationType)) {
    throw new Error('Tệp hồ sơ chưa xác định đúng loại cơ sở.');
  }
  return { data: parsed.data, registrationType: parsed.registrationType };
}


/* web/js/app.js */
const form = document.querySelector('#dossierForm');
const profileSelect = document.querySelector('#loaiHoSoSelect');
const extensionStatus = document.querySelector('#extensionStatus');
const progressBar = document.querySelector('#progressBar');
const validationSummary = document.querySelector('#validationSummary');
const currentStepNumber = document.querySelector('#currentStepNumber');
const currentStepName = document.querySelector('#currentStepName');
const wizardTitle = document.querySelector('#wizardTitle');
const wizardDescription = document.querySelector('#wizardDescription');
const formPanel = document.querySelector('#formPanel');
const finishPanel = document.querySelector('#finishPanel');
const reviewList = document.querySelector('#reviewList');
const prevStepBtn = document.querySelector('#prevStepBtn');
const nextStepBtn = document.querySelector('#nextStepBtn');

let extensionReady = false;
let toastTimer;
let registrationType = 'ban_le';
let data = {};
let currentStep = 0;

function messageTargetOrigin() {
  return window.location.protocol === 'file:' ? '*' : window.location.origin;
}

function escapeHtml(value = '') {
  return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}

function formatReviewValue(field, value) {
  if (value === undefined || value === null || value === '') return field.required ? 'Chưa nhập' : 'Bỏ qua';
  if (field.type === 'checkbox') return value ? 'Có' : 'Không';
  if (field.type === 'date') {
    const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) return `${match[3]}/${match[2]}/${match[1]}`;
  }
  return String(value);
}

function stepsForCurrentType() {
  return [
    ...getFieldGroupsForType(registrationType),
    {
      id: 'tong_duyet',
      label: 'Tổng duyệt & Khởi động',
      description: 'Xem lại toàn bộ thông tin. Bấm biểu tượng bút chì nếu cần sửa nhanh.'
    }
  ];
}

function renderProfileSelect() {
  profileSelect.innerHTML = REGISTRATION_TYPES.map(item =>
    `<option value="${item.id}" ${item.id === registrationType ? 'selected' : ''}>${escapeHtml(item.label)}</option>`
  ).join('');
}

function fieldInput(field) {
  const value = data[field.key] ?? '';
  if (field.type === 'select') {
    return `<select id="${field.key}" name="${field.key}"><option value="">-- Chọn --</option>${field.options.map(option => `<option value="${escapeHtml(option)}" ${value === option ? 'selected' : ''}>${escapeHtml(option)}</option>`).join('')}</select>`;
  }
  if (field.type === 'checkbox') {
    return `<label class="checkbox-row"><input id="${field.key}" name="${field.key}" type="checkbox" ${value ? 'checked' : ''} /><span>${escapeHtml(field.label)}</span></label>`;
  }
  const type = ['date','email','tel'].includes(field.type) ? field.type : 'text';
  const placeholder = field.type === 'date' ? 'Ngày/Tháng/Năm' : field.help || 'Nhập thông tin';
  return `<input id="${field.key}" name="${field.key}" type="${type}" value="${escapeHtml(value)}" placeholder="${escapeHtml(placeholder)}" autocomplete="off" />`;
}

function renderGroupForm(group) {
  form.innerHTML = `<div class="field-grid">${group.fields.map(field => {
    if (field.type === 'checkbox') {
      return `<div class="field full checkbox-field" data-field="${field.key}">${fieldInput(field)}<span class="error-text" data-error="${field.key}"></span></div>`;
    }
    const full = ['organizationIdentifier', 'businessAddress', 'headOfficeAddress'].includes(field.key) ? 'full' : '';
    return `<div class="field ${full}" data-field="${field.key}">
      <label for="${field.key}" class="${field.required ? 'required' : ''}">${escapeHtml(field.label)}</label>
      ${fieldInput(field)}
      ${field.help ? `<small class="field-help">${escapeHtml(field.help)}</small>` : ''}
      <span class="error-text" data-error="${field.key}"></span>
    </div>`;
  }).join('')}</div>`;
}

function renderFinishPanel() {
  const result = validateDossier(data, registrationType);
  validationSummary.textContent = result.isValid
    ? '✓ Thông tin bắt buộc đã đầy đủ. Bạn có thể xem lại hoặc bắt đầu điền.'
    : `Còn ${Object.keys(result.errors).length} thông tin bắt buộc cần bổ sung.`;
  validationSummary.classList.toggle('valid-text', result.isValid);

  const groups = getFieldGroupsForType(registrationType);
  reviewList.innerHTML = groups.map((group, groupIndex) => `
    <section class="review-group">
      <h4>${groupIndex + 1}. ${escapeHtml(group.label)}</h4>
      <div class="review-rows">
        ${group.fields.map(field => `
          <div class="review-row ${result.errors[field.key] ? 'review-missing' : ''}">
            <div class="review-text">
              <span>${escapeHtml(field.label)}</span>
              <strong>${escapeHtml(formatReviewValue(field, data[field.key]))}</strong>
            </div>
            <button type="button" class="edit-button" data-edit-field="${field.key}" title="Chỉnh sửa ${escapeHtml(field.label)}" aria-label="Chỉnh sửa ${escapeHtml(field.label)}">✎ <span>Chỉnh sửa</span></button>
          </div>`).join('')}
      </div>
    </section>`).join('');
}

function readForm() {
  const next = {...data};
  for (const field of getFieldsForType(registrationType)) {
    const el = form.elements[field.key];
    if (!el) continue;
    next[field.key] = field.type === 'checkbox' ? el.checked : el.value;
  }
  data = next;
  return data;
}

function pruneDataForType() {
  const validKeys = new Set(getFieldsForType(registrationType).map(field => field.key));
  data = Object.fromEntries(Object.entries(data).filter(([key]) => validKeys.has(key)));
}

function saveDraft() {
  readForm();
  localStorage.setItem(STORAGE_KEY, JSON.stringify({schemaVersion:1, registrationType, data}));
}

function loadDraft() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (parsed?.schemaVersion === 1 && REGISTRATION_TYPES.some(item => item.id === parsed.registrationType) && parsed.data && typeof parsed.data === 'object') {
      registrationType = parsed.registrationType;
      data = parsed.data;
    }
  } catch {}
}


function displayErrors(errors) {
  for (const field of getFieldsForType(registrationType)) {
    const wrapper = form.querySelector(`[data-field="${field.key}"]`);
    const msg = form.querySelector(`[data-error="${field.key}"]`);
    const error = errors[field.key] || '';
    wrapper?.classList.toggle('invalid', Boolean(error));
    if (msg) msg.textContent = error;
  }
}

function showPanel(panel) {
  for (const item of [formPanel, finishPanel]) item.classList.add('hidden');
  panel.classList.remove('hidden');
}

function renderWizard() {
  const steps = stepsForCurrentType();
  if (currentStep >= steps.length) currentStep = steps.length - 1;
  const step = steps[currentStep];

  currentStepNumber.textContent = String(currentStep + 1);
  currentStepName.textContent = step.label;
  wizardTitle.textContent = step.label;
  wizardDescription.textContent = step.description;
  progressBar.style.width = `${Math.round((currentStep + 1) / steps.length * 100)}%`;

  prevStepBtn.classList.toggle('invisible', currentStep === 0);
  nextStepBtn.classList.toggle('hidden', currentStep === steps.length - 1);

  const groups = getFieldGroupsForType(registrationType);
  if (currentStep < groups.length) {
    showPanel(formPanel);
    renderGroupForm(groups[currentStep]);
    return;
  }

  showPanel(finishPanel);
  renderFinishPanel();
}

function validateCurrentGroup() {
  readForm();
  const groups = getFieldGroupsForType(registrationType);
  if (currentStep >= groups.length) return validateDossier(data, registrationType).isValid;

  const result = validateDossier(data, registrationType);
  const group = groups[currentStep];
  const groupKeys = new Set(group.fields.map(field => field.key));
  const groupErrors = Object.fromEntries(
    Object.entries(result.errors).filter(([key]) => groupKeys.has(key))
  );
  displayErrors(groupErrors);

  if (Object.keys(groupErrors).length > 0) {
    const first = form.querySelector('.field.invalid input, .field.invalid select');
    first?.focus();
    toast('Vui lòng hoàn thành các mục bắt buộc trong nhóm này.');
    return false;
  }
  return true;
}

function goToStep(stepIndex, focusField = '') {
  saveDraft();
  currentStep = stepIndex;
  renderWizard();
  if (focusField) setTimeout(() => form.elements[focusField]?.focus(), 120);
}

function goToField(fieldKey) {
  const groups = getFieldGroupsForType(registrationType);
  const groupIndex = groups.findIndex(group => group.fields.some(field => field.key === fieldKey));
  if (groupIndex >= 0) goToStep(groupIndex, fieldKey);
}

function toast(message) {
  const el = document.querySelector('#toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3200);
}

function dialog(title, text) {
  document.querySelector('#dialogTitle').textContent = title;
  document.querySelector('#dialogText').textContent = text;
  document.querySelector('#dialog').classList.remove('hidden');
}

function firstErrorStep(errors) {
  const groups = getFieldGroupsForType(registrationType);
  for (let i = 0; i < groups.length; i += 1) {
    if (groups[i].fields.some(field => errors[field.key])) return i;
  }
  return 0;
}

function startFill() {
  readForm();
  const validation = validateDossier(data, registrationType);
  if (!validation.isValid) {
    const targetStep = firstErrorStep(validation.errors);
    currentStep = targetStep;
    renderWizard();
    displayErrors(validation.errors);
    const first = form.querySelector('.field.invalid input, .field.invalid select');
    first?.focus();
    toast('Còn thông tin bắt buộc. Phần mềm đã đưa bạn về đúng nhóm cần bổ sung.');
    return;
  }
  if (!extensionReady) {
    dialog('Chưa phát hiện tiện ích TRƯỜNG GPP', 'Hãy cài hoặc bật tiện ích TRƯỜNG GPP trên trình duyệt rồi tải lại trang. Bản nháp của bạn vẫn được lưu trên máy.');
    return;
  }
  const payload = createFillPayload(data, registrationType);
  window.postMessage(payload, messageTargetOrigin());
  toast('Đã chuyển hồ sơ cho tiện ích. Đang mở trang CSDL Dược…');
}


loadDraft();
renderProfileSelect();
renderWizard();

form.addEventListener('input', saveDraft);
form.addEventListener('change', saveDraft);

profileSelect.addEventListener('change', () => {
  readForm();
  registrationType = profileSelect.value;
  pruneDataForType();
  currentStep = 0;
  saveDraft();
  renderWizard();
  toast(`Đã chuyển sang ${getRegistrationType(registrationType).label}.`);
});

nextStepBtn.addEventListener('click', () => {
  if (!validateCurrentGroup()) return;
  goToStep(currentStep + 1);
});

prevStepBtn.addEventListener('click', () => {
  if (currentStep === 0) return;
  goToStep(currentStep - 1);
});

reviewList.addEventListener('click', event => {
  const button = event.target.closest('[data-edit-field]');
  if (!button) return;
  goToField(button.dataset.editField);
});

document.querySelector('#startFillBtn').addEventListener('click', startFill);
document.querySelector('#dialogClose').addEventListener('click', () => document.querySelector('#dialog').classList.add('hidden'));
window.addEventListener('message', event => {
  if (event.source !== window || event.origin !== window.location.origin) return;
  if (event.data?.type === 'TRUONG_GPP_EXTENSION_READY') {
    extensionReady = true;
    extensionStatus.className = 'status-pill status-ok';
    extensionStatus.textContent = '✓ Tiện ích đã sẵn sàng';
  }
  if (event.data?.type === 'TRUONG_GPP_EXTENSION_ERROR') {
    dialog('Tiện ích cần xử lý', event.data.message || 'Không thể bắt đầu điền.');
  }
});

window.postMessage({type:'TRUONG_GPP_PING'}, messageTargetOrigin());
setTimeout(() => {
  if (!extensionReady) {
    extensionStatus.className = 'status-pill status-warn';
    extensionStatus.textContent = 'Chưa phát hiện tiện ích';
  }
}, 1200);

})();
