// Mirrors the CSS custom properties defined in src/index.css.
// Use Tailwind classes / CSS vars for styling; reach for these only where a
// raw value is required (canvas/SVG fills, chart colors, etc).

export const colorTokens = {
  light: {
    background: 'rgb(250 248 242)',
    foreground: 'rgb(15 23 42)',
    muted: 'rgb(100 116 139)',
    surface: 'rgb(255 255 255)',
    border: 'rgb(226 232 240)',
    brand: 'rgb(13 148 136)',
    brandSoft: 'rgb(240 253 250)',
    brandStrong: 'rgb(15 118 110)',
  },
  dark: {
    background: 'rgb(11 15 20)',
    foreground: 'rgb(241 245 249)',
    muted: 'rgb(148 163 184)',
    surface: 'rgb(17 24 39)',
    border: 'rgb(51 65 85)',
    brand: 'rgb(45 212 191)',
    brandSoft: 'rgb(15 23 42)',
    brandStrong: 'rgb(153 246 228)',
  },
} as const

export type ThemeMode = 'light' | 'dark'
