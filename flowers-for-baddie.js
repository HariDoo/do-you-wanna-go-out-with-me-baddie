// =========================================================
// Flowers For Subbulakshmi - Interactive Experience Script
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  const introScreen = document.getElementById('introScreen');
  const flowerContainer = document.getElementById('flowerContainer');
  const introTitle = document.getElementById('introTitle');
  const openBtn = document.getElementById('openBtn');
  const giftIcon = document.getElementById('giftIcon');
  const titleElement = document.getElementById('title');
  const flowerSubtitle = document.getElementById('flowerSubtitle');
  const replayBtn = document.getElementById('replayBtn');
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const audioIcon = document.getElementById('audioIcon');
  const audioStatus = document.getElementById('audioStatus');
  const bgMusic = document.getElementById('bgMusic');

  // 1. Setup Intro Text with Staggered Glowing Animation
  const introPhrase = "I Have Something For You, Subbulakshmi...";
  const chars = introPhrase.split('');

  chars.forEach((char) => {
    const span = document.createElement('span');
    if (char === ' ') {
      span.style.width = '0.6rem';
      span.innerHTML = '&nbsp;';
    } else {
      span.textContent = char;
      const delay = (Math.random() * 2.2).toFixed(2);
      span.style.setProperty('--delay', `${delay}s`);
    }
    introTitle.appendChild(span);
  });

  // 2. Background Song (innumennaa.mp3) Handling - Play Only Once
  if (bgMusic) {
    bgMusic.loop = false;
    bgMusic.addEventListener('ended', () => {
      updateAudioUI(false);
    });
  }

  function playSong() {
    if (!bgMusic) return;
    bgMusic.play().then(() => {
      updateAudioUI(true);
    }).catch((err) => {
      console.warn('Audio autoplay blocked or failed:', err);
      updateAudioUI(false);
    });
  }

  function pauseSong() {
    if (!bgMusic) return;
    bgMusic.pause();
    updateAudioUI(false);
  }

  function toggleSong() {
    if (!bgMusic) return;
    if (bgMusic.paused) {
      playSong();
    } else {
      pauseSong();
    }
  }

  function updateAudioUI(playing) {
    if (audioStatus) {
      audioStatus.textContent = playing ? 'Music: On' : 'Music: Off';
    }
    if (audioIcon) {
      audioIcon.textContent = playing ? '🎵' : '🔇';
    }
  }

  audioToggleBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    toggleSong();
  });

  // 3. Flower Blooming & Typing Sequence
  let typingTimeout = null;
  const targetTitle = "Flowers for you Subbulakshmi";

  function typeTitle(text, callback) {
    titleElement.textContent = '';
    let idx = 0;
    if (typingTimeout) clearTimeout(typingTimeout);

    function step() {
      if (idx < text.length) {
        titleElement.textContent += text[idx];
        idx++;
        typingTimeout = setTimeout(step, 130);
      } else if (callback) {
        callback();
      }
    }
    step();
  }

  function triggerBloom() {
    // Show flower container
    flowerContainer.classList.add('active');

    // Remove not-loaded to kick off all blooming CSS animations
    setTimeout(() => {
      document.body.classList.remove('not-loaded');
      flowerContainer.classList.remove('not-loaded');

      // Start typewriter effect after a brief pause
      setTimeout(() => {
        typeTitle(targetTitle, () => {
          if (flowerSubtitle) {
            flowerSubtitle.classList.add('visible');
          }
        });
      }, 700);
    }, 200);
  }

  function openGift(e) {
    if (e && e.preventDefault) e.preventDefault();

    // Spawn celebration particles
    const x = (e && e.clientX) ? e.clientX : window.innerWidth / 2;
    const y = (e && e.clientY) ? e.clientY : window.innerHeight / 2;
    spawnParticleBurst(x, y, 16);

    // Play innumennaa song
    playSong();

    // Fade out intro screen
    introScreen.classList.add('hidden');

    // Bloom flowers
    triggerBloom();
  }

  openBtn?.addEventListener('click', openGift);
  giftIcon?.addEventListener('click', openGift);

  // 4. Replay Bloom Animation
  replayBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    // Add not-loaded state
    document.body.classList.add('not-loaded');
    flowerContainer.classList.add('not-loaded');
    titleElement.textContent = '';
    if (flowerSubtitle) flowerSubtitle.classList.remove('visible');

    // Force CSS reflow
    void flowerContainer.offsetWidth;

    // Reset song position & play if paused
    if (bgMusic) {
      bgMusic.currentTime = 0;
      playSong();
    }

    spawnParticleBurst(window.innerWidth / 2, window.innerHeight * 0.7, 12);
    triggerBloom();
  });

  // 5. Interactive Floating Hearts & Petals on Click/Tap
  const particleSymbols = ['🌸', '❤', '✨', '💐', '💖', '🌺'];

  function createParticle(x, y, symbol) {
    const el = document.createElement('div');
    el.className = 'click-heart';
    el.textContent = symbol || particleSymbols[Math.floor(Math.random() * particleSymbols.length)];
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.fontSize = `${16 + Math.random() * 18}px`;

    document.body.appendChild(el);
    setTimeout(() => {
      el.remove();
    }, 1500);
  }

  function spawnParticleBurst(x, y, count = 8) {
    for (let i = 0; i < count; i++) {
      const offsetX = x + (Math.random() * 80 - 40);
      const offsetY = y + (Math.random() * 60 - 30);
      setTimeout(() => {
        createParticle(offsetX, offsetY);
      }, i * 60);
    }
  }

  document.addEventListener('click', (e) => {
    // Avoid double triggering on button clicks
    if (e.target.closest('button') || e.target.closest('a')) return;
    createParticle(e.clientX, e.clientY);
  });

  document.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0]) {
      const touch = e.touches[0];
      if (e.target.closest('button') || e.target.closest('a')) return;
      createParticle(touch.clientX, touch.clientY);
    }
  }, { passive: true });

  // Auto-bloom if URL hash is #bloom
  if (window.location.hash === '#bloom') {
    introScreen.classList.add('hidden');
    triggerBloom();
    playSong();
  }
});
