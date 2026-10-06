import { useEffect, useLayoutEffect, useState } from 'react';

const STYLE_KEY = 'sticks_theme_style';
const MODE_KEY = 'sticks_theme_mode';
const STYLES = ['current', 'material', 'fluent'];
const MODES = ['system', 'light', 'dark'];
const DARK_QUERY = '(prefers-color-scheme: dark)';

function readChoice(key, allowed, fallback) {
  try {
    const value = localStorage.getItem(key);
    return allowed.includes(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

function saveChoice(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {}
}

export default function useTheme() {
  const [themeStyle, setThemeStyle] = useState(() => readChoice(STYLE_KEY, STYLES, 'current'));
  const [themeMode, setThemeMode] = useState(() => readChoice(MODE_KEY, MODES, 'system'));
  const [systemDark, setSystemDark] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia?.(DARK_QUERY).matches
  );
  const themeTone = themeMode === 'system' ? (systemDark ? 'dark' : 'light') : themeMode;

  useEffect(() => saveChoice(STYLE_KEY, themeStyle), [themeStyle]);
  useEffect(() => saveChoice(MODE_KEY, themeMode), [themeMode]);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const media = window.matchMedia(DARK_QUERY);
    const update = event => setSystemDark(event.matches);
    setSystemDark(media.matches);
    if (media.addEventListener) {
      media.addEventListener('change', update);
      return () => media.removeEventListener('change', update);
    }
    media.addListener(update);
    return () => media.removeListener(update);
  }, []);

  useLayoutEffect(() => {
    document.documentElement.dataset.themeStyle = themeStyle;
    document.documentElement.dataset.themeTone = themeTone;
  }, [themeStyle, themeTone]);

  return { themeStyle, setThemeStyle, themeMode, setThemeMode };
}
