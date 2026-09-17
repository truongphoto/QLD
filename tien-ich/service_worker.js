const PENDING_KEY = 'truong_gpp_pending_fill';
const TARGET_URL = 'https://csdlduoc.com.vn/auth/register';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === 'START_FILL') {
    handleStart(message.payload)
      .then(result => sendResponse({ok:true, ...result}))
      .catch(error => sendResponse({ok:false, error:error.message}));
    return true;
  }
  if (message?.type === 'GET_PENDING') {
    chrome.storage.local.get(PENDING_KEY)
      .then(stored => sendResponse({ok:true, payload:stored[PENDING_KEY] || null}))
      .catch(error => sendResponse({ok:false, error:error.message}));
    return true;
  }
  if (message?.type === 'CLEAR_PENDING') {
    chrome.storage.local.remove(PENDING_KEY)
      .then(() => sendResponse({ok:true}))
      .catch(error => sendResponse({ok:false, error:error.message}));
    return true;
  }
  return false;
});

async function handleStart(payload) {
  if (!payload || payload.schemaVersion !== 1 || !payload.runId || typeof payload.values !== 'object') {
    throw new Error('Hồ sơ chuyển sang tiện ích không hợp lệ.');
  }
  if (!['ban_le','ban_buon','chuoi_nha_thuoc'].includes(payload.registrationType)) {
    throw new Error('Loại hồ sơ chưa được hỗ trợ trong V1.');
  }
  if (payload.targetUrl !== TARGET_URL) {
    throw new Error('Địa chỉ trang CSDL Dược không đúng với cấu hình V1.');
  }

  await chrome.storage.local.set({[PENDING_KEY]: payload});

  const tabs = await chrome.tabs.query({url:'https://csdlduoc.com.vn/*'});
  const existing = tabs.find(tab => tab.url?.includes('/auth/register')) || tabs[0];
  if (existing?.id) {
    if (!existing.url?.includes('/auth/register')) {
      await chrome.tabs.update(existing.id, {url:TARGET_URL, active:true});
    } else {
      await chrome.tabs.update(existing.id, {active:true});
    }
    if (existing.windowId) await chrome.windows.update(existing.windowId, {focused:true});
    sendFillWithRetry(existing.id, payload).catch(() => {});
    return {tabId: existing.id};
  }

  const tab = await chrome.tabs.create({url:TARGET_URL, active:true});
  sendFillWithRetry(tab.id, payload).catch(() => {});
  return {tabId: tab.id};
}

async function sendFillWithRetry(tabId, payload) {
  for (let attempt = 0; attempt < 16; attempt += 1) {
    await delay(attempt === 0 ? 250 : 500);
    try {
      const response = await chrome.tabs.sendMessage(tabId, {
        type:'TRUONG_GPP_FILL_NOW',
        payload
      });
      if (response?.ok) return true;
    } catch {}
  }
  return false;
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
