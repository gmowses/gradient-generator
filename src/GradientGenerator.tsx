import { useState } from 'react'
import { Copy, Sun, Moon, Languages, Palette, Plus, Trash2 } from 'lucide-react'

const translations = {
  en: {
    title: 'Gradient Generator',
    subtitle: 'Create CSS gradients: linear or radial, multiple color stops, angle control. Live preview and CSS output.',
    type: 'Type',
    linear: 'Linear',
    radial: 'Radial',
    angle: 'Angle',
    colorStops: 'Color Stops',
    addStop: 'Add Color Stop',
    position: 'Position',
    preview: 'Live Preview',
    cssOutput: 'CSS Output',
    copy: 'Copy',
    copied: 'Copied!',
    preset: 'Presets',
    builtBy: 'Built by',
  },
  pt: {
    title: 'Gerador de Gradiente',
    subtitle: 'Crie gradientes CSS: linear ou radial, multiplas paradas de cor, controle de angulo. Preview e saida CSS.',
    type: 'Tipo',
    linear: 'Linear',
    radial: 'Radial',
    angle: 'Angulo',
    colorStops: 'Paradas de Cor',
    addStop: 'Adicionar Cor',
    position: 'Posicao',
    preview: 'Preview ao Vivo',
    cssOutput: 'Saida CSS',
    copy: 'Copiar',
    copied: 'Copiado!',
    preset: 'Predefinicoes',
    builtBy: 'Criado por',
  },
} as const

type Lang = keyof typeof translations
type GradType = 'linear' | 'radial'

interface ColorStop { id: number; color: string; position: number }

let nextStopId = 5

const PRESETS: { name: string; type: GradType; angle: number; stops: Omit<ColorStop, 'id'>[] }[] = [
  { name: 'Sunset', type: 'linear', angle: 135, stops: [{ color: '#f97316', position: 0 }, { color: '#ec4899', position: 50 }, { color: '#8b5cf6', position: 100 }] },
  { name: 'Ocean', type: 'linear', angle: 180, stops: [{ color: '#0ea5e9', position: 0 }, { color: '#06b6d4', position: 50 }, { color: '#10b981', position: 100 }] },
  { name: 'Fire', type: 'linear', angle: 90, stops: [{ color: '#fbbf24', position: 0 }, { color: '#f97316', position: 50 }, { color: '#ef4444', position: 100 }] },
  { name: 'Aurora', type: 'linear', angle: 45, stops: [{ color: '#34d399', position: 0 }, { color: '#818cf8', position: 50 }, { color: '#f472b6', position: 100 }] },
  { name: 'Night', type: 'linear', angle: 135, stops: [{ color: '#1e1b4b', position: 0 }, { color: '#312e81', position: 50 }, { color: '#0f172a', position: 100 }] },
  { name: 'Candy', type: 'radial', angle: 0, stops: [{ color: '#f9a8d4', position: 0 }, { color: '#c084fc', position: 50 }, { color: '#818cf8', position: 100 }] },
]

function buildGradient(type: GradType, angle: number, stops: ColorStop[]): string {
  const sorted = [...stops].sort((a, b) => a.position - b.position)
  const stopsStr = sorted.map(s => `${s.color} ${s.position}%`).join(', ')
  if (type === 'linear') return `linear-gradient(${angle}deg, ${stopsStr})`
  return `radial-gradient(circle, ${stopsStr})`
}

