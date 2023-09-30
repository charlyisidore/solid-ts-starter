import { type ParentComponent, batch, createEffect } from 'solid-js';
import { ColorSchemeProvider, useColorScheme } from './providers/color-scheme';
import { LocaleProvider, useLanguage } from './providers/locale';
import { createLocalStorageSignal } from './lib/storage';
import { ThemeProvider, useTheme } from './providers/theme';

// Default configuration
// Local storage
const localStorageKey = 'config';
// Color scheme
const defaultColorScheme = 'dark';
// Locale
const defaultLanguage = 'eo';
import defaultDictionary from './locales/eo';
// Theme
const defaultTheme = 'default';
import defaultThemeInstance from './themes/default';

/**
 * Fetch a locale dictionary given its language code.
 *
 * @param language Language code.
 *
 * @returns Dictionary.
 */
const fetchDictionary = async (language: string) => {
  try {
    return (await import(`./locales/${language}.ts`)).default;
  } catch {
    return defaultDictionary;
  }
};

/**
 * Fetch a theme instance given its identifier.
 *
 * @param theme Theme identifier.
 *
 * @returns Theme instance.
 */
const fetchTheme = async (theme: string) => {
  try {
    return (await import(`./themes/${theme}/index.ts`)).default;
  } catch {
    return defaultThemeInstance;
  }
};

/**
 * Synchronize app configuration with `localStorage`.
 *
 * @prop {string} localStorageKey Key in `localStorage`.
 */
const ConfigStorage: ParentComponent<{
  localStorageKey: string;
}> = (props) => {
  // We don't use `props.localStorageKey` as a reactive variable
  const [storage, setStorage] = createLocalStorageSignal<{
    colorScheme: string | undefined;
    language: string | undefined;
    theme: string | undefined;
  }>(props.localStorageKey); // eslint-disable-line solid/reactivity

  const [colorScheme, setColorScheme] = useColorScheme();
  const [language, setLanguage] = useLanguage();
  const [theme, setTheme] = useTheme();

  // Read from `localStorage`
  createEffect(() => {
    const config = storage();
    if (config) {
      batch(() => {
        setColorScheme((value) => config.colorScheme ?? value);
        setLanguage((value) => config.language ?? value);
        setTheme((value) => config.theme ?? value);
      });
    }
  });

  // Write to `localStorage`
  createEffect(() =>
    setStorage({
      colorScheme: colorScheme(),
      language: language(),
      theme: theme(),
    }),
  );

  return <>{props.children}</>;
};

/**
 * Define app configuration.
 */
export const ConfigProvider: ParentComponent = (props) => (
  <ColorSchemeProvider initialColorScheme={defaultColorScheme}>
    <LocaleProvider
      initialLanguage={defaultLanguage}
      initialDictionary={defaultDictionary}
      fetchDictionary={fetchDictionary}
    >
      <ThemeProvider
        initialTheme={defaultTheme}
        initialInstance={defaultThemeInstance}
        fetchTheme={fetchTheme}
      >
        <ConfigStorage localStorageKey={localStorageKey}>
          {/* prettier-ignore */}
          {props.children}
        </ConfigStorage>
      </ThemeProvider>
    </LocaleProvider>
  </ColorSchemeProvider>
);
