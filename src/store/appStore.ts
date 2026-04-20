import { create } from 'zustand'

export type Scene = 'entry' | 'main' | 'memory' | 'letter'

interface AppState {
  currentScene: Scene
  audioPlaying: boolean
  audioVolume: number
  radioFrequency: number
  specialEventActive: boolean
  letterVisible: boolean
  selectedCity: string | null
  setCurrentScene: (scene: Scene) => void
  setAudioPlaying: (playing: boolean) => void
  setAudioVolume: (volume: number) => void
  setRadioFrequency: (frequency: number) => void
  setSpecialEventActive: (active: boolean) => void
  setLetterVisible: (visible: boolean) => void
  setSelectedCity: (city: string | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  currentScene: 'entry',
  audioPlaying: false,
  audioVolume: 0.7,
  radioFrequency: 10.0,
  specialEventActive: false,
  letterVisible: false,
  selectedCity: null,
  setCurrentScene: (scene) => set({ currentScene: scene }),
  setAudioPlaying: (playing) => set({ audioPlaying: playing }),
  setAudioVolume: (volume) => set({ audioVolume: volume }),
  setRadioFrequency: (frequency) => set({ radioFrequency: frequency }),
  setSpecialEventActive: (active) => set({ specialEventActive: active }),
  setLetterVisible: (visible) => set({ letterVisible: visible }),
  setSelectedCity: (city) => set({ selectedCity: city })
}))