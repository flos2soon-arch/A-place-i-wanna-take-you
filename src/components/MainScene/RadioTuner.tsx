import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '../../store/appStore'
// @ts-ignore
import { radioConfig } from '../../data/radioConfig'
// @ts-ignore
import { frequencyEvents } from '../../data/frequencyEvents'
import './RadioTuner.css'

interface RadioTunerProps {
  onLetterClick?: () => void
}

const RadioTuner = ({ onLetterClick }: RadioTunerProps) => {
  const [frequency, setFrequency] = useState(6.0)
  const [activeEffect, setActiveEffect] = useState<string | null>(null)
  const [activeImage, setActiveImage] = useState<string | null>(null)

  const setRadioFrequency = useAppStore((state) => state.setRadioFrequency)

  // 检查频率 - 处理图片和信封事件
  useEffect(() => {
    // 检查是否在4.21Hz范围内（信件频率）
    const isLetterFrequency = Math.abs(frequency - 4.21) <= 0.01
    if (isLetterFrequency) {
      setActiveEffect('letter')
      setActiveImage(null)
    } else {
      setActiveEffect(null)
    }

    // 检查频率事件
    let foundImage = null
    for (const event of frequencyEvents) {
      if (Math.abs(frequency - event.freq) <= event.tolerance) {
        if (event.type === 'image') {
          foundImage = event.src
        }
        break
      }
    }

    setActiveImage(foundImage)
  }, [frequency])

  // 频率变化处理
  const handleFrequencyChange = (value: number) => {
    // 限制在 0-12.31 Hz 范围内
    const clampedValue = Math.max(radioConfig.frequencyRange.min, Math.min(radioConfig.frequencyRange.max, value))
    setFrequency(clampedValue)
    setRadioFrequency(clampedValue)
  }

  
  // 波形可视化
  const Waveform = () => {
    const bars = 40
    return (
      <div className="waveform">
        {[...Array(bars)].map((_, i) => (
          <div
            key={i}
            className="wave-bar"
            style={{
              height: `${Math.random() * 40 + 10}%`,
              animationDelay: `${i * 0.05}s`
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="radio-tuner">
      <div className="radio-display">
        <span className="frequency-value">{frequency.toFixed(2)}</span>
        <span className="frequency-unit">Hz</span>
      </div>

      <Waveform />

      <div className="frequency-slider">
        <input
          type="range"
          min={radioConfig.frequencyRange.min}
          max={radioConfig.frequencyRange.max}
          step="0.01"
          value={frequency}
          onChange={(e) => handleFrequencyChange(parseFloat(e.target.value))}
          className="slider"
        />
        <div className="frequency-marks">
          <span>0.00</span>
          <span>6.15</span>
          <span>12.31</span>
        </div>
      </div>

      {/* 中央信封图标 - 只在4.21Hz时显示 */}
      {activeEffect === 'letter' && (
        <motion.div
          className="central-envelope"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          whileHover={{ scale: 1.1 }}
          onClick={onLetterClick}
        >
          <span className="envelope-icon">✉️</span>
          <div className="envelope-glow" />
        </motion.div>
      )}

      {/* 中央图片显示 - 在特定频率时显示 */}
      {activeImage && (
        <motion.div
          className="central-image"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeIn" }}
        >
          <img src={activeImage} alt="Frequency image" className="frequency-image" />
        </motion.div>
      )}

      </div>
  )
}

export default RadioTuner