


const SETTING_CLASS_MAP = {
  hideRecommended: 'ytpro-hide-recommended',
  hideLiveChat: 'ytpro-hide-livechat',
  hidePlaylist: 'ytpro-hide-playlist',
  hideShorts: 'ytpro-hide-shorts',
  hideEndScreen: 'ytpro-hide-endscreen',
  hideEndCards: 'ytpro-hide-endcards',
  hideComments: 'ytpro-hide-comments',
  hideMixRadio: 'ytpro-hide-mix',
  hideMerch: 'ytpro-hide-merch',
  hideVideoButtons: 'ytpro-hide-video-buttons',
  hideChannel: 'ytpro-hide-channel',
  hideDescription: 'ytpro-hide-description',
  hideTopHeader: 'ytpro-hide-top-header',
  hideNotifBell: 'ytpro-hide-notif-bell',
  hideMoreYT: 'ytpro-hide-more-yt',
  hidePlayables: 'ytpro-hide-playables',
  hideIrrelevantSearch: 'ytpro-hide-irrelevant-search',
  hideSectionShelves: 'ytpro-hide-section-shelves',
  disableAnnotations: 'ytpro-disable-annotations',
  useDefaultFont: 'ytpro-default-font'
};

const DEFAULTS = {
  enableCarousel: true, gridColumns: 4,
  hideRecommended: false, hideLiveChat: false, hidePlaylist: false,
  hideShorts: true, hideEndScreen: false, hideEndCards: false,
  hideComments: false, hideMixRadio: true, hideMerch: true,
  hideVideoButtons: false, hideChannel: false, hideDescription: false,
  hideTopHeader: false, hideNotifBell: false,
  hideMoreYT: false, hidePlayables: false, hideIrrelevantSearch: true, hideSectionShelves: true,
  disableAutoplay: true, disableAnnotations: true,
  useDefaultFont: false, videoQuality: 'auto'
};

let currentSettings = { ...DEFAULTS };


function applySettings(settings) {
  Object.assign(currentSettings, settings);
  for (const [key, cls] of Object.entries(SETTING_CLASS_MAP)) {
    document.body.classList.toggle(cls, !!currentSettings[key]);
  }
  
  disableAutoplay();
  forceVideoQuality();
  
  [3, 4, 5, 6].forEach(n => document.body.classList.remove('ytpro-grid-' + n));
  const cols = currentSettings.gridColumns || 4;
  if (cols !== 4) document.body.classList.add('ytpro-grid-' + cols);
  
  document.body.classList.toggle('ytpro-carousel-active', !!currentSettings.enableCarousel);
  
  const wrapper = document.querySelector('.visiontube-carousel-wrapper');
  if (!currentSettings.enableCarousel && wrapper) wrapper.remove();
  const isEligible = window.location.pathname === '/' || window.location.pathname === '/feed/subscriptions';
  if (currentSettings.enableCarousel && isEligible && !document.querySelector('.visiontube-carousel-wrapper')) {
    buildCarousel();
  }
}


function initSettings() {
  if (chrome?.storage?.sync) {
    chrome.storage.sync.get(DEFAULTS, (s) => applySettings(s));
  }
}


if (chrome?.runtime?.onMessage) {
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === 'ytpro-settings-update' && msg.settings) {
      applySettings(msg.settings);
    }
  });
}


function injectFonts() {
  if (!document.head) { requestAnimationFrame(injectFonts); return; }
  if (!document.querySelector('link[href*="Google+Sans"]')) {
    const pc1 = document.createElement('link');
    pc1.rel = 'preconnect'; pc1.href = 'https://fonts.googleapis.com';
    document.head.appendChild(pc1);
    const pc2 = document.createElement('link');
    pc2.rel = 'preconnect'; pc2.href = 'https://fonts.gstatic.com';
    document.head.appendChild(pc2);
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;600;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
  }
}
injectFonts();

