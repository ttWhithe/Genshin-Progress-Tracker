import { useState } from 'react'
import { Link } from 'react-router-dom'

// --- МОКОВЫЕ ДАННЫЕ ---

type Element = 'physical' | 'fire' | 'ice' | 'lightning' | 'wind' | 'quantum' | 'imaginary'
type Path = 'destruction' | 'hunt' | 'erudition' | 'harmony' | 'nihility' | 'preservation' | 'abundance'

const ELEMENT_LABEL: Record<Element, string> = {
  physical: 'Физ.', fire: 'Огонь', ice: 'Лёд', lightning: 'Электро',
  wind: 'Ветер', quantum: 'Квант', imaginary: 'Мнимый',
}

const PATH_LABEL: Record<Path, string> = {
  destruction: 'Разрушение', hunt: 'Охота', erudition: 'Эрудация',
  harmony: 'Гармония', nihility: 'Небытие', preservation: 'Сохранение',
  abundance: 'Изобилие',
}

const ELEMENT_ICON: Record<Element, string> = {
  physical: '👊', fire: '🔥', ice: '❄️', lightning: '⚡',
  wind: '🌪️', quantum: '🔮', imaginary: '🌌',
}

const PATH_ICON: Record<Path, string> = {
  destruction: '💥', hunt: '🏹', erudition: '📚',
  harmony: '🎵', nihility: '🕳️', preservation: '🛡️', abundance: '🌿',
}


// Цвет элемента — для иконки-бейджа на карточке
const ELEMENT_COLOR: Record<Element, string> = {
  physical: 'bg-slate-500', fire: 'bg-red-500', ice: 'bg-cyan-400',
  lightning: 'bg-violet-500', wind: 'bg-teal-400', quantum: 'bg-indigo-500',
  imaginary: 'bg-yellow-500',
}

interface MockCharacter {
  name: string
  element: Element
  path: Path
  rarity: 4 | 5
  owned: boolean
  isNew: boolean
  // заглушка портрета: пока нет картинок — цветной градиент
  color: string
}

const MOCK_CHARACTERS: MockCharacter[] = [
  { name: 'chumba',    element: 'imaginary', path: 'harmony',      rarity: 5, owned: true,  isNew: false, color: 'from-amber-700 to-slate-700' },
  { name: 'Хохо',      element: 'wind',      path: 'harmony',      rarity: 5, owned: true,  isNew: true,  color: 'from-emerald-700 to-teal-900' },
  { name: 'Ахерон',    element: 'lightning', path: 'nihility',     rarity: 5, owned: true,  isNew: true,  color: 'from-violet-800 to-red-900' },
  { name: 'Март 7',    element: 'ice',       path: 'preservation', rarity: 4, owned: true,  isNew: true,  color: 'from-pink-500 to-cyan-700' },
  { name: 'Дань Хэн',  element: 'wind',      path: 'hunt',         rarity: 5, owned: true,  isNew: true,  color: 'from-slate-700 to-teal-900' },
  { name: 'Аста',      element: 'fire',      path: 'harmony',      rarity: 4, owned: true,  isNew: true,  color: 'from-rose-500 to-pink-800' },

  { name: 'Герта',     element: 'ice',       path: 'erudition',    rarity: 4, owned: true,  isNew: true,  color: 'from-purple-600 to-slate-800' },
  { name: 'Сервал',    element: 'lightning', path: 'erudition',    rarity: 4, owned: true,  isNew: true,  color: 'from-blue-500 to-indigo-900' },
  { name: 'Цинцюэ',    element: 'imaginary', path: 'harmony',      rarity: 4, owned: true,  isNew: true,  color: 'from-lime-600 to-slate-800' },
  { name: 'Сушан',     element: 'fire',      path: 'abundance',    rarity: 4, owned: true,  isNew: true,  color: 'from-amber-600 to-orange-900' },
  { name: 'Химеко',    element: 'fire',      path: 'erudition',    rarity: 5, owned: false, isNew: false, color: 'from-red-700 to-amber-900' },
  { name: 'Вельт',     element: 'imaginary', path: 'nihility',     rarity: 5, owned: false, isNew: false, color: 'from-slate-700 to-indigo-950' },

  { name: 'Кafka',     element: 'lightning', path: 'nihility',     rarity: 5, owned: false, isNew: false, color: 'from-purple-800 to-red-950' },
  { name: 'Серёга',    element: 'lightning', path: 'hunt',         rarity: 5, owned: false, isNew: false, color: 'from-indigo-800 to-slate-900' },
  { name: 'Яньцин',    element: 'lightning', path: 'hunt',         rarity: 5, owned: false, isNew: false, color: 'from-emerald-700 to-cyan-950' },
  { name: 'Лу ча',     element: 'physical',  path: 'destruction',  rarity: 5, owned: false, isNew: false, color: 'from-slate-600 to-slate-900' },
  { name: 'Блейд',     element: 'wind',      path: 'destruction',  rarity: 5, owned: false, isNew: false, color: 'from-teal-800 to-slate-950' },
  { name: 'Зеле',      element: 'quantum',   path: 'hunt',         rarity: 5, owned: false, isNew: false, color: 'from-violet-900 to-slate-950' },
]

