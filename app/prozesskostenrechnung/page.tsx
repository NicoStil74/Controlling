'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface ProzessDaten {
  application_amt: number;
  application_cost: number;
  application_cost_rate: number;
  appl_umlagesatz: number;
  appl_gesamt: number;
  interview_amt: number;
  interview_cost: number;
  interview_cost_rate: number;
  interview_umlagesatz: number;
  interview_gesamt: number;
  psych_amt: number;
  psych_cost: number;
  psych_cost_rate: number;
  psych_umlagesatz: number;
  psych_gesamt: number;
  abteilung : number;
  abteilung_umlagesatz: number;
}

interface ProductData {
  fertigungs_einzelkosten: number;
  produktionsmenge: number;
  bauplanpositionen: number;
}

interface Prozessdaten2 {
  personalkosten: number;
  sachkosten: number;
  sonstige_kosten: number;
  A: ProductData;
  B: ProductData;
  C: ProductData;
  D: ProductData;
  solutions: {
    gemeinkosten: number;
    einzelkosten: number;
    zuschlagssatz: number;
    gemeinkosten_A: number;
    gemeinkosten_B: number;
    gemeinkosten_C: number;
    gemeinkosten_D: number;
  };
}

type InputKey = 
  | 'appl_kostensatz' | 'appl_umlagesatz' | 'appl_gesamt'
  | 'int_kostensatz' | 'int_umlagesatz' | 'int_gesamt'
  | 'psych_kostensatz' | 'psych_umlagesatz' | 'psych_gesamt'
  | 'general_umlagesatz'
  | 'gemeinkosten' | 'einzelkosten' | 'zuschlagssatz'
  | 'gemeinkosten_A' | 'gemeinkosten_B' | 'gemeinkosten_C' | 'gemeinkosten_D';

