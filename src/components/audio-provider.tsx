'use client'

import * as React from 'react'

// ----------------------------------------------------------------------------
// Chant presets — each is a small constellation of oscillators with an LFO
// modulating a master gain to produce a gently pulsing drone.
// ----------------------------------------------------------------------------
export type ChantPreset = {
  id: string
  name: string
  sanskrit: string
  baseFreq: number
  oscillators: { type: OscillatorType; freq: number; gain: number }[]
  lfoFrequency: number
  lfoDepth: number
  masterGain: number
}

const CHANT_PRESETS: ChantPreset[] = [
  {
    id: 'om',
    name: 'Om',
    sanskrit: 'ॐ',
    baseFreq: 110,
    oscillators: [
      { type: 'sine', freq: 110, gain: 0.6 },
      { type: 'sine', freq: 220, gain: 0.25 },
      { type: 'triangle', freq: 55, gain: 0.35 },
    ],
    lfoFrequency: 0.18,
    lfoDepth: 0.18,
    masterGain: 0.5,
  },
  {
    id: 'gayatri',
    name: 'Gayatri',
    sanskrit: 'गायत्री',
    baseFreq: 147,
    oscillators: [
      { type: 'sine', freq: 147, gain: 0.55 },
      { type: 'sine', freq: 220.5, gain: 0.28 },
      { type: 'triangle', freq: 73.5, gain: 0.3 },
    ],
    lfoFrequency: 0.22,
    lfoDepth: 0.2,
    masterGain: 0.45,
  },
  {
    id: 'shanti',
    name: 'Shanti',
    sanskrit: 'शान्तिः',
    baseFreq: 131,
    oscillators: [
      { type: 'sine', freq: 131, gain: 0.6 },
      { type: 'sine', freq: 196, gain: 0.25 },
      { type: 'sine', freq: 262, gain: 0.18 },
    ],
    lfoFrequency: 0.15,
    lfoDepth: 0.16,
    masterGain: 0.5,
  },
  {
    id: 'mahamrityunjaya',
    name: 'Mahamrityunjaya',
    sanskrit: 'महामृत्युञ्जय',
    baseFreq: 98,
    oscillators: [
      { type: 'sine', freq: 98, gain: 0.6 },
      { type: 'triangle', freq: 147, gain: 0.3 },
      { type: 'sine', freq: 196, gain: 0.22 },
    ],
    lfoFrequency: 0.12,
    lfoDepth: 0.22,
    masterGain: 0.5,
  },
  {
    id: 'bija',
    name: 'Bija',
    sanskrit: 'बीज',
    baseFreq: 80,
    oscillators: [
      { type: 'sine', freq: 80, gain: 0.7 },
      { type: 'triangle', freq: 120, gain: 0.25 },
      { type: 'sine', freq: 240, gain: 0.15 },
    ],
    lfoFrequency: 0.1,
    lfoDepth: 0.24,
    masterGain: 0.55,
  },
]

type ActiveVoice = {
  osc: OscillatorNode
  gain: GainNode
  lfo: OscillatorNode
  lfoGain: GainNode
}

type AudioContextValue = {
  isEnabled: boolean
  isPlaying: boolean
  toggle: () => void
  currentChant: string
  setChant: (id: string) => void
  availableChants: ChantPreset[]
  volume: number
  setVolume: (v: number) => void
}

const AudioContext = React.createContext<AudioContextValue | null>(null)

