import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { toast } from 'sonner';

export interface ThemePreset {
  id: string;
  name: string;
  icon: string;
  bgToTr: string;
  bg: string;
  bgVia: string;
  bgTo: string;
  text: string;
  textMuted: string;
  accent: string;
  accentLight: string;
  accentHover: string;
  card: string;
  cardHover: string;
  border: string;
  contrast: string;
  contrastHover?: string;
  glass: string;
  isDark: boolean;
  description: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'classic',
    name: 'Chocolate Fudge',
    icon: '🍫',
    bgToTr: 'Chocolate Fudge Vibe',
    bg: '#140603',
    bgVia: '#2F150F',
    bgTo: '#210D09',
    text: '#FFFDFB',
    textMuted: 'rgba(255, 253, 251, 0.55)',
    accent: '#DFB15B',
    accentLight: 'rgba(223, 177, 91, 0.15)',
    accentHover: '#FFFFFF',
    card: '#26130F',
    cardHover: '#331B16',
    border: 'rgba(223, 177, 91, 0.2)',
    contrast: '#140603',
    glass: 'rgba(20, 6, 3, 0.85)',
    isDark: true,
    description: 'Original bakery dark theme with decadent chocolate tones and premium honey gold.'
  },
  {
    id: 'royal',
    name: 'Royal Golden Onyx',
    icon: '👑',
    bgToTr: 'Royal Elegance Onyx',
    bg: '#0a0a0a',
    bgVia: '#1b1b1b',
    bgTo: '#0f0f0f',
    text: '#fdfdfd',
    textMuted: 'rgba(253, 253, 253, 0.55)',
    accent: '#FFD700',
    accentLight: 'rgba(255, 215, 0, 0.15)',
    accentHover: '#ffffff',
    card: '#181818',
    cardHover: '#242424',
    border: 'rgba(255, 215, 0, 0.22)',
    contrast: '#0a0a0a',
    glass: 'rgba(10, 10, 10, 0.85)',
    isDark: true,
    description: 'Ultimate luxury palette with deep slate black and bright metallic gold highlights.'
  },
  {
    id: 'strawberry',
    name: 'Strawberry Macaron',
    icon: '🍓',
    bgToTr: 'Strawberry Velvet Garden',
    bg: '#FFF5F5',
    bgVia: '#FFEAEB',
    bgTo: '#FFF0F3',
    text: '#4D2323',
    textMuted: 'rgba(77, 35, 35, 0.6)',
    accent: '#DF6B82',
    accentLight: 'rgba(223, 107, 130, 0.12)',
    accentHover: '#4D2323',
    card: '#FFFFFF',
    cardHover: '#FFF2F4',
    border: 'rgba(223, 107, 130, 0.25)',
    contrast: '#FFFFFF',
    contrastHover: '#FFFFFF',
    glass: 'rgba(255, 245, 245, 0.85)',
    isDark: false,
    description: 'A charming, high-contrast light theme with blooming strawberry cream tones.'
  },
  {
    id: 'emerald',
    name: 'Emerald Royale',
    icon: '💚',
    bgToTr: 'Royal Emerald Forest',
    bg: '#07150C',
    bgVia: '#12291B',
    bgTo: '#091A10',
    text: '#F1FAF4',
    textMuted: 'rgba(241, 250, 244, 0.55)',
    accent: '#E5C158',
    accentLight: 'rgba(229, 193, 88, 0.15)',
    accentHover: '#FFFDFB',
    card: '#102619',
    cardHover: '#183D27',
    border: 'rgba(229, 193, 88, 0.2)',
    contrast: '#07150C',
    glass: 'rgba(7, 21, 12, 0.85)',
    isDark: true,
    description: 'Decadent deep forest green combined with high-contrast soft brass jewelry gold.'
  },
  {
    id: 'lavender',
    name: 'Lavish Lavender',
    icon: '🌌',
    bgToTr: 'Enchanted Amethyst',
    bg: '#0E0916',
    bgVia: '#221731',
    bgTo: '#150F22',
    text: '#FDFBFF',
    textMuted: 'rgba(253, 251, 255, 0.55)',
    accent: '#C084FC',
    accentLight: 'rgba(192, 132, 252, 0.15)',
    accentHover: '#FFFFFF',
    card: '#1C1129',
    cardHover: '#2E1C43',
    border: 'rgba(192, 132, 252, 0.22)',
    contrast: '#0E0916',
    glass: 'rgba(14, 9, 22, 0.85)',
    isDark: true,
    description: 'Enchanted, dreamy dark purple theme with radiant amethyst neon lilac touches.'
  },
  {
    id: 'blush',
    name: 'Blush Rose Gold',
    icon: '🌸',
    bgToTr: 'Elegant Rose Quartz',
    bg: '#FCFAF9',
    bgVia: '#F5ECE8',
    bgTo: '#FAF2EC',
    text: '#5C3E35',
    textMuted: 'rgba(92, 62, 53, 0.6)',
    accent: '#DE8070',
    accentLight: 'rgba(222, 128, 112, 0.15)',
    accentHover: '#5C3E35',
    card: '#FFFFFF',
    cardHover: '#F7EDE9',
    border: 'rgba(222, 128, 112, 0.25)',
    contrast: '#FFFFFF',
    glass: 'rgba(252, 250, 249, 0.85)',
    isDark: false,
    description: 'A cozy, delicate rose gold theme mimicking fine bone china and sweet vanilla.'
  },
  {
    id: 'espresso',
    name: 'Espresso Caramel',
    icon: '☕',
    bgToTr: 'Roasted Espresso Latte',
    bg: '#0F0C0B',
    bgVia: '#261F1C',
    bgTo: '#181311',
    text: '#F9F6F5',
    textMuted: 'rgba(249, 246, 245, 0.55)',
    accent: '#E6A15C',
    accentLight: 'rgba(230, 161, 92, 0.15)',
    accentHover: '#FFFFFF',
    card: '#1B1513',
    cardHover: '#2F2420',
    border: 'rgba(230, 161, 92, 0.23)',
    contrast: '#0F0C0B',
    glass: 'rgba(15, 12, 11, 0.85)',
    isDark: true,
    description: 'Deep roasted espresso bean tones with rich, glossy hot salted caramel highlights.'
  },
  {
    id: 'blueberry',
    name: 'Frosted Blueberry',
    icon: '🫐',
    bgToTr: 'Nordic Blue Glaze',
    bg: '#F3F7FA',
    bgVia: '#E4EEF5',
    bgTo: '#EBF2F8',
    text: '#1C2E4C',
    textMuted: 'rgba(28, 46, 76, 0.62)',
    accent: '#3B82F6',
    accentLight: 'rgba(59, 130, 246, 0.12)',
    accentHover: '#1C2E4C',
    card: '#FFFFFF',
    cardHover: '#EFF5F9',
    border: 'rgba(59, 130, 246, 0.2)',
    contrast: '#FFFFFF',
    glass: 'rgba(243, 247, 250, 0.85)',
    isDark: false,
    description: 'Refreshing frosty blue and vanilla glaze scheme, perfect for modern patisseries.'
  },
  {
    id: 'chai',
    name: 'Spiced Chai',
    icon: '🍂',
    bgToTr: 'Cozy Chai Lattechino',
    bg: '#FAF6F2',
    bgVia: '#EFE6DC',
    bgTo: '#F5ECDE',
    text: '#3D261A',
    textMuted: 'rgba(61, 38, 26, 0.65)',
    accent: '#D97706',
    accentLight: 'rgba(217, 119, 6, 0.14)',
    accentHover: '#3D261A',
    card: '#FCFAF7',
    cardHover: '#F4ECE1',
    border: 'rgba(217, 119, 6, 0.22)',
    contrast: '#FFFFFF',
    glass: 'rgba(250, 246, 242, 0.85)',
    isDark: false,
    description: 'Warm terracotta chai latte biscuit shades mixed with spicy cinnamon-gold.'
  },
  {
    id: 'matcha',
    name: 'Matcha Zen Pistachio',
    icon: '🍵',
    bgToTr: 'Organic Herbal Matcha',
    bg: '#F3F7F5',
    bgVia: '#E4ECE7',
    bgTo: '#ECF3EF',
    text: '#1A3022',
    textMuted: 'rgba(26, 48, 34, 0.6)',
    accent: '#15803D',
    accentLight: 'rgba(21, 128, 61, 0.14)',
    accentHover: '#1A3022',
    card: '#FFFFFF',
    cardHover: '#EEF6F1',
    border: 'rgba(21, 128, 61, 0.22)',
    contrast: '#FFFFFF',
    glass: 'rgba(243, 247, 245, 0.85)',
    isDark: false,
    description: 'Calm, organic elements mimicking powdered ceremonial matcha and pistachio moss.'
  }
];

