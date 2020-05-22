// ==UserScript==
// @name         Leetcode Timer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a timer for Leetcode
// @author       Yuki
// @match        https://leetcode.com/problems/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const h = document.querySelector.bind(document);

  let k = 10; // wait 10s

  let addTimer = setInterval(function () {
    if (k <= 0) {
      clearInterval(addTimer);
    }
    const titleEl = h('div[data-cy="question-title"]');
    if (!titleEl) {
      k--;
    } else {
      clearInterval(addTimer);
      initTimer();
    }
  }, 1000);

  function initTimer() {
    const titleEl = h('div[data-cy="question-title"]');

    const titleText = titleEl.innerHTML;

    const startIcon = '&#x25ba;';
    const stopIcon = '&#x25A0;';

    let defaultMinutes = 30;
    let time2Display = '30 : 00';
    let counter;

    const timer = `
      <div class="leetcode-timer" style="margin:10px 0">
        <span class="leetcode-timer-settings">
          <input class="leetcode-timer-time" value="${defaultMinutes}" style="width:50px"/>&nbsp;Minutes
          <button class="leetcode-timer-start">${startIcon}</button>
        </span>
        <span class="leetcode-timer-counting" style="display:none">
          <span class="leetcode-timer-time-display">${time2Display}</span>
          <button class="leetcode-timer-stop">${stopIcon}</button>
        </span>
      </div>
    `;

    titleEl.innerHTML = titleText + timer;

    h('.leetcode-timer-time').addEventListener('input', (e) => {
      defaultMinutes = parseInt(e.target.value, 10);
      h('.leetcode-timer-time-display').innerHTML = `${defaultMinutes} : 00`;
    });

    h('.leetcode-timer-start').addEventListener('click', (e) => {
      h('.leetcode-timer-settings').style.display = 'none';
      h('.leetcode-timer-counting').style.display = '';
      counter = countDown();
    });

    h('.leetcode-timer-stop').addEventListener('click', (e) => {
      h('.leetcode-timer-settings').style.display = '';
      h('.leetcode-timer-counting').style.display = 'none';
      h('.leetcode-timer-time-display').innerHTML = '';
      if (counter) {
        clearInterval(counter);
      }
    });

    function countDown() {
      let target = new Date().getTime() + defaultMinutes * 60 * 1000;

      let counter = setInterval(() => {
        let now = new Date().getTime();
        let dist = target - now;

        if (counter <= 0) {
          clearInterval(counter);
        }

        let m = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
        let s = Math.floor((dist % (1000 * 60)) / 1000);

        time2Display =
          (m >= 10 ? m : '0' + m) + ' : ' + (s >= 10 ? s : '0' + s);

        h('.leetcode-timer-time-display').innerHTML = time2Display;
      }, 1000);

      return counter;
    }
  }
})();
