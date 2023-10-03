import {
  type ParentComponent,
  createContext,
  createResource,
  useContext,
} from 'solid-js';
import { createLocalStorageStore } from './lib/storage';
import { ColorSchemeProvider } from './providers/color-scheme';
import { LocaleProvider, createDictionary } from './providers/locale';
import { ThemeProvider } from './providers/theme';

// Fallbacks when locale and theme are not found
import fallbackDictionary from './locales/eo';
import fallbackTheme from './themes/default';

/**
 * Fetch a locale dictionary given its language code.
 *
 * @param language Language code.
 *
 * @returns Dictionary.
 */
const fetchDictionary = async (language: string) => {
  try {
    return createDictionary((await import(`./locales/${language}.ts`)).default);
  } catch {
    return createDictionary(fallbackDictionary);
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
    return fallbackTheme;
  }
};

/**
 * App state.
 */
export type AppState = {
  colorScheme?: string;
  language?: string;
  theme?: string;
};

/**
 * Context for storing and accessing the app state.
 */
const AppContext = createContext<AppState>({});

/**
 * Hook for managing the app state.
 *
 * @returns An accessor and a setter to the app state.
 */
export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('AppContext not found');
  }
  return context;
}

/**
 * Provide the app state.
 */
export const AppStateProvider: ParentComponent = (props) => {
  const [config, setConfig] = createLocalStorageStore<AppState>('config', {
    colorScheme: undefined,
    language: 'eo',
    theme: 'default',
  });

  const [dictionary] = createResource(() => config.language, fetchDictionary);
  const [theme] = createResource(() => config.theme, fetchTheme);

  const state = {
    get colorScheme() {
      return config.colorScheme;
    },
    set colorScheme(colorScheme: string) {
      setConfig({ colorScheme });
    },
    get language() {
      return config.language;
    },
    set language(language: string) {
      setConfig({ language });
    },
    get theme() {
      return config.theme;
    },
    set theme(theme: string) {
      setConfig({ theme });
    },
  };

  return (
    <AppContext.Provider value={state}>
      <ColorSchemeProvider colorScheme={config.colorScheme}>
        <LocaleProvider dictionary={dictionary()}>
          <ThemeProvider theme={theme()}>
            {/* prettier-ignore */}
            {props.children}
          </ThemeProvider>
        </LocaleProvider>
      </ColorSchemeProvider>
    </AppContext.Provider>
  );
};
