import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../../store/appStore'
// @ts-ignore
import { letterData } from '../../data/letterData'
import './LetterScene.css'

const LetterScene = () => {
  const [visibleLines, setVisibleLines] = useState(0)

  const setCurrentScene = useAppStore((state) => state.setCurrentScene)
  const setLetterVisible = useAppStore((state) => state.setLetterVisible)

  useEffect(() => {
    // 逐行显示文字
    const interval = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev >= letterData.lines.length) {
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 800)

    return () => clearInterval(interval)
  }, [])

  const handleBack = () => {
    setLetterVisible(false)
    setCurrentScene('main')
  }

  const lineVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: "easeOut"
      }
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 1,
        ease: "easeInOut"
      }
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="letter-scene"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        {/* 返回按钮 */}
        <motion.button
          className="letter-back-button"
          onClick={handleBack}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 2 }}
          whileHover={{ opacity: 1 }}
        >
          &lt; back to the earth
        </motion.button>

        {/* 信件内容 */}
        <motion.div
          className="letter-container"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div className="letter-paper">
            {letterData.lines.map((line: string, index: number) => (
              <motion.div
                key={index}
                className={`letter-line ${line === '' ? 'empty' : ''}`}
                variants={lineVariants}
                initial="hidden"
                animate={index < visibleLines ? "visible" : "hidden"}
                custom={index}
              >
                  {line || '\u00A0'}
              </motion.div>
            ))}

            {/* 签名 */}
            <motion.div
              className="letter-signature"
              initial={{ opacity: 0 }}
              animate={{ opacity: visibleLines >= letterData.lines.length ? 1 : 0 }}
              transition={{ delay: 1, duration: 2 }}
            >
              — Yours, Wanruwu♡
            </motion.div>
          </motion.div>

          {/* 信封效果 */}
          <motion.div
            className="envelope-effect"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ delay: 0.5, duration: 2 }}
          >
            <div className="envelope-pattern" />
          </motion.div>
        </motion.div>

        {/* 微妙的光效 */}
        <motion.div
          className="letter-glow"
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </AnimatePresence>
  )
}

export default LetterScene