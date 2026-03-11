// ==UserScript==
// @name        YouTube End Time Tracker
// @match       https://www.youtube.com/*
// @grant       none
// @version     1.3
// ==/UserScript==

(function() {
    'use strict';

    console.log("YouTube End Time Tracker: Script running (v1.3 Safe Mode)");

    function formatTime(date) {
        return date.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: false 
        });
    }

    function update() {
        const video = document.querySelector('video');
        const timeContents = document.querySelector('.ytp-time-contents');
        
        if (!video || !timeContents || isNaN(video.duration)) {
            return;
        }

        // Розрахунок часу
        const remaining = (video.duration - video.currentTime) / video.playbackRate;
        const end = new Date(Date.now() + remaining * 1000);
        const timeStr = formatTime(end);

        let wrapper = document.getElementById('yt-end-time-wrapper');

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
            
            console.log("YouTube End Time Tracker: Element created in the player");
        }

        const endSpan = document.getElementById('yt-end-time-inline');
        if (endSpan) {
            const newText = 'Ends at ' + timeStr;
            if (endSpan.textContent !== newText) {
                endSpan.textContent = newText;
            }
        }

        wrapper.style.display = video.paused ? 'none' : 'inline';
    }

    setInterval(update, 1000);

    window.addEventListener('yt-navigate-finish', () => setTimeout(update, 1000));
    
    update();
})();