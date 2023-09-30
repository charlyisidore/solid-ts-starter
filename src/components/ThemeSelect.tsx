import { type Component, For } from 'solid-js';
import { useTheme } from '../providers/theme';

/**
 * Theme selector.
 *
 * @prop {Record<string, string>} options Object mapping theme identifiers to
 *                                        theme names.
 */
const ThemeSelect: Component<{
  options: Record<string, string>;
}> = (props) => {
  const [theme, setTheme] = useTheme();
  const handleChange = (event: Event) =>
    setTheme((event.target as HTMLSelectElement).value);
  return (
    <select onChange={handleChange}>
      <For each={Object.entries(props.options)}>
        {([identifier, name]) => (
          <option value={identifier} selected={identifier === theme()}>
            {name}
          </option>
        )}
      </For>
    </select>
  );
};

export default ThemeSelect;
