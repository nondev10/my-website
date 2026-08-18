/* ============================================================
   Countdown Timer — shows "考试已结束" when past
   ============================================================ */
const TARGET_DATE = new Date('2025-07-05T00:00:00+08:00');

function updateCountdown() {
  const now = new Date();
  const diff = TARGET_DATE - now;
  const cdLabel  = document.getElementById('cd-label');
  const cdDisplay = document.getElementById('cd-display');

  if (diff <= 0) {
    const abs = Math.abs(diff);
    const d = Math.floor(abs / 86400000);
    const h = Math.floor((abs % 86400000) / 3600000);
    const m = Math.floor((abs % 3600000) / 60000);
    const s = Math.floor((abs % 60000) / 1000);
    cdDisplay.innerHTML =
      '<span class="num big">-' + d + '</span><span class="unit">天</span>' +
      '<span class="num">' + String(h).padStart(2,'0') + '</span><span class="unit">时</span>' +
      '<span class="num">' + String(m).padStart(2,'0') + '</span><span class="unit">分</span>' +
      '<span class="num">' + String(s).padStart(2,'0') + '</span><span class="unit">秒</span>';
    cdLabel.textContent = '距离考试结束还有';
    return;
  }
}

updateCountdown();
setInterval(updateCountdown, 1000);
