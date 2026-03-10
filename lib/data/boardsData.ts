import {
  Music2,
  Mountain,
  Palette,
  Mic2,
  Dumbbell,
  Sun,
  Brain,
  type LucideIcon,
} from "lucide-react";

export type Board = {
  slug: string;
  name: string;
  nameEn: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgGradient: string;
  shadowColor: string;
};

export const BOARDS: Board[] = [
  {
    slug: "jazz",
    name: "爵士舞",
    nameEn: "Jazz",
    description: "Groove, rhythm, and expression.",
    icon: Music2,
    color: "bg-purple-600",
    bgGradient: "from-indigo-600 to-pink-500",
    shadowColor: "shadow-violet-500/25",
  },
  {
    slug: "rock-climbing",
    name: "攀岩",
    nameEn: "Rock Climbing",
    description: "Strength, problem solving, and heights.",
    icon: Mountain,
    color: "bg-orange-600",
    bgGradient: "from-stone-600 to-orange-500",
    shadowColor: "shadow-orange-500/25",
  },
  {
    slug: "oil-painting",
    name: "油画",
    nameEn: "Oil Painting",
    description: "Colors, textures, and creativity.",
    icon: Palette,
    color: "bg-yellow-500",
    bgGradient: "from-blue-800 to-amber-400",
    shadowColor: "shadow-amber-500/25",
  },
  {
    slug: "singing",
    name: "唱歌",
    nameEn: "Singing",
    description: "Voice, melody, and emotion.",
    icon: Mic2,
    color: "bg-blue-600",
    bgGradient: "from-blue-600 to-lime-400",
    shadowColor: "shadow-emerald-500/25",
  },
  {
    slug: "fitness",
    name: "健身",
    nameEn: "Fitness",
    description: "Discipline, sweat, and growth.",
    icon: Dumbbell,
    color: "bg-rose-500",
    bgGradient: "from-rose-600 to-amber-400",
    shadowColor: "shadow-rose-500/25",
  },
  {
    slug: "daily-life",
    name: "日常",
    nameEn: "Daily Life",
    description: "Moments, habits, and peace.",
    icon: Sun,
    color: "bg-teal-500",
    bgGradient: "from-orange-500 to-sky-400",
    shadowColor: "shadow-amber-400/30",
  },
  {
    slug: "psychology",
    name: "心理",
    nameEn: "Psychology",
    description: "Mind, reflection, and balance.",
    icon: Brain,
    color: "bg-emerald-600",
    bgGradient: "from-teal-600 to-violet-500",
    shadowColor: "shadow-green-600/25",
  },
];

export function getBoardBySlug(slug: string): Board | undefined {
  return BOARDS.find((b) => b.slug === slug);
}

/** Tailwind color token → hex value */
const COLOR_HEX: Record<string, string> = {
  "indigo-600": "#4f46e5",
  "stone-600": "#57534e",
  "blue-800": "#1e40af",
  "blue-600": "#2563eb",
  "rose-600": "#e11d48",
  "orange-500": "#f97316",
  "teal-600": "#0d9488",
  "pink-500": "#ec4899",
  "amber-400": "#fbbf24",
  "lime-400": "#a3e635",
  "sky-400": "#38bdf8",
  "violet-500": "#8b5cf6",
};

/** Parse bgGradient like "from-indigo-600 to-pink-500" → [hex1, hex2] */
export function parseGradientColors(bgGradient: string): [string, string] {
  const parts = bgGradient.split(" ");
  const from = parts[0].replace("from-", "");
  const to = parts[1].replace("to-", "");
  return [COLOR_HEX[from] ?? "#3b82f6", COLOR_HEX[to] ?? "#8b5cf6"];
}
