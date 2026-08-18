/* ============================================================
   Terminal / 回忆终端 — xterm.js Windows CMD 仿真
   ============================================================ */
const termContainer = document.getElementById('term');

const fitAddon = new FitAddon.FitAddon();
const term = new Terminal({
  cursorBlink: true,
  fontFamily: '"Consolas", "Lucida Console", "Courier New", monospace',
  fontSize: 14,
  theme: {
    background: '#0c0c0c',
    foreground: '#cccccc',
    cursor: '#cccccc',
    black:         '#0c0c0c',
    red:           '#c50f1f',
    green:         '#13a10e',
    yellow:        '#c19c00',
    blue:          '#0039da',
    magenta:       '#881798',
    cyan:          '#3a96dd',
    white:         '#cccccc',
    brightBlack:   '#525252',
    brightRed:     '#e74856',
    brightGreen:   '#16c60c',
    brightYellow:  '#f9f1a5',
    brightBlue:    '#3b78ff',
    brightMagenta: '#b4009e',
    brightCyan:    '#61d6d6',
    brightWhite:   '#f2f2f2',
  },
  allowProposedApi: true,
});
term.loadAddon(fitAddon);
term.open(termContainer);

function fitTerminal() {
  try { fitAddon.fit(); } catch(e) {}
}
fitTerminal();
window.addEventListener('resize', fitTerminal);

// Focus terminal on click so keyboard input works immediately
termContainer.addEventListener('click', () => term.focus());
term.focus();

// Command history + current line tracker
const cmdHistory = [];
let historyIndex = -1;
let currentLine = '';

// ANSI color helpers
function color(code, text) {
  return '\x1b[' + code + 'm' + text + '\x1b[39m';
}

// Print a line, optionally colored
function tprint(text, code) {
  term.write('\r\n' + (code ? color(code, text) : text));
}

// Show CMD prompt and reset trackers (white prompt, not green)
function showPrompt() {
  currentLine = '';
  term.write('\r\n\x1b[37mC:\\Users\\16019>\x1b[39m');
}

// Process a command
function processCommand(input) {
  const cmd = input.trim();
  const lower = cmd.toLowerCase();

  if (cmd) {
    cmdHistory.push(cmd);
    historyIndex = cmdHistory.length;
  }

  if (!lower) { showPrompt(); return; }

  // Echo command in white
  tprint('C:\\Users\\16019> ' + cmd, '37');

  if (lower === 'help') {
    tprint('Memory Terminal v1.0 — Available commands:', '33');
    tprint('  help          Show this help', '37');
    tprint('  calc <expr>   Calculator (+ - * / %)', '37');
    tprint('  guestbook     Navigate to message board', '37');
    tprint('  gallery       Navigate to photo gallery', '37');
    tprint('  message <n>   Say something to someone', '37');
    tprint('  whoami        About yourself', '37');
    tprint('  date          Current date/time', '37');
    tprint('  time          Current time', '37');
    tprint('  cls           Clear screen', '37');
    tprint('  echo <text>   Print text', '37');
    tprint('  ver           System version', '37');
    tprint('  dir           List memories', '37');
  } else if (lower === 'cls' || lower === 'clear') {
    term.clear();
  } else if (lower === 'date') {
    tprint(new Date().toLocaleDateString('zh-CN'), '32');
  } else if (lower === 'time') {
    tprint(new Date().toLocaleTimeString('zh-CN'), '32');
  } else if (lower === 'ver') {
    tprint('Memory Terminal [Version 10.0.26100.9168]', '37');
  } else if (lower === 'whoami') {
    tprint('16019 — the one walking out of these doors for the last time.', '32');
  } else if (lower.startsWith('calc ')) {
    const expr = cmd.slice(5).trim();
    try {
      const sanitized = expr.replace(/[^0-9+\-*/().%\s]/g, '');
      const result = Function('"use strict"; return (' + sanitized + ')')();
      tprint(expr + ' = ' + result, '32');
    } catch {
      tprint('Error: invalid expression', '31');
    }
  } else if (lower === 'guestbook') {
    tprint('Navigating to message board...', '33');
    document.getElementById('board').scrollIntoView({ behavior: 'smooth' });
  } else if (lower === 'gallery') {
    tprint('Navigating to photo gallery...', '33');
    document.getElementById('gallery').scrollIntoView({ behavior: 'smooth' });
  } else if (lower.startsWith('message ')) {
    const name = cmd.slice(8).trim();
    if (!name) { tprint('Usage: message <name>', '31'); showPrompt(); return; }
    tprint(getKnownMessage(simpleHash(name), name), '32');
  } else if (lower === 'dir') {
    tprint(' Directory of C:\\memories', '33');
    tprint('', '37');
    tprint('  corridor.jpg      2025-06-23   CORRIDOR_MEMORIES', '36');
    tprint('  window.jpg        2025-06-20  窗外的天空', '36');
    tprint('  note.txt          2025-06-22   那些没说出口的话', '36');
    tprint('  medal.jpg         2025-05-18   光芒之下', '36');
    tprint('  naicong.jpg       2025-04-15   运动会', '36');
    tprint('', '37');
    tprint('  5 File(s)    memories kept', '37');
  } else if (lower.startsWith('echo ')) {
    tprint(cmd.slice(5), '37');
  } else if (lower === 'goodbye') {
    tprint('bye!', '35');
  } else if (lower === 'bye') {
    tprint('goodbye!', '35');
  } else {
    tprint(`'${cmd}' is not recognized. Type "help" for available commands.`, '31');
  }

  showPrompt();
}

