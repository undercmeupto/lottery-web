# 🧧 年终大抽奖 2025

<div align="center">

![GitHub Stars](https://img.shields.io/github/stars/undercmeupto/lottery-web?style=social)
![GitHub Forks](https://img.shields.io/github/forks/undercmeupto/lottery-web?style=social)
![License](https://img.shields.io/github/license/undercmeupto/lottery-web)

**一款喜庆的春节主题抽奖网页应用**

[在线演示](https://undercmeupto.github.io/lottery-web/) • [快速开始](#使用方法) • [功能介绍](#功能特色)

</div>

---

## ✨ 功能特色

### 🎨 视觉设计
- 🏮 **16个红灯笼** - 分布页面四周，带摆动动画
- 🔴 **春节红色主题** - 中国红 + 金色配色
- ⭐ **星星装饰** - 背景闪烁星星效果
- 🎊 **纸屑飘落** - 中奖庆祝动画

### 🎆 庆祝效果
- 🧨 **鞭炮爆炸** - 两挂鞭炮从天而降，依次爆炸
- 🎆 **烟花绽放** - Canvas 粒子系统实现
- 📢 **语音播报** - 自动播报中奖者名字
- 🔊 **音量增强** - 中奖时背景音乐自动放大

### 🏆 抽奖功能
- 🥇 **一、二、三等奖** - 自定义奖品名称和数量
- 📊 **数量控制** - 每个奖项设置独立数量
- 🎲 **5秒倒计时** - 名字滚动后自动停止
- 🚫 **防重复中奖** - 已中奖者自动移除

### 📁 数据管理
- 📋 **名单导入** - 手动输入 / 文件上传 / 示例数据
- 💾 **结果导出** - 按奖项分组导出
- 🔄 **一键重置** - 清空所有记录重新开始

### 🎵 音频支持
- 🎶 **自定义音乐** - 上传自己的背景音乐
- 🔁 **循环播放** - 音乐自动循环
- ⏯️ **播放控制** - 随时播放/停止

---

## 🚀 在线演示

访问 **[undercmeupto.github.io/lottery-web](https://undercmeupto.github.io/lottery-web/)** 立即体验！

![演示截图](https://via.placeholder.com/800x450/C41E3A/FFD700?text=🏮+年终大抽奖+2025+🏮)

---

## 📦 使用方法

### 方式一：在线使用（推荐）

直接访问：https://undercmeupto.github.io/lottery-web/

### 方式二：本地运行

1. **克隆仓库**
```bash
git clone https://github.com/undercmeupto/lottery-web.git
cd lottery-web
```

2. **打开网页**
```bash
# 用浏览器打开 index.html
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux
```

### 方式三：本地服务器

```bash
# Python
python -m http.server 8000

# Node.js
npx http-server
```

然后访问 `http://localhost:8000`

---

## 🎮 操作指南

### 1️⃣ 设置奖项

点击 **"🏆 设置奖项"** 按钮：
- 设置一、二、三等奖的名称
- 设置每个奖项的数量
- 保存设置

### 2️⃣ 导入名单

点击 **"📁 导入名单"** 按钮：
- 手动输入名字（每行一个）
- 上传 TXT/CSV 文件
- 或使用示例数据快速体验

### 3️⃣ 选择奖项

点击奖项按钮选择要抽取的奖项：
- 一等奖 (剩余 X 个)
- 二等奖 (剩余 X 个)
- 三等奖 (剩余 X 个)

### 4️⃣ 开始抽奖

点击 **"开始抽奖"** 按钮：
- 名字快速滚动 5 秒
- 自动停止并显示中奖者
- 触发庆祝效果（鞭炮 + 烟花 + 语音）
- 自动扣除奖项数量

### 5️⃣ 导出结果

点击 **"💾 导出结果"** 按钮：
- 自动下载 TXT 文件
- 按奖项分组显示
- 同时复制到剪贴板

---

## ⌨️ 快捷键

| 按键 | 功能 |
|------|------|
| `空格` | 开始抽奖 |
| `Esc` | 关闭弹窗 |
| `Enter` | 确认导入 |

---

## 📁 文件结构

```
lottery-web/
├── index.html          # 主页面
├── style.css           # 样式文件
├── script.js           # 脚本逻辑
├── bg-music.mp3        # 背景音乐（可选）
├── celebration.mp3     # 庆祝音效（可选）
└── README.md           # 说明文档
```

---

## 🎨 颜色方案

```css
/* 中国红系列 */
--red-primary: #C41E3A    /* 主红色 */
--red-dark: #8B0000       /* 深红色 */
--red-light: #E64C54      /* 浅红色 */
--red-bright: #FF0000     /* 鲜红色 */

/* 金色系 */
--gold: #FFD700           /* 金色 */
--gold-light: #FFF8DC     /* 淡金色 */
--gold-dark: #DAA520      /* 深金色 */
```

---

## 🛠️ 技术栈

- **HTML5** - 语义化标签
- **CSS3** - Flexbox、动画、渐变
- **JavaScript ES6+** - 模块化、异步处理
- **Canvas API** - 烟花粒子系统
- **Web Speech API** - 语音播报
- **File API** - 文件导入导出

---

## 🌐 浏览器兼容性

| 浏览器 | 最低版本 |
|--------|----------|
| Chrome | 90+ ✅ |
| Firefox | 88+ ✅ |
| Safari | 14+ ✅ |
| Edge | 90+ ✅ |

---

## 📝 更新日志

### v1.0.0 (2025-02-06)
- ✨ 初始版本发布
- 🏆 支持一、二、三等奖设置
- 🧨 鞭炮庆祝效果
- 🎆 烟花粒子系统
- 📢 语音播报中奖者
- 📁 名单导入/导出
- 🎵 自定义背景音乐

---

## 📄 许可证

[MIT License](LICENSE)

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

<div align="center">

**如果这个项目对你有帮助，请给个 ⭐️ Star！**

Made with ❤️ by [undercmeupto](https://github.com/undercmeupto)

🎉🧧 祝您抽奖愉快！🧧🎉

</div>
