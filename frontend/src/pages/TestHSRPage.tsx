import { useState } from 'react'
import { ELEMENT_HEX } from '@/shared/lib/catalog-meta'

// --- МОКОВЫЕ ДАННЫЕ ---
const MOCK_PROFILE = {
  name: 'Raiden Shogun',
  handle: '@Plane_of_Euthymia',
  element: 'electro',
  title: 'Plane of Euthymia',
  path: 'Erudition (HSR Test)',
  bio: 'The Raiden Shogun is the awesome and terrible power of thunder incarnate, the exalted ruler of the Inazuma Bakufu. With the might of lightning at her disposal, she commits herself to the solitary pursuit of eternity.',
  friends: [
    { name: 'Kujou Sara', handle: 'Synergy', color: 'bg-purple-500/20 text-purple-300' },
    { name: 'Bennett', handle: 'Synergy', color: 'bg-red-500/20 text-red-300' },
  ],
}

const MOCK_STATS = [
  { label: 'HP', value: '12,450', icon: '❤️' },
  { label: 'ATK', value: '2,376', icon: '⚔️' },
  { label: 'DEF', value: '1,892', icon: '🛡️' },
  { label: 'SPD', value: '135', icon: '👟' },
  { label: 'CRIT', value: '52.4%', icon: '🎯' },
  { label: 'CDMG', value: '148.2%', icon: '💥' },
]

const MOCK_TALENTS = [
  { name: 'Basic ATK', level: 1, icon: '⚔️', maxLevel: 6 },
  { name: 'Skill', level: 10, icon: '⚡', maxLevel: 10 },
  { name: 'Ultimate', level: 8, icon: '🌩️', maxLevel: 10 },
  { name: 'Talent', level: 10, icon: '✨', maxLevel: 10 },
]

// Пути к картинкам реликвий (заглушки)
const MOCK_RELICS = [
  { slot: 'Head', icon: '👑', level: 15 },
  { slot: 'Hands', icon: '🧤', level: 15 },
  { slot: 'Body', icon: '👕', level: 15 },
  { slot: 'Feet', icon: '👢', level: 15 },
  { slot: 'Sphere', icon: '🔮', level: 15 },
  { slot: 'Rope', icon: '🪢', level: 15 },
]

