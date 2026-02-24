# MMI // AUGMENTED_CREATION

> **Système de production vidéo programmatique piloté par la donnée.** `[2025-12-25]`

![Remotion](https://img.shields.io/badge/Remotion-4.0-BC13FE?style=flat-square)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Claude Code](https://img.shields.io/badge/Claude_Code-CLI-BC13FE?style=flat-square)

---

## CONCEPT

Présentation institutionnelle du BUT Métiers du Multimédia et de l'Internet — parcours Création Numérique. Le projet est une démonstration de production audiovisuelle entièrement générée par code React, sans outil de montage traditionnel.

Chaque frame est une fonction pure du temps. Chaque transition est un paramètre calculé. Chaque donnée affichée est injectée depuis une source de vérité unique.

---

## ARCHITECTURE

### Pipeline Data-Driven

Le moteur de rendu génère l'intégralité des séquences visuelles à partir d'un seul fichier de structure : `src/mmiData.ts`.

```ts
// Source de vérité unique — modifier ce fichier régénère la vidéo intégralement
export interface Section {
  id: string;
  title: string;
  subtitle: string;
  durationInFrames: number;
  tags: string[];
  image: string;
}
```

Toute modification de contenu (titre, durée, asset) ne nécessite aucune intervention dans les composants de rendu. Le moteur recalcule automatiquement les timecodes, les transitions et la durée totale.

**Mapping des sections :**

| `id` | Titre | Asset | Durée |
|---|---|---|---|
| `intro` | BUT MMI | — | 90f · 3s |
| `creation-numerique` | Création Numérique | `1.png` | 90f · 3s |
| `design-graphique` | Design Graphique & UI | `2.png` | 90f · 3s |
| `production-av` | Production Audiovisuelle | `3.png` | 90f · 3s |
| `motion-design` | Motion Design | `4.png` | 90f · 3s |
| `narration-interactive` | Narration Interactive | `5.png` | 90f · 3s |
| `hard-skills` | Hard Skills | `6.png` | 90f · 3s |
| `debouches` | Débouchés | — | 90f · 3s |

> Total : **720 frames @ 30fps = 24 secondes.** Durée totale calculée dynamiquement via `mmiData.reduce()`.

### AI-Augmented Development

Le développement est orchestré via **Claude Code CLI** (Anthropic) opérant directement dans le terminal.

```
Brief créatif (intention textuelle)
        ↓
Claude Code CLI  →  édition de fichiers, refactoring, debug TypeScript
        ↓
Remotion React Engine  →  rendu frame-accurate
        ↓
Export MP4 via pipeline ffmpeg embarqué
```

- Itération design → code sans friction contextuelle
- Correction d'erreurs TypeScript en boucle serrée
- Refactoring architectural sur instruction naturelle
- Le développeur opère au niveau de l'intention ; le CLI au niveau de l'exécution

---

## STACK TECHNIQUE

| Couche | Technologie | Version |
|---|---|---|
| Moteur vidéo | [Remotion](https://remotion.dev) | 4.0.428 |
| UI Framework | React | 19 |
| Langage | TypeScript | 5 — `noUnusedLocals: true` |
| Styling | Tailwind CSS | v4 |
| Animations | `spring()` · `interpolate()` | Remotion built-in |
| Assets | `staticFile()` · `<Img>` | Chargement garanti pré-rendu |
| Audio | `<Audio>` · `useAudioData` | Remotion built-in |
| Orchestration | Claude Code CLI | — |

---

## FONCTIONNALITÉS CLÉS

### Dynamic HUD

Deux composants UI injectent les métadonnées de rendu en temps réel, frame par frame :

- **`DebugBanner`** — barre supérieure fixe
  - Numéro et ID de la section active
  - Type de transition à venir (`WHIP` / `VERTICAL` / `ZOOM`)
  - Frame counter absolu (`F:0247`)
  - Progression globale en pourcentage
- **`TechHUD`** — strip latérale gauche
  - Compteur de section (`01/08`) avec glow `#BC13FE`
  - Titre de section mis à jour dynamiquement à chaque slide
  - Barre de progression verticale avec curseur animé

### Asynchronous Media Management

Les assets photographiques et audio sont gérés via l'API native Remotion :

- `staticFile(path)` — résolution des chemins depuis `public/` avec garantie de disponibilité avant le rendu
- `<Img>` — wrappeur Remotion sur `<img>` natif : bloque le rendu de la frame jusqu'au chargement complet de l'asset, éliminant les frames vides
- `<Audio src={staticFile('music.mp3')} volume={0.5} />` — synchronisation audio frame-accurate sans dérive temporelle

### Audio-Réactivité

Analyse de spectre en temps réel via le hook `useAudioData` de Remotion :

```ts
// Simulation BPM 128 — src/utils/beat.ts
export const BPM = 128;
const framesPerBeat = (fps * 60) / BPM; // 14.06f @ 30fps

export function getKickPulse(frame: number, fps: number): number {
  const beatFrame = frame % framesPerBeat;
  return spring({ frame: beatFrame, fps, config: { stiffness: 400, damping: 10 } });
}
```

Les visuels procéduraux (waveform, formes géométriques) réagissent à l'amplitude du signal au fil des frames.

### Procedural Transitions

La logique de transition est calculée automatiquement par le moteur à partir de l'index de section, sans déclaration manuelle :

```ts
// src/utils/transitions.ts
const TRANSITION_ORDER: TransitionType[] = ['whip', 'vertical', 'zoom', 'whip', 'vertical', 'zoom', 'whip'];
export const TRANSITION_DURATION = 15; // frames — exact, sans interpolation approximative

const power4out = (t: number) => 1 - Math.pow(1 - t, 4);
```

- **Whip** — déplacement horizontal haute vélocité (`x`)
- **Vertical** — arc vertical (`y`)
- **Zoom** — pulse de scale centré sur le viewport

### 4-Layout System

Les sections alternent entre quatre compositions de mise en page, déterminées par `index % 4` :

| Index % 4 | Layout | Composition |
|---|---|---|
| `0` | `centered` | Texte centré · visuel en fond atténué |
| `1` | `left` | Texte gauche · image plein cadre droite |
| `2` | `right` | Image plein cadre gauche · texte droite |
| `3` | `fullscreen` | Titre 130px · débordement éditorial |

> **Override automatique** : les sections avec image en layout `fullscreen` ou `centered` basculent vers `left` / `right` pour garantir la visibilité de l'asset.

---

## STRUCTURE DU PROJET

```
src/
├── mmiData.ts                # Source de vérité — structure complète de la vidéo
├── Root.tsx                  # Enregistrement de la composition Remotion
├── Composition.tsx           # Orchestrateur principal + injection Audio
├── components/
│   ├── BlueprintSection.tsx  # Dispatcher de layouts + TextBlock animé
│   ├── SectionVisual.tsx     # Router visuel (ImageCard · Grid · Waveform · Geo)
│   ├── AnimatedTag.tsx       # Badge spring avec glow neon
│   ├── TechHUD.tsx           # HUD latéral gauche
│   ├── DebugBanner.tsx       # Barre de debug supérieure
│   ├── GridBackground.tsx    # Grille architecturale + parallaxe caméra
│   ├── CameraRig.tsx         # Translate x/y de la caméra
│   ├── LightSweep.tsx        # Balayage lumineux périodique (120f)
│   └── Scanlines.tsx         # Overlay CRT scanlines
└── utils/
    ├── transitions.ts        # computeCamera · getLayout · Power4.out
    └── beat.ts               # Simulation BPM · getKickPulse

public/
├── 1.png – 6.png             # Assets photo par section
└── music.mp3                 # Soundtrack (volume normalisé 0.5)
```

---

## SETUP LOCAL

```bash
# Installer les dépendances
npm install

# Lancer le Studio Remotion (preview interactif, http://localhost:3000)
npm run dev

# Exporter la vidéo finale en MP4
npm run build
```

---

## DESIGN SYSTEM

| Token | Valeur | Rôle |
|---|---|---|
| `--violet` | `#BC13FE` | Accent principal · glows · borders |
| `--bg` | `#050505` | Background profond |
| `--white` | `#FFFFFF` | Titres H1 · contraste maximal |
| `--text` | `rgba(255,255,255,0.72)` | Corps · descriptions |
| `--text-dim` | `rgba(255,255,255,0.35)` | Labels · métadonnées HUD |

---

<sub>Remotion 4.0 · React 19 · TypeScript 5 · Claude Code CLI · 2025</sub>