export default function ProzesskostenPage() {
  const [activeTab, setActiveTab] = useState(1);
  const [data, setData] = useState<ProzessDaten | null>(null);
  const [data2, setData2] = useState<Prozessdaten2 | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDecimals, setShowDecimals] = useState(true);
  const [inputs, setInputs] = useState<Record<InputKey, string>>({
    appl_kostensatz: '', appl_umlagesatz: '', appl_gesamt: '',
    int_kostensatz: '', int_umlagesatz: '', int_gesamt: '',
    psych_kostensatz: '', psych_umlagesatz: '', psych_gesamt: '',
    general_umlagesatz: '',
    gemeinkosten: '', einzelkosten: '', zuschlagssatz: '',
    gemeinkosten_A: '', gemeinkosten_B: '', gemeinkosten_C: '', gemeinkosten_D: ''
  });
  const [feedback, setFeedback] = useState<Record<InputKey, 'correct' | 'wrong' | 'neutral'>>({
    appl_kostensatz: 'neutral', appl_umlagesatz: 'neutral', appl_gesamt: 'neutral',
    int_kostensatz: 'neutral', int_umlagesatz: 'neutral', int_gesamt: 'neutral',
    psych_kostensatz: 'neutral', psych_umlagesatz: 'neutral', psych_gesamt: 'neutral',
    general_umlagesatz: 'neutral',
    gemeinkosten: 'neutral', einzelkosten: 'neutral', zuschlagssatz: 'neutral',
    gemeinkosten_A: 'neutral', gemeinkosten_B: 'neutral', gemeinkosten_C: 'neutral', gemeinkosten_D: 'neutral'
  });
  const [showSolutions, setShowSolutions] = useState(false);
  const [previousInputs, setPreviousInputs] = useState<Record<InputKey, string>>({
    appl_kostensatz: '', appl_umlagesatz: '', appl_gesamt: '',
    int_kostensatz: '', int_umlagesatz: '', int_gesamt: '',
    psych_kostensatz: '', psych_umlagesatz: '', psych_gesamt: '',
    general_umlagesatz: '',
    gemeinkosten: '', einzelkosten: '', zuschlagssatz: '',
    gemeinkosten_A: '', gemeinkosten_B: '', gemeinkosten_C: '', gemeinkosten_D: ''
  });

  const formatValue = (val: number | undefined, decimals: number = 2) => {
    if (val === undefined) return '';
    return val.toLocaleString('de-DE', {
      minimumFractionDigits: showDecimals ? decimals : 0,
      maximumFractionDigits: showDecimals ? decimals : 0
    });
  };

  const fetchData = async () => {
    setLoading(true);
    setShowSolutions(false);
    setFeedback({
        appl_kostensatz: 'neutral', appl_umlagesatz: 'neutral', appl_gesamt: 'neutral',
        int_kostensatz: 'neutral', int_umlagesatz: 'neutral', int_gesamt: 'neutral',
        psych_kostensatz: 'neutral', psych_umlagesatz: 'neutral', psych_gesamt: 'neutral',
        general_umlagesatz: 'neutral',
        gemeinkosten: 'neutral', einzelkosten: 'neutral', zuschlagssatz: 'neutral',
        gemeinkosten_A: 'neutral', gemeinkosten_B: 'neutral', gemeinkosten_C: 'neutral', gemeinkosten_D: 'neutral'
    });
    setInputs({
        appl_kostensatz: '', appl_umlagesatz: '', appl_gesamt: '',
        int_kostensatz: '', int_umlagesatz: '', int_gesamt: '',
        psych_kostensatz: '', psych_umlagesatz: '', psych_gesamt: '',
        general_umlagesatz: '',
        gemeinkosten: '', einzelkosten: '', zuschlagssatz: '',
        gemeinkosten_A: '', gemeinkosten_B: '', gemeinkosten_C: '', gemeinkosten_D: ''
    });

    try {
      const [res, res2] = await Promise.all([
        fetch('/api/prozesskosten'),
        fetch('/api/prozesskosten2')
      ]);
      const result = await res.json();
      const result2 = await res2.json();
      setData(result);
      setData2(result2);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (key: InputKey, value: string) => {
    const cleanValue = value.replace(/[^0-9.,-]/g, '');
    setInputs(prev => ({ ...prev, [key]: cleanValue }));
  };

  const parseGermanNumber = (val: string): number => {
    let clean = val.replace(/\./g, '').replace(',', '.');
    return parseFloat(clean) || 0;
  };

  const checkSolutions = () => {
    if (!data || !data2) return;

    const newFeedback: Record<InputKey, 'correct' | 'wrong' | 'neutral'> = { ...feedback };
    
    const check = (key: InputKey, correctValue: number) => {
        const userInput = inputs[key].trim();
        if (userInput === '') {
            newFeedback[key] = 'neutral';
        } else {
            const userValue = parseGermanNumber(userInput);
            // Tolerance for rounding
            const isCorrect = Math.abs(userValue - correctValue) < 0.1;
            newFeedback[key] = isCorrect ? 'correct' : 'wrong';
        }
    };

    if (activeTab === 1) {
        check('appl_kostensatz', data.application_cost_rate);
        check('appl_umlagesatz', data.appl_umlagesatz);
        check('appl_gesamt', data.appl_gesamt);
        
        check('int_kostensatz', data.interview_cost_rate);
        check('int_umlagesatz', data.interview_umlagesatz);
        check('int_gesamt', data.interview_gesamt);
        
        check('psych_kostensatz', data.psych_cost_rate);
        check('psych_umlagesatz', data.psych_umlagesatz);
        check('psych_gesamt', data.psych_gesamt);

        check('general_umlagesatz', data.abteilung_umlagesatz * 100);
    } else {
        check('gemeinkosten', data2.solutions.gemeinkosten);
        check('einzelkosten', data2.solutions.einzelkosten);
        check('zuschlagssatz', data2.solutions.zuschlagssatz * 100);
        check('gemeinkosten_A', data2.solutions.gemeinkosten_A);
        check('gemeinkosten_B', data2.solutions.gemeinkosten_B);
        check('gemeinkosten_C', data2.solutions.gemeinkosten_C);
        check('gemeinkosten_D', data2.solutions.gemeinkosten_D);
    }

    setFeedback(newFeedback);
  };

  const toggleSolutions = () => {
    if (!data || !data2) return;

    if (!showSolutions) {
      setPreviousInputs(inputs);
      if (activeTab === 1) {
        setInputs({
            ...inputs,
            appl_kostensatz: formatValue(data.application_cost_rate),
            appl_umlagesatz: formatValue(data.appl_umlagesatz),
            appl_gesamt: formatValue(data.appl_gesamt),
            int_kostensatz: formatValue(data.interview_cost_rate),
            int_umlagesatz: formatValue(data.interview_umlagesatz),
            int_gesamt: formatValue(data.interview_gesamt),
            psych_kostensatz: formatValue(data.psych_cost_rate),
            psych_umlagesatz: formatValue(data.psych_umlagesatz),
            psych_gesamt: formatValue(data.psych_gesamt),
            general_umlagesatz: formatValue(data.abteilung_umlagesatz * 100),
        });
      } else {
        setInputs({
            ...inputs,
            gemeinkosten: formatValue(data2.solutions.gemeinkosten),
            einzelkosten: formatValue(data2.solutions.einzelkosten),
            zuschlagssatz: formatValue(data2.solutions.zuschlagssatz * 100),
            gemeinkosten_A: formatValue(data2.solutions.gemeinkosten_A),
            gemeinkosten_B: formatValue(data2.solutions.gemeinkosten_B),
            gemeinkosten_C: formatValue(data2.solutions.gemeinkosten_C),
            gemeinkosten_D: formatValue(data2.solutions.gemeinkosten_D),
        });
      }
    } else {
      setInputs(previousInputs);
    }
    setShowSolutions(!showSolutions);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl font-semibold text-gray-600 animate-pulse text-zinc-500">Lade Daten...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen px-6 py-12 md:px-12 lg:px-24 bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-12">
        <nav>
          <Link href="/" className="group inline-flex items-center text-zinc-500 hover:text-zinc-900 transition-colors gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Zurück zur Übersicht
          </Link>
        </nav>

        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900">Prozesskostenrechnung</h1>
            <p className="text-zinc-500 text-lg max-w-2xl">Berechnung der Prozesskosten für den Personalbeschaffungsprozess.</p>
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-3 cursor-pointer group">
                <span className="text-sm font-bold text-zinc-600 group-hover:text-zinc-900 transition-colors">Nachkommastellen ausblenden</span>
                <div className="relative">
                    <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={!showDecimals}
                        onChange={() => setShowDecimals(!showDecimals)}
                    />
                    <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
            </label>
            <button
                onClick={fetchData}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-zinc-100 rounded-2xl font-bold text-zinc-700 hover:bg-zinc-50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={loading ? 'animate-spin' : ''}>
                    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
                    <path d="M21 3v5h-5"></path>
                    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
                    <path d="M3 21v-5h5"></path>
                </svg>
                Neue Daten
            </button>
          </div>
        </header>

        <div className="flex border-b border-zinc-200">
          <button 
            onClick={() => setActiveTab(1)}
            className={`px-6 py-3 font-bold text-sm transition-all border-b-2 ${activeTab === 1 ? 'border-zinc-900 text-zinc-900' : 'border-transparent text-zinc-400 hover:text-zinc-600'}`}
          >
            Übung 1
          </button>
          <button 
            onClick={() => setActiveTab(2)}
            className={`px-6 py-3 font-bold text-sm transition-all border-b-2 ${activeTab === 2 ? 'border-zinc-900 text-zinc-900' : 'border-transparent text-zinc-400 hover:text-zinc-600'}`}
          >
            Übung 2
          </button>
        </div>

        {activeTab === 1 ? (
          <section className="bg-white rounded-[2rem] border-2 border-zinc-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] overflow-hidden">
              <div className="bg-zinc-50/50 border-b border-zinc-100 px-8 py-4 flex items-center justify-between">
                  <h2 className="font-bold text-zinc-900 text-xl">Übung 1: Prozesskostenkalkulation</h2>
                  <div className="flex gap-4">
                      <button 
                          onClick={toggleSolutions}
                          className={`px-6 py-2 rounded-xl font-bold transition-all shadow-sm active:scale-95 text-sm ${
                              showSolutions ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200'
                          }`}
                      >
                          {showSolutions ? 'Lösungen ausblenden' : 'Lösungen anzeigen'}
                      </button>
                      <button 
                          onClick={checkSolutions}
                          className="px-6 py-2 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-colors shadow-lg active:scale-95 text-sm"
                      >
                          Prüfen
                      </button>
                  </div>
              </div>
              
              <div className="overflow-x-auto p-4">
                <table className="min-w-full border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Prozess</th>
                      <th className="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Cost driver</th>
                      <th className="border border-gray-300 px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Planprozessmenge</th>
                      <th className="border border-gray-300 px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Planprozesskosten in €</th>
                      <th className="border border-gray-300 px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Kostensatz (lm)</th>
                      <th className="border border-gray-300 px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Umlagesatz (lm)</th>
                      <th className="border border-gray-300 px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Gesamt €</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    <tr>
                      <td className="border border-gray-300 px-4 py-4 text-sm font-medium text-gray-900">Bestätigung von Bewerbungen</td>
                      <td className="border border-gray-300 px-4 py-4 text-sm text-gray-900">Anzahl Bestätigungen</td>
                      <td className="border border-gray-300 px-4 py-4 text-sm text-right font-mono">{data?.application_amt.toLocaleString('de-DE')}</td>
                      <td className="border border-gray-300 px-4 py-4 text-sm text-right font-mono">{formatValue(data?.application_cost)}</td>
                      <InputCell inputKey="appl_kostensatz" inputs={inputs} feedback={feedback} onChange={handleInputChange} />
                      <InputCell inputKey="appl_umlagesatz" inputs={inputs} feedback={feedback} onChange={handleInputChange} />
                      <InputCell inputKey="appl_gesamt" inputs={inputs} feedback={feedback} onChange={handleInputChange} />
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-4 text-sm font-medium text-gray-900">Bewerbungsgespräche</td>
                      <td className="border border-gray-300 px-4 py-4 text-sm text-gray-900">Anzahl Gespräche</td>
                      <td className="border border-gray-300 px-4 py-4 text-sm text-right font-mono">{data?.interview_amt.toLocaleString('de-DE')}</td>
                      <td className="border border-gray-300 px-4 py-4 text-sm text-right font-mono">{formatValue(data?.interview_cost)}</td>
                      <InputCell inputKey="int_kostensatz" inputs={inputs} feedback={feedback} onChange={handleInputChange} />
                      <InputCell inputKey="int_umlagesatz" inputs={inputs} feedback={feedback} onChange={handleInputChange} />
                      <InputCell inputKey="int_gesamt" inputs={inputs} feedback={feedback} onChange={handleInputChange} />
                    </tr>
                    <tr>
                      <td className="border border-gray-300 px-4 py-4 text-sm font-medium text-gray-900">Psychologische Tests</td>
                      <td className="border border-gray-300 px-4 py-4 text-sm text-gray-900">Anzahl Tests</td>
                      <td className="border border-gray-300 px-4 py-4 text-sm text-right font-mono">{data?.psych_amt.toLocaleString('de-DE')}</td>
                      <td className="border border-gray-300 px-4 py-4 text-sm text-right font-mono">{formatValue(data?.psych_cost)}</td>
                      <InputCell inputKey="psych_kostensatz" inputs={inputs} feedback={feedback} onChange={handleInputChange} />
                      <InputCell inputKey="psych_umlagesatz" inputs={inputs} feedback={feedback} onChange={handleInputChange} />
                      <InputCell inputKey="psych_gesamt" inputs={inputs} feedback={feedback} onChange={handleInputChange} />
                    </tr>
                    <tr className="font-bold">
                      <td className="border border-gray-300 px-4 py-4 text-sm text-zinc-900">Abteilung leiten</td>
                      <td className="border border-gray-300 px-4 py-4 text-sm text-gray-900"></td>
                      <td className="border border-gray-300 px-4 py-4 text-sm text-right font-mono"></td>
                      <td className="border border-gray-300 px-4 py-4 text-sm text-right font-mono text-zinc-900">{formatValue(data?.abteilung)}</td>
                      <td className="border border-gray-300 px-4 py-4 text-sm text-center"></td>
                      <InputCell inputKey="general_umlagesatz" suffix="%" inputs={inputs} feedback={feedback} onChange={handleInputChange} />
                      <td className="border border-gray-300 px-4 py-4 text-sm text-center"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="p-8 bg-zinc-50 border-t border-zinc-100 flex flex-col items-center gap-4">
                  <p className="text-sm text-zinc-500 font-medium">Berechne die Kostensätze für die lmi-Prozesse basierend auf dem Umlagesatz der lmn-Prozesse.</p>
              </div>
          </section>
        ) : (
          <section className="bg-white rounded-[2rem] border-2 border-zinc-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] overflow-hidden">
              <div className="bg-zinc-50/50 border-b border-zinc-100 px-8 py-4 flex items-center justify-between">
                  <h2 className="font-bold text-zinc-900 text-xl">Übung 2: Zuschlagskalkulation</h2>
                  <div className="flex gap-4">
                      <button 
                          onClick={toggleSolutions}
                          className={`px-6 py-2 rounded-xl font-bold transition-all shadow-sm active:scale-95 text-sm ${
                              showSolutions ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200'
                          }`}
                      >
                          {showSolutions ? 'Lösungen ausblenden' : 'Lösungen anzeigen'}
                      </button>
                      <button 
                          onClick={checkSolutions}
                          className="px-6 py-2 bg-zinc-900 text-white rounded-xl font-bold hover:bg-zinc-800 transition-colors shadow-lg active:scale-95 text-sm"
                      >
                          Prüfen
                      </button>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-zinc-50/50 border-b border-zinc-100">
                <DisplayField label="Personalkosten" value={formatValue(data2?.personalkosten)} />
                <DisplayField label="Sachkosten" value={formatValue(data2?.sachkosten)} />
                <DisplayField label="Sonstige Kosten" value={formatValue(data2?.sonstige_kosten)} />
                <DisplayField 
                  label="Summe" 
                  value={formatValue((data2?.personalkosten || 0) + (data2?.sachkosten || 0) + (data2?.sonstige_kosten || 0))} 
                  dark 
                />
              </div>

              <div className="p-8 bg-white grid grid-cols-1 md:grid-cols-3 gap-8">
                <InputField label="Gemeinkosten (Summe)" inputKey="gemeinkosten" inputs={inputs} feedback={feedback} onChange={handleInputChange} />
                <InputField label="Einzelkosten (Summe)" inputKey="einzelkosten" inputs={inputs} feedback={feedback} onChange={handleInputChange} />
                <InputField label="Zuschlagssatz" inputKey="zuschlagssatz" suffix="%" inputs={inputs} feedback={feedback} onChange={handleInputChange} />
              </div>
              
              <div className="overflow-x-auto p-4 border-t border-zinc-100">
                <table className="min-w-full border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Produkt</th>
                      <th className="border border-gray-300 px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Einzelkosten der Fertigung (in €)</th>
                      <th className="border border-gray-300 px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Produktionsmenge (Stück)</th>
                      <th className="border border-gray-300 px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Bauplanpositionen pro Fahrrad</th>
                      <th className="border border-gray-300 px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Gemeinkosten (in €)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {(['A', 'B', 'C', 'D'] as const).map((letter) => (
                      <tr key={letter}>
                        <td className="border border-gray-300 px-4 py-4 text-sm font-medium text-gray-900">Produkt {letter}</td>
                        <td className="border border-gray-300 px-4 py-4 text-sm text-right font-mono">{formatValue(data2?.[letter].fertigungs_einzelkosten)}</td>
                        <td className="border border-gray-300 px-4 py-4 text-sm text-right font-mono">{data2?.[letter].produktionsmenge.toLocaleString('de-DE')}</td>
                        <td className="border border-gray-300 px-4 py-4 text-sm text-right font-mono">{data2?.[letter].bauplanpositionen.toLocaleString('de-DE')}</td>
                        <InputCell inputKey={`gemeinkosten_${letter}` as InputKey} inputs={inputs} feedback={feedback} onChange={handleInputChange} />
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          </section>
        )}
      </div>
    </main>
  );
}

interface InputFieldProps {
  label: string;
  inputKey: InputKey;
  suffix?: string;
  inputs: Record<InputKey, string>;
  feedback: Record<InputKey, 'correct' | 'wrong' | 'neutral'>;
  onChange: (key: InputKey, value: string) => void;
}

const InputField = ({ label, inputKey, suffix = "€", inputs, feedback, onChange }: InputFieldProps) => (
  <div className="space-y-2">
    <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">{label}</label>
    <div className="relative">
      <input 
          type="text" 
          value={inputs[inputKey] || ''}
          onChange={(e) => onChange(inputKey, e.target.value)}
          placeholder="0,00"
          className={`w-full p-3 pr-8 border-2 rounded-xl focus:ring-2 outline-none font-mono transition-all ${
              feedback[inputKey] === 'correct' ? 'border-green-600 focus:ring-green-500 bg-green-50' : 
              feedback[inputKey] === 'wrong' ? 'border-red-600 focus:ring-red-500 bg-red-50' : 
              'border-zinc-100 focus:ring-zinc-900 bg-white'
          }`}
      />
      <span className={`absolute right-3 top-1/2 -translate-y-1/2 font-bold font-mono text-xs ${
          feedback[inputKey] === 'correct' ? 'text-green-700' : 
          feedback[inputKey] === 'wrong' ? 'text-red-700' : 'text-zinc-400'
      }`}>{suffix}</span>
    </div>
  </div>
);

interface DisplayFieldProps {
  label: string;
  value: string;
  suffix?: string;
  dark?: boolean;
}

const DisplayField = ({ label, value, suffix = "€", dark = false }: DisplayFieldProps) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{label}</label>
    <div className={`h-[52px] flex items-center justify-between px-4 rounded-xl border-2 font-mono font-bold transition-all ${
      dark ? 'bg-zinc-900 border-zinc-900 text-white shadow-md' : 'bg-white border-zinc-100 text-zinc-900 shadow-sm'
    }`}>
      <span className="text-lg">{value}</span>
      <span className={`text-xs ${dark ? 'text-zinc-400' : 'text-zinc-400'}`}>{suffix}</span>
    </div>
  </div>
);