// Simple hash for name lookup
function simpleHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h = h & h;
  }
  return Math.abs(h);
}

// Predefined responses keyed by hash modulo
function getKnownMessage(hash, name) {
  const messages = [
    `Hey ${name}! I'll miss you. Take care of yourself.`,
    `Hi ${name}! Remember those days in the corridor? Wish we could go back.`,
    `${name}... you were one of the good ones. Good luck ahead.`,
    `To ${name}: the best part of those three years was sharing them with people like you.`,
    `${name}, let's not lose touch. Wherever we go, remember this place.`,
  ];
  return messages[hash % messages.length];
}

// Boot sequence
const bootLines = [
  'Microsoft Windows [Version 10.0.26100.9168]',
  '(c) Microsoft Corporation. All rights reserved.',
  '',
];

function runBoot() {
  let i = 0;
  function next() {
    if (i < bootLines.length) {
      term.write(bootLines[i] + '\r');
      i++;
      setTimeout(next, 80);
    } else {
      tprint('Welcome to Memory Terminal v1.0', '32');
      tprint('Type "help" for available commands.', '33');
      tprint('', '37');
      showPrompt();
    }
  }
  next();
}

// Handle terminal input
term.onData(data => {
  if (data === '\r' || data === '\n') {
    processCommand(currentLine);
    currentLine = '';
    return;
  }
  if (data === '\x1b[A') {
    if (historyIndex > 0) {
      historyIndex--;
      const histCmd = cmdHistory[historyIndex];
      term.write('\r\x1b[' + (currentLine.length + 18) + 'G\x1b[2K\r\x1b[37mC:\\Users\\16019>\x1b[39m' + histCmd);
      currentLine = histCmd;
      term.write('\x1b[' + (18 + histCmd.length) + 'G');
    }
    return;
  }
  if (data === '\x1b[B') {
    if (historyIndex < cmdHistory.length - 1) {
      historyIndex++;
      const histCmd = cmdHistory[historyIndex];
      term.write('\r\x1b[' + (currentLine.length + 18) + 'G\x1b[2K\r\x1b[37mC:\\Users\\16019>\x1b[39m' + histCmd);
      currentLine = histCmd;
      term.write('\x1b[' + (18 + histCmd.length) + 'G');
    } else {
      historyIndex = cmdHistory.length;
      term.write('\r\x1b[' + (currentLine.length + 18) + 'G\x1b[2K\r\x1b[37mC:\\Users\\16019>\x1b[39m');
      currentLine = '';
    }
    return;
  }
  if (data === '\x7f' || data === '\b') {
    if (currentLine.length > 0) {
      currentLine = currentLine.slice(0, -1);
      term.write('\b \b');
    }
    return;
  }
  if (data === '\t') {
    const partial = currentLine.toLowerCase();
    const cmds = ['help','calc','guestbook','gallery','message','whoami',
                  'date','time','cls','clear','echo','ver','dir'];
    const matches = cmds.filter(c => c.startsWith(partial));
    if (matches.length === 1) {
      const rest = matches[0].slice(partial.length);
      currentLine += rest;
      term.write(rest);
    } else if (matches.length > 1) {
      term.write('\r\x1b[37mC:\\Users\\16019>\x1b[39m' + currentLine);
      term.write('\r\n' + matches.join('  '));
      term.write('\r\x1b[37mC:\\Users\\16019>\x1b[39m' + currentLine);
    }
    return;
  }
  if (data.length === 1 && data >= ' ' && data <= '~') {
    currentLine += data;
    term.write(data);
  } else {
    term.write(data);
  }
});

// Clear screen and run boot sequence
term.write('\x1b[2J\x1b[H');
runBoot();
