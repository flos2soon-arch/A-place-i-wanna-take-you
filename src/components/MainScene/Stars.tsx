import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const Stars = () => {
  const starsRef = useRef<THREE.Points>(null)

  // 创建多层星星背景
  const { starPositions, starColors, starSizes } = useMemo(() => {
    const count = 5000
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // 创建更大范围的星星分布
      positions[i * 3] = (Math.random() - 0.5) * 500
      positions[i * 3 + 1] = (Math.random() - 0.5) * 500
      positions[i * 3 + 2] = (Math.random() - 0.5) * 500

      // 随机颜色（白色、蓝色、淡黄色）
      const colorChoice = Math.random()
      if (colorChoice > 0.9) {
        // 淡蓝色星星
        colors[i * 3] = 0.7
        colors[i * 3 + 1] = 0.8
        colors[i * 3 + 2] = 1.0
      } else if (colorChoice > 0.8) {
        // 淡黄色星星
        colors[i * 3] = 1.0
        colors[i * 3 + 1] = 0.95
        colors[i * 3 + 2] = 0.8
      } else {
        // 白色星星
        colors[i * 3] = 1.0
        colors[i * 3 + 1] = 1.0
        colors[i * 3 + 2] = 1.0
      }

      // 随机大小
      sizes[i] = Math.random() * 2 + 0.5
    }

    return { starPositions: positions, starColors: colors, starSizes: sizes }
  }, [])

  useFrame((state) => {
    if (starsRef.current) {
      // 缓慢旋转星空
      starsRef.current.rotation.x = state.clock.elapsedTime * 0.00005
      starsRef.current.rotation.y = state.clock.elapsedTime * 0.0001
    }
  })

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={5000}
          array={starPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={5000}
          array={starColors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={5000}
          array={starSizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.6}
        sizeAttenuation
        transparent
        opacity={1}
        vertexColors
        depthWrite={false}
      />
    </points>
  )
}

export default Stars