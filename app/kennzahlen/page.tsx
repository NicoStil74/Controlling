'use client'

import Link from 'next/link'
import { useState } from 'react'

interface BalanceSheetData {
    grundstuecke: string;
    fuhrpark: string;
    bga: string;
    warenbestaende: string;
    forderungenLuL: string;
    wertpapiere: string;
    bank: string;
    gezeichnetesKapital: string;
    ruecklagen: string;
    steuerrueckstellungen: string;
    lfrDarlehen: string;
    kfrDarlehen: string;
    kundenanzahlungen: string;
    verbindlichkeitenLuL: string;
}

const initialData: BalanceSheetData = {
    grundstuecke: '',
    fuhrpark: '',
    bga: '',
    warenbestaende: '',
    forderungenLuL: '',
    wertpapiere: '',
    bank: '',
    gezeichnetesKapital: '',
    ruecklagen: '',
    steuerrueckstellungen: '',
    lfrDarlehen: '',
    kfrDarlehen: '',
    kundenanzahlungen: '',
    verbindlichkeitenLuL: '',
}

interface InputRowProps {
    label: string;
    value: string;
    onChange: (val: string) => void;
}

function InputRow({ label, value, onChange }: InputRowProps) {
    return (
        <tr className="divide-x divide-gray-100">
            <td className="py-2 px-2 whitespace-nowrap text-sm">{label}</td>
            <td className="py-1 px-2 text-right">
                <input 
                    type="text" 
                    value={value}
                    onChange={(e) => {
                        let rawVal = e.target.value.replace(',', '.');
                        
                        // Wenn ein Dezimaltrennzeichen gefunden wird, runden wir sofort
                        if (rawVal.includes('.')) {
                            const numeric = parseFloat(rawVal);
                            if (!isNaN(numeric)) {
                                onChange(Math.round(numeric).toString());
                            } else {
                                onChange('');
                            }
                        } else {
                            // Ansonsten nur Ziffern erlauben
                            onChange(rawVal.replace(/\D/g, ''));
                        }
                    }}
                    onBlur={(e) => {
                        // Zusätzliche Sicherheit beim Verlassen des Feldes
                        const numeric = parseFloat(e.target.value);
                        if (!isNaN(numeric)) {
                            onChange(Math.round(numeric).toString());
                        }
                    }}
                    placeholder="0"
                    className="w-full text-right p-1 border rounded focus:ring-1 focus:ring-blue-500 outline-none text-sm"
                />
            </td>
        </tr>
    );
}

export default function Kennzahlen() {
    const [data, setData] = useState<BalanceSheetData>(initialData);

    const handleInputChange = (key: keyof BalanceSheetData, value: string) => {
        setData(prev => ({ ...prev, [key]: value }));
    };

    // Helfer zur Konvertierung mit Rundung für Berechnungen
    const toInt = (val: string) => {
        const num = parseFloat(val);
        return isNaN(num) ? 0 : Math.round(num);
    };

    const totalAktiva = toInt(data.grundstuecke) + toInt(data.fuhrpark) + toInt(data.bga) + 
                        toInt(data.warenbestaende) + toInt(data.forderungenLuL) + 
                        toInt(data.wertpapiere) + toInt(data.bank);
    
    const totalPassiva = toInt(data.gezeichnetesKapital) + toInt(data.ruecklagen) + 
                         toInt(data.steuerrueckstellungen) + toInt(data.lfrDarlehen) + 
                         toInt(data.kfrDarlehen) + toInt(data.kundenanzahlungen) + 
                         toInt(data.verbindlichkeitenLuL);

    return (
        <main className="p-8 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Kennzahlen</h1>
                <Link href="/" className="text-blue-600 hover:underline">← Zurück zur Übersicht</Link>
            </div>
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                <div className="bg-gray-100 px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h2 className="text-xl font-semibold">Bilanz in TEUR</h2>
                    <div className="text-sm font-bold p-2 bg-white rounded border border-gray-300">
                        Bilanz-Differenz: <span className={totalAktiva === totalPassiva ? "text-green-600" : "text-red-600"}>
                            {(totalAktiva - totalPassiva).toLocaleString()} TEUR
                        </span>
                    </div>
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
                                <InputRow label="Grundstücke u. Gebäude" value={data.grundstuecke} onChange={(v) => handleInputChange('grundstuecke', v)} />
                                <InputRow label="Fuhrpark" value={data.fuhrpark} onChange={(v) => handleInputChange('fuhrpark', v)} />
                                <InputRow label="Betriebs- u. Geschäftsausstattung" value={data.bga} onChange={(v) => handleInputChange('bga', v)} />
                                <tr className="bg-gray-50"><td colSpan={2} className="py-1 px-2 font-bold text-xs uppercase text-gray-500">Umlaufvermögen</td></tr>
                                <InputRow label="Warenbestände" value={data.warenbestaende} onChange={(v) => handleInputChange('warenbestaende', v)} />
                                <InputRow label="Forderungen aus LuL" value={data.forderungenLuL} onChange={(v) => handleInputChange('forderungenLuL', v)} />
                                <InputRow label="Wertpapiere (nicht betriebsn.)" value={data.wertpapiere} onChange={(v) => handleInputChange('wertpapiere', v)} />
                                <InputRow label="Bank" value={data.bank} onChange={(v) => handleInputChange('bank', v)} />
                            </tbody>
                            <tfoot>
                                <tr className="bg-blue-50 font-bold border-t-2 border-blue-200">
                                    <td className="py-3 px-2 text-lg">Summe Aktiva</td>
                                    <td className="py-3 px-2 text-right text-lg">{totalAktiva.toLocaleString()}</td>
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
                                <InputRow label="Gezeichnetes Kapital" value={data.gezeichnetesKapital} onChange={(v) => handleInputChange('gezeichnetesKapital', v)} />
                                <InputRow label="Rücklagen" value={data.ruecklagen} onChange={(v) => handleInputChange('ruecklagen', v)} />
                                <tr className="bg-gray-50"><td colSpan={2} className="py-1 px-2 font-bold text-xs uppercase text-gray-500">Fremdkapital</td></tr>
                                <InputRow label="Steuerrückstellungen" value={data.steuerrueckstellungen} onChange={(v) => handleInputChange('steuerrueckstellungen', v)} />
                                <InputRow label="lfr. Darlehen" value={data.lfrDarlehen} onChange={(v) => handleInputChange('lfrDarlehen', v)} />
                                <InputRow label="kfr. Darlehen" value={data.kfrDarlehen} onChange={(v) => handleInputChange('kfrDarlehen', v)} />
                                <InputRow label="Kundenanzahlungen" value={data.kundenanzahlungen} onChange={(v) => handleInputChange('kundenanzahlungen', v)} />
                                <InputRow label="Verbindlichkeiten aus LuL" value={data.verbindlichkeitenLuL} onChange={(v) => handleInputChange('verbindlichkeitenLuL', v)} />
                            </tbody>
                            <tfoot>
                                <tr className="bg-red-50 font-bold border-t-2 border-red-200">
                                    <td className="py-3 px-2 text-lg">Summe Passiva</td>
                                    <td className="py-3 px-2 text-right text-lg">{totalPassiva.toLocaleString()}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    )
}
