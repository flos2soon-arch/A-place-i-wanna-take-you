import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface Star {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  delay: number
  symbol: string
}

const symbols = ['♡', '☆', '†', '◇', '◆', '★', '♥', '♦', '♣', '♠', '♪', '♫', '☼', '☽', '☾', '♦', '♣']

const MouseStars = () => {
  const [stars, setStars] = useState<Star[]>([])
  const starIdRef = useRef(0)
  const lastStarTimeRef = useRef(Date.now())

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // 控制星星生成频率
      const now = Date.now()
      if (now - lastStarTimeRef.current > 70) { // 每70ms生成一个星星
        const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)]
        const newStar: Star = {
          id: starIdRef.current++,
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 16 + 12, // 12-28px，更小一些
          opacity: 1,
          delay: Math.random() * 0.3,
          symbol: randomSymbol
        }

        setStars(prev => [...prev, newStar])

        // 2秒后移除星星
        setTimeout(() => {
          setStars(prev => prev.filter(star => star.id !== newStar.id))
        }, 800)

        lastStarTimeRef.current = now
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="mouse-stars-container" style={{ pointerEvents: 'none', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 999 }}>
      {stars.map(star => (
        <motion.div
          key={star.id}
          className="star"
          initial={{
            x: star.x,
            y: star.y,
            opacity: 0,
            scale: 0
          }}
          animate={{
            x: star.x,
            y: star.y,
            opacity: star.opacity,
            scale: 1
          }}
          exit={{
            opacity: 0,
            scale: 0.5
          }}
          transition={{
            duration: 0.5,
            delay: star.delay,
            ease: "easeOut"
          }}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            fontSize: `${star.size}px`,
            color: `rgba(255, 255, 255, ${star.opacity})`,
            textShadow: '0 0 10px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.4)',
            pointerEvents: 'none',
            transform: 'translate(-50%, -50%)'
          }}
        >
          {star.symbol}
        </motion.div>
      ))}
    </div>
  )
}

export default MouseStars