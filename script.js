// ========== 全局状态 ==========
const state = {
  participants: [],      // 所有参与者
  remaining: [],         // 剩余未中奖
  winners: [],           // 已中奖
  isRolling: false,      // 滚动状态
  rollTimer: null,       // 滚动定时器
  bgMusic: null,         // 背景音乐
  musicPlaying: false,   // 音乐播放状态
  celebrationSound: null,// 中奖音效
  fireworks: null,       // 烟花系统
  stars: [],             // 星星装饰
  currentPrize: 3,       // 当前选择的奖项 (1=一等奖, 2=二等奖, 3=三等奖)
  prizes: {              // 奖品名称
    1: 'iPhone 15',
    2: 'iPad Air',
    3: '小米手环'
  },
  prizeCounts: {         // 奖品数量
    1: 1,
    2: 2,
    3: 3
  },
  prizeWinners: {        // 各奖项已中奖人数
    1: 0,
    2: 0,
    3: 0
  }
};

// ========== 初始化 ==========
document.addEventListener('DOMContentLoaded', () => {
  init();
});

function init() {
  setupFireworks();
  createStars();
  loadSampleData();
  loadCelebrationSound();
  updatePrizeDisplay();
}

// ========== 星星装饰 ==========
function createStars() {
  const starCount = 15;
  const starSymbols = ['⭐', '✨', '🌟', '💫'];

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.textContent = starSymbols[Math.floor(Math.random() * starSymbols.length)];
    star.style.left = Math.random() * 100 + 'vw';
    star.style.top = Math.random() * 100 + 'vh';
    star.style.animationDelay = Math.random() * 2 + 's';
    star.style.fontSize = (15 + Math.random() * 15) + 'px';
    document.body.appendChild(star);
    state.stars.push(star);
  }
}

// ========== 加载中奖音效 ==========
function loadCelebrationSound() {
  try {
    state.celebrationSound = new Audio('celebration.mp3');
    state.celebrationSound.volume = 0.6;
  } catch (e) {
    console.log('中奖音效加载失败:', e);
  }
}

// ========== 播放中奖音效 ==========
function playCelebrationSound() {
  if (state.celebrationSound) {
    // 每次播放时重新创建，确保可以连续播放
    const sound = new Audio('celebration.mp3');
    sound.volume = 0.6;
    sound.play().catch(e => console.log('音效播放失败:', e));

    // 5秒后停止播放
    setTimeout(() => {
      sound.pause();
      sound.currentTime = 0;
    }, 5000);
  }
}

// ========== 播报中奖者名字 ==========
function announceWinner(name) {
  if ('speechSynthesis' in window) {
    // 停止之前的播报
    speechSynthesis.cancel();

    // 创建播报内容
    const prizeName = state.prizes[state.currentPrize];
    const text = `恭喜${name}获得${prizeName}！`;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 1;

    speechSynthesis.speak(utterance);
  } else {
    console.log('浏览器不支持语音播报');
  }
}

// ========== 奖项管理 ==========
function setupPrizes() {
  const modal = document.getElementById('prizeModal');
  modal.classList.add('show');

  // 填充当前值
  document.getElementById('prize1Input').value = state.prizes[1];
  document.getElementById('prize2Input').value = state.prizes[2];
  document.getElementById('prize3Input').value = state.prizes[3];
  document.getElementById('prize1Count').value = state.prizeCounts[1];
  document.getElementById('prize2Count').value = state.prizeCounts[2];
  document.getElementById('prize3Count').value = state.prizeCounts[3];
}

function closePrizeModal() {
  const modal = document.getElementById('prizeModal');
  modal.classList.remove('show');
}

