import { useEffect, useRef } from 'react'
import { useAppStore } from '../../store/appStore'

// Audio context that persists across component unmounts
let audioContext: AudioContext | null = null
let sourceNode: MediaElementAudioSourceNode | null = null
let filterNode: BiquadFilterNode | null = null

const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null)
  const audioPlaying = useAppStore((state) => state.audioPlaying)
  const audioVolume = useAppStore((state) => state.audioVolume)

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.volume = audioVolume
      if (audioPlaying) {
        // 确保音频可以播放
        const playPromise = audio.play()
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.warn('Audio play failed:', error)
            // 用户交互后重试
            document.addEventListener('click', () => {
              audio.play().catch(() => {})
            }, { once: true })
          })
        }
      } else {
        audio.pause()
      }
    }
  }, [audioPlaying, audioVolume])

  // 添加音频过滤器效果
  useEffect(() => {
    const audio = audioRef.current
    if (audio && !audioContext) {
      try {
        // 创建持久的音频上下文
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext
        if (AudioContext) {
          audioContext = new AudioContext()

          // 检查音频上下文状态
          if (audioContext.state === 'suspended') {
            console.log('Audio context suspended, waiting for user interaction')
            // 等待用户交互后恢复音频上下文
            document.addEventListener('click', () => {
              if (audioContext && audioContext.state === 'suspended') {
                audioContext.resume().then(() => {
                  console.log('Audio context resumed')
                })
              }
            }, { once: true })
          }

          sourceNode = audioContext.createMediaElementSource(audio)
          filterNode = audioContext.createBiquadFilter()

          // 设置低通滤波器，创造复古唱片效果
          filterNode.type = 'lowpass'
          filterNode.frequency.value = 8000
          filterNode.Q.value = 1

          sourceNode.connect(filterNode)
          filterNode.connect(audioContext.destination)
        }
      } catch (error) {
        console.warn('Failed to create audio context:', error)
      }
    }
  }, [])

  return (
    <audio
      ref={audioRef}
      src="/audio/main.mp3"
      loop
      preload="auto"
    />
  )
}

export default AudioPlayer