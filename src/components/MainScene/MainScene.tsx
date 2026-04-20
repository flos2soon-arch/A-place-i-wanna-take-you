import { useState, Suspense, useEffect } from 'react'
import { useAppStore } from '../../store/appStore'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { motion } from 'framer-motion'
import EnhancedGlobe from './EnhancedGlobe'
import RadioTuner from './RadioTuner'
import MusicControl from './MusicControl'
import Stars from './Stars'
import './MainScene.css'

const MainScene = () => {
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const setCurrentScene = useAppStore((state) => state.setCurrentScene)
  const setSelectedCity = useAppStore((state) => state.setSelectedCity)

  const handleCityClick = (city: string) => {
    console.log('City clicked:', city)
    setSelectedCity(city)
    setCurrentScene('memory')
  }

  const handleLetterClick = () => {
    setCurrentScene('letter')
  }

  const handleCanvasCreated = () => {
    console.log('Canvas created successfully')
    setIsLoading(false)
  }

  const handleCanvasError = (error: any) => {
    console.error('Canvas error:', error)
    setHasError(true)
  }

  // 错误边界处理
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('MainScene error:', event.error)
      setHasError(false)
    }

    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  if (hasError) {
    // 错误时不显示任何内容
    return null
  }

  return (
    <motion.div
      className="main-scene"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      {/* 背景效果 */}
      <div className="main-background" />

      {/* 3D场景 */}
      <div className="canvas-container">
        {isLoading && <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'white',
          zIndex: 1000
        }}>Loading 3D Scene...</div>}
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          style={{ background: '#0a0a0a' }}
          onCreated={handleCanvasCreated}
          onError={handleCanvasError}
        >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#64b5f6" />

        <Suspense fallback={null}>
          <Stars />
          <EnhancedGlobe onCityClick={handleCityClick} />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={3}
          maxDistance={8}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
      </div>

      {/* UI层 */}
      <MusicControl />
      <RadioTuner onLetterClick={handleLetterClick} />

      {/* 顶部标题 */}
      <motion.h1
        className="site-title-top"
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        animate={{ opacity: 0.8, filter: 'blur(0px)' }}
        transition={{ delay: 1, duration: 2 }}
      >
        M3mØries Fr3queη€y
      </motion.h1>

      {/* 提示文字 */}
      <motion.p
        className="main-hint"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 2, duration: 2 }}
      >
        Drag to explore • Click cities to listen
      </motion.p>
    </motion.div>
  )
}

export default MainScene