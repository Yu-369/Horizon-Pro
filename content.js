// content.js — VisionTube Extension

// ─── Font Injection ───
function injectFonts() {
  if (!document.head) { requestAnimationFrame(injectFonts); return; }
  if (!document.querySelector('link[href*="Google+Sans"]')) {
    const pc1 = document.createElement('link');
    pc1.rel = 'preconnect'; pc1.href = 'https://fonts.googleapis.com';
    document.head.appendChild(pc1);
    const pc2 = document.createElement('link');
    pc2.rel = 'preconnect'; pc2.href = 'https://fonts.gstatic.com'; pc2.crossOrigin = 'anonymous';
    document.head.appendChild(pc2);
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
  }
}
injectFonts();

// ─── Blur Bar Nuke (runs once then via observer) ───
const NUKE_SELECTOR =
  'ytd-rich-grid-renderer > #header, ' +
  'ytd-rich-grid-renderer > #header.ytd-rich-grid-renderer, ' +
  '#chips-wrapper, iron-selector#chips, yt-chip-cloud-renderer, ' +
  'ytd-feed-filter-chip-bar-renderer, #masthead-ad, ' +
  'ytd-statement-banner-renderer, ytd-banner-promo-renderer, #frosted-glass';

const NUKE_STYLE = 'display:none!important;height:0!important;max-height:0!important;min-height:0!important;margin:0!important;padding:0!important;overflow:hidden!important;position:absolute!important;visibility:hidden!important;pointer-events:none!important;';

function nukeBlurBar() {
  document.querySelectorAll(NUKE_SELECTOR).forEach(el => { el.style.cssText = NUKE_STYLE; });
}
nukeBlurBar();

