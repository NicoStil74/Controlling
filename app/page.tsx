import Image from 'next/image'
import Link from 'next/link'

const tiles = [
  { name: 'Material-\nkosten', color: 'border-blue-200 bg-blue-50/60 text-blue-700' },
  { name: 'Kostenstellen-\nrechnung', color: 'border-green-200 bg-green-50/60 text-green-700' },
  { name: 'Prozesskosten-\nrechnung', color: 'border-purple-200 bg-purple-50/60 text-purple-700' },
  { name: 'Kurzfristige\nErfolgrechnung', color: 'border-yellow-200 bg-yellow-50/60 text-yellow-700' },
  { name: 'Programm-\nplanung', color: 'border-red-200 bg-red-50/60 text-red-700' },
  { name: 'Target\nCosting', color: 'border-pink-200 bg-pink-50/60 text-pink-700' },
  { name: 'Planungskostenrechnung /\nAbweichungsanalyse', color: 'border-indigo-200 bg-indigo-50/60 text-indigo-700', span: 'md:col-span-2' },
  { name: 'Kennzahlen', color: 'border-orange-200 bg-orange-50/60 text-orange-700' },
]

export default function Home() {
  return (
    <main className="min-h-screen px-6 py-12 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <header className="flex items-center justify-between">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900">
            Learn Controlling
          </h1>
          <div className="w-10 h-10 rounded-full bg-zinc-200"></div>
        </header>

        {/* Hero / Search Section */}
        <div className="space-y-6 max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 leading-tight">
            Was möchtest du heute <span className="text-blue-600">lernen</span>?
          </h2>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-zinc-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
            <input
              type="search"
              className="block w-full p-5 pl-14 text-lg text-zinc-900 border border-zinc-200 rounded-3xl bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-lg"
              placeholder="Suche nach Themen, Formeln..."
              required
            />
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {tiles.map((tile, index) => (
            <Link
              key={index}
              href={`/${tile.name.toLowerCase().replace(/[\n-]/g, '').replace(/\s+/g, '').replace(/[^\w]/g, '')}`}
              className={`group relative overflow-hidden p-8 rounded-[2rem] border-2 ${tile.color.split(' ')[0]} ${tile.color.split(' ')[1]} ${tile.span || ''} transition-all hover:translate-y-[-4px] hover:shadow-2xl active:scale-[0.98] duration-300 flex flex-col justify-end min-h-[180px] md:min-h-[220px] shadow-sm`}
            >
              <div className="absolute top-6 right-6 text-zinc-400 group-hover:text-zinc-600 transition-colors">
                <div className="p-2 rounded-full bg-white/70 backdrop-blur-sm border border-zinc-100">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </div>
              </div>
              <h3 className={`text-xl md:text-2xl font-bold ${tile.color.split(' ')[2]} leading-tight whitespace-pre-line`}>
                {tile.name}
              </h3>
              <div className="mt-4 w-12 h-1 bg-current opacity-20 rounded-full"></div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
