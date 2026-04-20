import { useRef, useEffect, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useAppStore } from '../../store/appStore'
import './VinylRecord.css'

interface VinylRecordProps {
  onPlay: () => void
  isPlaying: boolean
}

const VinylRecord = ({ onPlay, isPlaying }: VinylRecordProps) => {
  const controls = useAnimation()
  const tonearmRef = useRef<HTMLDivElement>(null)
  const [vinylSpinning, setVinylSpinning] = useState(false)
  const setAudioPlaying = useAppStore((state) => state.setAudioPlaying)

  useEffect(() => {
    if (isPlaying) {
      // 指针动画：只有一次运动，从初始位置移动到播放位置
      controls.start({
        rotate: -25,
        y: -5,
        x: 0, // Ensure no x displacement
        transition: {
          duration: 1.2,
          ease: "easeInOut"
        }
      }).then(() => {
        // 指针运动结束后，黑胶唱片开始旋转
        setVinylSpinning(true)
        // 黑胶开始旋转后，播放音频
        setAudioPlaying(true)
      })
    } else {
      // 重置状态 - 指针回到初始位置
      controls.set({
        rotate: -45,
        y: -20,
        x: 0 // Ensure no x displacement
      })
      setVinylSpinning(false)
    }
  }, [isPlaying, controls, setAudioPlaying])

  return (
    <div className="vinyl-container">
      <div className="vinyl-player">
        {/* 唱片机指针 */}
        <motion.div
          ref={tonearmRef}
          className="tonearm"
          animate={controls}
          initial={{ rotate: -45, y: -20 }}
          style={{ transformOrigin: 'right center' }}
        >
          <div className="tonearm-base" />
          <div className="tonearm-arm" />
          <div className="tonearm-head" />
        </motion.div>

        {/* 黑胶唱片 - 固定位置 */}
        <div
          className={`vinyl-record ${vinylSpinning ? 'playing' : ''} ${!isPlaying ? 'clickable' : ''}`}
          onClick={!isPlaying ? onPlay : undefined}
          style={{ pointerEvents: isPlaying ? 'none' : 'auto' }}
        >
          {/* 唱片纹理 */}
          <div className="vinyl-texture" />

          {/* 中心标签 - 包含可替换图片 */}
          <div className="vinyl-label">
            <img
              src="/images/center.jpg"
              alt="Center"
              className="center-image"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          </div>

          {/* 反光效果 */}
          <div className="vinyl-shine" />
        </div>

        {/* 底座 */}
        <div className="vinyl-base" />
      </div>

      {/* 提示文字 */}
      <motion.p
        className="vinyl-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        Drop the needle to listen...
      </motion.p>
    </div>
  )
}

export default VinylRecord