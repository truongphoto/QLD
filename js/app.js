import {
  REGISTRATION_TYPES,
  getFieldsForType,
  getFieldGroupsForType,
  getRegistrationType
} from './schema.js';
import { validateDossier } from './validation.js';
import { STORAGE_KEY, createFillPayload } from './state.js';

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
const installExtensionBtn = document.querySelector('#installExtensionBtn');
const dialogCloseBtn = document.querySelector('#dialogClose');

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
  installExtensionBtn.classList.add('hidden');
  dialogCloseBtn.classList.remove('hidden');
  document.querySelector('#dialog').classList.remove('hidden');
}

function installExtensionDialog() {
  document.querySelector('#dialogTitle').textContent = 'Cài tiện ích TRƯỜNG GPP';
  document.querySelector('#dialogText').textContent = 'Tiện ích chỉ cần cài một lần để TRƯỜNG GPP tự điền thông tin vào CSDL Dược.';
  installExtensionBtn.classList.remove('hidden');
  dialogCloseBtn.classList.add('hidden');
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
    installExtensionDialog();
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
dialogCloseBtn.addEventListener('click', () => document.querySelector('#dialog').classList.add('hidden'));
installExtensionBtn.addEventListener('click', () => {
  toast('Đang tải tiện ích TRƯỜNG GPP…');
});
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
