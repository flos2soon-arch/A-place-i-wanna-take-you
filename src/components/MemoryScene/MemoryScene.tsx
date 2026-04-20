import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../../store/appStore'
// @ts-ignore
import { memoriesData } from '../../data/memoriesData'
import PhotoCard from './PhotoCard'
import './MemoryScene.css'

const MemoryScene = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const selectedCity = useAppStore((state) => state.selectedCity)

  // 使用选中的城市数据，默认为 mexico
  const cityData = selectedCity ? (memoriesData as any)[selectedCity] : memoriesData.mexico

  useEffect(() => {
    if (cityData) {
      // 图片自动切换
      const imageInterval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % cityData.images.length)
      }, 5000)

      // 文字自动切换
      const textInterval = setInterval(() => {
        setCurrentTextIndex((prev) => (prev + 1) % cityData.texts.length)
      }, 4000)

      return () => {
        clearInterval(imageInterval)
        clearInterval(textInterval)
      }
    }
  }, [cityData])

  const handleBack = () => {
    const setCurrentScene = useAppStore.getState().setCurrentScene
    setCurrentScene('main')
  }

  if (!cityData) return null

  return (
    <motion.div
      className="memory-scene"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* 模糊背景 */}
      <div className="memory-background" />

      {/* 城市标题 */}
      <motion.h2
        className="city-title"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        {cityData.title}
      </motion.h2>

      {/* 照片卡片 */}
      <div className="photo-cards-container">
        {cityData.images.map((image: any, index: number) => (
          <PhotoCard
            key={index}
            image={image}
            isActive={index === currentImageIndex}
            style={{
              transform: `rotate(${(index - currentImageIndex) * 5}deg) translateY(${Math.abs(index - currentImageIndex) * 20}px)`,
              zIndex: cityData.images.length - Math.abs(index - currentImageIndex)
            }}
          />
        ))}
      </div>

      {/* 文字内容 */}
      <AnimatePresence mode="wait">
        <motion.p
          key={currentTextIndex}
          className="memory-text"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8 }}
        >
          {cityData.texts[currentTextIndex]}
        </motion.p>
      </AnimatePresence>

      {/* 返回按钮 */}
      <motion.button
        className="back-button"
        onClick={handleBack}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        back to the earth
      </motion.button>
    </motion.div>
  )
}

export default MemoryScene