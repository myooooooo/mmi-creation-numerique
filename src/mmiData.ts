export interface Section {
  id: string;
  title: string;
  subtitle: string;
  durationInFrames: number;
  tags: string[];
  image: string;
}

export const mmiData: Section[] = [
  {
    id: 'intro',
    title: 'BUT MMI : Création Numérique',
    subtitle: "L'art de fusionner stratégie, code et esthétique.",
    durationInFrames: 90,
    tags: ['Stratégie', 'Code', 'Esthétique'],
    image: '',
  },
  {
    id: 'expertise',
    title: 'Design Graphique',
    subtitle: 'Concevoir des systèmes graphiques cohérents et des chartes graphiques de A à Z.',
    durationInFrames: 90,
    tags: ['Typographie', 'Sémiologie', 'Adobe'],
    image: '1.png',
  },
  {
    id: 'audiovisuel',
    title: 'Vidéo & Motion Design',
    subtitle: "Donner vie au graphisme par le montage rythmique et l'animation 2D/3D.",
    durationInFrames: 90,
    tags: ['VFX', 'Animation', 'Rythme'],
    image: '2.png',
  },
  {
    id: 'uiux',
    title: "Design d'Interaction",
    subtitle: "Créer des interfaces UI/UX fonctionnelles, intuitives et centrées sur l'utilisateur.",
    durationInFrames: 90,
    tags: ['Figma', 'Ergonomie', 'Prototypage'],
    image: '3.png',
  },
  {
    id: 'coding',
    title: 'Creative Coding',
    subtitle: "Codage d'outils de création sur mesure et exploration des formats immersifs (AR).",
    durationInFrames: 90,
    tags: ['Front-End', 'Remotion', 'Innovation'],
    image: '4.png',
  },
  {
    id: 'profil',
    title: 'Profil Hybride',
    subtitle: 'Comprendre les enjeux marketing tout en produisant des contenus innovants.',
    durationInFrames: 90,
    tags: ['Conception', 'Polyvalence', 'Impact'],
    image: '5.png',
  },
  {
    id: 'conclusion',
    title: "L'Impact par le Code",
    subtitle: 'Nous ne sommes pas juste des techniciens, nous sommes des concepteurs.',
    durationInFrames: 90,
    tags: ['Futur', 'Systèmes', 'MMI'],
    image: '6.png',
  },
];

export const TOTAL_FRAMES = mmiData.reduce((acc, s) => acc + s.durationInFrames, 0);
// 7 sections × 90 frames = 630 frames @ 30fps = 21 secondes