function savePrizes() {
  state.prizes[1] = document.getElementById('prize1Input').value.trim() || '一等奖';
  state.prizes[2] = document.getElementById('prize2Input').value.trim() || '二等奖';
  state.prizes[3] = document.getElementById('prize3Input').value.trim() || '三等奖';

  const count1 = parseInt(document.getElementById('prize1Count').value) || 0;
  const count2 = parseInt(document.getElementById('prize2Count').value) || 0;
  const count3 = parseInt(document.getElementById('prize3Count').value) || 0;

  state.prizeCounts = { 1: count1, 2: count2, 3: count3 };

  // 重置已中奖人数（因为奖品数量改变了）
  state.prizeWinners = { 1: 0, 2: 0, 3: 0 };
  // 重新计算已中奖人数
  state.winners.forEach(winner => {
    if (state.prizeWinners[winner.prize] !== undefined) {
      state.prizeWinners[winner.prize]++;
    }
  });

  updatePrizeDisplay();
  closePrizeModal();
}

function selectPrize(prizeLevel) {
  state.currentPrize = prizeLevel;

  // 更新按钮样式
  document.querySelectorAll('.prize-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`.prize-btn[data-prize="${prizeLevel}"]`).classList.add('active');

  updatePrizeDisplay();
}

function updatePrizeDisplay() {
  const prizeNames = ['', '一等奖', '二等奖', '三等奖'];
  const remaining = state.prizeCounts[state.currentPrize] - state.prizeWinners[state.currentPrize];

  document.getElementById('currentPrize').textContent = prizeNames[state.currentPrize];
  document.getElementById('currentPrizeName').textContent =
    `${state.prizes[state.currentPrize]} (剩余: ${remaining}/${state.prizeCounts[state.currentPrize]})`;

  // 更新按钮显示剩余数量
  document.querySelectorAll('.prize-btn').forEach(btn => {
    const prize = parseInt(btn.dataset.prize);
    const remainingCount = state.prizeCounts[prize] - state.prizeWinners[prize];
    if (remainingCount <= 0) {
      btn.style.opacity = '0.5';
      btn.textContent = `${['', '一等奖', '二等奖', '三等奖'][prize]} (已抽完)`;
    } else {
      btn.style.opacity = '1';
      btn.textContent = `${['', '一等奖', '二等奖', '三等奖'][prize]} (剩余${remainingCount}个)`;
    }
  });
}

// ========== 名单导入 ==========
function importNames() {
  const modal = document.getElementById('importModal');
  modal.classList.add('show');
  document.getElementById('nameInput').focus();
}

function closeModal() {
  const modal = document.getElementById('importModal');
  modal.classList.remove('show');
}

function parseAndImport() {
  const input = document.getElementById('nameInput').value;
  const names = parseInput(input);

  if (names.length === 0) {
    alert('请输入至少一个名字！');
    return;
  }

  setParticipants(names);
  closeModal();
  document.getElementById('nameInput').value = '';
}

function parseInput(text) {
  return text.split('\n')
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const content = e.target.result;
    const names = parseInput(content);

    if (names.length === 0) {
      alert('文件中没有有效的名字！');
      return;
    }

    setParticipants(names);
    closeModal();
  };
  reader.readAsText(file, 'UTF-8');

  // 清空input，允许重复上传同一文件
  event.target.value = '';
}

function setParticipants(names) {
  // 去重
  const uniqueNames = [...new Set(names)];

  state.participants = uniqueNames;
  state.remaining = [...uniqueNames];
  state.winners = [];

  updateUI();
}

function loadSampleData() {
  const sampleNames = [
    '张伟', '李娜', '王芳', '刘洋', '陈静',
    '杨强', '黄梅', '赵丽', '周杰', '吴强',
    '徐明', '孙丽', '马超', '朱珠', '胡勇',
    '郭平', '何秀', '罗林', '高山', '林峰'
  ];

  state.participants = sampleNames;
  state.remaining = [...sampleNames];
  state.winners = [];

  updateUI();
}

