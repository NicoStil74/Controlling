'use client'

import Link from 'next/link'

export default function Prozesskostenrechnung() {
    return (
        <main className="p-8 max-w-6xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div className="space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900">
                        Prozesskostenrechnung
                    </h1>
                    <p className="text-zinc-500 text-lg max-w-2xl">
                        Berechnung und Analyse der Prozesskostensätze für den Personalbereich.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/" className="text-blue-600 hover:underline">← Zurück zur Übersicht</Link>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg border border-gray-200">
                <div className="bg-gray-100 px-6 py-4 border-b border-gray-200 flex justify-between items-center rounded-t-lg">
                    <h2 className="text-xl font-semibold">lmi-Prozesse</h2>
                </div>
                
                <div className="p-4 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs text-gray-600 border-b bg-gray-50 uppercase tracking-wider">
                                <th className="py-3 px-4">Prozess</th>
                                <th className="py-3 px-4 text-right">Menge</th>
                                <th className="py-3 px-4 text-right">Kosten (€)</th>
                                <th className="py-3 px-4 text-right">lmi-Kostensatz</th>
                                <th className="py-3 px-4 text-right">Umlagesatz (lmn)</th>
                                <th className="py-3 px-4 text-right font-bold">Gesamtkostensatz</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <tr className="hover:bg-gray-50 transition-colors">
                                <td className="py-3 px-4 text-sm font-medium">Bewerbungen bearbeiten</td>
                                <td className="py-3 px-4 text-right font-mono text-sm">-</td>
                                <td className="py-3 px-4 text-right font-mono text-sm">-</td>
                                <td className="py-3 px-4 text-right font-mono text-sm">-</td>
                                <td className="py-3 px-4 text-right font-mono text-sm">-</td>
                                <td className="py-3 px-4 text-right font-mono text-sm font-bold">-</td>
                            </tr>
                            <tr className="hover:bg-gray-50 transition-colors">
                                <td className="py-3 px-4 text-sm font-medium">Interviews führen</td>
                                <td className="py-3 px-4 text-right font-mono text-sm">-</td>
                                <td className="py-3 px-4 text-right font-mono text-sm">-</td>
                                <td className="py-3 px-4 text-right font-mono text-sm">-</td>
                                <td className="py-3 px-4 text-right font-mono text-sm">-</td>
                                <td className="py-3 px-4 text-right font-mono text-sm font-bold">-</td>
                            </tr>
                            <tr className="hover:bg-gray-50 transition-colors">
                                <td className="py-3 px-4 text-sm font-medium">Psychologische Tests</td>
                                <td className="py-3 px-4 text-right font-mono text-sm">-</td>
                                <td className="py-3 px-4 text-right font-mono text-sm">-</td>
                                <td className="py-3 px-4 text-right font-mono text-sm">-</td>
                                <td className="py-3 px-4 text-right font-mono text-sm">-</td>
                                <td className="py-3 px-4 text-right font-mono text-sm font-bold">-</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg border border-gray-200">
                <div className="bg-gray-100 px-6 py-4 border-b border-gray-200 rounded-t-lg">
                    <h2 className="text-xl font-semibold">lmn-Prozesse (Zusatzinfo)</h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b pb-2">
                                <span className="text-sm text-gray-600 uppercase font-bold">Summe lmi-Kosten</span>
                                <span className="font-mono text-lg">- €</span>
                            </div>
                            <div className="flex justify-between items-center border-b pb-2">
                                <span className="text-sm text-gray-600 uppercase font-bold">Kosten Abteilungsleitung (lmn)</span>
                                <span className="font-mono text-lg">- €</span>
                            </div>
                        </div>
                        <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-100 flex flex-col justify-center items-center">
                            <span className="text-blue-800 text-sm font-bold uppercase mb-2">Berechneter Umlagesatz</span>
                            <span className="text-3xl font-extrabold text-blue-900 font-mono">-</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
