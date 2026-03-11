# YouTube End Time Tracker 🕒

A lightweight and efficient tool for YouTube that displays the exact time a video will finish (real-world clock time), taking into account your current progress and playback speed.

![YouTube End Time Tracker Preview](https://kappa.lol/J8RN70)

## ✨ Features
- **Real-World Clock:** Shows exactly what time you will finish the video on your local clock.
- **Speed-Aware:** Automatically adjusts the end time if you watch at 1.25x, 1.5x, 2x, etc.
- **Native Integration:** Blends seamlessly with the standard YouTube player UI.
- **Cross-Browser:** Works as a Chrome/Chromium extension or as a Userscript for Safari.
- **Security First:** Bypasses YouTube's `Trusted Types` policy (no unsafe `innerHTML` usage).

---

## 🚀 Installation

### Option 1: Chromium-based Browsers (Chrome, Edge, Brave, Opera)
Since this is a custom extension, you can install it manually using "Developer Mode":

1. **Download the project:** Click the green `Code` button and select `Download ZIP`. Extract the files to a folder on your computer.
2. **Open Extensions page:** In your browser, go to `chrome://extensions/` (or `edge://extensions/` for Microsoft Edge).
3. **Enable Developer Mode:** Toggle the switch in the top right corner.
4. **Load the extension:** Click the **"Load unpacked"** button and select the folder where you extracted the project files.
5. **Refresh YouTube:** Open any YouTube video, and you will see the "Ends at" time next to the video duration.

### Option 2: Safari (macOS / iOS)
Safari requires a "Userscript" manager to run custom scripts.

1. **Install Userscripts:** Download the free **[Userscripts](https://apps.apple.com/app/userscripts/id1463298887)** extension from the Mac App Store.
2. **Enable Extension:** Go to Safari **Settings > Extensions** and enable "Userscripts".
3. **Set Directory:** Click the Userscripts icon in your Safari toolbar and select **"Open Userscripts Directory"**.
4. **Create Script:** In that folder, create a new file named `youtube-ends.user.js`.
5. **Paste Code:** Copy the code from the [Script Section](#-the-script-safe-mode) below and paste it into the file.
6. **Grant Permissions:** Refresh YouTube. Safari may ask for permission to run the script on `youtube.com`. Click **"Always Allow"**.

---

## 🛠 The Script (Safe Mode)

This version uses `createElement` to comply with modern browser security policies (TrustedHTML):

```javascript
// ==UserScript==
// @name        YouTube End Time Tracker
// @match       https://www.youtube.com/*
// @grant       none
// @version     1.3
// ==/UserScript==

(function() {
    'use strict';

    function formatTime(date) {
        return date.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: false // Set to true for 12h format (AM/PM)
        });
    }

    function update() {
        const video = document.querySelector('video');
        const timeContents = document.querySelector('.ytp-time-contents');
        
        if (!video || !timeContents || isNaN(video.duration)) return;

        // Calculation
        const remaining = (video.duration - video.currentTime) / video.playbackRate;
        const end = new Date(Date.now() + remaining * 1000);
        const timeStr = formatTime(end);

        let wrapper = document.getElementById('yt-end-time-wrapper');

        // Create elements without innerHTML to bypass Trusted Types
        if (!wrapper) {
            wrapper = document.createElement('span');
            wrapper.id = 'yt-end-time-wrapper';
            wrapper.style.display = 'inline';

            const separator = document.createElement('span');
            separator.textContent = ' • ';
            separator.style.opacity = '0.7';
            separator.style.margin = '0 4px';

            const endSpan = document.createElement('span');
            endSpan.id = 'yt-end-time-inline';
            endSpan.className = 'ytp-time-duration';

            wrapper.appendChild(separator);
            wrapper.appendChild(endSpan);
            timeContents.appendChild(wrapper);
        }

        const endSpan = document.getElementById('yt-end-time-inline');
        if (endSpan) {
            const newText = 'Ends at ' + timeStr;
            if (endSpan.textContent !== newText) {
                endSpan.textContent = newText;
            }
        }

        // Hide when paused (optional)
        wrapper.style.display = video.paused ? 'none' : 'inline';
    }

    setInterval(update, 1000);
    window.addEventListener('yt-navigate-finish', () => setTimeout(update, 1000));
    update();
})();
```

---

## 🎨 Customization
You can easily tweak the script to your liking:
- **12h vs 24h Format:** Change `hour12: false` to `true` in the `formatTime` function.
- **Custom Text:** Change the `'Ends at '` string to anything you like (e.g., `'Finishes at '`).
- **Always Show:** Comment out the `wrapper.style.display = video.paused ? 'none' : 'inline';` line if you want the time to be visible even when the video is paused.

## 🤝 Contributing
Contributions are welcome!
1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📝 License
Distributed under the MIT License. See `LICENSE` for more information.
