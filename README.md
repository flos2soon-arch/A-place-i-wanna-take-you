# Memories Frequency - 纯静态版本

这是一个无需安装依赖的纯静态网站版本，直接打开 `index.html` 即可运行。

## 🚀 使用方法

1. 下载整个项目文件夹
2. 直接双击打开 `index.html` 文件
3. 或使用本地服务器（如 VS Code Live Server）

## 📁 文件结构

```
memories-frequency/
├── index.html          # 主页面
├── css/
│   └── styles.css      # 样式文件
├── js/
│   └── app.js          # 应用逻辑
└── README.md           # 说明文档
```

## 🎨 特性

- ✅ 纯HTML/CSS/JavaScript，无需构建
- ✅ 集成Three.js（通过CDN）
- ✅ 黑胶唱片入口动画
- ✅ 3D交互地球
- ✅ 收音机调谐器
- ✅ 城市记忆展示
- ✅ 隐藏信件彩蛋
- ✅ 响应式设计

## 🎵 音频说明

由于浏览器限制，音频使用占位数据。如需真实音频：

1. 准备 `main.mp3` 和 `secret.mp3` 文件
2. 将音频文件放在项目目录
3. 修改 `js/app.js` 中的音频路径

## 🖼️ 图片说明

地球纹理使用纯色替代。如需真实纹理：

1. 准备 `earth-day.jpg` 和 `earth-night.jpg`
2. 修改 `initGlobe()` 函数中的材质部分

## ⚠️ 注意事项

- 某些浏览器可能限制本地文件访问
- 建议使用现代浏览器（Chrome/Firefox/Edge）
- 移动端体验可能略有差异

## 🛠️ 自定义

所有配置都在 `js/app.js` 中：
- 城市数据：`getCityData()` 函数
- 特殊频率：`checkSpecialFrequencies()` 函数
- 信件内容：`startLetterAnimation()` 函数

## 🌟 体验提示

1. 点击黑胶唱片中心开始
2. 拖动地球探索三个城市
3. 点击城市标记查看记忆
4. 调节收音机频率发现彩蛋
5. 4.21 Hz 有特殊惊喜

享受这段频率之旅 🎶