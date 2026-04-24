import { useState } from 'react';
import { Download, FileImage, FileCode, Check } from 'lucide-react';
import { downloadAsPng, downloadAsSvg, slugify } from '../lib/download';
import { toSvg } from '../lib/api';

export default function LogoCard({ logo, brandName, index }) {
  const [busy, setBusy] = useState(null);
  const [done, setDone] = useState(null);

  const markDone = (t) => {
    setDone(t);
    setTimeout(() => setDone(null), 1500);
  };

  const handlePng = async () => {
    try {
      setBusy('png');
      const name = `${slugify(brandName)}-${index + 1}.png`;
      await downloadAsPng(logo.dataUrl, name);
      markDone('png');
    } catch (e) {
      alert('Erreur téléchargement PNG: ' + e.message);
    } finally {
      setBusy(null);
    }
  };

  const handleSvg = async () => {
    try {
      setBusy('svg');
      const name = `${slugify(brandName)}-${index + 1}.svg`;
      if (logo.svg) {
        downloadAsSvg(logo.svg, name);
      } else if (logo.dataUrl.startsWith('data:image/svg+xml')) {
        downloadAsSvg(logo.dataUrl, name);
      } else {
        // PNG from AI provider → wrap in SVG via backend
        const svg = await toSvg({ dataUrl: logo.dataUrl, brandName });
        downloadAsSvg(svg, name);
      }
      markDone('svg');
    } catch (e) {
      alert('Erreur téléchargement SVG: ' + e.message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="card group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-slide-up" style={{ animationDelay: `${index * 80}ms` }}>
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
        <img
          src={logo.dataUrl}
          alt={`Logo ${index + 1}`}
          className="h-full w-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur">
          #{index + 1}
        </div>
      </div>
      <div className="flex items-center gap-2 border-t border-slate-100 p-3">
        <button
          onClick={handlePng}
          disabled={busy !== null}
          className="btn-ghost flex-1"
        >
          {done === 'png' ? <Check className="h-4 w-4 text-emerald-600" /> : busy === 'png' ? <Spinner /> : <FileImage className="h-4 w-4" />}
          PNG
        </button>
        <button
          onClick={handleSvg}
          disabled={busy !== null}
          className="btn-ghost flex-1"
        >
          {done === 'svg' ? <Check className="h-4 w-4 text-emerald-600" /> : busy === 'svg' ? <Spinner /> : <FileCode className="h-4 w-4" />}
          SVG
        </button>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4"/>
      <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
    </svg>
  );
}
