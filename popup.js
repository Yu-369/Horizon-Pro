// popup.js — YouTube Pro Settings

const SECTIONS = [
  {
    id: 'ytpro', label: 'YouTube Pro',
    icon: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    defaultOpen: true,
    toggles: [
      { key: 'enableCarousel', label: 'Refined carousel', desc: 'Cinematic carousel on the homepage', defaultVal: true },
      { key: 'gridThreeVideos', label: '3 videos per row', desc: 'Show 3 instead of 4 videos per row', defaultVal: false }
    ]
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
      { key: 'hidePlayables', label: 'Hide Playables', desc: 'Playables games shelf and sidebar link' }
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
    ]
  }
];

function makeSVG(inner) {
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
}

function buildUI(settings) {
  const container = document.getElementById('sections');
  container.innerHTML = '';

  SECTIONS.forEach(sec => {
    const section = document.createElement('section');
    section.className = 'ytpro-section';

    const isOpen = sec.defaultOpen || false;

    // Header
    const header = document.createElement('button');
    header.className = 'ytpro-section-header';
    header.setAttribute('aria-expanded', isOpen);
    header.innerHTML = `
      <span class="ytpro-section-icon">${makeSVG(sec.icon)}</span>
      <span class="ytpro-section-label">${sec.label}</span>
      <svg class="ytpro-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
    `;

    // Body
    const body = document.createElement('div');
    body.className = 'ytpro-section-body' + (isOpen ? ' open' : '');

    sec.toggles.forEach(t => {
      const val = settings[t.key] !== undefined ? settings[t.key] : (t.defaultVal || false);
      const row = document.createElement('div');
      row.className = 'ytpro-toggle-row';
      row.innerHTML = `
        <div class="ytpro-toggle-info">
          <span class="ytpro-toggle-label">${t.label}</span>
          <span class="ytpro-toggle-desc">${t.desc}</span>
        </div>
        <m3-switch data-key="${t.key}" ${val ? 'checked' : ''}></m3-switch>
      `;
      body.appendChild(row);
    });

    // Toggle section
    header.addEventListener('click', () => {
      const expanded = header.getAttribute('aria-expanded') === 'true';
      header.setAttribute('aria-expanded', !expanded);
      body.classList.toggle('open', !expanded);
    });

    section.appendChild(header);
    section.appendChild(body);
    container.appendChild(section);
  });

  // Listen for changes
  container.addEventListener('switch-change', (e) => {
    if (e.target.matches('m3-switch[data-key]')) {
      const key = e.target.dataset.key;
      const val = e.detail.checked;
      const update = {};
      update[key] = val;
      chrome.storage.sync.set(update);
      // Relay to active tab
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, { type: 'ytpro-settings-update', settings: update }).catch(() => {});
        }
      });
    }
  });
}

// Get all setting keys with defaults
function getDefaults() {
  const defaults = {};
  SECTIONS.forEach(sec => {
    sec.toggles.forEach(t => {
      defaults[t.key] = t.defaultVal || false;
    });
  });
  return defaults;
}

// Init
chrome.storage.sync.get(getDefaults(), (settings) => {
  buildUI(settings);
});
