import { useState } from 'react';
import { Sparkles, Wand2, AlertCircle, Palette } from 'lucide-react';
import ColorPicker from './components/ColorPicker.jsx';
import LogoCard from './components/LogoCard.jsx';
import { generateLogos } from './lib/api';

const STYLE_PRESETS = [
  'Minimaliste', 'Futuriste', 'Luxe', 'Vintage',
  'Moderne', 'Élégant', 'Ludique', 'Corporate', 'Tech', 'Organique',
];

export default function App() {
  const [brandName, setBrandName] = useState('');
  const [style, setStyle] = useState('Minimaliste');
  const [colors, setColors] = useState(['#6366f1', '#ec4899']);
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e) => {
    e?.preventDefault();
    if (!brandName.trim()) {
      setError('Veuillez entrer un nom de marque.');
      return;
    }
    setError('');
    setLoading(true);
    setLogos([]);
    try {
      const { logos } = await generateLogos({
        brandName: brandName.trim(),
        style,
        colors,
        count: 4,
      });
      setLogos(logos);
    } catch (err) {
      setError(err.message || 'Erreur lors de la génération.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-full overflow-hidden">
      {/* Animated background blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-indigo-300/40 blur-3xl animate-blob" />
        <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-pink-300/40 blur-3xl animate-blob" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-violet-300/30 blur-3xl animate-blob" style={{ animationDelay: '8s' }} />
      </div>

      {/* Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 text-white shadow-lg shadow-indigo-500/30">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-extrabold tracking-tight">LogoForge</div>
            <div className="text-xs text-slate-500 -mt-0.5">AI Logo Generator</div>
          </div>
        </div>
        <a
          href="https://github.com"
          className="hidden text-sm font-medium text-slate-600 hover:text-slate-900 sm:block"
        >
          Propulsé par l'IA ✨
        </a>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-24">
        {/* Hero */}
        <section className="mx-auto max-w-3xl text-center animate-fade-in">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-medium text-slate-600 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            Génération par intelligence artificielle
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            Créez votre logo <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 bg-clip-text text-transparent">
              en quelques secondes
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
            Décrivez votre marque, choisissez un style et laissez l'IA générer 4 propositions uniques.
            Téléchargez en PNG ou SVG, gratuitement.
          </p>
        </section>

        {/* Form */}
        <section className="mt-12">
          <form onSubmit={handleGenerate} className="card mx-auto max-w-3xl p-6 sm:p-8 animate-slide-up">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="label">Nom de la marque *</label>
                <input
                  className="input"
                  placeholder="ex: Nova Studio"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  maxLength={40}
                />
              </div>

              <div className="md:col-span-2">
                <label className="label">Style / description du logo</label>
                <input
                  className="input"
                  placeholder="ex: minimaliste, futuriste, luxe..."
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                />
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {STYLE_PRESETS.map((s) => {
                    const active = style.toLowerCase() === s.toLowerCase();
                    return (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setStyle(s)}
                        className={`chip ${
                          active
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="label flex items-center gap-2">
                  <Palette className="h-4 w-4 text-slate-400" />
                  Couleurs ({colors.length}/5)
                </label>
                <ColorPicker colors={colors} onChange={setColors} />
              </div>
            </div>

            {error && (
              <div className="mt-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="mt-6 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-slate-500">
                💡 Astuce: un nom court et un style précis donnent les meilleurs résultats.
              </p>
              <button type="submit" disabled={loading} className="btn-primary">
                {loading ? (
                  <>
                    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
                      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                    </svg>
                    Génération en cours…
                  </>
                ) : (
                  <>
                    <Wand2 className="h-5 w-5" />
                    Générer le logo
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Results */}
        <section className="mt-14">
          {loading && <LoadingGrid />}

          {!loading && logos.length > 0 && (
            <>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900">
                  {logos.length} propositions générées
                </h2>
                <button
                  onClick={handleGenerate}
                  className="btn-ghost"
                >
                  <Wand2 className="h-4 w-4" /> Régénérer
                </button>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {logos.map((logo, i) => (
                  <LogoCard key={i} logo={logo} brandName={brandName} index={i} />
                ))}
              </div>
            </>
          )}

          {!loading && logos.length === 0 && (
            <EmptyState />
          )}
        </section>
      </main>

      <footer className="mx-auto max-w-6xl px-6 pb-10 text-center text-sm text-slate-500">
        Construit avec React, Tailwind & Node.js • © {new Date().getFullYear()} LogoForge
      </footer>
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="card overflow-hidden">
          <div className="aspect-square animate-pulse bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100" />
          <div className="flex gap-2 border-t border-slate-100 p-3">
            <div className="h-8 flex-1 animate-pulse rounded-lg bg-slate-100" />
            <div className="h-8 flex-1 animate-pulse rounded-lg bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="card mx-auto max-w-xl p-10 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-pink-100">
        <Sparkles className="h-7 w-7 text-indigo-600" />
      </div>
      <h3 className="text-lg font-bold text-slate-900">Prêt à créer votre logo ?</h3>
      <p className="mt-2 text-slate-600">
        Remplissez le formulaire ci-dessus et cliquez sur <strong>Générer le logo</strong>.
        Vous recevrez 4 propositions uniques en quelques secondes.
      </p>
    </div>
  );
}