interface InputCellProps {
  inputKey: InputKey;
  suffix?: string;
  inputs: Record<InputKey, string>;
  feedback: Record<InputKey, 'correct' | 'wrong' | 'neutral'>;
  onChange: (key: InputKey, value: string) => void;
}

const InputCell = ({ inputKey, suffix = "€", inputs, feedback, onChange }: InputCellProps) => (
  <td className={`border border-gray-300 px-2 py-1 text-right relative transition-colors ${
      feedback[inputKey] === 'correct' ? 'bg-green-100' : 
      feedback[inputKey] === 'wrong' ? 'bg-red-100' : ''
  }`}>
      <input 
          type="text" 
          value={inputs[inputKey] || ''}
          onChange={(e) => onChange(inputKey, e.target.value)}
          placeholder="0,00"
          className={`w-full text-right p-1.5 pr-6 border-2 rounded-lg focus:ring-2 outline-none text-sm font-mono transition-all ${
              feedback[inputKey] === 'correct' ? 'border-green-600 focus:ring-green-500 bg-white' : 
              feedback[inputKey] === 'wrong' ? 'border-red-600 focus:ring-red-500 bg-white' : 
              'border-gray-200 focus:ring-blue-500'
          }`}
      />
      <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold font-mono ${
          feedback[inputKey] === 'correct' ? 'text-green-700' : 
          feedback[inputKey] === 'wrong' ? 'text-red-700' : 'text-gray-400'
      }`}>{suffix}</span>
  </td>
);
