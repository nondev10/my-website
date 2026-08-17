/* ============================================================
   Random Quote (致谢末尾随机一句)
   ============================================================ */
const quotes = [
  { text: '黄昏黎明融作一片，\n今宵多多珍重。', source: '——丢莱卡《白夜狐步舞》' },
  { text: '多想用这歌声挥一挥手。', source: '——丢莱卡《白夜狐步舞》' },
  { text: '黄昏黎明融作一片，\n你可千万别睡着了。', source: '——丢莱卡《白夜狐步舞》' },
  { text: '那些代价终究会在尾奏中兑现为焰火。', source: '——丢莱卡《白夜狐步舞》' },
  { text: '过最君子的瘾，\n再次步入最温情漩涡。', source: '——丢莱卡《白夜狐步舞》' },
  { text: '关于危险是否，\n我们想象的太多。', source: '——丢莱卡《白夜狐步舞》' },
  { text: '你睡了，可时间它依然走着。\n你怕了，可恍然抬头梦却醒了。', source: '——福禄寿《我用什么把你留住》' },
  { text: '闪着光坠落，又依依不舍。\n所以生命啊，它璀璨如歌。', source: '——福禄寿《我用什么把你留住》' },
  { text: '只要能在有力气的年华中\n肆无忌惮地奔跑\n哪怕被无情地打倒', source: '——刘森《死如秋叶》' },
  { text: '快冲上绵延的云朵\n搬开那山峰你会看到我', source: '——刘森《死如秋叶》' },
  { text: '不远处有人在附和\n昨日写下的腐朽之歌', source: '——刘森《死如秋叶》' },
];

function setRandomQuote() {
  const q = quotes[Math.floor(Math.random() * quotes.length)];
  const el = document.getElementById('random-quote');
  const lines = q.text.split('\n');
  el.innerHTML = lines.map(l => '<div>' + l + '</div>').join('') +
    '<span class="source">' + q.source + '</span>';
}

setRandomQuote();
