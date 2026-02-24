export interface Section {
  id: string;
  title: string;
  subtitle: string;
  durationInFrames: number;
  tags: string[];
}

export const mmiData: Section[] = [
  {
    id: 'intro',
    title: 'BUT MMI',
    subtitle: "Métiers du Multimédia & de l'Internet — Bac+3 / Grade Licence",
    durationInFrames: 90,
    tags: ['Multimédia', 'Internet', 'Bac+3'],
  },
  {
    id: 'creation-numerique',
    title: 'Création Numérique',
    subtitle: 'Expression artistique & maîtrise technique des outils visuels et sonores',
    durationInFrames: 90,
    tags: ['Artistique', 'Technique', 'Visuel'],
  },
  {
    id: 'design-graphique',
    title: 'Design Graphique & UI',
    subtitle: 'Identités visuelles · Typographie · Interfaces web & mobile',
    durationInFrames: 90,
    tags: ['Design', 'UI', 'Typographie'],
  },
  {
    id: 'production-av',
    title: 'Production Audiovisuelle',
    subtitle: 'Prise de vue · Montage · Sound Design · Post-Production',
    durationInFrames: 90,
    tags: ['Vidéo', 'Son', 'Post-Prod'],
  },
  {
    id: 'motion-design',
    title: 'Motion Design',
    subtitle: 'Animation graphique 2D & 3D — publicité, génériques, identité animée',
    durationInFrames: 90,
    tags: ['Motion', '2D/3D', 'Animation'],
  },
  {
    id: 'narration-interactive',
    title: 'Narration Interactive',
    subtitle: 'Storytelling numérique — XR, installations interactives, UX narrative',
    durationInFrames: 90,
    tags: ['Storytelling', 'XR', 'Interactif'],
  },
  {
    id: 'hard-skills',
    title: 'Hard Skills',
    subtitle: 'Suite Adobe · Figma · Blender · Cinema 4D · HTML/CSS',
    durationInFrames: 90,
    tags: ['Adobe', 'Figma', 'Blender', 'HTML'],
  },
  {
    id: 'debouches',
    title: 'Débouchés',
    subtitle: 'Graphiste · UI Designer · Motion Designer · DA · Webdesigner',
    durationInFrames: 90,
    tags: ['Graphiste', 'UI Designer', 'Motion'],
  },
];

export const TOTAL_FRAMES = mmiData.reduce((acc, s) => acc + s.durationInFrames, 0);
// 8 sections × 90 frames = 720 frames @ 30fps = 24 secondes