const NUKE_SELECTOR =
  'ytd-browse[page-subtype="home"] ytd-rich-grid-renderer > #header, ' +
  'ytd-browse[page-subtype="home"] ytd-rich-grid-renderer > #header.ytd-rich-grid-renderer, ' +
  'ytd-browse[page-subtype="home"] #chips-wrapper, ' +
  'ytd-browse[page-subtype="home"] iron-selector#chips, ' +
  'ytd-browse[page-subtype="home"] yt-chip-cloud-renderer, ' +
  'ytd-browse[page-subtype="home"] ytd-feed-filter-chip-bar-renderer, ' +
  '#masthead-ad, ytd-statement-banner-renderer, ytd-banner-promo-renderer, #frosted-glass';
const NUKE_STYLE = 'display:none!important;height:0!important;max-height:0!important;min-height:0!important;margin:0!important;padding:0!important;overflow:hidden!important;position:absolute!important;visibility:hidden!important;pointer-events:none!important;';

function nukeBlurBar() {
  document.querySelectorAll(NUKE_SELECTOR).forEach(el => { el.style.cssText = NUKE_STYLE; });
}
nukeBlurBar();



const AD_OVERLAY_SELECTOR =
  'ytd-brand-video-singleton-renderer, ytd-promoted-sparkles-web-renderer, ' +
  'ytd-display-ad-renderer, ytd-in-feed-ad-layout-renderer, ' +
  'ytd-ad-slot-renderer, ytd-primetime-promo-renderer';

function fixCarouselAdOverlap() {
  const carousel = document.querySelector('.visiontube-carousel-wrapper');
  if (!carousel) return;
  
  document.querySelectorAll(AD_OVERLAY_SELECTOR).forEach(ad => {
    ad.style.position = 'relative';
    ad.style.zIndex = '0';
  });
  
  document.querySelectorAll('ytd-rich-section-renderer').forEach(section => {
    if (section.querySelector(AD_OVERLAY_SELECTOR)) {
      section.style.position = 'relative';
      section.style.zIndex = '0';
    }
  });
}


function fixSearchAndGuide() {
  const searchInput = document.querySelector('input#search, input.ytSearchboxComponentInput');
  if (searchInput && searchInput.placeholder !== 'Search') searchInput.placeholder = 'Search';
  document.querySelectorAll('.ytSearchboxComponentSearchIcon, yt-searchbox yt-icon.ytSearchboxComponentSearchIcon').forEach(el => {
    el.style.cssText = 'display:none!important;width:0!important;height:0!important;overflow:hidden!important;position:absolute!important;pointer-events:none!important;';
  });
  document.querySelectorAll('ytd-guide-entry-renderer, ytd-guide-collapsible-entry-point-renderer').forEach(el => {
    const text = el.textContent.trim();
    if (text === 'You' || text.startsWith('You\n') || text === 'You >' || (text.includes('You\n') && el.querySelector('a[href="/feed/you"]'))) {
      el.style.display = 'none';
    }
  });
}


function disableAutoplay() {
  const btn = document.querySelector('.ytp-autonav-toggle-button, button[data-tooltip-target-id="ytp-autonav-toggle-button"], button[aria-label^="Autoplay"]');
  if (!btn) return;
  
  const ariaChecked = btn.getAttribute('aria-checked');
  const ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase();
  const title = (btn.getAttribute('title') || '').toLowerCase();
  
  const isChecked = ariaChecked === 'true' || ariaLabel.includes('is on') || title.includes('is on');
  
  
  if (currentSettings.disableAutoplay && isChecked && !btn.dataset.ytproAutoplayHandled) {
    btn.dataset.ytproAutoplayHandled = 'true';
    btn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    btn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    btn.click();
  } 
  
  else if (!currentSettings.disableAutoplay && !isChecked && !btn.dataset.ytproAutoplayHandled) {
    btn.dataset.ytproAutoplayHandled = 'true';
    btn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    btn.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    btn.click();
  }
}


const QUALITY_MAP = {
  '2160': 'hd2160', '1440': 'hd1440', '1080': 'hd1080',
  '720': 'hd720', '480': 'large', '360': 'medium', '240': 'small', '144': 'tiny'
};

function injectQualityScript() {
  if (document.getElementById('ytpro-quality-script')) return;
  const script = document.createElement('script');
  script.id = 'ytpro-quality-script';
  script.src = chrome.runtime.getURL('inject-quality.js');
  (document.head || document.documentElement).appendChild(script);
}

