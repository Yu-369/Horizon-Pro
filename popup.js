

const SECTIONS = [
  {
    id: 'ytpro', label: 'Horizon Pro',
    icon: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    defaultOpen: true,
    toggles: [
      { key: 'enableCarousel', label: 'Refined carousel', desc: 'Cinematic carousel on the homepage', defaultVal: true },
      { key: 'useDefaultFont', label: 'Use default YouTube font', desc: 'Revert to Roboto instead of SF Pro' }
    ],
    slider: { key: 'gridColumns', label: 'Videos per row', desc: 'Adjust the grid density on home and subscriptions', min: 3, max: 6, defaultVal: 4 }
  },
  {
    id: 'sidebar', label: 'Video sidebar',
    icon: '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="15" y1="3" x2="15" y2="21"/>',
    toggles: [
      { key: 'hideRecommended', label: 'Hide recommended', desc: 'Related videos in the sidebar' },
      { key: 'hideLiveChat', label: 'Hide live chat', desc: 'Live chat panel on streams' },
      { key: 'hidePlaylist', label: 'Hide playlist', desc: 'Playlist panel in sidebar' }
    ]
  },
  {
    id: 'shorts', label: 'Shorts and end screens',
    icon: '<rect x="7" y="2" width="10" height="20" rx="3"/><line x1="12" y1="18" x2="12" y2="18"/>',
    toggles: [
      { key: 'hideShorts', label: 'Hide YouTube Shorts', desc: 'Shorts shelves and tabs everywhere', defaultVal: true },
      { key: 'hideEndScreen', label: 'Hide end screen videowall', desc: 'Grid of videos at end of playback' },
      { key: 'hideEndCards', label: 'Hide end screen cards', desc: 'Overlay cards during video playback' }
    ]
  },
  {
    id: 'social', label: 'Comments and social',
    icon: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    toggles: [
      { key: 'hideComments', label: 'Hide comments', desc: 'Comment section below videos' },
      { key: 'hideMixRadio', label: 'Hide mix and radio playlists', desc: 'Auto-generated mix playlists', defaultVal: true },
      { key: 'hideMerch', label: 'Hide merch, tickets, offers', desc: 'Promotional shelves below videos', defaultVal: true }
    ]
  },
  {
    id: 'videoinfo', label: 'Video info',
    icon: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
    toggles: [
      { key: 'hideVideoButtons', label: 'Hide video buttons bar', desc: 'Like, dislike, share, save buttons' },
      { key: 'hideChannel', label: 'Hide channel info', desc: 'Channel avatar and subscribe button' },
      { key: 'hideDescription', label: 'Hide video description', desc: 'Description box below the title' }
    ]
  },
  {
    id: 'header', label: 'Header and navigation',
    icon: '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/>',
    toggles: [
      { key: 'hideTopHeader', label: 'Hide top header', desc: 'Entire masthead bar at the top' },
      { key: 'hideNotifBell', label: 'Hide notification bell', desc: 'Bell icon in the top bar' },
      { key: 'hideMoreYT', label: 'Hide "More from YouTube"', desc: 'Extra links in sidebar footer' },
      { key: 'hidePlayables', label: 'Hide Playables', desc: 'Playables games shelf and sidebar link' },
      { key: 'hideSectionShelves', label: 'Hide section shelves', desc: '"Explore topics", news, and other promoted sections', defaultVal: true }
    ]
  },
  {
    id: 'search', label: 'Search',
    icon: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    toggles: [
      { key: 'hideIrrelevantSearch', label: 'Hide irrelevant search results', desc: '"Related to your search", "Latest from", etc.', defaultVal: true }
    ]
  },
  {
    id: 'playback', label: 'Playback',
    icon: '<polygon points="5 3 19 12 5 21 5 3"/>',
    toggles: [
      { key: 'disableAutoplay', label: 'Disable autoplay', desc: 'Prevent next video from auto-playing', defaultVal: true },
      { key: 'disableAnnotations', label: 'Disable annotations', desc: 'In-video annotation overlays', defaultVal: true }
    ],
    select: { key: 'videoQuality', label: 'Preferred quality', desc: 'Force video quality on every video', defaultVal: 'auto', options: [
      { value: 'auto', label: 'Auto (default)' },
      { value: '2160', label: '4K (2160p)' },
      { value: '1440', label: '1440p' },
      { value: '1080', label: '1080p' },
      { value: '720', label: '720p' },
      { value: '480', label: '480p' },
      { value: '360', label: '360p' },
      { value: '240', label: '240p' },
      { value: '144', label: '144p' }
    ]}
  }
];

