// popup.js
document.addEventListener('DOMContentLoaded', () => {
  const timeFormat = document.getElementById('timeFormat');
  const color = document.getElementById('color');
  const mode = document.getElementById('mode');
  const historyList = document.getElementById('historyList');
  const clearHistory = document.getElementById('clearHistory');
  const tabs = document.querySelectorAll('.tab');

  // Tab switching
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(tab.dataset.tab).classList.add('active');
      if (tab.dataset.tab === 'history') loadHistory();
    });
  });

  // Load settings
  chrome.storage.local.get(['settings'], (result) => {
    if (result.settings) {
      timeFormat.value = result.settings.timeFormat || '24h';
      color.value = result.settings.color || '#ffffff';
      mode.value = result.settings.mode || 'control-bar';
    }
  });

  // Save settings
  const saveSettings = () => {
    const settings = {
      timeFormat: timeFormat.value,
      color: color.value,
      mode: mode.value
    };
    chrome.storage.local.set({ settings });
  };

  [timeFormat, color, mode].forEach(el => el.addEventListener('change', saveSettings));

  // History logic
  function loadHistory() {
    chrome.storage.local.get(['history'], (result) => {
      const history = result.history || [];
      if (history.length === 0) {
        historyList.innerHTML = '<p style="color:#666;font-size:12px">No history yet.</p>';
        return;
      }
      historyList.innerHTML = history.map(item => `
        <div class="history-item">
          <div class="history-title">${item.title}</div>
          <div class="history-meta">Ended at ${item.endTime} • ${item.timestamp}</div>
        </div>
      `).join('');
    });
  }

  clearHistory.addEventListener('click', () => {
    chrome.storage.local.set({ history: [] }, loadHistory);
  });
});