function forceVideoQuality() {
  injectQualityScript();
  if (currentSettings.videoQuality !== 'auto') {
    const mapped = QUALITY_MAP[currentSettings.videoQuality];
    if (mapped) {
      document.body.dataset.ytproQuality = mapped;
      window.dispatchEvent(new CustomEvent('ytpro-force-quality'));
    }
  } else {
    document.body.dataset.ytproQuality = 'auto';
  }
}

function attachQualityListener() {
  
  forceVideoQuality();
}


function tagIrrelevantSearchResults() {
  if (!window.location.pathname.startsWith('/results')) return;
  const labels = ['related to your search', 'latest from', 'searches related to', 'people also search for', 'people also watched', 'for you', 'previously watched'];
  document.querySelectorAll('ytd-shelf-renderer:not(.ytpro-irrelevant-search), ytd-horizontal-card-list-renderer:not(.ytpro-irrelevant-search), ytd-reel-shelf-renderer:not(.ytpro-irrelevant-search)').forEach(el => {
    const title = (el.querySelector('#title, .title, h2, #title-text')?.textContent || '').toLowerCase().trim();
    if (labels.some(l => title.includes(l))) {
      el.classList.add('ytpro-irrelevant-search');
      const parent = el.closest('ytd-item-section-renderer');
      if (parent) parent.classList.add('ytpro-irrelevant-search');
    }
  });
}


function tagMixItems() {
  document.querySelectorAll('ytd-rich-item-renderer:not(.ytpro-mix-item), ytd-compact-video-renderer:not(.ytpro-mix-item), ytd-video-renderer:not(.ytpro-mix-item), yt-lockup-view-model:not(.ytpro-mix-item), .yt-lockup-view-model-wiz:not(.ytpro-mix-item), ytd-grid-video-renderer:not(.ytpro-mix-item)').forEach(el => {
    const links = Array.from(el.querySelectorAll('a'));
    const isMix = links.some(a => a.href && (a.href.includes('&start_radio=1') || a.href.includes('&list=RD')));
    const title = el.querySelector('#video-title, .yt-core-attributed-string[role="heading"]')?.textContent?.trim() || '';
    if (isMix || title === 'Mix' || title === 'My Mix' || title.startsWith('Mix -')) {
      el.classList.add('ytpro-mix-item');
    }
  });
}


function tagPlayablesShelf() {
  document.querySelectorAll('ytd-rich-section-renderer:not(.ytpro-playables-shelf)').forEach(el => {
    const title = el.querySelector('#title, .title, span, yt-formatted-string, .yt-core-attributed-string')?.textContent?.trim() || '';
    if (title.includes('Playables')) {
      el.classList.add('ytpro-playables-shelf');
    }
  });
}


let observerDebounce = null;
const mainObserver = new MutationObserver(() => {
  if (observerDebounce) return;
  observerDebounce = setTimeout(() => {
    observerDebounce = null;
    nukeBlurBar();
    fixSearchAndGuide();
    fixCarouselAdOverlap();
    tagIrrelevantSearchResults();
    tagMixItems();
    tagPlayablesShelf();
    disableAutoplay();
    attachQualityListener();
    forceVideoQuality();
    const isEligiblePage = window.location.pathname === '/' || window.location.pathname === '/feed/subscriptions';
    if (currentSettings.enableCarousel && isEligiblePage && !document.querySelector('.visiontube-carousel-wrapper')) {
      buildCarousel();
    }
  }, 300);
});

function startObserving() {
  const target = document.querySelector('ytd-app') || document.body;
  if (target) mainObserver.observe(target, { childList: true, subtree: true });
  else requestAnimationFrame(startObserving);
}
startObserving();

fixSearchAndGuide();
initSettings();


chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'ytpro-settings-update') {
    Object.assign(currentSettings, msg.settings);
    
    if (msg.settings.hasOwnProperty('disableAutoplay')) {
      const btn = document.querySelector('.ytp-autonav-toggle-button, button[data-tooltip-target-id="ytp-autonav-toggle-button"], button[aria-label^="Autoplay"]');
      if (btn) delete btn.dataset.ytproAutoplayHandled;
    }
    applySettings(currentSettings);
  }
});

