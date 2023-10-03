import { useAppState } from '../AppState';
import Hello from '../components/Hello';
import Select from '../components/Select';

import styles from './Settings.module.scss';

import locales from '../locales';
import themes from '../themes';

const colorSchemes = {
  '': 'System',
  light: 'Light',
  dark: 'Dark',
};

/**
 * Settings page.
 */
const Settings = () => {
  const app = useAppState();
  return (
    <div class={styles.page}>
      <p>
        💬{' '}
        <Select
          options={locales}
          value={app.language}
          onChange={(language) => (app.language = language)}
        />
      </p>
      <p>
        🎨{' '}
        <Select
          options={themes}
          value={app.theme}
          onChange={(theme) => (app.theme = theme)}
        />
      </p>
      <p>
        🌗{' '}
        <Select
          options={colorSchemes}
          value={app.colorScheme ?? ''}
          onChange={(colorScheme) =>
            (app.colorScheme = colorScheme || undefined)
          }
        />
      </p>
      <p>
        <Hello />
      </p>
    </div>
  );
};

export default Settings;
