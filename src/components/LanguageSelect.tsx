import { type Component, For } from 'solid-js';
import { useLanguage } from '../providers/locale';

/**
 * Language selector.
 *
 * @prop {Record<string, string>} options Object mapping language codes to
 *                                        language names.
 */
const LanguageSelect: Component<{
  options: Record<string, string>;
}> = (props) => {
  const [language, setLanguage] = useLanguage();
  const handleChange = (event: Event) =>
    setLanguage((event.target as HTMLSelectElement).value);
  return (
    <select onChange={handleChange}>
      <For each={Object.entries(props.options)}>
        {([code, name]) => (
          <option value={code} selected={code === language()}>
            {name}
          </option>
        )}
      </For>
    </select>
  );
};

export default LanguageSelect;
