/* ============================================================
   Message Board (弹幕) —— 从容器右边缘出发
   ============================================================ */
const boardEl      = document.getElementById('board-display');
const msgBtn       = document.getElementById('msg-btn');
const modalOverlay = document.getElementById('modal-overlay');
const mName        = document.getElementById('m-name');
const mRelate      = document.getElementById('m-relate');
const modalCancel  = document.getElementById('modal-cancel');
const modalSend    = document.getElementById('modal-send');
const mBody        = document.getElementById('msg-input');

const defaultMessages = [
  '再见了，我的初中时代。（示例）',
  '愿我们都能在各自的轨道上闪闪发光。（示例）',
  '谢谢你，陪我走过这段路。（示例）',
  '下次见面，希望我们都能成为更好的人。（示例）',
  '青春不散场。（示例）',
  '记得常联系。（示例）',
];

function spawnBullet(text) {
  const el = document.createElement('div');
  el.className = 'bullet';
  el.textContent = text;
  const maxTop = Math.max(boardEl.clientHeight - 30, 10);
  el.style.top = Math.random() * maxTop + 'px';
  el.style.animationDuration = (12 + Math.random() * 10) + 's';
  el.style.opacity = 0.6 + Math.random() * 0.4;
  boardEl.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
}

defaultMessages.forEach((msg, i) => {
  setTimeout(() => spawnBullet(msg), i * 1800);
});

msgBtn.addEventListener('click', () => modalOverlay.classList.add('active'));
modalCancel.addEventListener('click', () => modalOverlay.classList.remove('active'));
modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) modalOverlay.classList.remove('active');
});
modalSend.addEventListener('click', () => {
  const name = mName.value.trim();
  const message = mBody.value.trim();
  const relate = mRelate.value.trim();
  if (!name || !relate) { alert('请填写姓名和同学关系证明'); return; }
  spawnBullet(`${name}：${relate}`);
  const subject = encodeURIComponent(`[Leave a message] ${name} To 黄拾皓`);
  const body = encodeURIComponent(`${message}\n——${name}\n\n"${relate}"`);
  window.location.href = `mailto:talk@shihao.com?subject=${subject}&body=${body}`;
  mName.value = '';
  mRelate.value = '';
  modalOverlay.classList.remove('active');
});
