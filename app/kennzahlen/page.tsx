'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Kennzahlen() {
    // State für die Kennzahlen-Eingabefelder
    const [inputs, setInputs] = useState({
        verschuldungsgrad: '',
        fremdkapitalquote: '',
        eigenkapitalquote: '',
        anlagendeckungsgrad1: '',
        anlagendeckungsgrad2: '',
        liquiditaet1: '',
        liquiditaet2: '',
        liquiditaet3: '',
        ebit: '',
        ekRentVorSteuer: '',
        ekRentNachSteuer: '',
        umsatzRent: '',
        gesamtkapRent: ''
    });

    const handleInputChange = (key: string, value: string) => {
        // Nur Ziffern erlauben (Integer)
        const cleanValue = value.replace(/\D/g, '');
        setInputs(prev => ({ ...prev, [key]: cleanValue }));
    };

    const DataRow = ({ label }: { label: string }) => (
        <tr className="divide-x divide-gray-100">
            <td className="py-2 px-2 whitespace-nowrap text-sm">{label}</td>
            <td className="py-2 px-2 text-right font-mono text-sm">-</td>
        </tr>
    );

    const InputRow = ({ label, value, onChange, suffix = "%" }: { label: string, value: string, onChange: (v: string) => void, suffix?: string }) => (
        <tr className="divide-x divide-gray-100 hover:bg-gray-50 transition-colors">
            <td className="py-2 px-2 text-sm">{label}</td>
            <td className="py-1 px-2 text-right relative">
                <input 
                    type="text" 
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="0"
                    className="w-full text-right p-1 pr-8 border rounded focus:ring-1 focus:ring-blue-500 outline-none text-sm font-mono"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-mono">{suffix}</span>
            </td>
        </tr>
    );

    return (
        <main className="p-8 max-w-6xl mx-auto space-y-12">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Kennzahlen</h1>
                <Link href="/" className="text-blue-600 hover:underline">← Zurück zur Übersicht</Link>
            </div>
            
            {/* Bilanz Sektion */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold">Bilanz in TEUR</h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
                    {/* Aktiva */}
                    <div className="p-4 overflow-x-auto">
                        <h3 className="font-bold text-lg mb-3 border-b pb-2 text-blue-800">Aktiva</h3>
                        <table className="w-full text-left min-w-[300px]">
                            <thead>
                                <tr className="text-xs text-gray-600 border-b bg-gray-50 uppercase tracking-wider">
                                    <th className="py-2 px-2">Posten</th>
                                    <th className="py-2 px-2 text-right w-32">Betrag (TEUR)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr className="bg-gray-50"><td colSpan={2} className="py-1 px-2 font-bold text-xs uppercase text-gray-500">Anlagevermögen</td></tr>
                                <DataRow label="Grundstücke u. Gebäude" />
                                <DataRow label="Fuhrpark" />
                                <DataRow label="Betriebs- u. Geschäftsausstattung" />
                                <tr className="bg-gray-50"><td colSpan={2} className="py-1 px-2 font-bold text-xs uppercase text-gray-500">Umlaufvermögen</td></tr>
                                <DataRow label="Warenbestände" />
                                <DataRow label="Forderungen aus LuL" />
                                <DataRow label="Wertpapiere (nicht betriebsn.)" />
                                <DataRow label="Bank" />
                            </tbody>
                            <tfoot>
                                <tr className="bg-blue-50 font-bold border-t-2 border-blue-200">
                                    <td className="py-3 px-2 text-lg">Summe Aktiva</td>
                                    <td className="py-3 px-2 text-right text-lg">-</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* Passiva */}
                    <div className="p-4 overflow-x-auto">
                        <h3 className="font-bold text-lg mb-3 border-b pb-2 text-red-800">Passiva</h3>
                        <table className="w-full text-left min-w-[300px]">
                            <thead>
                                <tr className="text-xs text-gray-600 border-b bg-gray-50 uppercase tracking-wider">
                                    <th className="py-2 px-2">Posten</th>
                                    <th className="py-2 px-2 text-right w-32">Betrag (TEUR)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr className="bg-gray-50"><td colSpan={2} className="py-1 px-2 font-bold text-xs uppercase text-gray-500">Eigenkapital</td></tr>
                                <DataRow label="Gezeichnetes Kapital" />
                                <DataRow label="Rücklagen" />
                                <tr className="bg-gray-50"><td colSpan={2} className="py-1 px-2 font-bold text-xs uppercase text-gray-500">Fremdkapital</td></tr>
                                <DataRow label="Steuerrückstellungen" />
                                <DataRow label="lfr. Darlehen" />
                                <DataRow label="kfr. Darlehen" />
                                <DataRow label="Kundenanzahlungen" />
                                <DataRow label="Verbindlichkeiten aus LuL" />
                            </tbody>
                            <tfoot>
                                <tr className="bg-red-50 font-bold border-t-2 border-red-200">
                                    <td className="py-3 px-2 text-lg">Summe Passiva</td>
                                    <td className="py-3 px-2 text-right text-lg">-</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>

            {/* GuV Sektion */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold">GuV Rechnung in TEUR</h2>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
                    {/* Aufwand */}
                    <div className="p-4">
                        <h3 className="font-bold text-lg mb-3 border-b pb-2 text-orange-800">Aufwand</h3>
                        <table className="w-full text-left">
                            <tbody className="divide-y divide-gray-100">
                                <DataRow label="Bestandsveränderung" />
                                <DataRow label="Personalaufwand" />
                                <DataRow label="Warenaufwand" />
                                <DataRow label="Versicherungen" />
                                <DataRow label="Zinsaufwand" />
                                <DataRow label="Abschreibungen" />
                                <DataRow label="sonst. betriebl. Aufwand" />
                                <tr className="bg-orange-50 font-bold border-t-2 border-orange-200">
                                    <td className="py-2 px-2 text-sm">Gewinn vor Steuer</td>
                                    <td className="py-2 px-2 text-right text-sm">-</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Ertrag */}
                    <div className="p-4">
                        <h3 className="font-bold text-lg mb-3 border-b pb-2 text-green-800">Ertrag</h3>
                        <table className="w-full text-left">
                            <tbody className="divide-y divide-gray-100">
                                <DataRow label="Umsatzerlöse" />
                                <DataRow label="Zinsertrag" />
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Kennzahlen Sektion */}
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold">Kennzahlen (Eingabe)</h2>
                </div>
                <div className="p-4 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs text-gray-600 border-b bg-gray-50 uppercase tracking-wider">
                                <th className="py-2 px-2">Kennzahl</th>
                                <th className="py-2 px-2 text-right w-48">Eingabe</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <InputRow label="Verschuldungsgrad" value={inputs.verschuldungsgrad} onChange={(v) => handleInputChange('verschuldungsgrad', v)} />
                            <InputRow label="Fremdkapitalquote" value={inputs.fremdkapitalquote} onChange={(v) => handleInputChange('fremdkapitalquote', v)} />
                            <InputRow label="Eigenkapitalquote" value={inputs.eigenkapitalquote} onChange={(v) => handleInputChange('eigenkapitalquote', v)} />
                            <InputRow label="Anlagendeckungsgrad I" value={inputs.anlagendeckungsgrad1} onChange={(v) => handleInputChange('anlagendeckungsgrad1', v)} />
                            <InputRow label="Anlagendeckungsgrad II" value={inputs.anlagendeckungsgrad2} onChange={(v) => handleInputChange('anlagendeckungsgrad2', v)} />
                            <InputRow label="Liquidität 1. Grades" value={inputs.liquiditaet1} onChange={(v) => handleInputChange('liquiditaet1', v)} />
                            <InputRow label="Liquidität 2. Grades" value={inputs.liquiditaet2} onChange={(v) => handleInputChange('liquiditaet2', v)} />
                            <InputRow label="Liquidität 3. Grades" value={inputs.liquiditaet3} onChange={(v) => handleInputChange('liquiditaet3', v)} />
                            <InputRow label="EBIT" value={inputs.ebit} onChange={(v) => handleInputChange('ebit', v)} suffix="TEUR" />
                            <InputRow label="Eigenkapitalrentabilität (vor Steuern)" value={inputs.ekRentVorSteuer} onChange={(v) => handleInputChange('ekRentVorSteuer', v)} />
                            <InputRow label="Eigenkapitalrentabilität (nach Steuern)" value={inputs.ekRentNachSteuer} onChange={(v) => handleInputChange('ekRentNachSteuer', v)} />
                            <InputRow label="Umsatzrentabilität (nach Steuern)" value={inputs.umsatzRent} onChange={(v) => handleInputChange('umsatzRent', v)} />
                            <InputRow label="Gesamtkapitalrentabilität (nach Steuern)" value={inputs.gesamtkapRent} onChange={(v) => handleInputChange('gesamtkapRent', v)} />
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    )
}
