import Link from 'next/link'

export default function Imprint() {
  return (
    <main className="min-h-screen px-6 py-12 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto space-y-12">
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

        <header className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900">
            Impressum
          </h1>
          <p className="text-zinc-500 text-lg">
            Angaben gemäß § 5 TMG
          </p>
        </header>

        <section className="max-w-none space-y-8">
          <div className="bg-white p-8 rounded-[2rem] border-2 border-zinc-100 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-zinc-900">Betreiber der Website</h2>
            <p className="text-zinc-600 leading-relaxed">
              [Name / Unternehmen]<br />
              [Straße Hausnummer]<br />
              [PLZ Ort]
            </p>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border-2 border-zinc-100 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-zinc-900">Kontakt</h2>
            <p className="text-zinc-600 leading-relaxed">
              Telefon: [Telefonnummer]<br />
              E-Mail: [E-Mail-Adresse]
            </p>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border-2 border-zinc-100 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-zinc-900">Umsatzsteuer-ID</h2>
            <p className="text-zinc-600 leading-relaxed">
              Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
              [USt-ID]
            </p>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border-2 border-zinc-100 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-zinc-900">Redaktionell verantwortlich</h2>
            <p className="text-zinc-600 leading-relaxed">
              [Name]<br />
              [Straße Hausnummer]<br />
              [PLZ Ort]
            </p>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border-2 border-zinc-100 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-zinc-900">EU-Streitschlichtung</h2>
            <p className="text-zinc-600 leading-relaxed">
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://ec.europa.eu/consumers/odr/</a>.<br />
              Unsere E-Mail-Adresse finden Sie oben im Impressum.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border-2 border-zinc-100 shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-zinc-900">Verbraucherstreitbeilegung/Universalschlichtungsstelle</h2>
            <p className="text-zinc-600 leading-relaxed">
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
