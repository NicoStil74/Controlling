'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

interface DataRowProps {
    label: string;
    amount?: number;
}

const DataRow = ({ label, amount }: DataRowProps) => (
    <tr className="divide-x divide-gray-100">
        <td className="py-2 px-2 whitespace-nowrap text-sm">{label}</td>
        <td className="py-2 px-2 text-right font-mono text-sm">
            {amount !== undefined ? amount.toLocaleString('de-DE') : '-'}
        </td>
    </tr>
);

interface InputRowProps {
    label: string;
    inputKey: string;
    inputs: Record<string, string>;
    feedback: Record<string, 'correct' | 'wrong' | 'neutral'>;
    handleInputChange: (key: string, value: string) => void;
    suffix?: string;
}

const InputRow = ({ label, inputKey, inputs, feedback, handleInputChange, suffix = "%" }: InputRowProps) => (
    <tr className={`divide-x divide-gray-100 transition-colors ${
        feedback[inputKey] === 'correct' ? 'bg-green-100 border-l-4 border-l-green-600' : 
        feedback[inputKey] === 'wrong' ? 'bg-red-100 border-l-4 border-l-red-600' : 'hover:bg-gray-50'
    }`}>
        <td className="py-2 px-3 text-sm font-medium">{label}</td>
        <td className="py-1 px-2 text-right relative">
            <input 
                type="text" 
                value={inputs[inputKey] || ''}
                onChange={(e) => handleInputChange(inputKey, e.target.value)}
                placeholder="0,00"
                className={`w-full text-right p-1.5 pr-8 border-2 rounded-lg focus:ring-2 outline-none text-sm font-mono transition-all ${
                    feedback[inputKey] === 'correct' ? 'border-green-600 focus:ring-green-500 bg-white' : 
                    feedback[inputKey] === 'wrong' ? 'border-red-600 focus:ring-red-500 bg-white' : 
                    'border-gray-200 focus:ring-blue-500'
                }`}
            />
            <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold font-mono ${
                feedback[inputKey] === 'correct' ? 'text-green-700' : 
                feedback[inputKey] === 'wrong' ? 'text-red-700' : 'text-gray-400'
            }`}>{suffix}</span>
        </td>
    </tr>
);

interface DataItem {
    type: string;
    name: string;
    amount: number;
}

export default function Kennzahlen() {

    const [balance, setBalance] = useState<DataItem[]>([])
    const [guv, setGuV] = useState<DataItem[]>([])
    const [figures, setFigures] = useState<any>({})
    const [showSolutions, setShowSolutions] = useState(false)
    const [feedback, setFeedback] = useState<Record<string, 'correct' | 'wrong' | 'neutral'>>({})

    // State für die Kennzahlen-Eingabefelder
    const [inputs, setInputs] = useState<Record<string, string>>({
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

    const [previousInputs, setPreviousInputs] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true)
    const [activeType, setActiveType] = useState('standard')
    const [data2, setData2] = useState<any>(null)
    const [solutions2, setSolutions2] = useState<any>(null)
    const [roundToInteger, setRoundToInteger] = useState(false)

    const modes = [
        { id: 'standard', label: 'Kennzahlen I', icon: '' },
        { id: 'kennzahlen2', label: 'Kennzahlen II', icon: '' },
        { id: 'kennzahlen3', label: 'Kennzahlen III', icon: '' },
    ]

    const formatNumber = (val: number | undefined) => {
        if (val === undefined) return '-';
        if (roundToInteger) {
            return Math.round(val).toLocaleString('de-DE');
        }
        return val.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    const fetchData = async () => {
        setLoading(true)
        setShowSolutions(false)
        setFeedback({})
        
        if (activeType === 'standard') {
            setInputs({
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
            })

            try {
                const response = await fetch('/api/kennzahlen')
                if (!response.ok) {
                    console.error('API ERROR STATUS:', response.status)
                    throw new Error(`API request failed: ${response.status}`)
                }
                const result = await response.json()
                setBalance(result.balance || [])
                setGuV(result.guv || [])
                setFigures(result.figures || {})

            } catch (error) {
                console.error('Error fetching data:', error)
                setBalance([])
                setGuV([])
                setFigures({})
            } finally {
                setLoading(false)
            }
        } else if (activeType === 'kennzahlen2') {
            setInputs({
                umsatzrendite: '',
                ekr: '',
                gkr: '',
                ebit: '',
                ebitda: '',
                nopat: '',
                ocf: '',
                fcf: '',
                wacc: '',
                kapitalkosten: '',
                eva: ''
            })

            try {
                const response = await fetch('/api/kennzahlen2')
                if (!response.ok) {
                    console.error('API ERROR STATUS:', response.status)
                    throw new Error(`API request failed: ${response.status}`)
                }
                const result = await response.json()
                setData2(result.data || {})
                setSolutions2(result.solutions || {})

            } catch (error) {
                console.error('Error fetching data:', error)
                setData2(null)
                setSolutions2(null)
            } finally {
                setLoading(false)
            }
        } else {
            setLoading(false)
        }
    }
    useEffect(() => {
        fetchData()
    }, [activeType])

    const handleInputChange = (key: string, value: string) => {
        // Nur Ziffern und Punkt/Komma erlauben (für Dezimalzahlen)
        const cleanValue = value.replace(/[^0-9.,]/g, '');
        setInputs(prev => ({ ...prev, [key]: cleanValue }));
    };

    const parseGermanNumber = (val: string): number => {
        let clean = val.replace(/\./g, '').replace(',', '.')
        return parseFloat(clean) || 0
    }

    const mapping = {
        verschuldungsgrad: 'Verschuldungsgrad',
        fremdkapitalquote: 'Fremdkapitalquote',
        eigenkapitalquote: 'Eigenkapitalquote',
        anlagendeckungsgrad1: 'ADG_I',
        anlagendeckungsgrad2: 'ADG_II',
        liquiditaet1: 'LG_I',
        liquiditaet2: 'LG_II',
        liquiditaet3: 'LG_III',
        ebit: 'EBIT',
        ekRentVorSteuer: 'EKRvST',
        ekRentNachSteuer: 'EKRnST',
        umsatzRent: 'URnST',
        gesamtkapRent: 'GKRvST'
    }

    const mapping2: Record<string, string> = {
        umsatzrendite: 'umsatzrendite',
        ekr: 'ekr',
        gkr: 'gkr',
        ebit: 'ebit',
        ebitda: 'ebitda',
        nopat: 'nopat',
        ocf: 'ocf',
        fcf: 'fcf',
        wacc: 'wacc',
        kapitalkosten: 'kapitalkosten',
        eva: 'eva'
    }

    const checkSolutions = () => {
        const newFeedback: Record<string, 'correct' | 'wrong' | 'neutral'> = {}
        const currentMapping = activeType === 'kennzahlen2' ? mapping2 : mapping;
        const currentFigures = activeType === 'kennzahlen2' ? solutions2 : figures;

        if (!currentFigures || !currentMapping) return;

        Object.keys(inputs).forEach(key => {
            const userInput = inputs[key].trim()
            if (userInput === '') {
                newFeedback[key] = 'neutral'
                return
            }

            const userValue = parseGermanNumber(userInput)
            let correctValue = (currentFigures as any)[(currentMapping as any)[key]]

            if (roundToInteger && activeType === 'kennzahlen2') {
                correctValue = Math.round(correctValue)
            }

            // Toleranz für Rundungsdifferenzen (0.1 oder 0.5 bei Ganzzahlen)
            const tolerance = roundToInteger ? 0.5 : 0.1
            const isCorrect = Math.abs(userValue - correctValue) < tolerance
            newFeedback[key] = isCorrect ? 'correct' : 'wrong'
        })

        setFeedback(newFeedback)
    }

    const toggleSolutions = () => {
        const currentMapping = activeType === 'kennzahlen2' ? mapping2 : mapping;
        const currentFigures = activeType === 'kennzahlen2' ? solutions2 : figures;

        if (!currentFigures || !currentMapping) return;

        if (!showSolutions) {
            setPreviousInputs(inputs)
            const solvedInputs: Record<string, string> = {}
            Object.keys(currentMapping).forEach(key => {
                let val = (currentFigures as any)[(currentMapping as any)[key]]
                if (roundToInteger && activeType === 'kennzahlen2') {
                    val = Math.round(val)
                }
                solvedInputs[key] = formatNumber(val)
            })
            setInputs(solvedInputs)
        } else {
            setInputs(previousInputs)
        }
        setShowSolutions(!showSolutions)
    }

    const sumAktiva = (balance || [])
        .filter(item => item?.type === 'Anlagevermögen' || item?.type === 'Umlaufvermögen')
        .reduce((sum, item) => sum + (item?.amount || 0), 0);

    const sumPassiva = (balance || [])
        .filter(item => item?.type === 'Eigenkapital' || item?.type === 'Fremdkapital')
        .reduce((sum, item) => sum + (item?.amount || 0), 0);

    return (
        <main className="p-8 max-w-6xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div className="space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900">
                        Kennzahlen
                    </h1>
                    <p className="text-zinc-500 text-lg max-w-2xl">
                        Analyse der Bilanz und GuV zur Berechnung betriebswirtschaftlicher Kennzahlen.
                    </p>
                </div>
                <div className="flex items-center gap-4">
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
                    <Link href="/" className="text-blue-600 hover:underline">← Zurück zur Übersicht</Link>
                </div>
            </div>

            {/* Exercise Mode Switcher */}
            <div className="flex p-1 bg-zinc-100 rounded-2xl w-fit border border-zinc-200 shadow-inner">
                {modes.map((mode) => (
                    <button
                        key={mode.id}
                        onClick={() => setActiveType(mode.id)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                            activeType === mode.id
                                ? 'bg-white text-zinc-900 shadow-md scale-[1.02]'
                                : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200/50'
                        }`}
                    >
                        <span>{mode.icon}</span>
                        {mode.label}
                    </button>
                ))}
            </div>
            
            {activeType === 'standard' ? (
                <div className="space-y-12">
                    {/* Bilanz Sektion */}
                    <div className="bg-white shadow-md rounded-lg border border-gray-200">
                        <div className="bg-gray-100 px-6 py-4 border-b border-gray-200 flex items-center gap-2 rounded-t-lg">
                            <h2 className="text-xl font-semibold">Bilanz in TEUR</h2>
                            <div className="group relative">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 hover:text-zinc-600 transition-colors cursor-help">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <path d="M12 16v-4"></path>
                                    <path d="M12 8h.01"></path>
                                </svg>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-zinc-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-medium shadow-xl z-[100]">
                                    Geringfügige Abweichungen durch Rundungen sind möglich.
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-zinc-800"></div>
                                </div>
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
                                        {(balance || []).filter(item => item?.type === 'Anlagevermögen').map((row, i)=>(
                                            <DataRow key={i} label={row.name} amount={row.amount} />
                                        ))}
                                        <tr className="bg-gray-50">
                                            <td colSpan={2} className="py-1 px-2 font-bold text-xs uppercase text-gray-500">Umlaufvermögen</td>
                                        </tr>
                                        {(balance || []).filter(item => item?.type === 'Umlaufvermögen').map((row, i)=>(
                                            <DataRow key={i} label={row.name} amount={row.amount} />
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-blue-50 font-bold border-t-2 border-blue-200">
                                            <td className="py-3 px-2 text-lg">Summe Aktiva</td>
                                            <td className="py-3 px-2 text-right text-lg">
                                                {sumAktiva.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
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
                                        {(balance || []).filter(item => item?.type === 'Eigenkapital').map((row, i)=>(
                                            <DataRow key={i} label={row.name} amount={row.amount} />
                                        ))}
                                        <tr className="bg-gray-50"><td colSpan={2} className="py-1 px-2 font-bold text-xs uppercase text-gray-500">Fremdkapital</td></tr>
                                        {(balance || []).filter(item => item?.type === 'Fremdkapital').map((row, i)=>(
                                            <DataRow key={i} label={row.name} amount={row.amount} />
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-red-50 font-bold border-t-2 border-red-200">
                                            <td className="py-3 px-2 text-lg">Summe Passiva</td>
                                            <td className="py-3 px-2 text-right text-lg">
                                                {sumPassiva.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* GuV Sektion */}
                    <div className="bg-white shadow-md rounded-lg border border-gray-200">
                        <div className="bg-gray-100 px-6 py-4 border-b border-gray-200 flex justify-between items-center rounded-t-lg">
                            <h2 className="text-xl font-semibold">GuV Rechnung in TEUR</h2>
                            <span className="text-sm font-medium text-gray-600 bg-gray-200 px-3 py-1 rounded-full">Steuersatz = 30%</span>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
                            {/* Aufwand */}
                            <div className="p-4">
                                <h3 className="font-bold text-lg mb-3 border-b pb-2 text-orange-800">Aufwand</h3>
                                <table className="w-full text-left">
                                    <tbody className="divide-y divide-gray-100">
                                        {(guv || []).filter(item => item?.type === 'Aufwand').map((row, i)=>(
                                            <DataRow key={i} label={row.name} amount={row.amount} />
                                        ))}
                                        <tr className="bg-orange-50 font-bold border-t-2 border-orange-200">
                                            <td className="py-2 px-2 text-sm">Gewinn vor Steuer</td>
                                            <td className="py-2 px-2 text-right text-sm">
                                                {(guv || []).find(item => item?.name === 'Gewinn vor Steuer')?.amount?.toLocaleString('de-DE')}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Ertrag */}
                            <div className="p-4">
                                <h3 className="font-bold text-lg mb-3 border-b pb-2 text-green-800">Ertrag</h3>
                                <table className="w-full text-left">
                                    <tbody className="divide-y divide-gray-100">
                                        {(guv || []).filter(item => item?.type === 'Ertrag').map((row, i)=>(
                                            <DataRow key={i} label={row.name} amount={row.amount} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Kennzahlen Sektion */}
                    <div className="bg-white shadow-md rounded-lg border border-gray-200">
                        <div className="bg-gray-100 px-6 py-4 border-b border-gray-200 flex justify-between items-center rounded-t-lg">
                            <div>
                                <h2 className="text-xl font-semibold">Kennzahlen (Eingabe)</h2>
                                <p className="text-sm text-gray-500 mt-1">Bitte gib die Ergebnisse mit zwei Nachkommastellen an (z. B. 12,34).</p>
                            </div>
                            <div className="flex gap-4">
                                <button 
                                    onClick={toggleSolutions}
                                    className={`px-6 py-3 rounded-2xl font-bold transition-all shadow-sm active:scale-95 ${
                                        showSolutions 
                                            ? 'bg-zinc-800 text-white hover:bg-zinc-700' 
                                            : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200'
                                    }`}
                                >
                                    {showSolutions ? 'Lösungen ausblenden' : 'Lösungen anzeigen'}
                                </button>
                                <button 
                                    onClick={checkSolutions}
                                    className="px-6 py-3 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-colors shadow-lg active:scale-95"
                                >
                                    Ergebnisse prüfen
                                </button>
                            </div>
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
                                    <InputRow label="Verschuldungsgrad" inputKey="verschuldungsgrad" inputs={inputs} feedback={feedback} handleInputChange={handleInputChange} />
                                    <InputRow label="Fremdkapitalquote" inputKey="fremdkapitalquote" inputs={inputs} feedback={feedback} handleInputChange={handleInputChange} />
                                    <InputRow label="Eigenkapitalquote" inputKey="eigenkapitalquote" inputs={inputs} feedback={feedback} handleInputChange={handleInputChange} />
                                    <InputRow label="Anlagendeckungsgrad I" inputKey="anlagendeckungsgrad1" inputs={inputs} feedback={feedback} handleInputChange={handleInputChange} />
                                    <InputRow label="Anlagendeckungsgrad II" inputKey="anlagendeckungsgrad2" inputs={inputs} feedback={feedback} handleInputChange={handleInputChange} />
                                    <InputRow label="Liquidität 1. Grades" inputKey="liquiditaet1" inputs={inputs} feedback={feedback} handleInputChange={handleInputChange} />
                                    <InputRow label="Liquidität 2. Grades" inputKey="liquiditaet2" inputs={inputs} feedback={feedback} handleInputChange={handleInputChange} />
                                    <InputRow label="Liquidität 3. Grades" inputKey="liquiditaet3" inputs={inputs} feedback={feedback} handleInputChange={handleInputChange} />
                                    <InputRow label="EBIT" inputKey="ebit" inputs={inputs} feedback={feedback} handleInputChange={handleInputChange} suffix="TEUR" />
                                    <InputRow label="Eigenkapitalrentabilität (vor Steuern)" inputKey="ekRentVorSteuer" inputs={inputs} feedback={feedback} handleInputChange={handleInputChange} />
                                    <InputRow label="Eigenkapitalrentabilität (nach Steuern)" inputKey="ekRentNachSteuer" inputs={inputs} feedback={feedback} handleInputChange={handleInputChange} />
                                    <InputRow label="Umsatzrentabilität (nach Steuern)" inputKey="umsatzRent" inputs={inputs} feedback={feedback} handleInputChange={handleInputChange} />
                                    <InputRow label="Gesamtkapitalrentabilität (nach Steuern)" inputKey="gesamtkapRent" inputs={inputs} feedback={feedback} handleInputChange={handleInputChange} />
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : activeType === 'kennzahlen2' ? (
                <div className="space-y-12">
                    {/* Daten Sektion */}
                    <div className="bg-white shadow-md rounded-lg border border-gray-200">
                        <div className="bg-gray-100 px-6 py-4 border-b border-gray-200 flex justify-between items-center rounded-t-lg">
                            <h2 className="text-xl font-semibold">Unternehmensdaten</h2>
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <span className="text-sm font-bold text-zinc-600 group-hover:text-zinc-900 transition-colors">Nachkommastellen ausblenden</span>
                                <div className="relative">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer" 
                                        checked={roundToInteger}
                                        onChange={() => setRoundToInteger(!roundToInteger)}
                                    />
                                    <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </div>
                            </label>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-1 border-t pt-4">
                                <p className="text-xs font-bold uppercase text-gray-500">Eigenkapital</p>
                                <p className="text-lg font-mono">{formatNumber(data2?.ek)} €</p>
                            </div>
                            <div className="space-y-1 border-t pt-4" >
                                <p className="text-xs font-bold uppercase text-gray-500">Fremdkapital</p>
                                <p className="text-lg font-mono">{formatNumber(data2?.fk)} €</p>
                            </div>
                            <div className="space-y-1 border-t pt-4">
                                <p className="text-xs font-bold uppercase text-gray-500">Fremdkapitalzinssatz</p>
                                <p className="text-lg font-mono">{formatNumber(data2?.fk_zins * 100)} %</p>
                            </div>
                            <div className="space-y-1 border-t pt-4">
                                <p className="text-xs font-bold uppercase text-gray-500">Umsatzerlöse</p>
                                <p className="text-lg font-mono">{formatNumber(data2?.umsatz)} €</p>
                            </div>
                            <div className="space-y-1 border-t pt-4">
                                <p className="text-xs font-bold uppercase text-gray-500">Gewinn vor Steuer (EBT)</p>
                                <p className="text-lg font-mono">{formatNumber(data2?.ebt)} €</p>
                            </div>
                            <div className="space-y-1 border-t pt-4">
                                <p className="text-xs font-bold uppercase text-gray-500">Gewinn nach Steuer (JÜ)</p>
                                <p className="text-lg font-mono">{formatNumber(data2?.net_income)} €</p>
                            </div>
                            <div className="space-y-1 border-t pt-4">
                                <p className="text-xs font-bold uppercase text-gray-500">Abschreibungen</p>
                                <p className="text-lg font-mono">{formatNumber(data2?.abschreibungen)} €</p>
                            </div>
                            <div className="space-y-1 border-t pt-4">
                                <p className="text-xs font-bold uppercase text-gray-500">Veränderungen Pensionsrückstellungen</p>
                                <p className="text-lg font-mono">{formatNumber(data2?.pensionsrueckstellungen)} €</p>
                            </div>
                            <div className="space-y-1 border-t pt-4">
                                <p className="text-xs font-bold uppercase text-gray-500">Veränderungen Working Capital</p>
                                <p className="text-lg font-mono">{formatNumber(data2?.working_capital)} €</p>
                            </div>
                            <div className="space-y-1 border-t pt-4">
                                <p className="text-xs font-bold uppercase text-gray-500">Investitionen (Capex)</p>
                                <p className="text-lg font-mono">{formatNumber(data2?.investitionen)} €</p>
                            </div>
                            <div className="space-y-1 border-t pt-4">
                                <p className="text-xs font-bold uppercase text-gray-500">Kapitalkostensatz für Eigenkapital nach Steuern</p>
                                <p className="text-lg font-mono">{formatNumber(data2?.kapitalkosten_ek * 100) } %</p>
                            </div>
                        </div>
                    </div>

                    {/* Kennzahlen Sektion */}
                    <div className="bg-white shadow-md rounded-lg border border-gray-200">
                        <div className="bg-gray-100 px-6 py-4 border-b border-gray-200 flex justify-between items-center rounded-t-lg">
                            <div>
                                <h2 className="text-xl font-semibold">Kennzahlen II (Eingabe)</h2>
                                <p className="text-sm text-gray-500 mt-1">Berechne die erweiterten Kennzahlen und Cashflows.</p>
                            </div>
                            <div className="flex gap-4">
                                <button 
                                    onClick={toggleSolutions}
                                    className={`px-6 py-3 rounded-2xl font-bold transition-all shadow-sm active:scale-95 ${
                                        showSolutions 
                                            ? 'bg-zinc-800 text-white hover:bg-zinc-700' 
                                            : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200'
                                    }`}
                                >
                                    {showSolutions ? 'Lösungen ausblenden' : 'Lösungen anzeigen'}
                                </button>
                                <button 
                                    onClick={checkSolutions}
                                    className="px-6 py-3 bg-zinc-900 text-white rounded-2xl font-bold hover:bg-zinc-800 transition-colors shadow-lg active:scale-95"
                                >
                                    Ergebnisse prüfen
                                </button>
                            </div>
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
                                    <InputRow label="Umsatzrendite (vor Steuern)" inputKey="umsatzrendite" inputs={inputs} feedback={feedback} handleInputChange={handleInputChange} />
                                    <InputRow label="Eigenkapitalrentabilität (nach Steuern)" inputKey="ekr" inputs={inputs} feedback={feedback} handleInputChange={handleInputChange} />
                                    <InputRow label="Gesamtkapitalrentabilität (nach Steuern)" inputKey="gkr" inputs={inputs} feedback={feedback} handleInputChange={handleInputChange} />
                                    <InputRow label="EBIT" inputKey="ebit" inputs={inputs} feedback={feedback} handleInputChange={handleInputChange} suffix="€" />
                                    <InputRow label="EBITDA" inputKey="ebitda" inputs={inputs} feedback={feedback} handleInputChange={handleInputChange} suffix="€" />
                                    <InputRow label="NOPAT" inputKey="nopat" inputs={inputs} feedback={feedback} handleInputChange={handleInputChange} suffix="€" />
                                    <InputRow label="Operating Cash Flow (OCF)" inputKey="ocf" inputs={inputs} feedback={feedback} handleInputChange={handleInputChange} suffix="€" />
                                    <InputRow label="Free Cash Flow (FCF)" inputKey="fcf" inputs={inputs} feedback={feedback} handleInputChange={handleInputChange} suffix="€" />
                                    <InputRow label="WACC" inputKey="wacc" inputs={inputs} feedback={feedback} handleInputChange={handleInputChange} />
                                    <InputRow label="Kapitalkosten" inputKey="kapitalkosten" inputs={inputs} feedback={feedback} handleInputChange={handleInputChange} suffix="€" />
                                    <InputRow label="Economic Value Added (EVA)" inputKey="eva" inputs={inputs} feedback={feedback} handleInputChange={handleInputChange} suffix="€" />
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-zinc-200 text-center space-y-4">
                    <div className="text-4xl text-zinc-300">🔍</div>
                    <h3 className="text-xl font-bold text-zinc-900">Lücken-Bilanz folgt in Kürze</h3>
                    <p className="text-zinc-500 max-w-sm mx-auto">
                        In diesem Modus musst du die Bilanzposten anhand gegebener Kennzahlen vervollständigen.
                    </p>
                    <button 
                        onClick={() => setActiveType('standard')}
                        className="text-blue-600 font-bold hover:underline"
                    >
                        Zurück zur Basis-Analyse
                    </button>
                </div>
            )}
        </main>
    )
}
