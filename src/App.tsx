import { A, useRoutes } from '@solidjs/router';
import routes from './routes';

import styles from './App.module.scss';

/**
 * App root component.
 */
const App = () => {
  const Routes = useRoutes(routes);
  return (
    <div class={styles.app}>
      <nav class={styles.nav}>
        <A href="/" class={styles.link} activeClass={styles.active} end={true}>
          Home
        </A>
        <A href="/settings" class={styles.link} activeClass={styles.active}>
          Settings
        </A>
      </nav>
      <Routes />
    </div>
  );
};

export default App;
