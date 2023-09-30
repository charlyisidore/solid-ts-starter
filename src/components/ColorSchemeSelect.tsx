import { type Component, For } from 'solid-js';
import { useColorScheme } from '../providers/color-scheme';

/**
 * Color scheme selector.
 *
 * @prop {Record<string, string>} options Object mapping color scheme
 *                                        identifiers to their names.
 */
const ColorSchemeSelect: Component<{
  options: Record<string, string>;
}> = (props) => {
  const [colorScheme, setColorScheme] = useColorScheme();
  const handleChange = (event: Event) =>
    setColorScheme((event.target as HTMLSelectElement).value);
  return (
    <select onChange={handleChange}>
      <For each={Object.entries(props.options)}>
        {([identifier, name]) => (
          <option value={identifier} selected={identifier === colorScheme()}>
            {name}
          </option>
        )}
      </For>
    </select>
  );
};

export default ColorSchemeSelect;
