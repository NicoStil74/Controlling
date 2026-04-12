'use client'

import Link from 'next/link'
import {useEffect, useState} from 'react'

interface MaterialRow {
    id: number
    process: string
    date: string
    quantity: string
    price: string
}

interface ValuationSolutions {
    closing_stock: number
    weighted_average: number
    moving_average: number
    lifo: number
    fifo: number
}

export default function Materialkosten() {
    const [data, setData] = useState<MaterialRow[]>([])
    const [solutions, setSolutions] = useState<ValuationSolutions | null>(null)
    const [userInputs, setUserInputs] = useState<Record<string, string>>({
        closing_stock: '',
        weighted_average: '',
        moving_average: '',
        lifo: '',
        fifo: ''
    })
    const [feedback, setFeedback] = useState<Record<string, 'correct' | 'wrong' | 'neutral'>>({
        closing_stock: 'neutral',
        weighted_average: 'neutral',
        moving_average: 'neutral',
        lifo: 'neutral',
        fifo: 'neutral'
    })
    const [showSolutions, setShowSolutions] = useState(false)
    const [previousInputs, setPreviousInputs] = useState<Record<string, string>>({
        closing_stock: '',
        weighted_average: '',
        moving_average: '',
        lifo: '',
        fifo: ''
    })
    const [loading, setLoading] = useState(true)

    const fetchData = async () => {
        setLoading(true)
        setShowSolutions(false)
        try {
            const response = await fetch('/api/materialkosten')
            const result = await response.json()
            setData(result.table_data || [])
            setSolutions(result.solutions || null)

            // Reset feedback and inputs for new data
            setFeedback({
                closing_stock: 'neutral',
                weighted_average: 'neutral',
                moving_average: 'neutral',
                lifo: 'neutral',
                fifo: 'neutral'
            })
            setUserInputs({
                closing_stock: '',
                weighted_average: '',
                moving_average: '',
                lifo: '',
                fifo: ''
            })
        } catch (error) {
            console.error('Error fetching data:', error)
            setData([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    useEffect(() => {
        if (solutions){
                console.log(solutions?.closing_stock)
                console.log(solutions?.weighted_average)
                console.log(solutions?.moving_average)
                console.log(solutions?.lifo)
                console.log(solutions?.fifo)
        }
    }, [solutions])

    /**
     * Handles updates to user input fields.
     */
    const handleInputChange = (key: string, value: string) => {
        setUserInputs(prev => ({ ...prev, [key]: value }))
    }

    /**
     * Helper to convert German formatted strings (e.g., "1.200,50") to numbers.
     */
    const parseGermanNumber = (val: string): number => {
        // Remove thousands separators (.) and replace decimal comma (,) with dot (.)
        const clean = val.replace(/\./g, '').replace(',', '.')
        return parseFloat(clean)
    }

    /**
     * Compares user inputs with the solutions from the api.
     */
    const checkSolutions = () => {
        if (!solutions) return

        const newFeedback: Record<string, 'correct' | 'wrong' | 'neutral'> = {}

        Object.keys(userInputs).forEach(key => {
            const userInput = userInputs[key].trim()

            if (userInput === '') {
                newFeedback[key] = 'neutral'
                return
            }

            const userValue = parseGermanNumber(userInput)
            const correctValue = solutions[key as keyof ValuationSolutions]

            // Use a small tolerance for floating point comparisons (rounding differences)
            const isCorrect = Math.abs(userValue - correctValue) < 0.01

            newFeedback[key] = isCorrect ? 'correct' : 'wrong'
        })

        setFeedback(newFeedback)
    }

    /**
     * Toggles between showing the correct solutions and the user's previous inputs.
     */
    const toggleSolutions = () => {
        if (!solutions) return

        if (!showSolutions) {
            // Store current inputs before showing solutions
            setPreviousInputs(userInputs)

            const formattedSolutions: Record<string, string> = {}
            Object.keys(solutions).forEach(key => {
                const val = solutions[key as keyof ValuationSolutions]
                const formatted = val.toLocaleString('de-DE', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })
                formattedSolutions[key] = formatted
            })
            setUserInputs(formattedSolutions)
        } else {
            // Restore previous inputs when hiding solutions
            setUserInputs(previousInputs)
        }

        setShowSolutions(!showSolutions)
    }

    return (
        <main className="min-h-screen px-6 py-12 md:px-12 lg:px-24">
            <div className="max-w-6xl mx-auto space-y-12">
                {/* Navigation */}
                <nav>
                    <Link
                        href="/"
                        className="group inline-flex items-center text-zinc-500 hover:text-zinc-900 transition-colors gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                             className="group-hover:-translate-x-1 transition-transform">
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        Zurück zur Übersicht
                    </Link>
                </nav>

                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900">
                            Materialkosten
                        </h1>
                        <p className="text-zinc-500 text-lg max-w-2xl">
                            Übersicht der Materialbewegungen und Preisbewertungen für den aktuellen Zeitraum.
                        </p>
                    </div>
                    <button
                        onClick={fetchData}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-zinc-100 rounded-2xl font-bold text-zinc-700 hover:bg-zinc-50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className={loading ? 'animate-spin' : ''}
                        >
                            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                            <path d="M21 3v5h-5"></path>
                            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                            <path d="M3 21v-5h5"></path>
                        </svg>
                        Neue Daten
                    </button>
                </header>

                {/* Table Section (Bento Style) */}
                <div
                    className="bg-white rounded-[2rem] border-2 border-zinc-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] overflow-hidden">
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="px-8 py-12 text-center text-zinc-500">Lade Daten...</div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                <tr className="bg-zinc-50/50 border-b border-zinc-100">
                                    <th className="px-8 py-6 font-bold text-zinc-900">Vorgang</th>
                                    <th className="px-8 py-6 font-bold text-zinc-900">Datum</th>
                                    <th className="px-8 py-6 font-bold text-zinc-900 text-right">Menge (kg)</th>
                                    <th className="px-8 py-6 font-bold text-zinc-900 text-right">Preis (€/kg)</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-50">
                                {data.map((row) => (
                                    <tr key={row.id} className="hover:bg-zinc-50/30 transition-colors group">
                                        <td className="px-8 py-6 font-medium text-zinc-800">{row.process}</td>
                                        <td className="px-8 py-6 text-zinc-500">{row.date}</td>
                                        <td className="px-8 py-6 text-zinc-800 text-right font-mono">{row.quantity}</td>
                                        <td className="px-8 py-6 text-zinc-800 text-right font-mono">{row.price}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>



                {/* Self-Check Section */}
                <section className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-zinc-900">Selbstprüfung</h2>
                    <div className="flex gap-4">
                        <button
                          onClick={toggleSolutions}
                          className={`px-6 py-3 rounded-2xl font-bold transition-all shadow-sm active:scale-95 ${
                            showSolutions 
                              ? 'bg-zinc-800 text-white hover:bg-zinc-700' 
                              : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200'
                          }`}
                        >
                          {showSolutions ? 'Lösungen verbergen' : 'Lösungen anzeigen'}
                        </button>
                        <button
                          onClick={checkSolutions}
                          className="px-6 py-3 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-colors shadow-lg active:scale-95"
                        >
                          Ergebnisse prüfen
                        </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: 'Endbestand des Lagers', key: 'closing_stock' },
                      { label: 'Lagerbestand (gewogene Durchschnittsmethode)', key: 'weighted_average' },
                      { label: 'Lagerbestand (gleitende Durchschnittsmethode)', key: 'moving_average' },
                      { label: 'Lifo-Methode', key: 'lifo' },
                      { label: 'Fifo-Methode', key: 'fifo' },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className={`p-6 bg-white rounded-3xl border-2 transition-all space-y-3 ${
                          feedback[item.key] === 'correct' ? 'border-green-600 bg-green-100/30' : 
                          feedback[item.key] === 'wrong' ? 'border-red-600 bg-red-100/30' : 
                          'border-zinc-100'
                        }`}
                      >
                        <label className="block font-bold text-zinc-700">{item.label}</label>
                        <input
                          type="text"
                          value={userInputs[item.key]}
                          onChange={(e) => handleInputChange(item.key, e.target.value)}
                          className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 outline-none transition-all font-mono"
                        />
                      </div>
                    ))}
                  </div>
                </section>
            </div>
        </main>
    )
}
