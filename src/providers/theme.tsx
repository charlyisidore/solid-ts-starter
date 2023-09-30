import {
  type ParentComponent,
  type Resource,
  type Signal,
  createContext,
  createMemo,
  createResource,
  createSignal,
  useContext,
} from 'solid-js';

/**
 * Scoped styles.
 *
 * Maps user-defined CSS class names to scoped class names.
 */
export type Styles = Record<string, string>;

/**
 * Theme instance.
 *
 * Maps namespaces to scoped styles.
 */
export type Theme = Record<string, Styles>;

/**
 * Collection of CSS classes as string, array, object or undefined value.
 */
export type Classes =
  | string
  | (string | undefined)[]
  | Record<string, boolean>
  | undefined;

/**
 * Function to load a theme instance given its identifier.
 */
export type ThemeFetcher = (theme: string) => Theme | Promise<Theme>;

/**
 * Theme context.
 */
const ThemeContext = createContext<{
  theme: Signal<string | undefined>;
  instance: Resource<Theme | undefined>;
}>();

/**
 * Merge multiple styles into one by concatenating their class names.
 *
 * @param styles Array of styles.
 *
 * @returns Merged styles.
 */
function mergeStyles(styles: Styles[]): Styles {
  return styles.reduce(
    (merged, current) => ({
      ...merged,
      ...Object.fromEntries(
        Object.entries(current) //
          .map(([key, value]) => [key, [merged[key], value].join(' ')]),
      ),
    }),
    {} as Styles,
  );
}

/**
 * Normalize a collection of classes into an array.
 *
 * If the argument is:
 * - a string: the string is split based on whitespaces.
 * - an array of strings: strings are split based on whitespaces, and merged
 *   into one array without duplicates.
 * - an object of booleans: keys having a true value are merged into one array.
 * - undefined: an empty array is returned.
 *
 * @param classes Classes as string, array, object or undefined value.
 *
 * @returns Array of classes.
 *
 * @example
 *   normalizeClasses('hello world');
 *   // ['hello', 'world']
 *   normalizeClasses(['hello', undefined, 'world']);
 *   // ['hello', 'world']
 *   normalizeClasses({ hello: true, world: false });
 *   // ['hello']
 *   normalizeClasses(undefined);
 *   // []
 */
function normalizeClasses(classes: Classes): string[] {
  if (!classes) {
    return [];
  }

  if (Array.isArray(classes)) {
    return [
      ...new Set(
        classes
          .filter((value) => value)
          .map((value) => (value as string).split(/\s+/u))
          .flat()
          .filter((value) => value),
      ),
    ];
  }

  if (typeof classes === 'object') {
    return normalizeClasses(
      Object.entries(classes) //
        .filter(([, value]) => value)
        .map(([key]) => key),
    );
  }

  return normalizeClasses([classes]);
}

/**
 * Hook for managing the theme context.
 *
 * @returns The theme context.
 */
function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('ThemeContext not found');
  }
  return context;
}

/**
 * Hook for managing the theme identifier.
 *
 * @returns An accessor and a setter for the theme identifier.
 */
export function useTheme() {
  return useThemeContext().theme;
}

/**
 * Hook for getting the theme instance.
 *
 * @returns An accessor for the theme instance.
 */
export function useThemeInstance() {
  return useThemeContext().instance;
}

/**
 * Hook providing a styling function.
 *
 * This hook takes a namespace and optional default styles.
 *
 * The returned function takes user-defined CSS class names and returns a string
 * that contains scoped CSS class names. When default styles are specified,
 * their scoped class names are concatenated to the result.
 *
 * @param namespace Namespace in the theme.
 * @param defaultStyles Default styles.
 *
 * @returns Styling function.
 *
 * @example
 *   import { useStyles } from './providers/theme';
 *
 *   const Hello = () => {
 *     const styles = useStyles('Hello');
 *     return <div class={styles('content')}>Hello</div>;
 *   };
 */
export function useStyles(namespace: string, defaultStyles?: Styles) {
  const theme = useThemeInstance();
  const styles = createMemo(() =>
    mergeStyles(
      [defaultStyles, theme()?.[namespace]].filter((v) => v) as Styles[],
    ),
  );

  return (classes: Classes) =>
    normalizeClasses(classes)
      .reduce(
        // False positive
        // eslint-disable-next-line solid/reactivity
        (merged, className) => [...merged, styles()[className]],
        [] as string[],
      )
      .join(' ');
}

/**
 * Provide simple theming support for descendant components.
 *
 * @prop {string | undefined} initialTheme Pre-fetched theme identifier.
 * @prop {Theme | undefined} initialInstance Pre-fetched theme instance.
 * @prop {ThemeFetcher} fetchTheme Theme fetcher function.
 *
 * @example
 *   import {
 *     type Theme,
 *     ThemeProvider,
 *     useStyles,
 *     useTheme,
 *   } from './providers/theme';
 *
 *   import defaultTheme from './themes/default';
 *   import unicornTheme from './themes/unicorn';
 *
 *   const themes: Record<string, Theme> = {
 *     default: defaultTheme,
 *     unicorn: unicornTheme,
 *   };
 *
 *   const Hello = () => {
 *     const styles = useStyles('Hello');
 *     return <div class={styles('content')}>Hello</div>;
 *   };
 *
 *   const ThemeSelect = () => {
 *     const [theme, setTheme] = useTheme();
 *     const handleChange = (event: Event) =>
 *       setTheme((event.target as HTMLSelectElement).value);
 *     return (
 *       <select onChange={handleChange}>
 *         <For each={Object.keys(themes)}>
 *           {(identifier) => (
 *             <option value={identifier} selected={identifier === theme()}>
 *               {identifier}
 *             </option>
 *           )}
 *         </For>
 *       </select>
 *     );
 *   };
 *
 *   const App = () => (
 *     <ThemeProvider
 *       initialTheme="default"
 *       initialInstance={themes.default}
 *       fetchTheme={(theme) => themes[theme]}
 *     >
 *       <Hello />
 *       <ThemeSelect />
 *     </ThemeProvider>
 *   );
 */
export const ThemeProvider: ParentComponent<{
  initialTheme?: string;
  initialInstance?: Theme;
  fetchTheme: ThemeFetcher;
}> = (props) => {
  const [theme, setTheme] = createSignal(props.initialTheme);

  // The theme fetcher is not supposed to be reactive
  // eslint-disable-next-line solid/reactivity
  const [instance] = createResource(theme, props.fetchTheme, {
    initialValue: props.initialInstance,
  });

  return (
    <ThemeContext.Provider
      value={{
        theme: [theme, setTheme],
        instance,
      }}
    >
      {props.children}
    </ThemeContext.Provider>
  );
};
