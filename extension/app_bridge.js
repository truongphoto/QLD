(() => {
  const allowedTypes = new Set(['TRUONG_GPP_START_FILL']);

  function messageTargetOrigin() {
    return window.location.protocol === 'file:' ? '*' : window.location.origin;
  }

  function announceReady() {
    window.postMessage({type:'TRUONG_GPP_EXTENSION_READY'}, messageTargetOrigin());
  }

  window.addEventListener('message', event => {
    if (event.source !== window || event.origin !== window.location.origin) return;
    const message = event.data;
    if (message?.type === 'TRUONG_GPP_PING') {
      announceReady();
      return;
    }
    if (!allowedTypes.has(message?.type)) return;

    chrome.runtime.sendMessage({type:'START_FILL', payload:message}, response => {
      if (chrome.runtime.lastError) {
        window.postMessage({
          type:'TRUONG_GPP_EXTENSION_ERROR',
          message:'Không thể kết nối với tiện ích TRƯỜNG GPP. Hãy tải lại trang và thử lại.'
        }, messageTargetOrigin());
        return;
      }
      if (!response?.ok) {
        window.postMessage({
          type:'TRUONG_GPP_EXTENSION_ERROR',
          message:response?.error || 'Không thể mở trang CSDL Dược.'
        }, messageTargetOrigin());
      }
    });
  });

  announceReady();
})();
