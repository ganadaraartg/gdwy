
  // 시계 업데이트
  function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit'
    });
    document.getElementById('taskbar-time').textContent = timeString;
  }
  updateTime();
  setInterval(updateTime, 1000);

  // 선택 박스 관련 (생략, 기존 코드 그대로 유지)
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let selectionBox = null;

  const mainBox = document.querySelector('.main-box');

  mainBox.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;

    // 뮤직창 타이틀바 드래그 이벤트와 충돌 방지 위해 조건 분리
    if (e.target.closest('.music-titlebar')) return;

    isDragging = true;
    startX = e.offsetX;
    startY = e.offsetY;

    selectionBox = document.createElement('div');
    selectionBox.classList.add('selection-box');
    selectionBox.style.left = `${startX}px`;
    selectionBox.style.top = `${startY}px`;
    mainBox.appendChild(selectionBox);
  });

  mainBox.addEventListener('mousemove', (e) => {
    if (!isDragging || !selectionBox) return;

    const currentX = e.offsetX;
    const currentY = e.offsetY;

    const width = Math.abs(currentX - startX);
    const height = Math.abs(currentY - startY);
    const left = Math.min(currentX, startX);
    const top = Math.min(currentY, startY);

    selectionBox.style.width = `${width}px`;
    selectionBox.style.height = `${height}px`;
    selectionBox.style.left = `${left}px`;
    selectionBox.style.top = `${top}px`;
  });

  mainBox.addEventListener('mouseup', () => {
    if (isDragging && selectionBox) {
      selectionBox.remove();
      selectionBox = null;
    }
    isDragging = false;
  });

  document.addEventListener('mouseup', () => {
    if (isDragging && selectionBox) {
      selectionBox.remove();
      selectionBox = null;
    }
    isDragging = false;
  });

  function fadeToMenu() {
    const blackout = document.getElementById('blackout');
    blackout.classList.add('show');
    setTimeout(() => {
      location.href = '../menu/menu.html';
    }, 2000); // 2초 후 이동
  }

  // 아이콘 선택 및 더블클릭 (기존 코드 유지)
  const icons = document.querySelectorAll('.icon');
  let selectedIcon = null;

  icons.forEach((icon) => {
    // 클릭 시 선택 처리
    icon.addEventListener('click', (e) => {
      e.stopPropagation(); // 배경 선택 방지
      if (selectedIcon) {
        selectedIcon.classList.remove('selected');
      }
      selectedIcon = icon;
      icon.classList.add('selected');
    });

    // 더블 클릭 시 페이지 이동
    icon.addEventListener('dblclick', () => {
      const link = icon.dataset.link;
      if (link) {
        location.href = link;
      }
    });
  });

  // 배경 클릭 시 선택 해제
  mainBox.addEventListener('click', () => {
    if (selectedIcon) {
      selectedIcon.classList.remove('selected');
      selectedIcon = null;
    }
  });

  // ----------------------
  // 뮤직창 기능 구현
  // ----------------------

  const musicIcon = document.getElementById('music-icon');
  const musicWindow = document.getElementById('music-window');
  const musicTitlebar = document.getElementById('music-titlebar');
  const musicCloseBtn = document.getElementById('music-close-btn');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const songNameElem = document.getElementById('song-name');

  // 예시 노래 리스트