// ─── Search Bar Placeholder + Hide "You >" ───
function fixSearchAndGuide() {
  const searchInput = document.querySelector('input#search, input.ytSearchboxComponentInput');
  if (searchInput && searchInput.placeholder !== 'Search') {
    searchInput.placeholder = 'Search';
  }

  // Also nuke the inline search icon via JS for shadow DOM resistance
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

// ─── MutationObserver: single observer replaces multiple setIntervals ───
let observerDebounce = null;
const mainObserver = new MutationObserver(() => {
  if (observerDebounce) return;
  observerDebounce = setTimeout(() => {
    observerDebounce = null;
    nukeBlurBar();
    fixSearchAndGuide();
    if (window.location.pathname === '/' && !document.querySelector('.visiontube-carousel-wrapper')) {
      buildCarousel();
    }
  }, 300);
});

// Start observing after DOM is ready
function startObserving() {
  const target = document.querySelector('ytd-app') || document.body;
  if (target) {
    mainObserver.observe(target, { childList: true, subtree: true });
  } else {
    requestAnimationFrame(startObserving);
  }
}
startObserving();

// Also run on initial load and SPA navigation
fixSearchAndGuide();

document.addEventListener('yt-navigate-finish', () => {
  const existing = document.querySelector('.visiontube-carousel-wrapper');
  if (existing) existing.remove();
  document.querySelectorAll('.visiontube-hidden').forEach(v => {
    v.style.display = '';
    v.classList.remove('visiontube-hidden');
  });
  // Re-run fixups after navigation
  setTimeout(() => {
    nukeBlurBar();
    fixSearchAndGuide();
    if (window.location.pathname === '/') buildCarousel();
  }, 500);
});

// Single fallback interval at low frequency (replaces 3 separate intervals)
setInterval(() => {
  nukeBlurBar();
  fixSearchAndGuide();
  if (window.location.pathname === '/') {
    if (!document.querySelector('.visiontube-carousel-wrapper')) buildCarousel();
  } else {
    const existing = document.querySelector('.visiontube-carousel-wrapper');
    if (existing) existing.remove();
    document.querySelectorAll('.visiontube-hidden').forEach(v => {
      v.style.display = '';
      v.classList.remove('visiontube-hidden');
    });
  }
}, 2000);

// ─── Carousel Builder ───
function buildCarousel() {
  const feed = document.querySelector('ytd-rich-grid-renderer');
  if (!feed || document.querySelector('.visiontube-carousel-container')) return;

  const allVideos = Array.from(document.querySelectorAll('ytd-rich-item-renderer, yt-lockup-view-model'))
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
    vid.style.display = 'none';
    vid.classList.add('visiontube-hidden');
    document.querySelectorAll(`a[href*="${videoId}"]`).forEach(a => {
      const parent = a.closest('ytd-rich-item-renderer, yt-lockup-view-model');
      if (parent && parent !== vid) { parent.style.display = 'none'; parent.classList.add('visiontube-hidden'); }
    });
    return { title, img, channel, link, videoId, metaText, duration };
  });

  // ── Side videos (right column) ──
  const sideHTML = data.map(vid => {
    const channelName = vid.channel || 'Channel';
    const durationStr = vid.duration || '';
    return `
    <a href="${vid.link}" class="visiontube-side-video" style="
      text-decoration: none; background: var(--visiontube-card); border-radius: 12px; display: flex;
      border: 1px solid var(--visiontube-border); cursor: pointer; color: inherit;
      overflow: hidden; height: 60px; align-items: stretch; box-sizing: border-box;
      padding: 0; margin: 0;
    ">
      <div style="position:relative;flex-shrink:0;width:106px;height:100%;">
        <img class="visiontube-fallback-img" src="${vid.img}" data-vid="${vid.videoId}" style="
          width: 100%; height: 100%; object-fit: cover; display: block; border-radius: 0;
        " />
        ${durationStr ? `<span style="
          position: absolute; bottom: 4px; right: 4px; background: rgba(0,0,0,0.8);
          color: #fff; font-size: 10px; font-weight: 600; padding: 1px 5px;
          border-radius: 3px; line-height: 1.4; letter-spacing: 0.3px;
        ">${durationStr}</span>` : ''}
      </div>
      <div style="display:flex;flex-direction:column;justify-content:center;overflow:hidden;flex:1;padding:6px 10px;gap:2px;">
        <div style="font-size:11.5px;font-weight:500;color:var(--visiontube-text-primary);line-height:1.3;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${vid.title}</div>
        <div style="font-size:10.5px;color:var(--visiontube-text-secondary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex-shrink:0;">${channelName}</div>
      </div>
    </a>`;
  }).join('');

  // ── Flex-based Indicators (Always White) ──
  const makeIndicators = (count) => {
    let html = `<div class="vt-indicator-wrap" style="display:flex; gap:6px; align-items:center; padding: 4px 0;">`;
    for (let i = 0; i < count; i++) {
      html += `<div class="visiontube-dot" data-idx="${i}" style="
        height: 6px; border-radius: 3px;
        background: ${i === 0 ? '#fff' : 'rgba(255,255,255,0.4)'};
        width: ${i === 0 ? '22px' : '6px'};
        transition: width 0.4s cubic-bezier(0.25, 1, 0.5, 1), background 0.4s;
        box-shadow: 0 1px 3px rgba(0,0,0,0.3);
      "></div>`;
    }
    html += `</div>`;
    return html;
  };

  // ── Slides (with cloned first slide for infinite loop) ──
  const loopData = [...data, data[0]];
  const slidesHTML = loopData.map((vid, idx) => {
    const descText = vid.channel + (vid.metaText ? (' \u00b7 ' + vid.metaText) : '');
    return `
    <a href="${vid.link}" class="visiontube-slide" style="
      flex: 0 0 100%; width: 100%; display: flex; text-decoration: none;
      color: var(--visiontube-text-primary); overflow: hidden; box-sizing: border-box;
    ">
      <!-- Left: Content Panel (38%) -->
      <div style="
        flex: 0 0 38%; background: var(--visiontube-surface); padding: 32px 36px;
        display: flex; flex-direction: column; justify-content: center;
        box-sizing: border-box; border-radius: 16px 0 0 16px;
      ">
        <h2 style="
          font-family: 'Google Sans', sans-serif !important;
          font-optical-sizing: auto; font-weight: 700; font-style: normal;
          font-variation-settings: 'GRAD' 0; font-size: 22px; line-height: 1.3;
          margin: 0 0 10px 0; color: var(--visiontube-text-primary); letter-spacing: -0.3px;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        ">${vid.title}</h2>
        <p style="font-size: 13px; color: var(--visiontube-text-secondary); margin: 0; line-height: 1.5;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        ">${descText}</p>
        <div style="
          background: var(--visiontube-text-primary); color: var(--visiontube-bg); border-radius: 40px; padding: 10px 22px;
          font-family: 'Google Sans', sans-serif !important; font-weight: 600;
          font-size: 13px; display: inline-flex; align-items: center; gap: 8px;
          width: fit-content; margin-top: 20px; white-space: nowrap; flex-shrink: 0;
        ">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
          Play Video
        </div>
      </div>

      <!-- Right: 16:9 Thumbnail (62%) -->
      <div style="
        flex: 0 0 62%; position: relative; overflow: hidden; background: #111;
        border-radius: 0 16px 16px 0; display: flex; align-items: center; justify-content: center;
      ">
        <img class="visiontube-fallback-img" src="${vid.img}" data-vid="${vid.videoId}" style="
          width: 100%; aspect-ratio: 16/9; object-fit: cover; display: block;
        "/>
      </div>
    </a>`;
  }).join('');

  // ── Full carousel block ──
  const carouselHTML = `
    <div class="visiontube-carousel-container" style="
      display: flex; flex-direction: column; width: 100%;
      box-sizing: border-box; margin-bottom: 24px; padding-top: 24px;
    ">
      <h1 style="
        font-family: 'Google Sans', sans-serif !important;
        font-optical-sizing: auto; font-weight: 700; font-style: normal;
        font-variation-settings: 'GRAD' 0; font-size: 22px; color: var(--visiontube-text-primary);
        margin: 0 0 20px 12px; letter-spacing: -0.3px; padding: 0;
      ">Home</h1>
      
      <div style="display:flex;gap:16px;height:280px;width:100%;align-items:stretch;">
        <!-- Main slideshow -->
        <div style="flex:1;position:relative;overflow:hidden;min-width:0;border-radius:16px;">
          <div class="visiontube-carousel-track" style="
            display: flex; width: 100%; height: 100%;
            transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
            transform: translateX(0%); will-change: transform;
          ">
            ${slidesHTML}
          </div>
          <div style="position:absolute;bottom:14px;left:69%;transform:translateX(-50%);z-index:10;">
            ${makeIndicators(data.length)}
          </div>
        </div>

        <!-- Side video list -->
        <div style="flex:0 0 260px;display:flex;flex-direction:column;justify-content:space-between;gap:6px;">
          ${sideHTML}
        </div>
      </div>
      
      <div style="margin:32px 0 0 12px;">
        <h2 style="
          font-family: 'Google Sans', sans-serif !important;
          font-optical-sizing: auto; font-weight: 700; font-style: normal;
          font-variation-settings: 'GRAD' 0; font-size: 22px; color: var(--visiontube-text-primary);
          margin: 0; letter-spacing: -0.3px; padding: 0;
        ">For You</h2>
      </div>
    </div>
  `;

  const container = document.createElement('div');
  container.className = 'visiontube-carousel-wrapper';
  container.style.width = '100%';
  container.style.gridColumn = '1 / -1';

  // Support Trusted Types for modern YouTube
  if (window.trustedTypes && window.trustedTypes.createPolicy) {
    if (!window.visiontubePolicy) {
      try {
        window.visiontubePolicy = window.trustedTypes.createPolicy('visiontube-policy', { createHTML: s => s });
      } catch (e) {
        try { window.visiontubePolicy = window.trustedTypes.createPolicy('default', { createHTML: s => s }); }
        catch (e2) { }
      }
    }
    if (window.visiontubePolicy) {
      container.innerHTML = window.visiontubePolicy.createHTML(carouselHTML);
    } else {
      const temp = document.createElement('template');
      temp.innerHTML = carouselHTML;
      container.appendChild(temp.content);
    }
  } else {
    container.innerHTML = carouselHTML;
  }

  const contents = feed.querySelector('#contents');
  if (contents) { contents.insertAdjacentElement('afterbegin', container); }
  else { feed.prepend(container); }

  // ── CSP-Safe Thumbnail Fallback Logic ──
  container.querySelectorAll('img.visiontube-fallback-img').forEach(img => {
    const handleErr = function() {
      const vidId = img.getAttribute('data-vid');
      if (!vidId) return;
      if (img.src.includes('hq720.jpg')) {
        img.src = `https://i.ytimg.com/vi/${vidId}/maxresdefault.jpg`;
      } else if (img.src.includes('maxresdefault.jpg')) {
        img.src = `https://i.ytimg.com/vi/${vidId}/hqdefault.jpg`;
      }
    };
    img.addEventListener('error', handleErr);
    img.addEventListener('load', function() {
      if (this.naturalWidth > 0 && this.naturalWidth <= 120) handleErr();
    });
    if (img.complete) {
      if (img.naturalWidth === 0 || img.naturalWidth <= 120) handleErr();
    }
  });

  // ── Slideshow + Infinite Loop Logic ──
  let currentSlide = 0;
  let isTransitioning = false;
  const track = container.querySelector('.visiontube-carousel-track');
  const dots = container.querySelectorAll('.visiontube-dot');

  if (window.visiontubeSlideshowInterval) clearInterval(window.visiontubeSlideshowInterval);

  function goToSlide(nextIdx) {
    if (isTransitioning) return;
    currentSlide = nextIdx;

    if (track) {
      track.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
      track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    const indicatorIdx = currentSlide % data.length;
    dots.forEach((dot, idx) => {
      if (idx === indicatorIdx) {
        dot.style.width = '22px';
        dot.style.background = '#fff';
      } else {
        dot.style.width = '6px';
        dot.style.background = 'rgba(255,255,255,0.4)';
      }
    });

    // Infinite loop jump
    if (currentSlide === data.length) {
      isTransitioning = true;
      setTimeout(() => {
        if (track) {
          track.style.transition = 'none';
          currentSlide = 0;
          track.style.transform = `translateX(0%)`;
          track.offsetHeight; // force reflow
        }
        isTransitioning = false;
      }, 600); // Wait for transition to finish
    }
  }

  window.visiontubeSlideshowInterval = setInterval(() => {
    if (!document.contains(container)) {
      clearInterval(window.visiontubeSlideshowInterval);
      return;
    }
    goToSlide(currentSlide + 1);
  }, 5500);
}
