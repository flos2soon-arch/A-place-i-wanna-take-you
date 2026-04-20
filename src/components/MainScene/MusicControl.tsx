import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '../../store/appStore'
import './MusicControl.css'

const MusicControl = () => {
  const [showVolume, setShowVolume] = useState(false)
  const audioPlaying = useAppStore((state) => state.audioPlaying)
  const audioVolume = useAppStore((state) => state.audioVolume)
  const setAudioPlaying = useAppStore((state) => state.setAudioPlaying)
  const setAudioVolume = useAppStore((state) => state.setAudioVolume)

  const toggleAudio = () => {
    setAudioPlaying(!audioPlaying)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAudioVolume(parseFloat(e.target.value))
  }

  return (
    <motion.div
      className="music-control"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1 }}
    >
      <button
        className={`music-toggle ${audioPlaying ? 'playing' : ''}`}
        onClick={toggleAudio}
      >
        {audioPlaying ? '🔊' : '🔇'}
      </button>

      <div
        className="volume-container"
        onMouseEnter={() => setShowVolume(true)}
        onMouseLeave={() => setShowVolume(false)}
      >
        <motion.div
          className="volume-slider-wrapper"
          initial={{ opacity: 0, x: 10 }}
          animate={showVolume ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
        >
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={audioVolume}
            onChange={handleVolumeChange}
            className="volume-slider"
          />
        </motion.div>
      </div>
    </motion.div>
  )
}

export default MusicControl