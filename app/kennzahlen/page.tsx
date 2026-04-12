'use client'

import Link from 'next/link'
import {useEffect, useState} from 'react'

interface BalanceSheetItem {
    name: string;
    value?: number;
}

export default function Kennzahlen() {
    return (
        <main className="p-8 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Kennzahlen</h1>
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold">Bilanz in TEUR</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                    {/* Aktiva */}
                    <div className="p-4">
                        <h3 className="font-bold text-lg mb-3 border-b pb-2">Aktiva</h3>
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-sm text-gray-600 border-b">
                                    <th className="py-2">Posten</th>
                                    <th className="py-2 text-right">Betrag</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr><td className="py-2 font-medium">Anlagevermögen</td><td className="py-2"></td></tr>
                                <tr><td className="py-2">Grundstücken u. Gebäude</td><td className="py-2 text-right">-</td></tr>
                                <tr><td className="py-2">Fuhrpark</td><td className="py-2 text-right">-</td></tr>
                                <tr><td className="py-2">Betriebs- u. Geschäftsausstattung</td><td className="py-2 text-right">-</td></tr>
                                <tr><td className="py-2 font-medium pt-4">Umlaufvermögen</td><td className="py-2"></td></tr>
                                <tr><td className="py-2 pl-4">Warenbestände</td><td className="py-2 text-right">-</td></tr>
                                <tr><td className="py-2 pl-4">Forderungen aus LuL</td><td className="py-2 text-right">-</td></tr>
                                <tr><td className="py-2 pl-4">Wertpapiere (nicht betriebsnotwendig)</td><td className="py-2 text-right">-</td></tr>
                                <tr><td className="py-2 pl-4">Bank</td><td className="py-2 text-right">-</td></tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Passiva */}
                    <div className="p-4">
                        <h3 className="font-bold text-lg mb-3 border-b pb-2">Passiva</h3>
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-sm text-gray-600 border-b">
                                    <th className="py-2">Posten</th>
                                    <th className="py-2 text-right">Betrag</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr><td className="py-2 font-medium">Eigenkapital</td><td className="py-2"></td></tr>
                                <tr><td className="py-2 pl-4">Gezeichnetes Kapital</td><td className="py-2 text-right">-</td></tr>
                                <tr><td className="py-2 pl-4">Rücklagen</td><td className="py-2 text-right">-</td></tr>
                                <tr><td className="py-2 font-medium pt-4">Fremdkapital</td><td className="py-2"></td></tr>
                                <tr><td className="py-2 pl-4">Steuerrückstellungen</td><td className="py-2 text-right">-</td></tr>
                                <tr><td className="py-2 pl-4">lfr. Darlehen</td><td className="py-2 text-right">-</td></tr>
                                <tr><td className="py-2 pl-4">kfr. Darlehen</td><td className="py-2 text-right">-</td></tr>
                                <tr><td className="py-2 pl-4">Kundenanzahlungen</td><td className="py-2 text-right">-</td></tr>
                                <tr><td className="py-2 pl-4">Verbindlichkeiten aus LuL</td><td className="py-2 text-right">-</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <Link href="/" className="text-blue-600 hover:underline">← Zurück zur Übersicht</Link>
            </div>
        </main>
    )
}