// ========== 抽奖逻辑 ==========
function startLottery() {
  // 检查当前奖项是否已抽完
  const remaining = state.prizeCounts[state.currentPrize] - state.prizeWinners[state.currentPrize];
  if (remaining <= 0) {
    const prizeNames = ['', '一等奖', '二等奖', '三等奖'];
    alert(`${prizeNames[state.currentPrize]}已全部抽完！请选择其他奖项。`);
    return;
  }

  if (state.remaining.length === 0) {
    alert('所有参与者都已中奖！请点击"重置"开始新一轮抽奖。');
    return;
  }

  state.isRolling = true;
  updateButtonStates();

  const rollDuration = 5000; // 5秒（毫秒）
  const startTime = Date.now();
  let speed = 50; // 初始速度（毫秒）

  function roll() {
    if (!state.isRolling) return;

    const elapsed = Date.now() - startTime;

    // 随机显示一个名字
    const idx = Math.floor(Math.random() * state.remaining.length);
    displayWinner(state.remaining[idx]);

    // 根据剩余时间调整速度，越到后面越慢
    const remaining = rollDuration - elapsed;
    if (remaining < 3000) {
      // 最后3秒明显减速
      speed = 100 + (3000 - remaining) * 3;
    } else if (remaining < 6000) {
      // 中间3秒开始减速
      speed = 70 + (6000 - remaining) * 0.5;
    }

    // 时间到，选出中奖者
    if (elapsed >= rollDuration) {
      selectWinner();
      return;
    }

    state.rollTimer = setTimeout(roll, speed);
  }

  roll();
}

function stopLottery() {
  if (!state.isRolling) return;

  // 立即选出中奖者
  clearTimeout(state.rollTimer);
  selectWinner();
}

function selectWinner() {
  state.isRolling = false;

  // 最终随机选中
  const idx = Math.floor(Math.random() * state.remaining.length);
  const winner = state.remaining[idx];

  // 从剩余名单中移除
  state.remaining.splice(idx, 1);

  // 增加当前奖项的中奖人数
  state.prizeWinners[state.currentPrize]++;

  // 添加到中奖名单
  state.winners.push({
    name: winner,
    prize: state.currentPrize,
    prizeName: state.prizes[state.currentPrize],
    time: new Date().toLocaleString('zh-CN')
  });

  // 中奖时加大音乐音量
  if (state.bgMusic && state.musicPlaying) {
    state.bgMusic.volume = 0.9;  // 加大到90%
    // 3秒后恢复正常音量
    setTimeout(() => {
      if (state.bgMusic) {
        state.bgMusic.volume = 0.5;  // 恢复到50%
      }
    }, 3000);
  }

  // 显示并庆祝
  displayWinner(winner, true);
  announceWinner(winner);
  launchFireworks();
  createConfetti();

  updateUI();
  updatePrizeDisplay();  // 更新奖品数量显示
  updateButtonStates();
}

function displayWinner(name, isFinal = false) {
  const display = document.getElementById('winner-display');

  if (isFinal) {
    display.textContent = name;
    display.classList.add('announce');

    // 3秒后移除闪烁效果
    setTimeout(() => {
      display.classList.remove('announce');
    }, 3000);
  } else {
    display.textContent = name;
    display.classList.remove('announce');
  }
}

function resetLottery() {
  if (state.winners.length > 0) {
    const confirmed = confirm('确定要重置吗？所有中奖记录将被清空。');
    if (!confirmed) return;
  }

  state.remaining = [...state.participants];
  state.winners = [];
  state.isRolling = false;
  state.prizeWinners = { 1: 0, 2: 0, 3: 0 };

  if (state.rollTimer) {
    clearTimeout(state.rollTimer);
  }

  document.getElementById('winner-display').textContent = '准备抽奖';
  document.getElementById('winner-display').classList.remove('announce');

  updateUI();
  updatePrizeDisplay();
  updateButtonStates();
}

function updateButtonStates() {
  const startBtn = document.getElementById('startBtn');
  startBtn.disabled = state.isRolling || state.remaining.length === 0;
}