export interface ThemeContextType {
  activeTheme: ThemePreset;
  setTheme: (id: string) => void;
  setGlobalTheme: (id: string) => Promise<void>;
  loadingTheme: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const injectThemeCSS = (theme: ThemePreset) => {
  let styleEl = document.getElementById('cakehouse-theme-overrides');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'cakehouse-theme-overrides';
    document.head.appendChild(styleEl);
  }

  // Set individual CSS Custom variables on root
  const root = document.documentElement;
  root.style.setProperty('--theme-bg', theme.bg);
  root.style.setProperty('--theme-bg-via', theme.bgVia);
  root.style.setProperty('--theme-bg-to', theme.bgTo);
  root.style.setProperty('--theme-text', theme.text);
  root.style.setProperty('--theme-text-muted', theme.textMuted);
  root.style.setProperty('--theme-accent', theme.accent);
  root.style.setProperty('--theme-accent-light', theme.accentLight);
  root.style.setProperty('--theme-accent-hover', theme.accentHover);
  root.style.setProperty('--theme-card', theme.card);
  root.style.setProperty('--theme-card-hover', theme.cardHover);
  root.style.setProperty('--theme-border', theme.border);
  root.style.setProperty('--theme-contrast', theme.contrast);
  root.style.setProperty('--theme-contrast-hover', theme.contrastHover || theme.contrast);
  root.style.setProperty('--theme-bg-glass', theme.glass);

