import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface SimpleGlobeProps {
  onCityClick: (city: string) => void
}

const SimpleGlobe = ({ onCityClick }: SimpleGlobeProps) => {
  const meshRef = useRef<THREE.Mesh>(null)

  // 城市坐标（简化版）
  const cities = [
    { name: 'mexico', pos: new THREE.Vector3(-1.2, 0.5, 1.5) },
    { name: 'guangzhou', pos: new THREE.Vector3(1.5, 0.3, 0.8) },
    { name: 'shantou', pos: new THREE.Vector3(1.4, 0.2, 1.0) }
  ]

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002
    }
  })

  return (
    <group>
      {/* 简化地球 */}
      <mesh ref={meshRef} position={[0, 0, 0]} scale={2}
        onPointerOver={() => document.body.style.cursor = 'grab'}
        onPointerOut={() => document.body.style.cursor = 'default'}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#1a4f8a"
          roughness={0.9}
          metalness={0.1}
          emissive="#0a1a3a"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* 城市标记 */}
      {cities.map((city) => (
        <group key={city.name}>
          <mesh
            position={city.pos}
            onClick={(e) => {
              e.stopPropagation()
              onCityClick(city.name)
            }}
          >
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color="#ffb6c1" />
          </mesh>

          <mesh position={city.pos}>
            <ringGeometry args={[0.08, 0.12, 16]} />
            <meshBasicMaterial
              color="#ffb6c1"
              transparent
              opacity={0.6}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}

      {/* 连接线 */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={6}
            array={new Float32Array([
              cities[0].pos.x, cities[0].pos.y, cities[0].pos.z,
              0, 1, 0,
              0, 1, 0,
              cities[1].pos.x, cities[1].pos.y, cities[1].pos.z,
              cities[1].pos.x, cities[1].pos.y, cities[1].pos.z,
              0, -1, 0,
              0, -1, 0,
              cities[2].pos.x, cities[2].pos.y, cities[2].pos.z
            ])}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#ffb6c1" transparent opacity={0.3} />
      </line>
    </group>
  )
}

export default SimpleGlobe