const FILTERS: Array<Path | 'all'> = [
  'all', 'destruction', 'hunt', 'erudition',
  'harmony', 'nihility', 'preservation', 'abundance',
]

// --- КАРТОЧКА ---

function CharacterCard({ char }: { char: MockCharacter }) {
  const rarityBar = char.rarity === 5 ? 'bg-amber-400' : 'bg-violet-400'
  const starsColor = char.rarity === 5 ? 'text-amber-300' : 'text-violet-300'

  return (
    <Link
      to={`/testHSR`}
      className={`group relative block rounded-lg overflow-hidden border border-slate-700/50 bg-slate-900 transition-transform duration-200 hover:scale-[1.03] hover:border-amber-400/60 hover:z-10 ${!char.owned ? 'grayscale' : ''}`}
    >
      {/* Портрет (заглушка — градиент) */}
      <div className={`aspect-[3/4] bg-gradient-to-br ${char.color} flex items-end justify-center`}>
        <span className="text-5xl font-black text-white/20 mb-16 select-none">
          {char.name.charAt(0)}
        </span>
      </div>

      {/* Квадратики: стихия (сверху) и путь (снизу) */}
      <div className="absolute top-2 left-2 flex flex-col gap-1.5">
        <div
          className={`w-7 h-7 rounded-md ${ELEMENT_COLOR[char.element]} border border-white/20 flex items-center justify-center text-sm shadow`}
          title={ELEMENT_LABEL[char.element]}
        >
          {ELEMENT_ICON[char.element]}
        </div>
        <div
          className="w-7 h-7 rounded-md bg-slate-950/80 border border-white/20 flex items-center justify-center text-sm shadow"
          title={PATH_LABEL[char.path]}
        >
          {PATH_ICON[char.path]}
        </div>
      </div>

      {/* Бейдж "Новое" */}
      {char.isNew && (
        <div className="absolute top-2 right-2 bg-amber-400 text-black text-[10px] font-bold px-2 py-0.5 rounded-sm shadow">
          Новое
        </div>
      )}

      {/* Плашка "Не получено" */}
      {!char.owned && (
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 bg-slate-900/80 text-white text-sm font-bold text-center py-1.5">
          Не получено
        </div>
      )}

      {/* Градиентная подложка снизу вверх (в цвет полоски редкости) */}
      <div
        className={`absolute inset-x-0 bottom-1.5 h-20 bg-gradient-to-t pointer-events-none ${
          char.rarity === 5
            ? 'from-amber-400/80 via-amber-400/40'
            : 'from-violet-400/80 via-violet-400/40'
        } to-transparent`}
      />

      {/* Имя */}
      <div className="absolute bottom-9 inset-x-0 text-center">
        <span className="text-sm font-bold text-white drop-shadow-md">{char.name}</span>
      </div>

      {/* Звёзды */}
      <div className="absolute bottom-4 inset-x-0 text-center">
        <span className={`text-[20px] leading-none tracking-widest ${starsColor}`}>
          {'★'.repeat(char.rarity)}
        </span>
      </div>

      {/* Полоска редкости */}
      <div className={`absolute bottom-0 inset-x-0 h-1.5 ${rarityBar}`} />
    </Link>
  )
}

// --- СТРАНИЦА ---

export default function HSRCharactersPage() {
  const [filter, setFilter] = useState<Path | 'all'>('all')

  const visible = MOCK_CHARACTERS.filter(
    (c) => filter === 'all' || c.path === filter,
  )
  const ownedCount = MOCK_CHARACTERS.filter((c) => c.owned).length

  return (
    <div className="min-h-screen -mx-4 md:-mx-[4%] -my-8 text-slate-100">
      {/* Звёздный фон */}
      <div className="fixed inset-0 z-0 bg-slate-950 bg-[radial-gradient(ellipse_at_top,#1e2a4a_0%,#0b1020_60%,#05070f_100%)]" />

      <div className="relative z-10 flex min-h-screen">
        {/* === САЙДБАР === */}
        <aside className="w-16 md:w-56 shrink-0 py-6 md:pl-6">
          <div className="hidden md:block mb-8 pl-2">
            <p className="text-xs text-amber-400/80 font-medium">База данных</p>
            <h1 className="text-lg font-bold text-white">Персонажи</h1>
          </div>

          <nav className="flex md:flex-col gap-1 overflow-x-auto px-4 md:px-0">
            {FILTERS.map((f) => {
              const isActive = filter === f
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex items-center gap-3 shrink-0 px-4 py-2.5 rounded-full md:rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${isActive ? 'bg-amber-300' : 'bg-slate-600'}`} />
                  <span>{f === 'all' ? 'Все' : PATH_LABEL[f]}</span>
                </button>
              )
            })}
          </nav>
        </aside>

        {/* === КОНТЕНТ === */}
        <main className="flex-1 px-4 py-6">
          {/* Шапка со счётчиком */}
          <div className="flex justify-end mb-4">
            <p className="text-sm text-slate-300">
              Получено <span className="text-amber-300 font-bold">{ownedCount}</span>
              <span className="text-slate-500">/{MOCK_CHARACTERS.length}</span>
            </p>
          </div>

          {/* Сетка карточек */}
          <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3">
            {visible.map((char) => (
              <CharacterCard key={char.name} char={char} />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
