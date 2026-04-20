export const frequencyEvents = [
  // 新增特定频率图片事件
  {
    freq: 3.25,
    type: "image",
    tolerance: 0.05,
    src: "/assets/freq-3.25.jpg"
  },
  {
    freq: 11.20,
    type: "image",
    tolerance: 0.05,
    src: "/assets/freq-11.20.jpg"
  },
  {
    freq: 12.21,
    type: "image",
    tolerance: 0.05,
    src: "/assets/freq-12.21.jpg"
  },

  // 保留原有的 4.21Hz 信封事件
  {
    freq: 4.21,
    type: "letter",
    tolerance: 0.02,
    displayType: "letterButton"
  }
  {
    freq: 5.21,
    type: "image",
    tolerance: 0.05,
    src: "/assets/freq-5.21.jpg"
  },
  {
    freq: 8.08,
    type: "image",
    tolerance: 0.05,
    src: "/assets/freq-8.08.jpg"
  },
  {
    freq: 10.00,
    type: "image",
    tolerance: 0.05,
    src: "/assets/freq-10.00.jpg"
  },
];
