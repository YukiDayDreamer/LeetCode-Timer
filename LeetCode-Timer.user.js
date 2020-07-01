// ==UserScript==
// @name         Leetcode Timer
// @namespace    https://github.com/YukiDayDreamer/LeetCode-Timer/
// @version      0.8
// @description  Mount a Timer for Leetcode Problem
// @author       YukiDayDreamer
// @updateURL    https://raw.githubusercontent.com/YukiDayDreamer/LeetCode-Timer/master/LeetCode-Timer.meta.js
// @downloadURL  https://raw.githubusercontent.com/YukiDayDreamer/LeetCode-Timer/master/LeetCode-Timer.user.js
// @match        https://leetcode.com/problems/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const h = document.querySelector.bind(document); // query selector shortcut

  let retryWait = 200;
  let patience = 20 * 1000; // patience time: 20s

  let addTimer = setInterval(function () {
    if (patience <= 0) {
      clearInterval(addTimer);
    }
    const navContainer = h('div#navbar-right-container');
    const diffLevelContainer = h('div[diff]');
    if (!navContainer || !diffLevelContainer) {
      patience -= retryWait;
      return;
    }
    clearInterval(addTimer);
    initTimer();
  }, retryWait);

  // main entry
  function initTimer() {
    // leetcode elements
    const navContainer = h('div#navbar-right-container');
    const diffLevel = h('div[diff]').getAttribute('diff'); // easy/medium/hard

    // icons and colors
    const startIcon = '&#x25ba;';
    const stopIcon = '&#x25A0;';
    const easyColor = 'rgb(67, 160, 71)';
    const mediumColor = 'rgb(239, 108, 0)';
    const hardColor = 'rgb(233, 30, 99)';

    let defaultMinutes =
      diffLevel === 'easy' ? 10 : diffLevel === 'medium' ? 20 : 30;

    let time2Display = defaultMinutes + ' : 00';
    let timesUp = `<span style="color:${hardColor}">Time's Up!</span>`;
    let counter;

    const timerContainer = `
      <div class="leetcode-timer" style="color:black;font-size:16px">
        <span class="leetcode-timer-settings-container">
          <input type="number" class="leetcode-timer-input" value="${defaultMinutes}" style="width:80px"/>&nbsp;Minutes
          <button class="leetcode-timer-start">${startIcon}</button>
        </span>
        <span class="leetcode-timer-counting-container" style="display:none">
          <span class="leetcode-timer-time-display">${time2Display}</span>
          <button class="leetcode-timer-stop">${stopIcon}</button>
        </span>
      </div>
    `;

    navContainer.insertAdjacentHTML('beforebegin', timerContainer); // prepend to nav container

    // timer elements
    const settingsContainer = h('.leetcode-timer-settings-container');
    const timeInputEl = h('.leetcode-timer-input');
    const startButton = h('.leetcode-timer-start');

    const countingContainer = h('.leetcode-timer-counting-container');
    const displayContainer = h('.leetcode-timer-time-display');
    const stopButton = h('.leetcode-timer-stop');

    // event binding
    timeInputEl.addEventListener('input', (e) => {
      defaultMinutes = parseInt(e.target.value, 10);
    });

    startButton.addEventListener('click', (e) => {
      updateTime2Display();
      settingsContainer.style.display = 'none';
      countingContainer.style.display = '';
      if (counter) {
        clearInterval(counter);
      }
      counter = countDown();
    });

    stopButton.addEventListener('click', (e) => {
      settingsContainer.style.display = '';
      countingContainer.style.display = 'none';
      if (counter) {
        clearInterval(counter);
      }
    });

    // timer count down
    function countDown() {
      let target = new Date().getTime() + defaultMinutes * 60 * 1000;

      let counter = setInterval(() => {
        let now = new Date().getTime();
        let dist = target - now;

        if (dist <= 0) {
          clearInterval(counter);
          updateTime2Display(timesUp);
          return;
        }

        let m = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
        let s = Math.floor((dist % (1000 * 60)) / 1000);

        time2Display = formatTime(m, s);

        updateTime2Display(time2Display);
      }, 500);

      return counter;
    }

    function updateTime2Display(value) {
      if (value !== undefined) {
        displayContainer.innerHTML = value;
        return;
      }
      displayContainer.innerHTML = formatTime(defaultMinutes, 0);
    }

    function formatTime(m, s) {
      let formattedTime =
        (m >= 10 ? m : '0' + m) + ' : ' + (s >= 10 ? s : '0' + s);
      if (m < 1) {
        return `<span style="color:${hardColor}">${formattedTime}</span>`;
      } else if (m < 5) {
        return `<span style="color:${mediumColor}">${formattedTime}</span>`;
      }
      return `<span style="color:${easyColor}">${formattedTime}</span>`;
    }
  }
})();