const VOLUME_STORAGE_KEY = 'sanatan-setu-audio-volume'

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isEnabled, setIsEnabled] = React.useState(false)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [currentChant, setCurrentChant] = React.useState<string>('om')
  const [volume, setVolumeState] = React.useState(0.5)

  // Refs to live audio nodes — these persist across renders but are not state.
  const audioCtxRef = React.useRef<AudioContext | null>(null)
  const masterGainRef = React.useRef<GainNode | null>(null)
  const voicesRef = React.useRef<ActiveVoice[]>([])
  const fadeRafRef = React.useRef<number | null>(null)

  // Load saved volume on mount.
  React.useEffect(() => {
    try {
      const saved = window.localStorage.getItem(VOLUME_STORAGE_KEY)
      if (saved) {
        const v = parseFloat(saved)
        if (!Number.isNaN(v)) setVolumeState(Math.max(0, Math.min(1, v)))
      }
    } catch {
      // ignore
    }
  }, [])

  // Cleanup on unmount.
  React.useEffect(() => {
    return () => {
      if (fadeRafRef.current) cancelAnimationFrame(fadeRafRef.current)
      const ctx = audioCtxRef.current
      if (ctx) {
        try {
          ctx.close()
        } catch {
          // ignore
        }
      }
    }
  }, [])

  const setVolume = React.useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v))
    setVolumeState(clamped)
    try {
      window.localStorage.setItem(VOLUME_STORAGE_KEY, String(clamped))
    } catch {
      // ignore
    }
    // Update master gain in real-time if playing.
    if (masterGainRef.current) {
      const target = clamped * 0.6 // gentle ceiling
      try {
        masterGainRef.current.gain.setTargetAtTime(
          target,
          audioCtxRef.current!.currentTime,
          0.05
        )
      } catch {
        // ignore
      }
    }
  }, [])

  const buildVoicesForChant = React.useCallback(
    (preset: ChantPreset, ctx: AudioContext, master: GainNode): ActiveVoice[] => {
      const voices: ActiveVoice[] = []
      for (const def of preset.oscillators) {
        const osc = ctx.createOscillator()
        osc.type = def.type
        osc.frequency.value = def.freq

        const gain = ctx.createGain()
        gain.gain.value = def.gain

        // LFO modulates this voice's gain for a breathing, pulsing drone.
        const lfo = ctx.createOscillator()
        lfo.frequency.value = preset.lfoFrequency
        const lfoGain = ctx.createGain()
        lfoGain.gain.value = preset.lfoDepth * def.gain

        lfo.connect(lfoGain)
        lfoGain.connect(gain.gain)

        osc.connect(gain)
        gain.connect(master)

        osc.start()
        lfo.start()
        voices.push({ osc, gain, lfo, lfoGain })
      }
      return voices
    },
    []
  )

  const stopVoices = React.useCallback(
    (ctx: AudioContext, voices: ActiveVoice[], fadeMs: number) => {
      const now = ctx.currentTime
      const fadeEnd = now + fadeMs / 1000
      for (const v of voices) {
        try {
          v.gain.gain.cancelScheduledValues(now)
          v.gain.gain.setValueAtTime(v.gain.gain.value, now)
          v.gain.gain.linearRampToValueAtTime(0.0001, fadeEnd)
        } catch {
          // ignore
        }
      }
      window.setTimeout(() => {
        for (const v of voices) {
          try {
            v.osc.stop()
            v.lfo.stop()
            v.osc.disconnect()
            v.lfo.disconnect()
            v.gain.disconnect()
            v.lfoGain.disconnect()
          } catch {
            // ignore
          }
        }
      }, fadeMs + 50)
    },
    []
  )

  // Cross-fade between chants. Stops old voices with a quick fade and starts
  // new ones with a fade-in.
  const setChant = React.useCallback(
    (id: string) => {
      const preset = CHANT_PRESETS.find((c) => c.id === id) ?? CHANT_PRESETS[0]
      setCurrentChant(preset.id)
      if (!isPlaying) return
      const ctx = audioCtxRef.current
      const master = masterGainRef.current
      if (!ctx || !master) return
      // Fade out current voices
      const oldVoices = voicesRef.current
      stopVoices(ctx, oldVoices, 400)
      // Fade in new voices
      const newVoices = buildVoicesForChant(preset, ctx, master)
      const now = ctx.currentTime
      for (const v of newVoices) {
        try {
          const target = v.gain.gain.value
          v.gain.gain.setValueAtTime(0.0001, now)
          v.gain.gain.linearRampToValueAtTime(target, now + 0.6)
        } catch {
          // ignore
        }
      }
      voicesRef.current = newVoices
    },
    [isPlaying, buildVoicesForChant, stopVoices]
  )

  // The toggle handler creates the AudioContext DIRECTLY in the click handler
  // so the browser treats it as a user-initiated audio source (autoplay policy).
  const toggle = React.useCallback(() => {
    if (!isPlaying) {
      // Start audio — create context here, in the click handler.
      let ctx = audioCtxRef.current
      if (!ctx) {
        const AC =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext
        if (!AC) return
        ctx = new AC()
        audioCtxRef.current = ctx
      }
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {})
      }
      const master = ctx.createGain()
      master.gain.value = 0.0001
      master.connect(ctx.destination)
      masterGainRef.current = master

      const preset =
        CHANT_PRESETS.find((c) => c.id === currentChant) ?? CHANT_PRESETS[0]
      const voices = buildVoicesForChant(preset, ctx, master)
      voicesRef.current = voices

      // Fade in master gain to target volume.
      const target = volume * 0.6
      const now = ctx.currentTime
      master.gain.cancelScheduledValues(now)
      master.gain.setValueAtTime(0.0001, now)
      master.gain.linearRampToValueAtTime(target, now + 0.8)

      setIsEnabled(true)
      setIsPlaying(true)
    } else {
      // Stop audio with a fade-out.
      const ctx = audioCtxRef.current
      const master = masterGainRef.current
      if (ctx && master) {
        const now = ctx.currentTime
        master.gain.cancelScheduledValues(now)
        master.gain.setValueAtTime(master.gain.value, now)
        master.gain.linearRampToValueAtTime(0.0001, now + 0.4)
        stopVoices(ctx, voicesRef.current, 400)
        voicesRef.current = []
      }
      setIsPlaying(false)
      // We keep isEnabled true so the UI knows the feature is available.
      setIsEnabled(true)
    }
  }, [isPlaying, currentChant, volume, buildVoicesForChant, stopVoices])

  const value = React.useMemo<AudioContextValue>(
    () => ({
      isEnabled,
      isPlaying,
      toggle,
      currentChant,
      setChant,
      availableChants: CHANT_PRESETS,
      volume,
      setVolume,
    }),
    [isEnabled, isPlaying, toggle, currentChant, setChant, volume, setVolume]
  )

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
}

export function useAudio(): AudioContextValue {
  const ctx = React.useContext(AudioContext)
  if (!ctx) {
    throw new Error('useAudio must be used within an AudioProvider')
  }
  return ctx
}
