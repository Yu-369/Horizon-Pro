// background.js — YouTube Pro Service Worker

// Relay storage changes to all YouTube tabs
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== 'sync') return;
  const settings = {};
  for (const [key, { newValue }] of Object.entries(changes)) {
    settings[key] = newValue;
  }
  chrome.tabs.query({ url: '*://www.youtube.com/*' }, (tabs) => {
    tabs.forEach(tab => {
      chrome.tabs.sendMessage(tab.id, { type: 'ytpro-settings-update', settings }).catch(() => {});
    });
  });
});
