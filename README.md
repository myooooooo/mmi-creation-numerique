# MMI // AUGMENTED_CREATION

> **Système de production vidéo programmatique piloté par la donnée.** `[2025-12-25]`

![Remotion](https://img.shields.io/badge/Remotion-4.0-BC13FE?style=flat-square&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyQzYuNDggMiAyIDYuNDggMiAxMnM0LjQ4IDEwIDEwIDEwIDEwLTQuNDggMTAtMTBTMTcuNTIgMiAxMiAyem0tMiAxNFY4bDYgNHoiLz48L3N2Zz4=)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Claude Code](https://img.shields.io/badge/Claude_Code-CLI-BC13FE?style=flat-square&logo=anthropic&logoColor=white)

---

## CONCEPT

**MMI // AUGMENTED_CREATION** est une vidéo de présentation institutionnelle pour le BUT Métiers du Multimédia et de l'Internet — parcours Création Numérique. Le projet démontre qu'une production audiovisuelle de haute fidélité peut être **entièrement générée par du code React**, sans outil de montage traditionnel.

Chaque frame est une fonction pure du temps. Chaque transition est un paramètre. Chaque donnée est une variable.

---

## PIPELINE DATA-DRIVEN

Le visuel est intégralement piloté par `src/mmiData.ts` — source de vérité unique du projet.

```ts
// src/mmiData.ts — modifier ici suffit à régénérer l'intégralité de la vidéo
export interface Section {
  id: string;
  title: string;
  subtitle: string;
  durationInFrames: number;
  tags: string[];
  image: string;       // asset lié à la section
}
```

| Section ID | Titre | Image | Durée |
|---|---|---|---|
| `intro` | BUT MMI | — | 90f / 3s |
| `creation-numerique` | Création Numérique | `1.png` | 90f / 3s |
| `design-graphique` | Design Graphique & UI | `2.png` | 90f / 3s |
| `production-av` | Production Audiovisuelle | `3.png` | 90f / 3s |
| `motion-design` | Motion Design | `4.png` | 90f / 3s |
| `narration-interactive` | Narration Interactive | `5.png` | 90f / 3s |
| `hard-skills` | Hard Skills | `6.png` | 90f / 3s |
| `debouches` | Débouchés | — | 90f / 3s |

> **Total : 720 frames @ 30fps = 24 secondes.**
> Ajouter une section = une entrée dans le tableau. La durée totale se recalcule automatiquement.

---

## AI-AUGMENTED WORKFLOW

Ce projet a été orchestré via **Claude Code** (CLI Anthropic), opérant directement dans le terminal sur la base de prompts créatifs à haute intention.

```
Intention créative (brief textuel)
        ↓
Claude Code CLI (orchestration, refactoring, debug)
        ↓
Remotion React Engine (rendu frame-accurate)
        ↓
Export MP4 / WebM (pipeline ffmpeg)
```

L'approche élimine le fossé entre *ce que l'on imagine* et *ce que le code produit*. Le développeur devient directeur artistique ; le LLM, exécutant technique.

Ce workflow est identique à celui utilisé pour le développement du plugin Photoshop **[X-FLTR](https://github.com/myooooooo/x-fltr)**.

---

## STACK TECHNIQUE

| Couche | Technologie | Rôle |
|---|---|---|
| **Moteur vidéo** | [Remotion 4.0](https://remotion.dev) | Video as Code — rendu React → MP4 |
| **UI Framework** | React 19 + TypeScript 5 | Composants typés, `noUnusedLocals: true` |
| **Animations** | `spring()`, `interpolate()` | Physique réaliste, easing Power4.out |
| **Assets** | `staticFile()` + `Img` | Chargement asynchrone garanti avant rendu |
| **Audio** | `<Audio>` Remotion | Synchronisation music.mp3 frame-accurate |
| **Orchestration** | Claude Code CLI | Génération, refactoring, debug en terminal |

---

## KEY FEATURES

### Dynamic HUD
Deux composants d'interface affichent les métadonnées de rendu en temps réel :

- **`DebugBanner`** — barre supérieure : numéro de section, ID, type de transition suivante, frame counter (`F:0247`), progression globale
- **`TechHUD`** — strip latérale gauche : compteur `01/08`, titre de section dynamique, barre de progression verticale avec curseur glow

### Visual Identity
Identité visuelle Neon-Tech Haute Fidélité :

| Token | Valeur | Usage |
|---|---|---|
| `--violet` | `#BC13FE` | Accent principal, glows, borders |
| `--bg` | `#050505` | Background profond |
| `--white` | `#FFFFFF` | Titres H1, contraste maximal |
| `--white-dim` | `rgba(255,255,255,0.72)` | Corps de texte, descriptions |

### 4-Layout System
Les sections alternent automatiquement entre 4 compositions :

| Index % 4 | Layout | Description |
|---|---|---|
| `0` | Centered | Texte centré, visuel en fond subtil |
| `1` | Left | Texte gauche · Image droite |
| `2` | Right | Image gauche · Texte droite |
| `3` | Fullscreen | Editorial, titre 130px overflowing |

> Les sections avec image overrident `fullscreen → left` et `centered → right` pour garantir la visibilité de l'asset.

### Transition Engine
3 types de transitions déterministes, cycliques, durée exacte de 15 frames avec easing `Power4.out` :

```ts
// src/utils/transitions.ts
const TRANSITION_ORDER: TransitionType[] = ['whip', 'vertical', 'zoom', 'whip', 'vertical', 'zoom', 'whip'];
const power4out = (t: number) => 1 - Math.pow(1 - t, 4);
```

### Light Sweep
Micro-animation atmosphérique : trait de lumière vertical (`#BC13FE` → blanc → `#BC13FE`) balayant l'écran toutes les 4 secondes (120 frames), durée 28 frames.

---

## ARCHITECTURE

```
src/
├── mmiData.ts              # Source de vérité — sections, images, durées
├── Root.tsx                # Enregistrement composition Remotion
├── Composition.tsx         # Orchestrateur principal + Audio
├── components/
│   ├── BlueprintSection.tsx  # Dispatcher 4-layouts + TextBlock
│   ├── SectionVisual.tsx     # Router visuel (ImageCard / Grid / Waveform / Geo)
│   ├── AnimatedTag.tsx       # Badge neon avec spring + glow
│   ├── TechHUD.tsx           # Strip HUD latérale gauche
│   ├── DebugBanner.tsx       # Barre de debug supérieure
│   ├── GridBackground.tsx    # Grille architecturale avec parallaxe
│   ├── CameraRig.tsx         # Translate camera (x, y)
│   ├── LightSweep.tsx        # Balayage lumineux toutes les 4s
│   └── Scanlines.tsx         # CRT scanlines overlay
└── utils/
    ├── transitions.ts        # computeCamera, getLayout, Power4.out
    └── beat.ts               # Simulation BPM 128 (getKickPulse)

public/
├── 1.png – 6.png            # Assets photo par section
└── music.mp3                # Soundtrack (volume 0.5)
```

---

## SETUP

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer le Studio Remotion (preview interactif)
npm run dev

# 3. Rendu final (MP4)
npx remotion render src/index.ts MMI-CreationNumerique out/mmi.mp4

# 4. Mettre à jour Remotion
npx remotion upgrade
```

> Le Studio est accessible sur `http://localhost:3000`. Navigation frame par frame, prévisualisation en temps réel.

---

## X-FLTR CONNECTION

Ce projet partage son workflow de développement avec **X-FLTR**, un plugin Photoshop de filtrage colorimétrique avancé développé avec la même approche AI-Augmented (Claude Code CLI + TypeScript).

→ [github.com/myooooooo/x-fltr](https://github.com/myooooooo/x-fltr)

Les deux projets démontrent qu'une **symbiose LLM + développeur** permet de produire des outils créatifs professionnels à une vélocité impossible en workflow traditionnel.

---

## LICENSE

Remotion requiert une licence commerciale pour certaines entités. [Lire les conditions](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).

Le code applicatif (hors dépendances) est la propriété de son auteur.

---

<sub>Built with Claude Code CLI · Remotion 4.0 · TypeScript · 2025</sub>