const songs = [
  { name: "Lotus Waters", file: "./media/music/Lotus_Waters.mp3" },
  { name: "Deep swim", file: "./media/music/Deep_swim.mp3" },
  { name: "Nevermind, everything's ok", file: "./media/music/nevermind,_everything's_ok.mp3" },
  { name: "Light Lock", file: "./media/music/Light_Lock.mp3" },
  { name: "warm nights", file: "./media/music/warm_nights.mp3" }
];
  let currentSongIndex = 0;

  function updateSongName() {
    songNameElem.textContent = songs[currentSongIndex];
  }

  musicIcon.addEventListener('dblclick', () => {
    if (musicWindow.style.display === 'none' || musicWindow.style.display === '') {
      musicWindow.style.display = 'block';
      updateSongName();
    } else {
      musicWindow.style.display = 'none';
    }
  });

  musicCloseBtn.addEventListener('click', () => {
    musicWindow.style.display = 'none';
  });

  prevBtn.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    updateSongName();
  });

  nextBtn.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    updateSongName();
  });

  // --- 뮤직창 드래그 이동 (main-box 내로 제한) ---
  let isMusicDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  let windowStartLeft = 0;
  let windowStartTop = 0;

  musicTitlebar.addEventListener('mousedown', (e) => {
    e.preventDefault();
    isMusicDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;

    // 현재 위치(px) 읽기
    const rect = musicWindow.getBoundingClientRect();
    const mainRect = mainBox.getBoundingClientRect();

    // 상대 좌표로 변환(mainBox 안에서)
    windowStartLeft = rect.left - mainRect.left;
    windowStartTop = rect.top - mainRect.top;

    // 마우스 이벤트 중지 등 위해 바깥 document에 리스너 추가
    document.addEventListener('mousemove', onMusicDrag);
    document.addEventListener('mouseup', stopMusicDrag);
  });

  function onMusicDrag(e) {
    if (!isMusicDragging) return;

    const mainRect = mainBox.getBoundingClientRect();
    const newLeft = windowStartLeft + (e.clientX - dragStartX);
    const newTop = windowStartTop + (e.clientY - dragStartY);

    // main-box 내부 경계 제한
    const maxLeft = mainBox.clientWidth - musicWindow.offsetWidth;
    const maxTop = mainBox.clientHeight - musicWindow.offsetHeight;

    let boundedLeft = Math.min(Math.max(newLeft, 0), maxLeft);
    let boundedTop = Math.min(Math.max(newTop, 0), maxTop);

    musicWindow.style.left = boundedLeft + 'px';
    musicWindow.style.top = boundedTop + 'px';
  }

  function stopMusicDrag(e) {
    if (isMusicDragging) {
      isMusicDragging = false;
      document.removeEventListener('mousemove', onMusicDrag);
      document.removeEventListener('mouseup', stopMusicDrag);
    }
  }

  function updateSongName() {
  const song = songs[currentSongIndex];
  songNameElem.textContent = song.name;
  const audio = document.getElementById('audio-player');
  audio.src = song.file;
  audio.play();
}

const audio = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('play-pause-btn');
const volumeUpBtn = document.getElementById('volume-up-btn');
const volumeDownBtn = document.getElementById('volume-down-btn');

// ▶ / ❚❚ 토글
playPauseBtn.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    playPauseBtn.innerHTML = '❚❚'; // 일시정지 표시
  } else {
    audio.pause();
    playPauseBtn.innerHTML = '&#9658;'; // 재생 ▶ 표시
  }
});

// 곡 바뀔 때마다 버튼도 업데이트
function updateSongName() {
  const song = songs[currentSongIndex];
  songNameElem.textContent = song.name;
  audio.src = song.file;
  audio.play();
  playPauseBtn.innerHTML = '❚❚';
}

// 볼륨 조절
volumeUpBtn.addEventListener('click', () => {
  audio.volume = Math.min(audio.volume + 0.1, 1);
});

volumeDownBtn.addEventListener('click', () => {
  audio.volume = Math.max(audio.volume - 0.1, 0);
});

function saveMusicState() {
  localStorage.setItem('musicState', JSON.stringify({
    currentSongIndex,
    currentTime: audio.currentTime,
    isPlaying: !audio.paused,
    windowTop: musicWindow.style.top,
    windowLeft: musicWindow.style.left
  }));
}

// 재생 상태 저장
function saveMusicState() {
  localStorage.setItem('musicState', JSON.stringify({
    currentSongIndex,
    currentTime: audio.currentTime,
    isPlaying: !audio.paused,
    windowTop: musicWindow.style.top,
    windowLeft: musicWindow.style.left
  }));
}

// 재생 위치 주기적으로 저장
audio.addEventListener('timeupdate', saveMusicState);

window.addEventListener('DOMContentLoaded', () => {
  const state = localStorage.getItem('musicState');
  const shouldReset = localStorage.getItem('resetMusicPlayer');

  if (shouldReset === 'true') {
    localStorage.removeItem('resetMusicPlayer');
    localStorage.removeItem('musicState');
    return;
  }

  if (state) {
    const parsed = JSON.parse(state);
    currentSongIndex = parsed.currentSongIndex || 0;
    audio.src = songs[currentSongIndex].file;
    songNameElem.textContent = songs[currentSongIndex].name;

    if (parsed.windowTop && parsed.windowLeft) {
      musicWindow.style.top = parsed.windowTop;
      musicWindow.style.left = parsed.windowLeft;
    }

    audio.addEventListener('loadedmetadata', () => {
      audio.currentTime = parsed.currentTime || 0;
      if (parsed.isPlaying) {
        audio.play();
        playPauseBtn.innerHTML = '❚❚';
      }
    });
  }
});

musicCloseBtn.addEventListener('click', () => {
  saveMusicState();
  musicWindow.style.display = 'none';
});