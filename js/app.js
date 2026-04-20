// 应用状态管理
const App = {
  currentScene: 'entry',
  audioPlaying: false,
  audioVolume: 0.7,
  radioFrequency: 10.0,
  currentCity: null,
  isPlaying: false,
  isTransitioning: false,
  visibleLetterLines: 0,

  // 初始化
  init() {
    this.setupScenes();
    this.setupEventListeners();
    this.setupAudio();
    this.showScene('entry');
    document.querySelector('.loading').style.display = 'none';
  },

  // 创建场景
  setupScenes() {
    const app = document.getElementById('app');

    // 入口场景
    app.innerHTML += this.createEntryScene();

    // 主场景
    app.innerHTML += this.createMainScene();

    // 记忆场景
    app.innerHTML += this.createMemoryScene();

    // 信件场景
    app.innerHTML += this.createLetterScene();
  },

  // 事件监听
  setupEventListeners() {
    // 黑胶唱片点击
    document.addEventListener('click', (e) => {
      if (e.target.closest('.vinyl-record') && !this.isPlaying) {
        this.startVinyl();
      }

      // 城市点击
      if (e.target.closest('.city-marker')) {
        const city = e.target.closest('.city-marker').dataset.city;
        this.showCityMemory(city);
      }

      // 返回按钮
      if (e.target.closest('.back-button')) {
        this.showScene('main');
      }

      // 信件图标
      if (e.target.closest('.letter-indicator')) {
        this.showScene('letter');
      }

      // 音频控制
      if (e.target.closest('.music-toggle')) {
        this.toggleAudio();
      }
    });

    // 频率滑块
    const frequencySlider = document.querySelector('.frequency-slider input');
    if (frequencySlider) {
      frequencySlider.addEventListener('input', (e) => {
        this.updateFrequency(parseFloat(e.target.value));
      });
    }

    // 音量滑块
    const volumeSlider = document.querySelector('.volume-slider');
    if (volumeSlider) {
      volumeSlider.addEventListener('input', (e) => {
        this.audioVolume = parseFloat(e.target.value);
        this.updateAudioVolume();
      });
    }
  },

  // 音频设置
  setupAudio() {
    this.mainAudio = document.getElementById('mainAudio');
    this.secretAudio = document.getElementById('secretAudio');

    // 创建音频上下文
    if (window.AudioContext || window.webkitAudioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  },

  // 创建入口场景
  createEntryScene() {
    return `
      <div id="entry-scene" class="scene hidden">
        <div class="entry-container">
          <div class="particles"></div>

          <div class="vinyl-player">
            <div class="tonearm" id="tonearm">
              <div class="tonearm-base"></div>
              <div class="tonearm-arm"></div>
              <div class="tonearm-head"></div>
            </div>

            <div class="vinyl-record" id="vinyl">
              <div class="vinyl-texture"></div>
              <div class="vinyl-label">
                <div class="label-text">MEMORIES</div>
                <div class="label-text small">FREQUENCY</div>
              </div>
              <div class="vinyl-shine"></div>
            </div>

            <div class="vinyl-base"></div>
          </div>

          <p class="vinyl-hint">Drop the needle to listen...</p>
          <h1 class="site-title">Memories Frequency</h1>
        </div>
      </div>
    `;
  },

  // 创建主场景
  createMainScene() {
    return `
      <div id="main-scene" class="scene hidden">
        <canvas id="globe-canvas"></canvas>

        <div class="music-control">
          <button class="music-toggle">🔊</button>
          <div class="volume-container">
            <input type="range" class="volume-slider" min="0" max="1" step="0.1" value="0.7">
          </div>
        </div>

        <div class="radio-tuner">
          <div class="radio-display">
            <span class="frequency-value">10.00</span>
            <span class="frequency-unit">Hz</span>
          </div>

          <div class="waveform" id="waveform"></div>

          <div class="frequency-slider">
            <input type="range" min="0" max="20" step="0.01" value="10" class="slider">
            <div class="frequency-marks">
              <span>0.00</span>
              <span>10.00</span>
              <span>20.00</span>
            </div>
          </div>

          <div class="letter-indicator hidden" id="letterIndicator">✉️</div>
        </div>

        <h1 class="main-title">Memories Frequency</h1>
        <p class="main-hint">Drag to explore • Click cities to listen</p>
      </div>
    `;
  },

  // 创建记忆场景
  createMemoryScene() {
    return `
      <div id="memory-scene" class="scene hidden">
        <div class="memory-background"></div>
        <h2 class="city-title"></h2>
        <div class="photo-cards-container"></div>
        <p class="memory-text"></p>
        <button class="back-button">← back to earth</button>
      </div>
    `;
  },

  // 创建信件场景
  createLetterScene() {
    return `
      <div id="letter-scene" class="scene hidden">
        <button class="letter-back-button">← back</button>
        <div class="letter-container">
          <div class="letter-paper">
            <div id="letterContent"></div>
            <div class="letter-signature hidden">— The one who waits</div>
          </div>
          <div class="envelope-effect">
            <div class="envelope-pattern"></div>
          </div>
        </div>
        <div class="letter-glow"></div>
      </div>
    `;
  },

  // 显示场景
  showScene(sceneName) {
    document.querySelectorAll('.scene').forEach(scene => {
      scene.classList.add('hidden');
    });

    const targetScene = document.getElementById(`${sceneName}-scene`);
    if (targetScene) {
      targetScene.classList.remove('hidden');
      this.currentScene = sceneName;

      if (sceneName === 'main') {
        this.initGlobe();
      } else if (sceneName === 'letter') {
        this.startLetterAnimation();
      }
    }
  },

  // 开始黑胶播放
  startVinyl() {
    if (this.isPlaying) return;

    this.isPlaying = true;

    // 唱针动画
    const tonearm = document.getElementById('tonearm');
    tonearm.style.transform = 'rotate(25deg) translateX(60px)';
    tonearm.style.transition = 'transform 1.5s ease-in-out';

    // 唱片旋转
    const vinyl = document.getElementById('vinyl');
    vinyl.classList.add('playing');

    // 播放音频
    this.mainAudio.play();
    this.audioPlaying = true;

    // 显示标题
    document.querySelector('.site-title').style.opacity = '1';

    // 4秒后过渡到主界面
    setTimeout(() => {
      this.transitionToMain();
    }, 4000);
  },

  // 过渡到主界面
  transitionToMain() {
    const entryScene = document.getElementById('entry-scene');
    entryScene.style.transition = 'opacity 2s, filter 2s';
    entryScene.style.opacity = '0';
    entryScene.style.filter = 'blur(10px)';

    setTimeout(() => {
      this.showScene('main');
    }, 2000);
  },

  // 初始化地球
  initGlobe() {
    if (this.globeInitialized) return;
    this.globeInitialized = true;

    const canvas = document.getElementById('globe-canvas');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // 创建地球
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const material = new THREE.MeshPhongMaterial({
      color: 0x64b5f6,
      emissive: 0x0a0a0a,
      shininess: 10
    });

    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);

    // 添加城市标记
    const cities = [
      { name: 'mexico', pos: this.latLonToVector3(19.4326, -99.1332, 1.02) },
      { name: 'guangzhou', pos: this.latLonToVector3(23.1291, 113.2644, 1.02) },
      { name: 'shantou', pos: this.latLonToVector3(23.3541, 116.7083, 1.02) }
    ];

    cities.forEach(city => {
      const markerGeometry = new THREE.SphereGeometry(0.02, 16, 16);
      const markerMaterial = new THREE.MeshBasicMaterial({
        color: 0xffb6c1,
        transparent: true,
        opacity: 0.8
      });

      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.copy(city.pos);
      marker.userData = { city: city.name };

      // 呼吸光环
      const ringGeometry = new THREE.RingGeometry(0.03, 0.05, 32);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0xffb6c1,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide
      });

      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.copy(city.pos);
      ring.lookAt(new THREE.Vector3(0, 0, 0));

      scene.add(marker);
      scene.add(ring);

      // 呼吸动画
      this.animateGlow(ring);
    });

    // 连接线
    this.createConnectionLines(scene, cities);

    // 添加星空
    this.createStars(scene);

    // 灯光
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    camera.position.z = 5;

    // 鼠标交互
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    canvas.addEventListener('click', (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children);

      if (intersects.length > 0) {
        const object = intersects[0].object;
        if (object.userData.city) {
          this.showCityMemory(object.userData.city);
        }
      }
    });

    // 动画循环
    const animate = () => {
      requestAnimationFrame(animate);

      globe.rotation.y += 0.001;

      renderer.render(scene, camera);
    };

    animate();

    // 窗口调整
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  },

  // 经纬度转3D坐标
  latLonToVector3(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);

    return new THREE.Vector3(x, y, z);
  },

  // 创建连接线
  createConnectionLines(scene, cities) {
    const points = [];
    points.push(cities[0].pos);
    points.push(new THREE.Vector3(0, 1.5, 0));
    points.push(cities[1].pos);
    points.push(new THREE.Vector3(0, -1.5, 0));
    points.push(cities[2].pos);

    const curve = new THREE.CatmullRomCurve3(points);
    const curvePoints = curve.getPoints(50);

    const geometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const material = new THREE.LineBasicMaterial({
      color: 0xffb6c1,
      transparent: true,
      opacity: 0.3
    });

    const line = new THREE.Line(geometry, material);
    scene.add(line);
  },

  // 创建星空
  createStars(scene) {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
      transparent: true,
      opacity: 0.6
    });

    const starsVertices = [];
    for (let i = 0; i < 200; i++) {
      const x = (Math.random() - 0.5) * 100;
      const y = (Math.random() - 0.5) * 100;
      const z = (Math.random() - 0.5) * 100;
      starsVertices.push(x, y, z);
    }

    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
  },

  // 呼吸动画
  animateGlow(mesh) {
    const animate = () => {
      mesh.material.opacity = 0.2 + Math.sin(Date.now() * 0.002) * 0.2;
      requestAnimationFrame(animate);
    };
    animate();
  },

  // 显示城市记忆
  showCityMemory(city) {
    this.currentCity = city;
    const cityData = this.getCityData(city);

    if (!cityData) return;

    // 更新场景内容
    document.querySelector('.city-title').textContent = cityData.title;

    // 创建照片卡片
    const container = document.querySelector('.photo-cards-container');
    container.innerHTML = '';

    cityData.images.forEach((image, index) => {
      const card = document.createElement('div');
      card.className = 'photo-card';
      card.style.transform = `rotate(${index * 5}deg)`;
      card.innerHTML = `
        <div class="polaroid-frame">
          <div class="photo-placeholder">
            <div class="photo-content">${image}</div>
          </div>
          <div class="polaroid-bottom">
            <div class="polaroid-text">${new Date().toLocaleDateString()}</div>
          </div>
        </div>
        <div class="photo-shadow"></div>
      `;

      // 添加漂浮动画
      this.addFloatAnimation(card, index);
      container.appendChild(card);
    });

    // 开始文字轮播
    this.startTextRotation(cityData.texts);

    this.showScene('memory');
  },

  // 获取城市数据
  getCityData(city) {
    const data = {
      mexico: {
        title: "Mexico City",
        images: ["Mexico City Photo 1", "Mexico City Photo 2", "Mexico City Photo 3"],
        texts: [
          "The air smelled like diesel and marigolds",
          "Street vendors calling, cathedral bells",
          "We got lost in the pink district at 3am",
          "Your Polaroids are still in my wallet"
        ]
      },
      guangzhou: {
        title: "Guangzhou",
        images: ["Guangzhou Photo 1", "Guangzhou Photo 2", "Guangzhou Photo 3"],
        texts: [
          "Pearl River fog at dawn",
          "The way you said my name in Cantonese",
          "Neon reflecting in puddles",
          "We never said goodbye properly"
        ]
      },
      shantou: {
        title: "Shantou",
        images: ["Shantou Photo 1", "Shantou Photo 2", "Shantou Photo 3"],
        texts: [
          "Grandmother's courtyard, jasmine tea",
          "The old harbor, fishing boats",
          "Your childhood stories",
          "Salt wind through broken shutters"
        ]
      }
    };

    return data[city];
  },

  // 添加漂浮动画
  addFloatAnimation(element, index) {
    const animate = () => {
      const time = Date.now() * 0.001;
      const y = Math.sin(time + index) * 10;
      const rotate = Math.sin(time * 0.5 + index) * 2;
      const originalTransform = element.style.transform;
      const rotateMatch = originalTransform.match(/rotate\((.*?)deg\)/);
      const baseRotate = rotateMatch ? rotateMatch[1] : 0;

      element.style.transform = `rotate(${baseRotate}deg) translateY(${y}px) rotate(${rotate}deg)`;
      requestAnimationFrame(animate);
    };
    animate();
  },

  // 开始文字轮播
  startTextRotation(texts) {
    let index = 0;
    const textElement = document.querySelector('.memory-text');

    const updateText = () => {
      textElement.textContent = texts[index];
      index = (index + 1) % texts.length;
    };

    updateText();
    setInterval(updateText, 4000);
  },

  // 更新频率
  updateFrequency(frequency) {
    this.radioFrequency = frequency;
    document.querySelector('.frequency-value').textContent = frequency.toFixed(2);

    // 检查特殊频率
    this.checkSpecialFrequencies(frequency);

    // 更新波形
    this.updateWaveform();
  },

  // 检查特殊频率
  checkSpecialFrequencies(frequency) {
    const specialFrequencies = [
      { value: 4.21, type: 'letter', tolerance: 0.05 },
      { value: 7.83, type: 'text', tolerance: 0.05, text: 'You are exactly where you need to be' },
      { value: 11.11, type: 'glitch', tolerance: 0.05 },
      { value: 16.04, type: 'audio', tolerance: 0.05 }
    ];

    const activeFreq = specialFrequencies.find(f =>
      Math.abs(frequency - f.value) <= f.tolerance
    );

    if (activeFreq) {
      this.triggerSpecialEvent(activeFreq);
    } else {
      document.body.classList.remove('glitch-active');
      document.getElementById('letterIndicator').classList.add('hidden');
    }
  },

  // 触发特殊事件
  triggerSpecialEvent(event) {
    switch (event.type) {
      case 'letter':
        document.getElementById('letterIndicator').classList.remove('hidden');
        break;
      case 'text':
        this.showHiddenText(event.text);
        break;
      case 'glitch':
        document.body.classList.add('glitch-active');
        setTimeout(() => {
          document.body.classList.remove('glitch-active');
        }, 2000);
        break;
      case 'audio':
        this.secretAudio.play();
        break;
    }
  },

  // 显示隐藏文字
  showHiddenText(text) {
    const div = document.createElement('div');
    div.className = 'hidden-text';
    div.textContent = text;
    document.body.appendChild(div);

    setTimeout(() => {
      div.remove();
    }, 3000);
  },

  // 更新波形
  updateWaveform() {
    const waveform = document.getElementById('waveform');
    if (!waveform || waveform.children.length === 0) {
      this.createWaveform();
      return;
    }

    Array.from(waveform.children).forEach(bar => {
      bar.style.height = `${Math.random() * 40 + 10}%`;
    });
  },

  // 创建波形
  createWaveform() {
    const waveform = document.getElementById('waveform');
    waveform.innerHTML = '';

    for (let i = 0; i < 40; i++) {
      const bar = document.createElement('div');
      bar.className = 'wave-bar';
      bar.style.animationDelay = `${i * 0.05}s`;
      waveform.appendChild(bar);
    }
  },

  // 切换音频
  toggleAudio() {
    this.audioPlaying = !this.audioPlaying;
    const button = document.querySelector('.music-toggle');

    if (this.audioPlaying) {
      this.mainAudio.play();
      button.textContent = '🔊';
    } else {
      this.mainAudio.pause();
      button.textContent = '🔇';
    }
  },

  // 更新音量
  updateAudioVolume() {
    this.mainAudio.volume = this.audioVolume;
  },

  // 开始信件动画
  startLetterAnimation() {
    const letterContent = document.getElementById('letterContent');
    const letterLines = [
      "Dear you,",
      "",
      "I found your frequency again last night.",
      "It was hiding between the static and the stars.",
      "",
      "Do you remember the way home from the airport?",
      "How we walked backwards to make the moment last?",
      "",
      "I've been collecting these fragments -",
      "Polaroids, ticket stubs, the way you said my name.",
      "They hum at 4.21 Hz when no one's listening.",
      "",
      "The cities miss you.",
      "Mexico's marigolds, Guangzhou's river fog,",
      "Even grandmother's jasmine has forgotten your hands.",
      "",
      "But the signal remains.",
      "Faint, like breath on glass.",
      "",
      "If you're receiving this,",
      "Meet me where the frequencies overlap.",
      "You know the place.",
      "",
      "— The one who waits"
    ];

    letterContent.innerHTML = '';

    letterLines.forEach((line, index) => {
      const div = document.createElement('div');
      div.className = `letter-line ${line === '' ? 'empty' : ''}`;
      div.textContent = line || '\u00A0';
      letterContent.appendChild(div);

      setTimeout(() => {
        div.style.opacity = '1';
      }, index * 800);
    });

    // 显示签名
    setTimeout(() => {
      document.querySelector('.letter-signature').classList.remove('hidden');
    }, letterLines.length * 800 + 1000);
  }
};

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});