export default function GradientGenerator() {
  const [lang, setLang] = useState<Lang>(() => navigator.language.startsWith('pt') ? 'pt' : 'en')
  const [dark, setDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
  const [gradType, setGradType] = useState<GradType>('linear')
  const [angle, setAngle] = useState(135)
  const [stops, setStops] = useState<ColorStop[]>([
    { id: 1, color: '#f97316', position: 0 },
    { id: 2, color: '#ec4899', position: 50 },
    { id: 3, color: '#8b5cf6', position: 100 },
  ])
  const [copied, setCopied] = useState(false)

  const t = translations[lang]

  const toggleDark = () => {
    setDark(d => {
      document.documentElement.classList.toggle('dark', !d)
      return !d
    })
  }

  const gradient = buildGradient(gradType, angle, stops)
  const cssValue = `background: ${gradient};`

  const addStop = () => {
    setStops(s => [...s, { id: nextStopId++, color: '#60a5fa', position: 50 }])
  }

  const removeStop = (id: number) => {
    if (stops.length <= 2) return
    setStops(s => s.filter(stop => stop.id !== id))
  }

  const updateStop = (id: number, field: keyof Omit<ColorStop, 'id'>, value: string | number) => {
    setStops(s => s.map(stop => stop.id === id ? { ...stop, [field]: value } : stop))
  }

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setGradType(preset.type)
    setAngle(preset.angle)
    setStops(preset.stops.map((s, i) => ({ ...s, id: i + 1 })))
    nextStopId = preset.stops.length + 1
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(cssValue).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors">
      <header className="border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f97316, #ec4899, #8b5cf6)' }}>
              <Palette size={18} className="text-white" />
            </div>
            <span className="font-semibold">Gradient Generator</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setLang(l => l === 'en' ? 'pt' : 'en')} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <Languages size={14} />
              {lang.toUpperCase()}
            </button>
            <button onClick={toggleDark} className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <a href="https://github.com/gmowses/gradient-generator" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-10">
        <div className="max-w-5xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold">{t.title}</h1>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">{t.subtitle}</p>
          </div>

          {/* Preview */}
          <div className="rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 h-48" style={{ background: gradient }} />

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Controls */}
            <div className="space-y-6">
              {/* Presets */}
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-3">
                <h2 className="font-semibold text-sm">{t.preset}</h2>
                <div className="grid grid-cols-3 gap-2">
                  {PRESETS.map(p => (
                    <button
                      key={p.name}
                      onClick={() => applyPreset(p)}
                      className="relative h-12 rounded-lg overflow-hidden border-2 border-transparent hover:border-white transition-all"
                      style={{ background: buildGradient(p.type, p.angle, p.stops.map((s, i) => ({ ...s, id: i }))) }}
                      title={p.name}
                    >
                      <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold drop-shadow">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Type & Angle */}
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">{t.type}</label>
                  <div className="flex gap-2">
                    {(['linear', 'radial'] as const).map(type => (
                      <button
                        key={type}
                        onClick={() => setGradType(type)}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${gradType === type ? 'bg-pink-500 text-white border-pink-500' : 'border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                      >
                        {type === 'linear' ? t.linear : t.radial}
                      </button>
                    ))}
                  </div>
                </div>
                {gradType === 'linear' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{t.angle}</span>
                      <span className="font-bold text-pink-500">{angle}deg</span>
                    </div>
                    <input type="range" min={0} max={360} value={angle} onChange={e => setAngle(Number(e.target.value))} className="w-full accent-pink-500" />
                    <div className="flex justify-between text-xs text-zinc-400"><span>0</span><span>360</span></div>
                  </div>
                )}
              </div>
            </div>

            {/* Color stops */}
            <div className="space-y-4">
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4">
                <h2 className="font-semibold">{t.colorStops}</h2>

                {/* Visual bar */}
                <div className="h-8 rounded-lg" style={{ background: gradient }} />

                <div className="space-y-3">
                  {stops.map((stop) => (
                    <div key={stop.id} className="flex items-center gap-3">
                      <input
                        type="color"
                        value={stop.color}
                        onChange={e => updateStop(stop.id, 'color', e.target.value)}
                        className="w-10 h-10 rounded-lg border border-zinc-200 dark:border-zinc-700 cursor-pointer p-0.5 bg-transparent"
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-mono">{stop.color}</span>
                          <span className="text-zinc-400">{stop.position}%</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={stop.position}
                          onChange={e => updateStop(stop.id, 'position', Number(e.target.value))}
                          className="w-full accent-pink-500"
                        />
                      </div>
                      <button
                        onClick={() => removeStop(stop.id)}
                        disabled={stops.length <= 2}
                        className="p-1 text-zinc-400 hover:text-red-500 transition-colors disabled:opacity-30"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={addStop}
                  className="w-full flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-500 hover:border-pink-400 hover:text-pink-500 transition-colors"
                >
                  <Plus size={14} />
                  {t.addStop}
                </button>
              </div>

              {/* CSS Output */}
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">{t.cssOutput}</h2>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-500 text-white text-xs font-medium hover:bg-pink-600 transition-colors"
                  >
                    <Copy size={12} />
                    {copied ? t.copied : t.copy}
                  </button>
                </div>
                <pre className="rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 px-4 py-3 font-mono text-xs overflow-auto whitespace-pre-wrap select-all text-zinc-700 dark:text-zinc-300">
                  {cssValue}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-zinc-400">
          <span>{t.builtBy} <a href="https://github.com/gmowses" className="text-zinc-600 dark:text-zinc-300 hover:text-pink-500 transition-colors">Gabriel Mowses</a></span>
          <span>MIT License</span>
        </div>
      </footer>
    </div>
  )
}
