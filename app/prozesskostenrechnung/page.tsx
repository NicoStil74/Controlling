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

type InputKey = 
  | 'appl_kostensatz' | 'appl_umlagesatz' | 'appl_gesamt'
  | 'int_kostensatz' | 'int_umlagesatz' | 'int_gesamt'
  | 'psych_kostensatz' | 'psych_umlagesatz' | 'psych_gesamt'
  | 'general_umlagesatz';

export default function ProzesskostenPage() {
  const [data, setData] = useState<ProzessDaten | null>(null);
  const [loading, setLoading] = useState(true);
  const [inputs, setInputs] = useState<Record<InputKey, string>>({
    appl_kostensatz: '', appl_umlagesatz: '', appl_gesamt: '',
    int_kostensatz: '', int_umlagesatz: '', int_gesamt: '',
    psych_kostensatz: '', psych_umlagesatz: '', psych_gesamt: '',
    general_umlagesatz: ''
  });
  const [feedback, setFeedback] = useState<Record<InputKey, 'correct' | 'wrong' | 'neutral'>>({
    appl_kostensatz: 'neutral', appl_umlagesatz: 'neutral', appl_gesamt: 'neutral',
    int_kostensatz: 'neutral', int_umlagesatz: 'neutral', int_gesamt: 'neutral',
    psych_kostensatz: 'neutral', psych_umlagesatz: 'neutral', psych_gesamt: 'neutral',
    general_umlagesatz: 'neutral'
  });
  const [showSolutions, setShowSolutions] = useState(false);
  const [previousInputs, setPreviousInputs] = useState<Record<InputKey, string>>({
    appl_kostensatz: '', appl_umlagesatz: '', appl_gesamt: '',
    int_kostensatz: '', int_umlagesatz: '', int_gesamt: '',
    psych_kostensatz: '', psych_umlagesatz: '', psych_gesamt: '',
    general_umlagesatz: ''
  });

  const fetchData = async () => {
    setLoading(true);
    setShowSolutions(false);
    setFeedback({
        appl_kostensatz: 'neutral', appl_umlagesatz: 'neutral', appl_gesamt: 'neutral',
        int_kostensatz: 'neutral', int_umlagesatz: 'neutral', int_gesamt: 'neutral',
        psych_kostensatz: 'neutral', psych_umlagesatz: 'neutral', psych_gesamt: 'neutral',
        general_umlagesatz: 'neutral'
    });
    setInputs({
        appl_kostensatz: '', appl_umlagesatz: '', appl_gesamt: '',
        int_kostensatz: '', int_umlagesatz: '', int_gesamt: '',
        psych_kostensatz: '', psych_umlagesatz: '', psych_gesamt: '',
        general_umlagesatz: ''
    });

    try {
      const res = await fetch('/api/prozesskosten');
      const result = await res.json();
      setData(result);
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
    if (!data) return;

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

    setFeedback(newFeedback);
  };

  const toggleSolutions = () => {
    if (!data) return;

    if (!showSolutions) {
      setPreviousInputs(inputs);
      setInputs({
        appl_kostensatz: data.application_cost_rate.toLocaleString('de-DE', { minimumFractionDigits: 2 }),
        appl_umlagesatz: data.appl_umlagesatz.toLocaleString('de-DE', { minimumFractionDigits: 2 }),
        appl_gesamt: data.appl_gesamt.toLocaleString('de-DE', { minimumFractionDigits: 2 }),
        int_kostensatz: data.interview_cost_rate.toLocaleString('de-DE', { minimumFractionDigits: 2 }),
        int_umlagesatz: data.interview_umlagesatz.toLocaleString('de-DE', { minimumFractionDigits: 2 }),
        int_gesamt: data.interview_gesamt.toLocaleString('de-DE', { minimumFractionDigits: 2 }),
        psych_kostensatz: data.psych_cost_rate.toLocaleString('de-DE', { minimumFractionDigits: 2 }),
        psych_umlagesatz: data.psych_umlagesatz.toLocaleString('de-DE', { minimumFractionDigits: 2 }),
        psych_gesamt: data.psych_gesamt.toLocaleString('de-DE', { minimumFractionDigits: 2 }),
        general_umlagesatz: (data.abteilung_umlagesatz * 100).toLocaleString('de-DE', { minimumFractionDigits: 2 }),
      });
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

  const InputCell = ({ inputKey, suffix = "€" }: { inputKey: InputKey, suffix?: string }) => (
    <td className={`border border-gray-300 px-2 py-1 text-right relative transition-colors ${
        feedback[inputKey] === 'correct' ? 'bg-green-100' : 
        feedback[inputKey] === 'wrong' ? 'bg-red-100' : ''
    }`}>
        <input 
            type="text" 
            value={inputs[inputKey] || ''}
            onChange={(e) => handleInputChange(inputKey, e.target.value)}
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
          <div className="flex gap-4">
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

        <section className="bg-white rounded-[2rem] border-2 border-zinc-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] overflow-hidden">
            <div className="bg-zinc-50/50 border-b border-zinc-100 px-8 py-4 flex items-center justify-between">
                <h2 className="font-bold text-zinc-900 text-xl">Prozesskostenkalkulation</h2>
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
                    <td className="border border-gray-300 px-4 py-4 text-sm text-right font-mono">{data?.application_cost.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</td>
                    <InputCell inputKey="appl_kostensatz" />
                    <InputCell inputKey="appl_umlagesatz" />
                    <InputCell inputKey="appl_gesamt" />
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-4 text-sm font-medium text-gray-900">Bewerbungsgespräche</td>
                    <td className="border border-gray-300 px-4 py-4 text-sm text-gray-900">Anzahl Gespräche</td>
                    <td className="border border-gray-300 px-4 py-4 text-sm text-right font-mono">{data?.interview_amt.toLocaleString('de-DE')}</td>
                    <td className="border border-gray-300 px-4 py-4 text-sm text-right font-mono">{data?.interview_cost.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</td>
                    <InputCell inputKey="int_kostensatz" />
                    <InputCell inputKey="int_umlagesatz" />
                    <InputCell inputKey="int_gesamt" />
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-4 text-sm font-medium text-gray-900">Psychologische Tests</td>
                    <td className="border border-gray-300 px-4 py-4 text-sm text-gray-900">Anzahl Tests</td>
                    <td className="border border-gray-300 px-4 py-4 text-sm text-right font-mono">{data?.psych_amt.toLocaleString('de-DE')}</td>
                    <td className="border border-gray-300 px-4 py-4 text-sm text-right font-mono">{data?.psych_cost.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</td>
                    <InputCell inputKey="psych_kostensatz" />
                    <InputCell inputKey="psych_umlagesatz" />
                    <InputCell inputKey="psych_gesamt" />
                  </tr>
                  <tr className="font-bold">
                    <td className="border border-gray-300 px-4 py-4 text-sm text-zinc-900">Abteilung leiten</td>
                    <td className="border border-gray-300 px-4 py-4 text-sm text-gray-900"></td>
                    <td className="border border-gray-300 px-4 py-4 text-sm text-right font-mono"></td>
                    <td className="border border-gray-300 px-4 py-4 text-sm text-right font-mono text-zinc-900">{(data?.abteilung || 0).toLocaleString('de-DE', { minimumFractionDigits: 2 })}</td>
                    <td className="border border-gray-300 px-4 py-4 text-sm text-center"></td>
                    <InputCell inputKey="general_umlagesatz" suffix="%" />
                    <td className="border border-gray-300 px-4 py-4 text-sm text-center"></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="p-8 bg-zinc-50 border-t border-zinc-100 flex flex-col items-center gap-4">
                <p className="text-sm text-zinc-500 font-medium">Berechne die Kostensätze für die lmi-Prozesse basierend auf dem Umlagesatz der lmn-Prozesse.</p>
            </div>
        </section>
      </div>
    </main>
  );
}
