export const radioConfig = {
  frequencyRange: {
    min: 0,
    max: 12.31
  },
  specialFrequencies: [
    {
      value: 3.25,
      type: 'image',
      tolerance: 0.05,
      content: 'memories-frequency/public/assets/freq-12.21.jpg'
    },
    {
      value: 4.21,
      type: 'letter',
      tolerance: 0.05,
      content: {
        icon: '✉️',
        effect: 'pulse'
      }
    },
    {
      value: 11.11,
      type: 'glitch',
      tolerance: 0.05,
      content: {
        duration: 2000,
        intensity: 0.3
      }
    }
  ]
};