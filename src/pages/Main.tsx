import ColorSchemeSelect from '../components/ColorSchemeSelect';
import Hello from '../components/Hello';
import LanguageSelect from '../components/LanguageSelect';
import ThemeSelect from '../components/ThemeSelect';

import styles from './Main.module.scss';

import locales from '../locales';
import themes from '../themes';

const colorSchemes = {
  light: 'Light',
  dark: 'Dark',
};

/**
 * Main page.
 */
const Main = () => (
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

export default Main;
