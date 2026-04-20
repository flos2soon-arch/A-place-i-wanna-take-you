import { useRef, useMemo, useState } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import { TextureLoader } from 'three'

interface EnhancedGlobeProps {
  onCityClick: (city: string) => void
}

const EnhancedGlobe = ({ onCityClick }: EnhancedGlobeProps) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  const [hoveredCity, setHoveredCity] = useState<string | null>(null)

  console.log('EnhancedGlobe rendering')

  // 加载地球夜晚纹理
  const earthTexture = useLoader(TextureLoader, '/images/earth-night.jpg')

  // 创建夜晚城市灯光纹理 - 更明亮细致
  const nightTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 2048
    canvas.height = 1024
    const ctx = canvas.getContext('2d')!

    // 深空背景
    ctx.fillStyle = '#050510'
    ctx.fillRect(0, 0, 2048, 1024)

    // 添加更细致的城市灯光
    for (let i = 0; i < 500; i++) {
      const x = Math.random() * 2048
      const y = Math.random() * 1024
      const size = Math.random() * 4 + 1
      const brightness = Math.random() * 0.9 + 0.3

      // 主光点
      ctx.fillStyle = `rgba(255, 220, 180, ${brightness})`
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()

      // 内层光晕
      const innerGradient = ctx.createRadialGradient(x, y, 0, x, y, size * 2)
      innerGradient.addColorStop(0, `rgba(255, 220, 180, ${brightness * 0.8})`)
      innerGradient.addColorStop(1, 'rgba(255, 220, 180, 0)')
      ctx.fillStyle = innerGradient
      ctx.beginPath()
      ctx.arc(x, y, size * 2, 0, Math.PI * 2)
      ctx.fill()

      // 外层光晕
      const outerGradient = ctx.createRadialGradient(x, y, 0, x, y, size * 5)
      outerGradient.addColorStop(0, `rgba(255, 200, 150, ${brightness * 0.3})`)
      outerGradient.addColorStop(1, 'rgba(143, 87, 34, 0)')
      ctx.fillStyle = outerGradient
      ctx.beginPath()
      ctx.arc(x, y, size * 5, 0, Math.PI * 2)
      ctx.fill()
    }

    return new THREE.CanvasTexture(canvas)
  }, [])

  // 城市坐标
  const cities = useMemo(() => [
    { name: 'mexico', position: [-99.1332, 19.4326, 0], label: 'You' },
    { name: 'guangzhou', position: [113.2644, 23.1291, 0], label: 'эM' }
  ], [])

  // 将经纬度转换为3D坐标
  const latLonToVector3 = (lat: number, lon: number, radius: number) => {
    const phi = (90 - lat) * (Math.PI / 180)
    const theta = (lon + 180) * (Math.PI / 180)

    const x = -(radius * Math.sin(phi) * Math.cos(theta))
    const z = radius * Math.sin(phi) * Math.sin(theta)
    const y = radius * Math.cos(phi)

    return new THREE.Vector3(x, y, z)
  }

  // 获取城市3D位置
  const cityPositions = useMemo(() => {
    return cities.map(city => ({
      ...city,
      vector: latLonToVector3(city.position[1], city.position[0], 1.7)
    }))
  }, [cities])

  useFrame(() => {
    if (groupRef.current) {
      // 缓慢自动旋转
      groupRef.current.rotation.y += 0.001
    }
  })

  return (
    <group ref={groupRef}>
      {/* 地球主体 */}
      <mesh ref={meshRef} position={[0, 0, 0]} scale={1.2}
        onPointerOver={() => document.body.style.cursor = 'grab'}
        onPointerOut={() => document.body.style.cursor = 'default'}
      >
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          map={earthTexture}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* 夜晚城市灯光 */}
      <mesh position={[0, 0, 0]} scale={1.005}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial
          map={nightTexture}
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 大气层效果 */}
      <mesh position={[0, 0, 0]} scale={1.1}>
        <sphereGeometry args={[1.01, 64, 64]} />
        <meshStandardMaterial
          color="#64b5f6"
          transparent
          opacity={0.12}
          emissive="#4a90e2"
          emissiveIntensity={0.3}
          side={THREE.BackSide}
          metalness={0.1}
          roughness={0.1}
        />
      </mesh>

      {/* 城市标记 - 钻石形状 + 名称标签 */}
      {cityPositions.map((city) => (
        <group key={city.name}>
          {/* 钻石形状地标 */}
          <mesh
            position={city.vector}
            onClick={(e) => {
              e.stopPropagation()
              console.log('City clicked:', city.name)
              onCityClick(city.name)
            }}
            rotation={[Math.PI / 4, 0, Math.PI / 4]}
            onPointerOver={() => setHoveredCity(city.name)}
            onPointerOut={() => setHoveredCity(null)}
          >
            <octahedronGeometry args={[0.04]} />
            <meshBasicMaterial
              color={hoveredCity === city.name ? "#ffffff" : "#dab3ff"}
              transparent
              opacity={0.9}
            />
          </mesh>

          {/* 发光效果 */}
          <mesh position={city.vector}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshBasicMaterial
              color="#e0bcff"
              transparent
              opacity={0.2}
            />
          </mesh>

          {/* 城市名称标签 */}
          <Text
            position={[city.vector.x * 1.01, city.vector.y * 1.15, city.vector.z * 1.05]}
            fontSize={0.05}
            color={hoveredCity === city.name ? "#ffffff" : "#e8c2ff"}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.01}
            outlineColor="#564c55"
            outlineOpacity={0.5}
            fillOpacity={1}
          >
            {city.label}
          </Text>
        </group>
      ))}

      {/* 发光连接线 */}
      <GlowingConnection cities={cityPositions} />
    </group>
  )
}

// 发光连接线组件
const GlowingConnection = ({ cities }: { cities: any[] }) => {
  const materialRef = useRef<THREE.LineBasicMaterial>(null)

  // 创建城市间的连接线
  const connectionPoints = useMemo(() => {
    if (cities.length < 2) return []

    const start = cities[0].vector
    const end = cities[1].vector

    // 第一条连接线（现有）
    const curve1 = new THREE.QuadraticBezierCurve3(
      start,
      new THREE.Vector3(
        (start.x + end.x) / 2 - 2.1,
        (start.y + end.y) / 2,
        (start.z + end.z) / 1.7
      ),
      end
    )

    return [...curve1.getPoints(50)]
  }, [cities])

  // 脉冲动画
  useFrame((state) => {
    if (materialRef.current) {
      const time = state.clock.getElapsedTime()
      const pulse = Math.sin(time * 2) * 0.3 + 0.7
      materialRef.current.opacity = pulse * 0.6
    }
  })

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={connectionPoints.length}
          array={new Float32Array(connectionPoints.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        ref={materialRef}
        color="#d08aff"
        transparent
        opacity={0.8}
      />
    </line>
  )
}

export default EnhancedGlobe
