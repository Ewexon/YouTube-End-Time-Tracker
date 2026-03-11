// content.js - Стабільна версія v3.2 (Без лагів)

let settings = {
  timeFormat: '24h',
  color: '#ffffff'
};

// Завантажуємо налаштування
chrome.storage.local.get(['settings'], (result) => {
  if (result.settings) settings = { ...settings, ...result.settings };
});

// Оновлення при зміні налаштувань
chrome.storage.onChanged.addListener((changes) => {
  if (changes.settings) {
    settings = { ...settings, ...changes.settings.newValue };
    update(true); // Примусове оновлення
  }
});

function formatTime(date, format) {
  return date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: format === '12h' 
  });
}

function update(force = false) {
  const video = document.querySelector('video');
  const timeContents = document.querySelector('.ytp-time-contents');
  
  // Якщо немає відео або панелі часу - виходимо
  if (!video || !timeContents || isNaN(video.duration) || video.duration === 0) {
    return;
  }

  // Якщо відео на паузі і це не примусове оновлення - ховаємо блок і виходимо
  if (video.paused && !force) {
    const wrapper = document.getElementById('yt-end-time-wrapper');
    if (wrapper) wrapper.style.display = 'none';
    return;
  }

  // Розрахунок часу
  const remaining = (video.duration - video.currentTime) / video.playbackRate;
  const end = new Date(Date.now() + remaining * 1000);
  const timeStr = formatTime(end, settings.timeFormat);

  let wrapper = document.getElementById('yt-end-time-wrapper');

  // Створюємо блок, якщо його немає
  if (!wrapper) {
    wrapper = document.createElement('span');
    wrapper.id = 'yt-end-time-wrapper';
    wrapper.style.whiteSpace = 'nowrap';
    wrapper.style.display = 'inline';
    wrapper.innerHTML = `
      <span style="opacity: 0.7; margin: 0 4px;"> • </span>
      <span id="yt-end-time-inline" class="ytp-time-duration"></span>
    `;
    timeContents.appendChild(wrapper);
  }

  const endSpan = document.getElementById('yt-end-time-inline');
  if (endSpan && (endSpan.innerText !== 'Ends at ' + timeStr || force)) {
    endSpan.innerText = 'Ends at ' + timeStr;
    endSpan.style.color = settings.color;
  }

  if (wrapper.style.display === 'none') {
    wrapper.style.display = 'inline';
  }
}

// 1. Основний цикл оновлення (раз на секунду) - це безпечно і не вантажить процесор
setInterval(update, 1000);

// 2. Спеціальна подія YouTube для переходів між відео
window.addEventListener('yt-navigate-finish', () => {
  // Невелика затримка, щоб YouTube встиг намалювати інтерфейс
  setTimeout(() => update(true), 1000);
});

// 3. Додатковий тригер на повноекранний режим
document.addEventListener('fullscreenchange', () => {
  setTimeout(() => update(true), 500);
});