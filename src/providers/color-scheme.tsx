import {
  type ParentComponent,
  type Signal,
  createContext,
  createSignal,
  useContext,
} from 'solid-js';

/**
 * Color scheme context.
 */
const ColorSchemeContext = createContext<Signal<string | undefined>>();

/**
 * Hook for managing the color scheme value.
 *
 * @returns An accessor and a setter for the color scheme value.
 *
 * @example
 *   import { useColorScheme } from './providers/color-scheme';
 *
 *   const Button = () => {
 *     const [colorScheme, setColorScheme] = useColorScheme();
 *     const handleClick = () =>
 *       setColorScheme(colorScheme() === 'light' ? 'dark' : 'light');
 *     return (
 *       <button class={colorScheme()} onClick={handleClick}>
 *         {colorScheme()}
 *       </button>
 *     );
 *   };
 */
export function useColorScheme() {
  const context = useContext(ColorSchemeContext);
  if (!context) {
    throw new Error('ColorSchemeContext not found');
  }
  return context;
}

/**
 * Provide a color scheme value for descendant components.
 *
 * @prop {string?} initialColorScheme Initial color scheme value.
 *
 * @example
 *   import {
 *     ColorSchemeProvider,
 *     useColorScheme,
 *   } from './providers/color-scheme';
 *
 *   const Hello = () => {
 *     const [colorScheme] = useColorScheme();
 *     return <div class={colorScheme()}>Hello</div>;
 *   };
 *
 *   const App = () => (
 *     <ColorSchemeProvider colorScheme="dark">
 *       <Hello />
 *     </ColorSchemeProvider>
 *   );
 */
export const ColorSchemeProvider: ParentComponent<{
  initialColorScheme?: string;
}> = (props) => {
  const [colorScheme, setColorScheme] = createSignal(props.initialColorScheme);
  return (
    <ColorSchemeContext.Provider value={[colorScheme, setColorScheme]}>
      {props.children}
    </ColorSchemeContext.Provider>
  );
};