  // Set selection colors
  root.style.setProperty('--selection-bg', theme.accentLight);
  root.style.setProperty('--selection-text', theme.accent);

  styleEl.innerHTML = `
    /* Body & Root Defaults */
    html, body, #root {
      background-color: ${theme.bg} !important;
      color: ${theme.text} !important;
      transition: background-color 0.8s cubic-bezier(0.16, 1, 0.3, 1), color 0.5s ease-in-out !important;
    }

    /* Target Tailwind color stops globally to repaint any background gradients across all pages */
    .from-\\[\\#140603\\], .from-\\[\\#1E0D0A\\], .from-\\[\\#1C0A05\\], .from-\\[\\#2D150F\\], .from-emerald-950\\/10 {
      --tw-gradient-from: var(--theme-bg) !important;
      --tw-gradient-to: var(--theme-bg-to) !important;
      --tw-gradient-stops: var(--theme-bg), var(--theme-bg-via), var(--theme-bg-to) !important;
    }

    .via-\\[\\#2F150F\\], .via-\\[\\#1B0A06\\], .via-\\[\\#2F140A\\] {
      --tw-gradient-to: var(--theme-bg-to) !important;
      --tw-gradient-stops: var(--theme-bg), var(--theme-bg-via), var(--theme-bg-to) !important;
    }

    .to-\\[\\#210D09\\], .to-\\[\\#120502\\], .to-black, .to-\\[\\#2D150F\\] {
      --tw-gradient-to: var(--theme-bg-to) !important;
    }

    /* Core Tailwinds overrides targeting precise Hex codes */
    .bg-\\[\\#140603\\],
    .bg-\\[\\#140603\\]\\/80,
    .bg-\\[\\#140603\\]\\/40,
    .bg-\\[\\#140603\\]\\/95,
    .bg-black\\/50,
    .bg-black\\/70,
    .bg-\\[\\#140603\\]\\/35 {
      background-color: var(--theme-bg) !important;
    }

    /* Global gradients layout background */
    .bg-gradient-to-tr.from-\\[\\#140603\\].via-\\[\\#2F150F\\].to-\\[\\#210D09\\],
    .bg-gradient-to-tr.from-\\[\\#1E0D0A\\].to-\\[\\#2D150F\\],
    .bg-gradient-to-tr.from-emerald-950\\/10.to-black\\/40 {
      background: linear-gradient(135deg, var(--theme-bg), var(--theme-bg-via), var(--theme-bg-to)) !important;
    }

    .bg-gradient-to-br.from-\\[\\#2D150F\\].via-\\[\\#1B0A06\\].to-\\[\\#2D150F\\],
    .bg-gradient-to-b.from-\\[\\#1C0A05\\]\\/90.to-black,
    .bg-gradient-to-b.from-\\[\\#1C0A05\\].via-\\[\\#2F140A\\].to-\\[\\#120502\\] {
      background: linear-gradient(180deg, var(--theme-bg), var(--theme-bg-via), var(--theme-bg-to)) !important;
    }

    /* Transparent navigation bars / filters and headers */
    .bg-\\[\\#140603\\]\\/85,
    .bg-\\[\\#140603\\]\\/20,
    .bg-\\[\\#140603\\]\\/30,
    .bg-\\[\\#140603\\]\\/10,
    .bg-black\\/30,
    .bg-stone-950\\/80,
    .bg-\\[\\#2D150F\\]\\/30,
    .bg-\\[\\#26130F\\]\\/80 {
      background-color: var(--theme-bg-glass) !important;
      backdrop-filter: blur(12px) !important;
    }

    /* Complex Card Background structures */
    .bg-\\[\\#26130F\\],
    .bg-\\[\\#2D150F\\],
    .bg-\\[\\#1C0A05\\],
    .bg-\\[\\#26130F\\]\\/45,
    .bg-\\[\\#26130F\\]\\/70,
    .bg-\\[\\#26130F\\]\\/80,
    .bg-\\[\\#26130F\\]\\/85,
    .bg-\\[\\#2D150F\\]\\/20,
    .bg-\\[\\#2D150F\\]\\/45,
    .bg-[#26130F]\\/45,
    .bg-zinc-900\\/50,
    .bg-white\\/5 {
      background-color: var(--theme-card) !important;
      transition: background-color 0.5s ease-in-out !important;
    }

    /* Hover states on cards */
    .hover\\:bg-\\[\\#2D150F\\]\\/45:hover,
    .group:hover .bg-\\[\\#26130F\\]\\/85 {
      background-color: var(--theme-card-hover) !important;
    }

    /* Content/Input texts */
    .text-\\[\\#FFFDFB\\],
    .text-\\[\\#FFFDFB\\]\\/80,
    .text-\\[\\#FFFDFB\\]\\/70,
    .text-\\[\\#FFFDFB\\]\\/60,
    .text-\\[\\#FFFDFB\\]\\/50,
    .text-\\[\\#FFFDFB\\]\\/40,
    .text-\\[\\#FFFDFB\\]\\/30,
    .text-zinc-300,
    .text-stone-300,
    .text-white\\/70,
    .text-white\\/80 {
      color: var(--theme-text) !important;
    }

    .text-\\[\\#FFFDFB\\]\\/50,
    .text-zinc-400,
    .text-stone-400,
    .text-white\\/40 {
      color: var(--theme-text-muted) !important;
    }

    /* Standard accent triggers */
    .text-\\[\\#DFB15B\\],
    .text-amber-500,
    .text-\\[\\#cc7a74\\],
    .text-emerald-400 {
      color: var(--theme-accent) !important;
    }

    .bg-\\[\\#DFB15B\\],
    .bg-amber-500,
    .bg-\\[\\#DFB15B\\]\\/90 {
      background-color: var(--theme-accent) !important;
      color: var(--theme-contrast) !important;
    }

    /* Hover effects for primary actions */
    .hover\\:bg-white:hover,
    .hover\\:text-\\[\\#140603\\\]:hover {
      background-color: var(--theme-accent-hover) !important;
      color: var(--theme-contrast-hover) !important;
    }

    /* Custom borders and outlines */
    .border-\\[\\#DFB15B\\]\\/15,
    .border-\\[\\#DFB15B\\]\\/20,
    .border-\\[\\#DFB15B\\]\\/25,
    .border-\\[\\#DFB15B\\]\\/30,
    .border-\\[\\#DFB15B\\]\\/50,
    .border-white\\/10,
    .border-white\\/5 {
      border-color: var(--theme-border) !important;
    }

    .border-\\[\\#DFB15B\\] {
      border-color: var(--theme-accent) !important;
    }

    .bg-\\[\\#DFB15B\\\]\\/10,
    .bg-\\[\\#DE9088\\]\\/5 {
      background-color: var(--theme-accent-light) !important;
    }

    /* Interactive inputs/select outline highlights */
    input:focus, select:focus, textarea:focus {
      border-color: var(--theme-accent) !important;
      box-shadow: 0 0 0 2px var(--theme-accent-light) !important;
    }

    /* Skeletons */
    .animate-pulse {
      background-color: var(--theme-card) !important;
      opacity: 0.65 !important;
    }

    /* Custom Selection Styling */
    ::selection {
      background-color: var(--theme-accent-light) !important;
      color: var(--theme-accent) !important;
    }

    /* Adjust the standard 4D glass sphere overlays if theme is light */
    ${!theme.isDark ? `
      .absolute.rounded-full.backdrop-blur-md {
        background-color: rgba(0,0,0,0.02) !important;
        border-color: rgba(0,0,0,0.08) !important;
      }
      .bg-white\\/5, .bg-white\\/10 {
        background-color: rgba(0, 0, 0, 0.03) !important;
      }
      .text-white {
        color: var(--theme-text) !important;
      }

