import {
  type ParentProps,
  type Resource,
  type Signal,
  createContext,
  createResource,
  createSignal,
  useContext,
} from 'solid-js';

/**
 * Message translation.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Translation = (params: any) => string;

/**
 * Flat dictionary.
 */
export type Dictionary = Record<string, Translation>;

/**
 * Function to load a dictionary given its language code.
 */
export type DictionaryFetcher<D> = (language: string) => D | Promise<D>;

/**
 * Function to normalize a dictionary.
 */
export type DictionaryNormalizer<D> = (dictionary: D) => Dictionary;

/**
 * The locale context.
 */
const LocaleContext = createContext<{
  language: Signal<string | undefined>;
  dictionary: Resource<Dictionary | undefined>;
}>();

/**
 * Normalize a raw translation into a function.
 *
 * @param translation Raw translation.
 *
 * @returns Normalized translation.
 */
export function createTranslation<T>(translation: T): Translation {
  return translation instanceof Function
    ? (translation as Translation)
    : () => `${translation}`;
}

/**
 * Normalize a raw tree dictionary into a flat dictionary.
 *
 * @param dictionary Raw dictionary.
 * @param separator Separator for the keys.
 *
 * @returns Normalized dictionary.
 */
export function createDictionary<D extends object>(
  dictionary: D,
  separator: string = '.',
): Dictionary {
  return Object.fromEntries(
    Object.entries(dictionary)
      .map(([key, value]) =>
        typeof value === 'object'
          ? // Subtree
            Object.entries(createDictionary(value)) //
              .map(([k, v]) => [[key, k].join(separator), v])
          : // Terminal node
            [[key, createTranslation(value)]],
      )
      .flat(),
  );
}

/**
 * Hook for managing the locale context.
 *
 * @returns The locale context.
 */
function useLocaleContext() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error('LocaleContext not found');
  }
  return context;
}

/**
 * Hook for managing the language code.
 *
 * @returns An accessor and a setter for the language code.
 */
export function useLanguage() {
  return useLocaleContext().language;
}

/**
 * Hook for getting the dictionary.
 *
 * @returns An accessor for the dictionary.
 */
export function useDictionary() {
  return useLocaleContext().dictionary;
}

/**
 * Hook providing a translator function.
 *
 * The returned function takes a translation key and optional parameters. If the
 * key exists in the current dictionary, it returns the translated string.
 * Otherwise, it returns the key unchanged.
 *
 * @returns Translator function.
 *
 * @example
 *   import { useTranslate } from './providers/locale';
 *
 *   const Hello = () => {
 *     const translate = useTranslate();
 *     return <>{translate('hello')}</>;
 *   };
 *
 *   const HelloWithParams = () => {
 *     const translate = useTranslate();
 *     return <>{translate('helloName', { name: 'world' })}</>;
 *   };
 */
export function useTranslate() {
  const dictionary = useDictionary();
  return (key: string, params?: unknown): string =>
    dictionary()?.[key]?.(params) ?? key;
}

/**
 * Provide simple translation support for descendant components.
 *
 * @prop {string | undefined} initialLanguage Pre-fetched language code.
 * @prop {D | undefined} initialDictionary Pre-fetched dictionary.
 * @prop {DictionaryFetcher<D>} fetchDictionary Dictionary fetcher function.
 * @prop {DictionaryNormalizer<D> | undefined} normalizeDictionary Dictionary
 *       normalizer function.
 *
 * @example
 *   import { For } from 'solid-js';
 *   import {
 *     LocaleProvider,
 *     useLanguage,
 *     useTranslate,
 *   } from './providers/locale';
 *
 *   const locales: Record<string, object> = {
 *     eo: {
 *       hello: 'saluton',
 *     },
 *     vo: {
 *       hello: 'glidis',
 *     },
 *   };
 *
 *   const Hello = () => {
 *     const translate = useTranslate();
 *     return <>{translate('hello')}</>;
 *   };
 *
 *   const LanguageSelect = () => {
 *     const [language, setLanguage] = useLanguage();
 *     const handleChange = (event: Event) =>
 *       setLanguage((event.target as HTMLSelectElement).value);
 *     return (
 *       <select onChange={handleChange}>
 *         <For each={Object.keys(locales)}>
 *           {(code) => (
 *             <option value={code} selected={code === language()}>
 *               {code}
 *             </option>
 *           )}
 *         </For>
 *       </select>
 *     );
 *   };
 *
 *   const App = () => (
 *     <LocaleProvider
 *       initialLanguage="eo"
 *       initialDictionary={locales.eo}
 *       fetchDictionary={(language) => locales[language]}
 *     >
 *       <Hello />
 *       <LanguageSelect />
 *     </LocaleProvider>
 *   );
 */
export const LocaleProvider = <D extends object>(
  props: ParentProps<{
    initialLanguage?: string;
    initialDictionary?: D;
    fetchDictionary: DictionaryFetcher<D>;
    normalizeDictionary?: DictionaryNormalizer<D>;
  }>,
) => {
  const [language, setLanguage] = createSignal(props.initialLanguage);

  // eslint-disable-next-line solid/reactivity
  const { initialDictionary, fetchDictionary } = props;

  // eslint-disable-next-line solid/reactivity
  const normalizeDictionary = props.normalizeDictionary ?? createDictionary;

  const loadDictionary = async (language: string) =>
    normalizeDictionary(await fetchDictionary(language));

  const [dictionary] = createResource(language, loadDictionary, {
    initialValue: initialDictionary
      ? normalizeDictionary(initialDictionary)
      : undefined,
  });

  return (
    <LocaleContext.Provider
      value={{
        language: [language, setLanguage],
        dictionary,
      }}
    >
      {props.children}
    </LocaleContext.Provider>
  );
};
