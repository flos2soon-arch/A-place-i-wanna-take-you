import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../../store/appStore'
import VinylRecord from './VinylRecord'
import './EntryScreen.css'

const EntryScreen = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showTitle, setShowTitle] = useState(false)
  const setCurrentScene = useAppStore((state) => state.setCurrentScene)

  const handlePlay = () => {
    if (!isPlaying) {
      setIsPlaying(true)

      // 黑胶开始旋转后，延迟显示标题
      setTimeout(() => {
        setShowTitle(true)
      }, 1000)

      // 延长进入主界面的时间（原3.5秒 + 2秒 = 5.5秒）
      setTimeout(() => {
        setIsTransitioning(true)
        setTimeout(() => {
          setCurrentScene('main')
          // 音频继续播放，不停止
        }, 2000)
      }, 5500)
    }
  }

  return (
    <AnimatePresence>
      {!isTransitioning ? (
        <motion.div
          className="entry-screen"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            filter: 'blur(30px)',
            scale: 1.3,
            transition: { duration: 3, ease: 'easeInOut' }
          }}
        >
          {/* 背景粒子效果 */}
          <div className="particles">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="particle"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 0.5, 0],
                  y: [-100, 100],
                }}
                transition={{
                  duration: 3 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut"
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>

          {/* 音乐符号飘动 - 增强版：更亮、更多、更散落 */}
          <div className="music-symbols">
            {[
              '☆', '♡', '♫', '♪', '♬', '★', '✶', '♩', '♭', '♮', '♯', '✧', '✦', '❋',
              '✩', '✪', '✫', '✬', '✭', '✮', '✯', '✰', '⋆', '✱', '✲', '✳', '✴', '✵',
              '♫', '♬', '♭', '♮', '♯', '♪', '♩', '♫', '♬', '♪', '♩'
            ].map((symbol, i) => (
              <motion.div
                key={i}
                className="music-symbol"
                initial={{ opacity: 0, scale: 0 }}
                animate={isPlaying ? {
                  opacity: [0, 1, 0.8, 0],
                  scale: [0.3, 1.8, 1.4],
                  y: [Math.random() * 200 - 100, Math.random() * 400 - 200],
                  x: [(Math.random() - 0.5) * 600, (Math.random() - 0.5) * 800],
                  rotate: [0, Math.random() * 720]
                } : {}}
                transition={{
                  duration: 15 + Math.random() * 12,
                  repeat: Infinity,
                  delay: Math.random() * 10,
                  ease: "easeInOut"
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  fontSize: `${Math.random() * 30 + 24}px`,
                  textShadow: '0 0 30px rgba(255, 200, 220, 1), 0 0 60px rgba(255, 182, 193, 0.8), 0 0 90px rgba(255, 182, 193, 0.5)',
                  filter: 'drop-shadow(0 0 15px rgba(255, 200, 220, 1))'
                }}
              >
                {symbol}
              </motion.div>
            ))}
          </div>

          <VinylRecord onPlay={handlePlay} isPlaying={isPlaying} />

          {/* 标题 - 居中显示，缓慢浮现 */}
          <motion.h1
            className="site-title"
            initial={{ opacity: 0, filter: 'blur(10px)' }}
            animate={showTitle ? { opacity: 1, filter: 'blur(0px)' } : {}}
            transition={{ duration: 3, ease: "easeOut" }}
          >
            M3mØries Fr3queη€y
          </motion.h1>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default EntryScreen