document.addEventListener('yt-navigate-finish', () => {
  const btn = document.querySelector('.ytp-autonav-toggle-button, button[data-tooltip-target-id="ytp-autonav-toggle-button"], button[aria-label^="Autoplay"]');
  if (btn) delete btn.dataset.ytproAutoplayHandled;

  
  const existing = document.querySelector('.visiontube-carousel-wrapper');
  if (existing) existing.remove();
  document.querySelectorAll('.visiontube-hidden').forEach(v => {
    v.style.display = ''; v.classList.remove('visiontube-hidden');
  });
  if (window.visiontubeSlideshowInterval) clearInterval(window.visiontubeSlideshowInterval);

  setTimeout(() => {
    nukeBlurBar();
    fixSearchAndGuide();
    applySettings(currentSettings);
    attachQualityListener();
    forceVideoQuality();
  }, 300);

  
  const isEligible = window.location.pathname === '/' || window.location.pathname === '/feed/subscriptions';
  if (currentSettings.enableCarousel && isEligible) {
    let attempts = 0;
    const poller = setInterval(() => {
      attempts++;
      const isSubscriptions = window.location.pathname === '/feed/subscriptions';
      const pageSubtype = isSubscriptions ? 'subscriptions' : 'home';
      const browse = Array.from(document.querySelectorAll(`ytd-browse[page-subtype="${pageSubtype}"]`))
                          .find(el => !el.hasAttribute('hidden') && getComputedStyle(el).display !== 'none');
      
      if (document.querySelector('.visiontube-carousel-wrapper')) { clearInterval(poller); return; }
      
      const hasVideos = browse ? browse.querySelectorAll('ytd-rich-item-renderer, yt-lockup-view-model').length >= 4 : false;
      if (hasVideos) {
        buildCarousel();
        clearInterval(poller);
      }
      if (attempts >= 15) clearInterval(poller); 
    }, 500);
  }
});

setInterval(() => {
  nukeBlurBar();
  fixSearchAndGuide();
  fixCarouselAdOverlap();
  tagIrrelevantSearchResults();
  tagMixItems();
  tagPlayablesShelf();
  disableAutoplay();

  const isEligiblePage = window.location.pathname === '/' || window.location.pathname === '/feed/subscriptions';
  
  if (currentSettings.enableCarousel && isEligiblePage) {
    if (!document.querySelector('.visiontube-carousel-wrapper')) buildCarousel();
  } else if (!currentSettings.enableCarousel || !isEligiblePage) {
    const existing = document.querySelector('.visiontube-carousel-wrapper');
    if (existing && !currentSettings.enableCarousel) existing.remove();
    if (!isEligiblePage) {
      const ex2 = document.querySelector('.visiontube-carousel-wrapper');
      if (ex2) ex2.remove();
      document.querySelectorAll('.visiontube-hidden').forEach(v => {
        v.style.display = ''; v.classList.remove('visiontube-hidden');
      });
    }
  }
}, 2000);