function createSVGElement(tag, attrs = {}) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [key, val] of Object.entries(attrs)) {
    el.setAttribute(key, val);
  }
  return el;
}

function makeSVGElement(innerPath) {
  const svg = createSVGElement('svg', {
    width: '16', height: '16', viewBox: '0 0 24 24',
    fill: 'none', stroke: 'currentColor', 'stroke-width': '2',
    'stroke-linecap': 'round', 'stroke-linejoin': 'round'
  });
  
  
  
  
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<svg xmlns="http://www.w3.org/2000/svg">${innerPath}</svg>`, 'image/svg+xml');
  const children = Array.from(doc.documentElement.childNodes);
  children.forEach(child => svg.appendChild(document.importNode(child, true)));
  return svg;
}

function buildUI(settings) {
  const container = document.getElementById('sections');
  container.textContent = '';

  SECTIONS.forEach(sec => {
    const section = document.createElement('section');
    section.className = 'ytpro-section';

    const isOpen = sec.defaultOpen || false;

    
    const header = document.createElement('button');
    header.className = 'ytpro-section-header';
    header.setAttribute('aria-expanded', isOpen);

    const iconSpan = document.createElement('span');
    iconSpan.className = 'ytpro-section-icon';
    iconSpan.appendChild(makeSVGElement(sec.icon));

    const labelSpan = document.createElement('span');
    labelSpan.className = 'ytpro-section-label';
    labelSpan.textContent = sec.label;

    const chevron = createSVGElement('svg', {
      'class': 'ytpro-chevron', width: '14', height: '14',
      viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
      'stroke-width': '2.5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round'
    });
    chevron.appendChild(createSVGElement('polyline', { points: '6 9 12 15 18 9' }));

    header.appendChild(iconSpan);
    header.appendChild(labelSpan);
    header.appendChild(chevron);

    
    const body = document.createElement('div');
    body.className = 'ytpro-section-body' + (isOpen ? ' open' : '');

    sec.toggles.forEach(t => {
      const val = settings[t.key] !== undefined ? settings[t.key] : (t.defaultVal || false);
      const row = document.createElement('div');
      row.className = 'ytpro-toggle-row';

      const info = document.createElement('div');
      info.className = 'ytpro-toggle-info';

      const toggleLabel = document.createElement('span');
      toggleLabel.className = 'ytpro-toggle-label';
      toggleLabel.textContent = t.label;

      const toggleDesc = document.createElement('span');
      toggleDesc.className = 'ytpro-toggle-desc';
      toggleDesc.textContent = t.desc;

      info.appendChild(toggleLabel);
      info.appendChild(toggleDesc);

      const toggle = document.createElement('m3-switch');
      toggle.dataset.key = t.key;
      if (val) toggle.setAttribute('checked', '');

      row.appendChild(info);
      row.appendChild(toggle);
      body.appendChild(row);
    });

    
    if (sec.slider) {
      const s = sec.slider;
      const val = settings[s.key] !== undefined ? settings[s.key] : s.defaultVal;
      const row = document.createElement('div');
      row.className = 'ytpro-slider-row';

      const top = document.createElement('div');
      top.className = 'ytpro-slider-top';

      const info = document.createElement('div');
      info.className = 'ytpro-toggle-info';
      const sliderLabel = document.createElement('span');
      sliderLabel.className = 'ytpro-toggle-label';
      sliderLabel.textContent = s.label;
      const sliderDesc = document.createElement('span');
      sliderDesc.className = 'ytpro-toggle-desc';
      sliderDesc.textContent = s.desc;
      info.appendChild(sliderLabel);
      info.appendChild(sliderDesc);

      const badge = document.createElement('span');
      badge.className = 'ytpro-slider-badge';
      badge.textContent = val;

      top.appendChild(info);
      top.appendChild(badge);

      const trackWrap = document.createElement('div');
      trackWrap.className = 'ytpro-slider-track-wrap';

      const input = document.createElement('input');
      input.type = 'range';
      input.className = 'ytpro-slider';
      input.min = s.min;
      input.max = s.max;
      input.step = 1;
      input.value = val;
      input.dataset.key = s.key;
      
      const pct = ((val - s.min) / (s.max - s.min)) * 100;
      trackWrap.style.setProperty('--slider-pct', pct + '%');
      trackWrap.style.setProperty('--slider-ratio', pct / 100);

      const trackBg = document.createElement('div');
      trackBg.className = 'ytpro-slider-track-bg';

      const ticks = document.createElement('div');
      ticks.className = 'ytpro-slider-ticks';
      for (let i = s.min; i <= s.max; i++) {
        const tick = document.createElement('span');
        tick.className = 'ytpro-slider-tick';
        tick.textContent = i;
        if (i < val) tick.classList.add('active');
        ticks.appendChild(tick);
      }

      trackWrap.appendChild(trackBg);
      trackWrap.appendChild(ticks);
      trackWrap.appendChild(input);

      row.appendChild(top);
      row.appendChild(trackWrap);
      body.appendChild(row);

      let sliderDebounce = null;
      input.addEventListener('input', () => {
        const v = parseInt(input.value, 10);
        badge.textContent = v;
        const p = ((v - s.min) / (s.max - s.min)) * 100;
        trackWrap.style.setProperty('--slider-pct', p + '%');
        trackWrap.style.setProperty('--slider-ratio', p / 100);
        ticks.querySelectorAll('.ytpro-slider-tick').forEach((t, idx) => {
          t.classList.toggle('active', idx < v - s.min);
        });
        
        
        if (sliderDebounce) clearTimeout(sliderDebounce);
        sliderDebounce = setTimeout(() => {
          const update = {};
          update[s.key] = v;
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
              chrome.tabs.sendMessage(tabs[0].id, { type: 'ytpro-settings-update', settings: update }).catch(() => {});
            }
          });
        }, 30);
      });

      
      input.addEventListener('change', () => {
        const v = parseInt(input.value, 10);
        const update = {};
        update[s.key] = v;
        chrome.storage.sync.set(update);
      });
    }

    
    if (sec.select) {
      const s = sec.select;
      const val = settings[s.key] !== undefined ? settings[s.key] : s.defaultVal;
      const row = document.createElement('div');
      row.className = 'ytpro-select-row';

      const info = document.createElement('div');
      info.className = 'ytpro-toggle-info';
      const selectLabel = document.createElement('span');
      selectLabel.className = 'ytpro-toggle-label';
      selectLabel.textContent = s.label;
      const selectDesc = document.createElement('span');
      selectDesc.className = 'ytpro-toggle-desc';
      selectDesc.textContent = s.desc;
      info.appendChild(selectLabel);
      info.appendChild(selectDesc);

      const selectWrap = document.createElement('div');
      selectWrap.className = 'ytpro-select-wrap';
      const select = document.createElement('select');
      select.className = 'ytpro-select';
      select.dataset.key = s.key;
      s.options.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.label;
        if (opt.value === val) option.selected = true;
        select.appendChild(option);
      });
      selectWrap.appendChild(select);

      
      const chevronSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      chevronSvg.setAttribute('class', 'ytpro-select-chevron');
      chevronSvg.setAttribute('width', '12');
      chevronSvg.setAttribute('height', '12');
      chevronSvg.setAttribute('viewBox', '0 0 24 24');
      chevronSvg.setAttribute('fill', 'none');
      chevronSvg.setAttribute('stroke', 'currentColor');
      chevronSvg.setAttribute('stroke-width', '2.5');
      const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      polyline.setAttribute('points', '6 9 12 15 18 9');
      chevronSvg.appendChild(polyline);
      selectWrap.appendChild(chevronSvg);

      row.appendChild(info);
      row.appendChild(selectWrap);
      body.appendChild(row);

      select.addEventListener('change', () => {
        const update = {};
        update[s.key] = select.value;
        chrome.storage.sync.set(update);
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]?.id) {
            chrome.tabs.sendMessage(tabs[0].id, { type: 'ytpro-settings-update', settings: update }).catch(() => {});
          }
        });
      });
    }

    
    header.addEventListener('click', () => {
      const expanded = header.getAttribute('aria-expanded') === 'true';
      header.setAttribute('aria-expanded', !expanded);
      body.classList.toggle('open', !expanded);
    });

    section.appendChild(header);
    section.appendChild(body);
    container.appendChild(section);
  });

  
  container.addEventListener('switch-change', (e) => {
    if (e.target.matches('m3-switch[data-key]')) {
      const key = e.target.dataset.key;
      const val = e.detail.checked;
      const update = {};
      update[key] = val;
      chrome.storage.sync.set(update);
      
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, { type: 'ytpro-settings-update', settings: update }).catch(() => {});
        }
      });
    }
  });
}


function getDefaults() {
  const defaults = {};
  SECTIONS.forEach(sec => {
    sec.toggles.forEach(t => {
      defaults[t.key] = t.defaultVal || false;
    });
    if (sec.slider) {
      defaults[sec.slider.key] = sec.slider.defaultVal;
    }
    if (sec.select) {
      defaults[sec.select.key] = sec.select.defaultVal;
    }
  });
  return defaults;
}


chrome.storage.sync.get(getDefaults(), (settings) => {
  buildUI(settings);
});
