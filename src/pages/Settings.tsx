import ColorSchemeSelect from '../components/ColorSchemeSelect';
import Hello from '../components/Hello';
import LanguageSelect from '../components/LanguageSelect';
import ThemeSelect from '../components/ThemeSelect';

import styles from './Settings.module.scss';

import locales from '../locales';
import themes from '../themes';

const colorSchemes = {
  light: 'Light',
  dark: 'Dark',
};

/**
 * Configuration page.
 */
const Config = () => (
  <div class={styles.page}>
    <p>
      💬 <LanguageSelect options={locales} />
    </p>
    <p>
      🎨 <ThemeSelect options={themes} />
    </p>
    <p>
      🌗 <ColorSchemeSelect options={colorSchemes} />
    </p>
    <p>
      <Hello />
    </p>
  </div>
);

export default Config;
