import {
  Music2,
  Mountain,
  Palette,
  Mic2,
  Dumbbell,
  Sun,
  Brain,
  Code2,
  MessageCircle,
  Heart,
  type LucideIcon,
} from "lucide-react";

export type Board = {
  slug: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  image: string;
  overlay: string;
  icon: LucideIcon;
};

export const BOARDS: Board[] = [
  {
    slug: "jazz",
    name: "爵士舞",
    nameEn: "Jazz",
    description: "让身体跟随律动流淌，在节拍之间释放灵魂。",
    descriptionEn: "Groove, rhythm, and expression.",
    image: "/jazz-dance.jpg",
    overlay: "from-purple-950/60 via-fuchsia-900/40 to-pink-950/70",
    icon: Music2,
  },
  {
    slug: "rock-climbing",
    name: "攀岩",
    nameEn: "Rock Climbing",
    description: "在岩壁上寻找自己的节奏，每一步都是与重力的对话。",
    descriptionEn: "Strength, problem solving, and heights.",
    image: "/climbing.jpg",
    overlay: "from-amber-950/60 via-orange-900/40 to-stone-950/70",
    icon: Mountain,
  },
  {
    slug: "oil-painting",
    name: "油画",
    nameEn: "Oil Painting",
    description: "用色彩与油脂的交融，在画布上留下时间的印记。",
    descriptionEn: "Colors, textures, and creativity.",
    image: "/painting.jpg",
    overlay: "from-amber-950/60 via-yellow-900/40 to-orange-950/70",
    icon: Palette,
  },
  {
    slug: "singing",
    name: "唱歌",
    nameEn: "Singing",
    description: "让声音在空气中流淌，每一个音符都是心跳的延伸。",
    descriptionEn: "Voice, melody, and emotion.",
    image: "/singing.jpg",
    overlay: "from-violet-950/60 via-blue-900/40 to-cyan-950/70",
    icon: Mic2,
  },
  {
    slug: "fitness",
    name: "健身",
    nameEn: "Fitness",
    description: "用汗水浇灌意志，一次次突破身体的边界。",
    descriptionEn: "Discipline, sweat, and growth.",
    image: "/fitness.jpg",
    overlay: "from-rose-950/60 via-red-900/40 to-orange-950/70",
    icon: Dumbbell,
  },
  {
    slug: "daily-life",
    name: "日常",
    nameEn: "Daily Life",
    description: "平凡日子里藏着的温柔，值得被一一记录。",
    descriptionEn: "Moments, habits, and peace.",
    image: "/daily.jpg",
    overlay: "from-lime-950/60 via-emerald-900/40 to-green-950/70",
    icon: Sun,
  },
  {
    slug: "psychology",
    name: "心理",
    nameEn: "Psychology",
    description: "向内探索那些未曾言说的角落，与自己和解。",
    descriptionEn: "Mind, reflection, and balance.",
    image: "/mind.jpg",
    overlay: "from-indigo-950/60 via-violet-900/40 to-purple-950/70",
    icon: Brain,
  },
  {
    slug: "frontend",
    name: "前端",
    nameEn: "Frontend",
    description: "在代码的世界里构建想象，把像素变成诗。",
    descriptionEn: "Code, components, and craft.",
    image: "/frontend.jpg",
    overlay: "from-blue-950/60 via-indigo-900/40 to-slate-950/70",
    icon: Code2,
  },
  {
    slug: "speaking",
    name: "口语",
    nameEn: "Speaking",
    description: "每一次开口都是勇气，让语言成为连接世界的桥梁。",
    descriptionEn: "Fluency, confidence, and expression.",
    image: "/speak.jpg",
    overlay: "from-sky-950/60 via-cyan-900/40 to-teal-950/70",
    icon: MessageCircle,
  },
  {
    slug: "redemption",
    name: "自我救赎",
    nameEn: "Redemption",
    description: "在裂缝中透进光来，一步步找回完整的自己。",
    descriptionEn: "Healing, growth, and becoming whole.",
    image: "/redemption.jpg",
    overlay: "from-red-950/60 via-rose-900/40 to-fuchsia-950/70",
    icon: Heart,
  },
];

export function getBoardBySlug(slug: string): Board | undefined {
  return BOARDS.find((b) => b.slug === slug);
}

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [59, 130, 246];
  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ];
}

function hexToHsl(hex: string): [number, number, number] {
  const [r, g, b] = hexToRgb(hex).map((v) => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  const sl = s / 100;
  const ll = l / 100;
  const a = sl * Math.min(ll, 1 - ll);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = ll - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/** overlay 色族名 → 500 级 hex，用于背景光晕 */
const COLOR_500: Record<string, string> = {
  purple: "#a855f7",
  fuchsia: "#d946ef",
  pink: "#ec4899",
  amber: "#f59e0b",
  orange: "#f97316",
  stone: "#78716c",
  yellow: "#eab308",
  blue: "#3b82f6",
  cyan: "#06b6d4",
  teal: "#14b8a6",
  emerald: "#10b981",
  green: "#22c55e",
  neutral: "#737373",
  zinc: "#71717a",
  indigo: "#6366f1",
  violet: "#8b5cf6",
  sky: "#0ea5e9",
  rose: "#f43f5e",
  red: "#ef4444",
  slate: "#64748b",
  lime: "#84cc16",
};

/** 从 overlay class 字符串提取三个色族对应的 500 级 hex */
function parseOverlayColors(overlay: string): [string, string, string] {
  const matches = overlay.match(/(?:from|via|to)-([a-z]+)-\d+/g) ?? [];
  const colors = matches.map((m) => {
    const family = m.replace(/^(?:from|via|to)-([a-z]+)-\d+$/, "$1");
    return COLOR_500[family] ?? "#a855f7";
  });
  const c0 = colors[0] ?? "#a855f7";
  const c1 = colors[1] ?? c0;
  const c2 = colors[2] ?? c0;
  return [c0, c1, c2];
}

export type BoardTheme = {
  /** 降饱和后的主题色，适合浅色背景 */
  accent: string;
  /** accent 低透明度，用于弹窗/drawer 背景毛玻璃 */
  light: string;
  /** accent 中透明度，用于节点光环、边框 */
  dark: string;
  /** overlay 三个色族的 500 级 hex，用于页面 aurora 背景光晕 */
  blobs: [string, string, string];
};

export function buildBoardTheme(overlay: string): BoardTheme {
  const [f, v, t] = parseOverlayColors(overlay);
  const [h, s, l] = hexToHsl(v);
  const mutedS = Math.max(s - 35, 30);
  const accentHex = hslToHex(h, mutedS, l);
  const [r, g, b] = hexToRgb(accentHex);

  return {
    accent: `rgba(${r},${g},${b})`,
    light: `rgba(${r},${g},${b},0.3)`,
    dark: t,
    blobs: [f, v, t],
  };
}