// ========== UI更新 ==========
function updateUI() {
  // 更新参与者计数
  document.getElementById('count').textContent = state.participants.length;

  // 更新参与者列表显示
  const participantsDiv = document.getElementById('participants');
  if (state.participants.length > 0) {
    participantsDiv.innerHTML = state.participants.join('、');
  } else {
    participantsDiv.innerHTML = '<em style="color: #999;">暂无参与者，请导入名单</em>';
  }

  // 更新中奖名单
  const winnersListDiv = document.getElementById('winners-list');
  if (state.winners.length === 0) {
    winnersListDiv.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">暂无中奖记录</p>';
  } else {
    const prizeEmojis = { 1: '🥇', 2: '🥈', 3: '🥉' };

    winnersListDiv.innerHTML = state.winners.map((winner, index) => {
      const prizeEmoji = prizeEmojis[winner.prize] || '🏆';
      return `
        <div class="winner-item">
          <span class="winner-rank">${prizeEmoji}</span>
          <div class="winner-info">
            <span class="winner-name">${winner.name}</span>
            <span class="winner-prize">${winner.prizeName}</span>
          </div>
          <span class="winner-time">${winner.time}</span>
        </div>
      `;
    }).join('');

    // 滚动到最新的中奖记录
    winnersListDiv.scrollTop = winnersListDiv.scrollHeight;
  }
}

// ========== 烟花系统 ==========
class FireworksSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.fireworks = [];
    this.resize();
    this.animate();

    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  launch() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 3;

    // 发射更多烟花，更持久
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        const x = centerX + (Math.random() - 0.5) * 600;
        const y = centerY + (Math.random() - 0.5) * 300;
        this.createFirework(x, y);
      }, i * 150);
    }

    // 再发射一轮
    setTimeout(() => {
      for (let i = 0; i < 8; i++) {
        setTimeout(() => {
          const x = Math.random() * this.canvas.width;
          const y = this.canvas.height / 4 + Math.random() * 200;
          this.createFirework(x, y);
        }, i * 150);
      }
    }, 1500);
  }

  createFirework(x, y) {
    const particleCount = 60 + Math.random() * 40;
    const hue = Math.random() * 360;

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 / particleCount) * i;
      const velocity = 2 + Math.random() * 5;

      this.fireworks.push({
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        alpha: 1,
        color: `hsl(${hue + Math.random() * 30}, 100%, 60%)`,
        size: 2 + Math.random() * 3,
        decay: 0.015 + Math.random() * 0.01
      });
    }
  }

  animate() {
    // 清除画布
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 只有在有粒子时才处理
    if (this.fireworks.length === 0) {
      requestAnimationFrame(() => this.animate());
      return;
    }

    // 更新和绘制所有粒子
    for (let i = this.fireworks.length - 1; i >= 0; i--) {
      const p = this.fireworks[i];

      // 更新位置
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.05;  // 重力
      p.vx *= 0.99;  // 空气阻力
      p.vy *= 0.99;
      p.alpha -= p.decay;

      // 绘制粒子
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fill();
      this.ctx.globalAlpha = 1;

      // 移除消失的粒子
      if (p.alpha <= 0) {
        this.fireworks.splice(i, 1);
      }
    }

    requestAnimationFrame(() => this.animate());
  }

  clear() {
    this.fireworks = [];
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

function setupFireworks() {
  const canvas = document.getElementById('fireworks');
  state.fireworks = new FireworksSystem(canvas);
}

function launchFireworks() {
  if (state.fireworks) {
    state.fireworks.launch();
  }
}

// ========== 纸屑效果 ==========
function createConfetti() {
  const colors = [
    '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1',
    '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'
  ];

  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDuration = (2 + Math.random() * 2) + 's';
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;

      // 随机形状
      const shapes = ['50%', '0%', '50% 0 50% 50%'];
      confetti.style.borderRadius = shapes[Math.floor(Math.random() * shapes.length)];

      document.body.appendChild(confetti);

      // 动画结束后移除元素
      setTimeout(() => {
        confetti.remove();
      }, 4000);
    }, i * 30);
  }
}

