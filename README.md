# LogoForge — Générateur de logos IA

Application web moderne (style SaaS) pour générer des logos avec l'IA. Entrez le nom de votre marque, décrivez le style souhaité, choisissez vos couleurs, et recevez 4 propositions téléchargeables en **PNG** et **SVG**.

## Stack

- **Frontend** — React 18 + Vite + TailwindCSS + lucide-react
- **Backend** — Node.js + Express (ES modules)
- **IA** — OpenAI (gpt-image-1 / DALL·E 3), Stability AI, ou mode **mock** (par défaut, sans clé API)

## Structure

```
ai-logo-generator/
├── backend/         # API Node.js / Express
│   ├── src/
│   │   ├── server.js
│   │   ├── providers/    # openai.js, stability.js, mock.js
│   │   └── utils/svg.js
│   └── .env.example
└── frontend/        # React + Vite + Tailwind
    ├── src/
    │   ├── App.jsx
    │   ├── components/   # ColorPicker, LogoCard
    │   └── lib/          # api, download
    └── ...
```

## Installation & lancement

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # (Windows: copy .env.example .env)
npm run dev            # http://localhost:5000
```

Par défaut, `AI_PROVIDER=mock` : l'application fonctionne **sans clé API** et génère des logos SVG variés côté serveur.

Pour utiliser une vraie IA, éditez `.env` :

```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-image-1
```

ou

```env
AI_PROVIDER=stability
STABILITY_API_KEY=sk-...
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev            # http://localhost:5173
```

Vite proxifie automatiquement `/api/*` vers `http://localhost:5000`.

## Endpoints API

| Méthode | Route               | Description                                         |
|---------|---------------------|-----------------------------------------------------|
| GET     | `/api/health`       | Statut + provider actif                             |
| POST    | `/api/generate`     | `{ brandName, style, colors, count }` → 4 logos     |
| POST    | `/api/to-svg`       | Wrappe un PNG (dataURL) dans un SVG téléchargeable  |

## Fonctionnalités

- Champ nom de marque + description de style (avec presets cliquables)
- Sélecteur de couleurs avancé (jusqu'à 5 couleurs, presets inclus)
- Génération de 4 propositions en parallèle
- Téléchargement **PNG** (rastérisé côté navigateur si besoin) et **SVG**
- Interface responsive, animations, gradients modernes
- Mode fallback `mock` pour démo sans clé API

## Notes

- Le téléchargement SVG de logos provenant d'un modèle raster (OpenAI/Stability) utilise un wrapper SVG qui embarque le PNG. Pour une vraie vectorisation, intégrez [potrace](https://www.npmjs.com/package/potrace) dans `backend/src/utils/svg.js`.
- Le mode `mock` produit des SVG **réellement vectoriels** (parfaits pour tester le flux complet).

## Licence

MIT