      /* Guard explicit dark elements, footers, headers, cards and primary buttons to maintain absolute readability */
      header .text-white,
      footer .text-white,
      footer .text-zinc-300,
      footer .text-zinc-400,
      .bg-gradient-to-r .text-white,
      button.text-white,
      .text-white-keep,
      .bg-\\[\\#26130F\\] .text-white,
      .bg-\\[\\#26130F\\]\\/90 .text-white,
      .bg-\\[\\#26130F\\]\\/85 .text-white,
      .bg-\\[\\#140603\\] .text-white,
      .bg-\\[\\#210F0C\\] .text-white,
      .bg-\\[\\#1A0A07\\]\\/80 .text-white,
      .bg-emerald-950 .text-white,
      .bg-purple-950 .text-white,
      .bg-[#26130F] .text-white,
      .bg-[#26130F]/45 .text-white,
      .bg-[#26130F]/85 .text-white,
      .bg-[#140603] .text-white,
      .bg-[#140603]/85 .text-white,
      .bg-stone-900 .text-white,
      .bg-zinc-900 .text-white,
      .bg-[#210F0C] .text-white,
      .bg-[#140603]/95 .text-white,
      .bg-gradient-to-b .text-white,
      .bg-gradient-to-tr .text-white,
      .bg-gradient-to-br .text-white,
      .text-slate-100,
      .font-sans.text-white,
      .text-zinc-300-keep {
        color: #ffffff !important;
      }
      header .text-white\\/80,
      footer .text-white\\/80,
      .bg-gradient-to-r .text-white\\/80,
      .bg-slate-900 .text-white\\/80,
      .bg-\\[\\#26130F\\] .text-white\\/80,
      .bg-\\[\\#26130F\\]\\/90 .text-white\\/80,
      .bg-[#26130F]/85 .text-white\\/80,
      .bg-[#26130F]/45 .text-white\\/80,
      .bg-stone-900 .text-white\\/80,
      .bg-zinc-900 .text-white\\/80 {
        color: rgba(255, 255, 255, 0.8) !important;
      }
      footer .text-zinc-400,
      .bg-gradient-to-r .text-zinc-400,
      .bg-\\[\\#26130F\\] .text-zinc-400,
      .bg-[#26130F]/85 .text-zinc-400 {
        color: rgba(255, 255, 255, 0.6) !important;
      }
    ` : ''}
  `;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTheme, setActiveThemeState] = useState<ThemePreset>(THEME_PRESETS[0]);
  const [loadingTheme, setLoadingTheme] = useState(true);

  // Initialize and subscribe in real time to global Firestore settings
  useEffect(() => {
    // Sync style instantly for the default theme first
    const localThemeId = localStorage.getItem('cakehouse_local_theme');
    if (localThemeId) {
      const match = THEME_PRESETS.find(t => t.id === localThemeId);
      if (match) {
        setActiveThemeState(match);
        injectThemeCSS(match);
      }
    } else {
      injectThemeCSS(activeTheme);
    }

    const unsub = onSnapshot(doc(db, 'settings', 'theme'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.themeId) {
          const match = THEME_PRESETS.find(t => t.id === data.themeId);
          if (match) {
            setActiveThemeState(match);
            injectThemeCSS(match);
            localStorage.setItem('cakehouse_local_theme', match.id);
          }
        }
      }
      setLoadingTheme(false);
    }, (error) => {
      console.warn("Theme live sync error (permissions or offline). Using local storage fallback:", error);
      setLoadingTheme(false);
    });

    return () => unsub();
  }, []);

  // Client-side instant theme picker (or preview helper)
  const setTheme = (id: string) => {
    const match = THEME_PRESETS.find(t => t.id === id);
    if (match) {
      setActiveThemeState(match);
      injectThemeCSS(match);
      localStorage.setItem('cakehouse_local_theme', match.id);
    }
  };

  // Admin-level global setting that updates the Firestore database live!
  const setGlobalTheme = async (id: string) => {
    const match = THEME_PRESETS.find(t => t.id === id);
    if (!match) {
      toast.error("Invalid theme selected");
      return;
    }

    try {
      await setDoc(doc(db, 'settings', 'theme'), {
        themeId: id,
        updatedAt: new Date().toISOString()
      });
      setActiveThemeState(match);
      injectThemeCSS(match);
      localStorage.setItem('cakehouse_local_theme', match.id);
      toast.success(`Theme updated globally to: ${match.name}!`, {
        icon: match.icon
      });
    } catch (err: any) {
      console.error("Failed to commit theme globally:", err);
      // Fallback local change if Firestore transaction is offline or permission-blocked for non-admins
      setTheme(id);
      toast.success(`Theme updated locally (saving change to browser): ${match.name}!`, {
        icon: match.icon
      });
    }
  };

  return (
    <ThemeContext.Provider value={{ activeTheme, setTheme, setGlobalTheme, loadingTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