// ========== 音乐控制 ==========

// 处理用户上传的音乐
function handleMusicUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  // 停止当前播放的音乐
  if (state.bgMusic && state.musicPlaying) {
    state.bgMusic.pause();
    state.musicPlaying = false;
  }

  // 创建新的音频对象
  const url = URL.createObjectURL(file);
  state.bgMusic = new Audio(url);
  state.bgMusic.loop = true;
  state.bgMusic.volume = 0.5;

  // 启用播放按钮
  const btn = document.getElementById('musicBtn');
  btn.disabled = false;
  btn.textContent = '▶️ 播放音乐';

  // 显示文件名
  alert(`已加载音乐: ${file.name}`);
}

function toggleMusic() {
  const btn = document.getElementById('musicBtn');

  if (!state.bgMusic) {
    alert('请先点击"选择音乐"按钮上传音乐文件！');
    return;
  }

  if (state.musicPlaying) {
    state.bgMusic.pause();
    btn.textContent = '▶️ 播放音乐';
    state.musicPlaying = false;
  } else {
    state.bgMusic.play().catch(e => {
      console.log('播放失败:', e);
      alert('音乐播放失败。请确保已与页面进行交互（点击任意位置），然后重试。');
    });
    btn.textContent = '⏸️ 停止音乐';
    state.musicPlaying = true;
  }
}

// ========== 导出结果 ==========
function exportResults() {
  if (state.winners.length === 0) {
    alert('暂无中奖记录可导出！');
    return;
  }

  const prizeNames = { 1: '一等奖', 2: '二等奖', 3: '三等奖' };
  const lines = [
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '        年终抽奖结果',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    `抽奖时间: ${new Date().toLocaleString('zh-CN')}`,
    `参与人数: ${state.participants.length}人`,
    `中奖人数: ${state.winners.length}人`,
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    ''
  ];

  // 按奖项分组
  const prizeGroups = { 1: [], 2: [], 3: [] };
  state.winners.forEach(winner => {
    if (prizeGroups[winner.prize]) {
      prizeGroups[winner.prize].push(winner);
    }
  });

  // 按奖项顺序输出
  [1, 2, 3].forEach(prize => {
    if (prizeGroups[prize].length > 0) {
      lines.push(`【${prizeNames[prize]}】(${state.prizes[prize]})`);
      prizeGroups[prize].forEach(winner => {
        lines.push(`  ${winner.name} - ${winner.time}`);
      });
      lines.push('');
    }
  });

  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  lines.push('     恭喜所有中奖者！🎉');
  lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  const text = lines.join('\n');

  // 创建下载
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `抽奖结果_${new Date().toISOString().slice(0, 10)}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  // 同时复制到剪贴板
  copyToClipboard(text);
}

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      console.log('已复制到剪贴板');
    }).catch(err => {
      console.log('复制失败:', err);
    });
  } else {
    // 降级方案
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      console.log('已复制到剪贴板');
    } catch (err) {
      console.log('复制失败:', err);
    }
    document.body.removeChild(textarea);
  }
}

// ========== 键盘快捷键 ==========
document.addEventListener('keydown', (e) => {
  // Space: 开始/停止抽奖
  if (e.code === 'Space' && !e.target.matches('textarea, input')) {
    e.preventDefault();
    if (state.isRolling) {
      stopLottery();
    } else {
      startLottery();
    }
  }

  // Escape: 关闭弹窗
  if (e.code === 'Escape') {
    closeModal();
  }

  // Enter: 在弹窗中确认导入
  if (e.code === 'Enter' && document.getElementById('importModal').classList.contains('show')) {
    parseAndImport();
  }
});
