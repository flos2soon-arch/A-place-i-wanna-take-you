import { useRef, useMemo } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { TextureLoader, DoubleSide } from 'three'
import * as THREE from 'three'

interface GlobeProps {
  onCityClick: (city: string) => void
}

const Globe = ({ onCityClick }: GlobeProps) => {
  const meshRef = useRef<THREE.Mesh>(null)

  // 创建地球纹理（使用占位图）- 添加错误处理
  let earthTexture, nightTexture
  try {
    earthTexture = useLoader(TextureLoader, '/images/earth-day.jpg')
    nightTexture = useLoader(TextureLoader, '/images/earth-night.jpg')
  } catch (error) {
    console.warn('Failed to load earth textures:', error)
    // 创建默认材质
    earthTexture = '/images/earth-day.jpg'
    nightTexture = '/images/earth-night.jpg'
  }

  // 如果没有纹理，创建程序化地球
  if (!earthTexture) {
    console.log('Using procedural earth texture')
  }

  // 城市坐标
  const cities = useMemo(() => [
    { name: 'mexico', position: [-99.1332, 19.4326, 0], label: 'Mexico City' },
    { name: 'guangzhou', position: [113.2644, 23.1291, 0], label: 'Guangzhou' },
    { name: 'shantou', position: [116.7083, 23.3541, 0], label: 'Shantou' }
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
      vector: latLonToVector3(city.position[1], city.position[0], 2.02)
    }))
  }, [cities])

  useFrame(() => {
    if (meshRef.current) {
      // 缓慢自动旋转
      meshRef.current.rotation.y += 0.001
    }
  })

  return (
    <group>
      {/* 地球主体 - 简化版本 */}
      <mesh ref={meshRef} position={[0, 0, 0]} scale={1.5}
        onPointerOver={() => document.body.style.cursor = 'grab'}
        onPointerOut={() => document.body.style.cursor = 'default'}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#1a4f8a"
          map={earthTexture || undefined}
          roughness={0.9}
          metalness={0.1}
          emissive="#0a1a3a"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* 夜晚城市灯光 */}
      {nightTexture && (
        <mesh position={[0, 0, 0]} scale={1.51}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshBasicMaterial
            map={nightTexture}
            transparent
            opacity={0.3}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* 大气层效果 */}
      <mesh position={[0, 0, 0]} scale={1.55}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial
          color="#64b5f6"
          transparent
          opacity={0.1}
          side={DoubleSide}
        />
      </mesh>

      {/* 城市标记 - 简化版本 */}
      {cityPositions.map((city) => (
        <group key={city.name}>
          {/* 城市光点 */}
          <mesh
            position={city.vector}
            onClick={(e) => {
              e.stopPropagation()
              onCityClick(city.name)
            }}
          >
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial
              color="#ffb6c1"
              transparent
              opacity={0.9}
            />
          </mesh>

          {/* 呼吸光环 */}
          <mesh position={city.vector}>
            <ringGeometry args={[0.08, 0.12, 16]} />
            <meshBasicMaterial
              color="#ffb6c1"
              transparent
              opacity={0.6}
              side={DoubleSide}
            />
          </mesh>
        </group>
      ))}

      {/* 连接线 */}
      <ConnectionLines cities={cityPositions} />
    </group>
  )
}

// 连接线组件 - 简化版本
const ConnectionLines = ({ cities }: { cities: any[] }) => {
  const points = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      cities[0].vector,
      new THREE.Vector3(0, 1.5, 0),
      cities[1].vector,
      new THREE.Vector3(0, -1.5, 0),
      cities[2].vector
    ])
    return curve.getPoints(20)
  }, [cities])

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#ffb6c1" transparent opacity={0.3} />
    </line>
  )
}

export default Globe