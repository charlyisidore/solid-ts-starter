import { type Component, For } from 'solid-js';

/**
 * Wrapper for `<select>` element.
 *
 * @prop {Record<string, string>} options Object mapping values to names.
 * @prop {string | undefined} value Selected value.
 * @prop {((value: string) => void) | undefined} onChange Function called on
 *       option change.
 */
const Select: Component<{
  options: Record<string, string>;
  value?: string;
  onChange?: (value: string) => void;
}> = (props) => {
  const handleChange = (event: Event) =>
    props.onChange?.((event.target as HTMLSelectElement).value);
  return (
    <select onChange={handleChange}>
      <For each={Object.entries(props.options)}>
        {([value, name]) => (
          <option value={value} selected={value === props.value}>
            {name}
          </option>
        )}
      </For>
    </select>
  );
};

export default Select;
