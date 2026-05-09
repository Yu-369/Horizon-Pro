(function() {
  const QUALITY_ORDER = ['hd2160', 'hd1440', 'hd1080', 'hd720', 'large', 'medium', 'small', 'tiny'];
  let debounce = null;
  
  function enforceQuality() {
    const pref = document.body.dataset.ytproQuality;
    if (!pref || pref === 'auto') return;
    
    if (debounce) return;
    debounce = setTimeout(() => { debounce = null; }, 500);

    const player = document.getElementById('movie_player');
    if (!player || typeof player.getAvailableQualityLevels !== 'function') return;

    const available = player.getAvailableQualityLevels();
    if (!available || available.length === 0) return;

    const preferredIdx = QUALITY_ORDER.indexOf(pref);
    if (preferredIdx === -1) return;

    let target = null;
    if (available.includes(pref)) {
      target = pref;
    } else {
      for (let i = preferredIdx; i < QUALITY_ORDER.length; i++) {
        if (available.includes(QUALITY_ORDER[i])) { target = QUALITY_ORDER[i]; break; }
      }
      if (!target) {
        for (let i = preferredIdx - 1; i >= 0; i--) {
          if (available.includes(QUALITY_ORDER[i])) { target = QUALITY_ORDER[i]; break; }
        }
      }
    }

    if (!target) return;
    const current = player.getPlaybackQuality();
    if (current === target) return;

    
    try {
      const ytPlayerPref = JSON.parse(localStorage.getItem('yt-player-quality') || '{}');
      ytPlayerPref.data = JSON.stringify({ quality: target, previousQuality: current });
      ytPlayerPref.creation = Date.now();
      ytPlayerPref.expiration = Date.now() + 2592000000; 
      localStorage.setItem('yt-player-quality', JSON.stringify(ytPlayerPref));
    } catch(e) {}

    if (typeof player.setPlaybackQualityRange === 'function') {
      player.setPlaybackQualityRange(target, target);
    }
    if (typeof player.setPlaybackQuality === 'function') {
      player.setPlaybackQuality(target);
    }
  }

  window.addEventListener('ytpro-force-quality', enforceQuality);

  
  let stateHandler = null;
  window.addEventListener('yt-navigate-finish', () => {
    const player = document.getElementById('movie_player');
    if (player && typeof player.addEventListener === 'function' && !stateHandler) {
      stateHandler = () => { setTimeout(enforceQuality, 800); };
      player.addEventListener('onStateChange', stateHandler);
    }
    enforceQuality();
  });
})();