export default function TestHSRPage() {
  const [mainTab, setMainTab] = useState<'overview' | 'team' | 'guides'>('overview')
  const themeColors = ELEMENT_HEX[MOCK_PROFILE.element as keyof typeof ELEMENT_HEX]

  // Имитация прогресса из progress.ts
  const progressPercent = 85

  return (
    <div className="relative min-h-screen font-body text-text-main selection:bg-slate-700 pb-10">

      {/* ФОН */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.95)), url('/images/background/electro background.png')`
        }}
      />

      <div
        className="relative z-10 py-8 px-4 flex justify-center"
        style={{
          '--theme-main': themeColors.main,
          '--theme-secondary': themeColors.secondary,
          '--theme-accent': themeColors.accent,
        } as React.CSSProperties}
      >

        <div className="w-full max-w-[1100px] bg-slate-900/90 backdrop-blur-xl shadow-2xl rounded-2xl flex flex-col relative overflow-hidden border border-slate-700/50">

          {/* ВЕРХНЯЯ ПАНЕЛЬ */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-slate-700/50 bg-slate-800/50 z-30 relative">
            <div className="flex items-center gap-6 text-xs font-bold tracking-widest text-slate-400 uppercase">
              <span className="hover:text-[var(--theme-main)] cursor-pointer flex items-center gap-1 transition-colors">🏠 Home</span>
              <span className="hover:text-[var(--theme-main)] cursor-pointer flex items-center gap-1 transition-colors">🐦 Twitter</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="bg-[var(--theme-main)] hover:bg-[var(--theme-secondary)] text-white text-xs font-bold px-6 py-1.5 rounded-full transition-colors shadow-[0_0_15px_var(--theme-main)]">
                EDIT
              </button>
            </div>
          </div>

          {/* БАННЕР */}
          <div className="relative w-full h-[280px] bg-slate-800 z-10 border-b border-slate-700/50 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-top opacity-90"
              style={{ backgroundImage: `url('/images/characters/raiden-shogun/portrait.png')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-90" />

            {/* HUD: Световой конус и Эйдолоны */}
            <div className="absolute top-4 right-4 flex gap-4 z-20">
              {/* Конус */}
              <div className="w-16 h-24 rounded-lg bg-slate-900/80 border border-slate-600 flex items-center justify-center relative shadow-lg group cursor-pointer hover:border-[var(--theme-main)] transition-colors backdrop-blur-sm">
                <span className="text-3xl">📜</span>
                <div className="absolute -bottom-2 bg-slate-800 border border-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded text-white">S1</div>
              </div>
            </div>
          </div>

          {/* НАВИГАЦИЯ */}
          <div className="w-full h-[50px] border-b border-slate-700/50 bg-slate-800/80 flex items-center justify-start pl-[280px] pr-8 z-10 relative">
            <div className="flex gap-8 text-[12px] font-bold tracking-widest uppercase text-slate-400">
              <button onClick={() => setMainTab('overview')} className={`h-[50px] flex items-center transition-colors ${mainTab === 'overview' ? 'text-[var(--theme-main)] border-b-2 border-[var(--theme-main)]' : 'hover:text-white'}`}>Overview</button>
              <button onClick={() => setMainTab('team')} className={`h-[50px] flex items-center transition-colors ${mainTab === 'team' ? 'text-[var(--theme-main)] border-b-2 border-[var(--theme-main)]' : 'hover:text-white'}`}>Team</button>
              <button onClick={() => setMainTab('guides')} className={`h-[50px] flex items-center transition-colors ${mainTab === 'guides' ? 'text-[var(--theme-main)] border-b-2 border-[var(--theme-main)]' : 'hover:text-white'}`}>Guides</button>
            </div>
          </div>

          {/* КОНТЕНТ */}
          <div className="relative px-8 pb-12 flex-1 bg-transparent">

            {/* АВАТАРКА С КРУГОВЫМ ПРОГРЕССОМ */}
            <div className="absolute -top-[120px] left-8 z-20">
              <div className="relative w-[200px] h-[200px]">

                {/* 1. Мягкое фоновое свечение (аура) */}
                <div className="absolute inset-2 rounded-full bg-[var(--theme-main)] blur-2xl opacity-40 animate-pulse" />

                {/* 2. Круговой прогресс (SVG) */}
                <svg
                  className="absolute inset-0 w-full h-full -rotate-90 transform overflow-visible"
                  viewBox="0 0 100 100"
                >
                  {/* Фоновый круг (трек) */}
                  <circle
                    cx="50" cy="50" r="46"
                    fill="transparent"
                    stroke="#1e293b"
                    strokeWidth="5"
                  />
                  {/* Круг прогресса */}
                  <circle
                    cx="50" cy="50" r="46"
                    fill="transparent"
                    stroke="var(--theme-main)"
                    strokeWidth="5"
                    strokeDasharray={`${(progressPercent / 100) * 289} 289`}
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_12px_var(--theme-main)]"
                  />
                </svg>

                {/* 3. Картинка персонажа */}
                <div className="absolute inset-1.5 rounded-full overflow-hidden border-[3px] border-slate-900 bg-slate-800 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
                  <img
                    src="/images/characters/raiden-shogun/icon.png"
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* 4. Бейдж с процентами (сдвинут чуть внутрь, чтобы не перекрывать свечение) */}
                <div className="absolute bottom-1 right-1 w-12 h-12 rounded-full bg-slate-900 border-2 border-[var(--theme-main)] flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.8)] z-10">
                  <span className="text-xs font-black text-white">{progressPercent}%</span>
                </div>

              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">

              {/* ЛЕВАЯ КОЛОНКА */}
              <div className="space-y-4 pt-[100px]">
                <div>
                  <h1 className="text-3xl font-black text-white tracking-tight font-sans drop-shadow-md">{MOCK_PROFILE.name}</h1>
                  <p className="text-[var(--theme-accent)] text-[13px] font-bold mt-1">{MOCK_PROFILE.title}</p>
                  <div className="flex gap-2 mt-3">
                    <span className="text-[10px] bg-slate-800 border border-slate-600 text-slate-300 px-2 py-0.5 rounded font-bold uppercase">{MOCK_PROFILE.element}</span>
                    <span className="text-[10px] bg-slate-800 border border-slate-600 text-slate-300 px-2 py-0.5 rounded font-bold uppercase">{MOCK_PROFILE.path}</span>
                  </div>
                  <p className="mt-4 text-[12px] leading-relaxed text-slate-400">{MOCK_PROFILE.bio}</p>
                </div>

                <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
                  <h3 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">Best Synergies</h3>
                  <ul className="space-y-3">
                    {MOCK_PROFILE.friends.map((friend, i) => (
                      <li key={i} className="flex items-center gap-3 group cursor-pointer">
                        <div className={`w-8 h-8 rounded-full ${friend.color} overflow-hidden flex items-center justify-center text-xs font-bold border border-white/10`}>
                          {friend.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-300 group-hover:text-[var(--theme-main)] transition-colors">
                            {friend.name}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* ПРАВАЯ КОЛОНКА (ЛЕНТА) */}
              <div className="pt-4">
                {mainTab === 'overview' && (
                  <div className="animate-in fade-in duration-300 space-y-5">

                    {/* СТАТЫ (УЗКАЯ ПОЛОСА) */}
                    <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-lg p-3 flex flex-wrap gap-2 justify-between">
                      {MOCK_STATS.map((stat, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/60 rounded-lg border border-slate-700/50">
                          <span className="text-xs">{stat.icon}</span>
                          <span className="text-[10px] text-slate-400 font-bold uppercase">{stat.label}</span>
                          <span className="text-xs font-black text-white ml-1">{stat.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* ТАЛАНТЫ (КОМПАКТНО) */}
                    <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-lg p-4 flex items-center justify-between">
                      <div className="flex gap-4">
                        {MOCK_TALENTS.map((talent, idx) => {
                          const isMax = talent.level === talent.maxLevel;
                          return (
                            <div key={idx} className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-700/50">
                              <span className="text-lg">{talent.icon}</span>
                              <span className={`text-[11px] font-bold ${isMax ? 'text-yellow-300' : talent.level === 1 ? 'text-slate-500' : 'text-white'}`}>
                                Lv.{talent.level}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* НЕДАВНИЕ РЕЛИКВИИ (КАК ФОТО В СОЦСЕТЯХ) */}
                    <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-lg p-5">
                      <h2 className="text-[12px] font-bold text-white mb-4 uppercase tracking-widest flex items-center gap-2">
                        <span className="text-[var(--theme-main)]">::</span> Recent Relics
                      </h2>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {MOCK_RELICS.map((relic, idx) => (
                          <div key={idx} className="aspect-square bg-slate-900/80 rounded-lg border border-slate-700/50 flex flex-col items-center justify-center relative group cursor-pointer hover:border-[var(--theme-main)] transition-colors overflow-hidden">
                            <span className="text-3xl group-hover:scale-110 transition-transform">{relic.icon}</span>
                            <div className="absolute bottom-1 w-full text-center">
                              <span className="text-[9px] font-bold text-slate-400 uppercase">{relic.slot}</span>
                            </div>
                            <div className="absolute top-1 right-1 bg-slate-800/90 text-[9px] font-bold px-1 rounded border border-slate-600">+{relic.level}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ЭЙДОЛОНЫ (ОСКОЛКИ СТЕКЛА) */}
                    <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-lg p-5">
                      <h2 className="text-[12px] font-bold text-white mb-4 uppercase tracking-widest flex items-center gap-2">
                        <span className="text-[var(--theme-main)]">::</span> Eidolons (Shattered Glass)
                      </h2>

                      {/* Контейнер для осколков */}
                      <div className="flex justify-around items-center h-32 relative">
                        {[1, 2, 3, 4, 5, 6].map((level) => {
                          const isActive = level <= 2; // Для примера: 2 из 6 открыты
                          return (
                            <div
                              key={level}
                              className={`relative w-16 h-20 group cursor-pointer transition-all duration-300 ${isActive ? 'scale-100 z-10' : 'scale-90 opacity-40 grayscale hover:opacity-100 hover:grayscale-0'}`}
                              // Магия CSS: делаем осколок неправильной формы
                              style={{
                                clipPath: 'polygon(20% 0%, 80% 10%, 100% 60%, 70% 100%, 10% 90%, 0% 40%)',
                                background: isActive ? 'var(--theme-main)' : '#334155',
                              }}
                            >
                              {/* Картинка внутри осколка (например, лицо персонажа или иконка) */}
                              <img
                                src="/images/characters/raiden-shogun/icon.png"
                                alt={`Eidolon ${level}`}
                                className={`w-full h-full object-cover ${isActive ? 'opacity-80 mix-blend-overlay' : ''}`}
                              />

                              {/* Номер эйдолона */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xl font-black text-white drop-shadow-md">E{level}</span>
                              </div>

                              {/* Свечение для активных */}
                              {isActive && (
                                <div className="absolute inset-0 shadow-[inset_0_0_20px_var(--theme-accent)]" />
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>

                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
