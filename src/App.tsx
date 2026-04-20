import { useEffect } from 'react'
import { useAppStore } from './store/appStore'
import EntryScreen from './components/EntryScreen/EntryScreen'
import MainScene from './components/MainScene/MainScene'
import MemoryScene from './components/MemoryScene/MemoryScene'
import LetterScene from './components/LetterScene/LetterScene'
import AudioPlayer from './components/EntryScreen/AudioPlayer'
import ErrorBoundary from './components/ErrorBoundary'
import MouseStars from './components/MouseStars'
import './styles/global.css'

function App() {
  const currentScene = useAppStore((state) => state.currentScene)

  useEffect(() => {
    // 防止右键菜单
    const handleContextMenu = (e: MouseEvent) => e.preventDefault()
    document.addEventListener('contextmenu', handleContextMenu)
    return () => document.removeEventListener('contextmenu', handleContextMenu)
  }, [])


  return (
    <ErrorBoundary>
      <div className="app" style={{ width: '100vw', height: '100vh' }}>
        {/* 鼠标星星特效 - 在所有场景中显示 */}
        <MouseStars />

        {currentScene === 'entry' && <EntryScreen />}
        {currentScene === 'main' && <MainScene />}
        {currentScene === 'memory' && <MemoryScene />}
        {currentScene === 'letter' && <LetterScene />}
        {/* 音频在所有场景持续播放 */}
        <AudioPlayer />
      </div>
    </ErrorBoundary>
  )
}

export default App