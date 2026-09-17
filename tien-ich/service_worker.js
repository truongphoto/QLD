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
    chrome.storage.session.get(PENDING_KEY)
      .then(stored => sendResponse({ok:true, payload:stored[PENDING_KEY] || null}))
      .catch(error => sendResponse({ok:false, error:error.message}));
    return true;
  }
  if (message?.type === 'CLEAR_PENDING') {
    chrome.storage.session.remove(PENDING_KEY)
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

  await chrome.storage.session.set({[PENDING_KEY]: payload});

  const tabs = await chrome.tabs.query({url:'https://csdlduoc.com.vn/*'});
  const existing = tabs.find(tab => tab.url?.includes('/auth/register')) || tabs[0];
  if (existing?.id) {
    await chrome.tabs.update(existing.id, {active:true});
    if (!existing.url?.includes('/auth/register')) {
      await chrome.tabs.update(existing.id, {url:TARGET_URL});
    } else {
      chrome.tabs.sendMessage(existing.id, {type:'TRUONG_GPP_PENDING_CHANGED'}).catch(() => {});
    }
    if (existing.windowId) await chrome.windows.update(existing.windowId, {focused:true});
    return {tabId: existing.id};
  }

  const tab = await chrome.tabs.create({url:TARGET_URL, active:true});
  return {tabId: tab.id};
}