function buildCarousel() {
  if (!currentSettings.enableCarousel) return;
  const isSubscriptions = window.location.pathname === '/feed/subscriptions';
  const pageSubtype = isSubscriptions ? 'subscriptions' : 'home';
  const browse = Array.from(document.querySelectorAll(`ytd-browse[page-subtype="${pageSubtype}"]`))
                      .find(el => !el.hasAttribute('hidden') && getComputedStyle(el).display !== 'none');
  if (!browse) return;
  
  const firstVideo = browse.querySelector('ytd-rich-item-renderer, yt-lockup-view-model');
  const feed = firstVideo ? firstVideo.closest('ytd-rich-grid-renderer, ytd-section-list-renderer, #contents, #primary, ytd-two-column-browse-results-renderer') : null;
  if (!feed || browse.querySelector('.visiontube-carousel-container')) return;

  const allVideos = Array.from(browse.querySelectorAll('ytd-rich-item-renderer, yt-lockup-view-model'))
    .filter(el => {
      if (el.closest('ytd-rich-section-renderer') || el.closest('.visiontube-carousel-container')) return false;
      if (el.querySelector('ytd-ad-slot-renderer, [aria-label*="Ad"], [aria-label*="Sponsored"], feed-ad-metadata-view-model, ad-badge-view-model, .yt-spec-badge-shape__badge')) return false;
      if ((el.textContent || '').includes('Sponsored')) return false;
      const titleText = el.querySelector('#video-title, .yt-core-attributed-string[role="heading"]')?.textContent?.trim() || '';
      if (titleText === 'Mix' || titleText === 'My Mix' || titleText.startsWith('Mix -')) return false;
      return true;
    });

  const validVideos = allVideos.filter(vid => {
    const links = Array.from(vid.querySelectorAll('a'));
    return links.some(a => a.href && (a.href.includes('/watch') || a.href.includes('/shorts')));
  });

  const extractedData = validVideos.map(vid => {
    const titleEl = vid.querySelector('#video-title, .yt-core-attributed-string[role="heading"], yt-formatted-string.title, h3');
    const title = titleEl?.textContent?.trim() || '';
    const links = Array.from(vid.querySelectorAll('a'));
    const watchLink = links.find(a => a.href && (a.href.includes('/watch') || a.href.includes('/shorts')));
    const linkHref = watchLink ? watchLink.href : '';
    const vidIdMatch = linkHref.match(/[?&]v=([^&]+)/) || linkHref.match(/\/shorts\/([^?&]+)/) || linkHref.match(/youtu\.be\/([^?&]+)/);
    const videoId = vidIdMatch ? vidIdMatch[1] : '';
    const metaEls = Array.from(vid.querySelectorAll('.inline-metadata-item, #metadata-line span, .yt-core-attributed-string'));
    const views = metaEls.find(el => el.textContent.includes('views') || el.textContent.includes('watching'))?.textContent?.trim() || '';
    const time = metaEls.find(el => el.textContent.includes('ago'))?.textContent?.trim() || '';
    const metaText = [views, time].filter(Boolean).join(' \u00b7 ');
    const channelEl = vid.querySelector('yt-content-metadata-view-model .ytContentMetadataViewModelMetadataRow a, ytd-channel-name yt-formatted-string, ytd-video-meta-block #channel-name, .yt-core-attributed-string--link-inherit-color');
    const channel = channelEl?.textContent?.trim() || '';
    const durationEl = vid.querySelector('yt-thumbnail-badge-view-model badge-shape, ytd-thumbnail-overlay-time-status-renderer, span.ytd-thumbnail-overlay-time-status-renderer');
    const durationText = durationEl?.textContent?.trim() || '';
    const duration = durationText.replace(/\s+/g, '').replace(/[^0-9:]/g, '');
    return { vid, title, linkHref, videoId, metaText, channel, duration };
  }).filter(item => item.title && item.videoId);

  const uniqueVideos = [];
  const seenIds = new Set();
  for (const item of extractedData) {
    if (!seenIds.has(item.videoId)) { seenIds.add(item.videoId); uniqueVideos.push(item); }
  }
  if (uniqueVideos.length < 4) return;

  const data = uniqueVideos.slice(0, 4).map(item => {
    const { vid, title, linkHref, videoId, metaText, channel, duration } = item;
    const img = `https://i.ytimg.com/vi/${videoId}/hq720.jpg`;
    const link = linkHref || '#';
    vid.style.display = 'none'; vid.classList.add('visiontube-hidden');
    browse.querySelectorAll(`a[href*="${videoId}"]`).forEach(a => {
      const parent = a.closest('ytd-rich-item-renderer, yt-lockup-view-model');
      if (parent && parent !== vid) { parent.style.display = 'none'; parent.classList.add('visiontube-hidden'); }
    });
    return { title, img, channel, link, videoId, metaText, duration };
  });

  const sideHTML = data.map(vid => {
    return `<a href="${vid.link}" class="visiontube-side-video" style="text-decoration:none;background:var(--visiontube-card);border-radius:12px;display:flex;border:1px solid var(--visiontube-border);cursor:pointer;color:inherit;overflow:hidden;height:60px;align-items:stretch;box-sizing:border-box;padding:0;margin:0;">
      <div style="position:relative;flex-shrink:0;width:106px;height:100%;">
        <img class="visiontube-fallback-img" src="${vid.img}" data-vid="${vid.videoId}" style="width:100%;height:100%;object-fit:cover;display:block;border-radius:0;"/>
        ${vid.duration ? `<span style="position:absolute;bottom:4px;right:4px;background:rgba(0,0,0,0.8);color:#fff;font-size:10px;font-weight:600;padding:1px 5px;border-radius:3px;line-height:1.4;letter-spacing:0.3px;">${vid.duration}</span>` : ''}
      </div>
      <div style="display:flex;flex-direction:column;justify-content:center;overflow:hidden;flex:1;padding:6px 10px;gap:2px;">
        <div style="font-size:11.5px;font-weight:500;color:var(--visiontube-text-primary);line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${vid.title}</div>
        <div style="font-size:10.5px;color:var(--visiontube-text-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex-shrink:0;">${vid.channel || 'Channel'}</div>
      </div>
    </a>`;
  }).join('');

  const makeIndicators = (count) => {
    let html = '<div class="vt-indicator-wrap" style="display:flex;gap:6px;align-items:center;padding:4px 0;">';
    for (let i = 0; i < count; i++) {
      html += `<div class="visiontube-dot" data-idx="${i}" style="height:6px;border-radius:3px;background:${i === 0 ? '#fff' : 'rgba(255,255,255,0.4)'};width:${i === 0 ? '22px' : '6px'};transition:width 0.4s cubic-bezier(0.25,1,0.5,1),background 0.4s;box-shadow:0 1px 3px rgba(0,0,0,0.3);"></div>`;
    }
    return html + '</div>';
  };

  const loopData = [...data, data[0]];
  const slidesHTML = loopData.map(vid => {
    const descText = vid.channel + (vid.metaText ? (' \u00b7 ' + vid.metaText) : '');
    return `<a href="${vid.link}" class="visiontube-slide" style="flex:0 0 100%;width:100%;display:flex;text-decoration:none;color:var(--visiontube-text-primary);overflow:hidden;box-sizing:border-box;">
      <div style="flex:0 0 38%;background:var(--visiontube-surface);padding:32px 36px;display:flex;flex-direction:column;justify-content:center;box-sizing:border-box;border-radius:16px 0 0 16px;">
        <h2 style="font-optical-sizing:auto;font-weight:700;font-style:normal;font-variation-settings:'GRAD' 0;font-size:22px;line-height:1.3;margin:0 0 10px 0;color:var(--visiontube-text-primary);letter-spacing:-0.3px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${vid.title}</h2>
        <p style="font-size:13px;color:var(--visiontube-text-secondary);margin:0;line-height:1.5;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${descText}</p>
        <div style="background:var(--visiontube-text-primary);color:var(--visiontube-bg);border-radius:40px;padding:10px 22px;font-weight:600;font-size:13px;display:inline-flex;align-items:center;gap:8px;width:fit-content;margin-top:20px;white-space:nowrap;flex-shrink:0;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
          Play Video
        </div>
      </div>
      <div class="visiontube-slide-media" style="flex:0 0 62%;position:relative;overflow:hidden;background:#111;border-radius:0 16px 16px 0;display:flex;align-items:center;justify-content:center;">
        <img class="visiontube-fallback-img" src="${vid.img}" data-vid="${vid.videoId}" style="width:100%;aspect-ratio:16/9;object-fit:cover;display:block;"/>
      </div>
    </a>`;
  }).join('');
  
  const pageTitle = isSubscriptions ? 'Featured' : 'Home';
  const bottomHeadingHTML = isSubscriptions ? '' : `<div style="margin:32px 0 24px 0;">
      <h2 style="font-optical-sizing:auto;font-weight:700;font-style:normal;font-variation-settings:'GRAD' 0;font-size:22px;color:var(--visiontube-text-primary);margin:0;letter-spacing:-0.3px;padding:0;">For You</h2>
    </div>`;

  const carouselHTML = `<div class="visiontube-carousel-container" style="display:flex;flex-direction:column;width:100%;box-sizing:border-box;margin-bottom:0px;padding-top:24px;">
    <h1 style="font-optical-sizing:auto;font-weight:700;font-style:normal;font-variation-settings:'GRAD' 0;font-size:22px;color:var(--visiontube-text-primary);margin:0 0 24px 0;letter-spacing:-0.3px;padding:0;">${pageTitle}</h1>
    <div style="display:flex;gap:16px;height:280px;width:100%;align-items:stretch;">
      <div style="flex:1;position:relative;overflow:hidden;min-width:0;border-radius:16px;">
        <div class="visiontube-carousel-track" style="display:flex;width:100%;height:100%;transition:transform 0.6s cubic-bezier(0.25,1,0.5,1);transform:translateX(0%);will-change:transform;">${slidesHTML}</div>
        <div style="position:absolute;bottom:14px;left:69%;transform:translateX(-50%);z-index:10;">${makeIndicators(data.length)}</div>
      </div>
      <div style="flex:0 0 260px;display:flex;flex-direction:column;justify-content:space-between;gap:6px;">${sideHTML}</div>
    </div>
    ${bottomHeadingHTML}
  </div>`;

  const container = document.createElement('div');
  container.className = 'visiontube-carousel-wrapper';
  container.style.width = 'calc(100% - var(--ytd-rich-grid-item-margin, 16px))';
  container.style.margin = '0 calc(var(--ytd-rich-grid-item-margin, 16px) / 2)';
  container.style.gridColumn = '1 / -1';

  const parser = new DOMParser();
  const parsed = parser.parseFromString(carouselHTML, 'text/html');
  while (parsed.body.firstChild) container.appendChild(document.adoptNode(parsed.body.firstChild));

  
  feed.prepend(container);

  
  container.querySelectorAll('img.visiontube-fallback-img').forEach(img => {
    const handleErr = function () {
      const vidId = img.getAttribute('data-vid');
      if (!vidId) return;
      if (img.src.includes('hq720.jpg')) img.src = `https://i.ytimg.com/vi/${vidId}/maxresdefault.jpg`;
      else if (img.src.includes('maxresdefault.jpg')) img.src = `https://i.ytimg.com/vi/${vidId}/hqdefault.jpg`;
    };
    img.addEventListener('error', handleErr);
    img.addEventListener('load', function () { if (this.naturalWidth > 0 && this.naturalWidth <= 120) handleErr(); });
    if (img.complete && (img.naturalWidth === 0 || img.naturalWidth <= 120)) handleErr();
  });



  
  let currentSlide = 0, isTransitioning = false, isHovered = false;
  const track = container.querySelector('.visiontube-carousel-track');
  const dots = container.querySelectorAll('.visiontube-dot');
  if (window.visiontubeSlideshowInterval) clearInterval(window.visiontubeSlideshowInterval);
  
  container.addEventListener('mouseenter', () => isHovered = true);
  container.addEventListener('mouseleave', () => isHovered = false);

  function goToSlide(nextIdx) {
    if (isTransitioning) return;
    currentSlide = nextIdx;
    if (track) { track.style.transition = 'transform 0.6s cubic-bezier(0.25,1,0.5,1)'; track.style.transform = `translateX(-${currentSlide * 100}%)`; }
    const indicatorIdx = currentSlide % data.length;
    dots.forEach((dot, idx) => {
      dot.style.width = idx === indicatorIdx ? '22px' : '6px';
      dot.style.background = idx === indicatorIdx ? '#fff' : 'rgba(255,255,255,0.4)';
    });
    if (currentSlide === data.length) {
      isTransitioning = true;
      setTimeout(() => { if (track) { track.style.transition = 'none'; currentSlide = 0; track.style.transform = 'translateX(0%)'; track.offsetHeight; } isTransitioning = false; }, 600);
    }
  }

  window.visiontubeSlideshowInterval = setInterval(() => {
    if (!document.contains(container)) { clearInterval(window.visiontubeSlideshowInterval); return; }
    if (!isHovered) goToSlide(currentSlide + 1);
  }, 4500);
}
