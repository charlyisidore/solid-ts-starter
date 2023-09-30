import { useColorScheme } from '../providers/color-scheme';
import { useTranslate } from '../providers/locale';
import { useStyles } from '../providers/theme';

import defaultStyles from './Hello.module.scss';

/**
 * Just says hello.
 */
const Hello = () => {
  const [colorScheme] = useColorScheme();
  const styles = useStyles('Hello', defaultStyles);
  const translate = useTranslate();
  return (
    <div class={styles(['content', colorScheme()])}>
      {/* prettier-ignore */}
      {translate('hello')}
    </div>
  );
};

export default Hello;
