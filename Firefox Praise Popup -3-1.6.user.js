// ==UserScript==
// @name         Firefox Praise Popup :3
// @namespace    http://tampermonkey.net
// @version      1.6
// @description  what a good boy~
// @match        *://*/*
// @noframes
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_getResourceURL
// @resource     praiseImage https://i.imgur.com/K66noSa_d.jpeg?maxwidth=520&shape=thumb&fidelity=high
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIG ---
    const INTERVAL_MS = 1.5 * 60 * 1000; // 1.5 minutes cooldown
    const TRIGGER_CHANCE = 0.6;          // 60% chance to trigger

    function isMediaPlaying() {
        const mediaElements = document.querySelectorAll('video, audio');
        for (let media of mediaElements) {
            if (!media.paused && !media.ended && media.readyState > 2) {
                return true;
            }
        }
        return false;
    }

    function triggerPopup() {
        if (document.getElementById('firefox-praise-overlay')) return;

        const imgSrc = GM_getResourceURL("praiseImage");

        const overlay = document.createElement('div');
        overlay.id = 'firefox-praise-overlay';
        Object.assign(overlay.style, {
            position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.75)', zIndex: '999999', display: 'flex',
            justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif'
        });

        const box = document.createElement('div');
        Object.assign(box.style, {
            background: '#1e1e2e', color: '#cdd6f4', padding: '30px',
            borderRadius: '12px', textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)', maxWidth: '400px'
        });

        // Creates the image
        const img = document.createElement('img');
        img.src = imgSrc;
        Object.assign(img.style, {
            width: '300px', height: 'auto', marginBottom: '20px', borderRadius: '8px'
        });

        // Creates the heading text
        const heading = document.createElement('h2');
        heading.textContent = "Who's a good boy~~.";
        Object.assign(heading.style, {
            fontSize: '24px', margin: '0 0 20px 0'
        });

        // Creates the button and its text
        const btn = document.createElement('button');
        btn.id = 'praise-close-btn';
        btn.textContent = 'I am~ :3';
        Object.assign(btn.style, {
            background: '#ff6600', color: 'white', border: 'none', padding: '10px 20px',
            fontSize: '16px', borderRadius: '6px', cursor: 'pointer'
        });

        btn.onclick = function() {
            overlay.remove();
        };

        box.append(img, heading, btn);
        overlay.appendChild(box);
        document.body.appendChild(overlay);
    }

    function checkTimer() {
        if (!document.hasFocus()) return;

        if (document.getElementById('firefox-praise-overlay')) return;

        if (isMediaPlaying()) return;

        const now = Date.now();
        const lastGreeted = GM_getValue('last_praise_time');

        if (!lastGreeted || (now - parseInt(lastGreeted)) >= INTERVAL_MS) {
            GM_setValue('last_praise_time', now.toString());

            if (Math.random() < TRIGGER_CHANCE) {
                triggerPopup();
            }
        }
    }

    checkTimer();
    setInterval(checkTimer, 10000);
})();
