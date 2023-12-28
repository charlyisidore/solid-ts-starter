import { ParentComponent } from 'solid-js';
import { A } from '@solidjs/router';
import { AppStateProvider } from './AppState';

import styles from './App.module.scss';

/**
 * App root component.
 */
const App: ParentComponent = (props) => {
  return (
    <AppStateProvider>
      <div class={styles.app}>
        <nav class={styles.nav}>
          <A
            href="/"
            class={styles.link}
            activeClass={styles.active}
            end={true}
          >
            Home
          </A>
          <A href="/settings" class={styles.link} activeClass={styles.active}>
            Settings
          </A>
        </nav>
        {props.children}
      </div>
    </AppStateProvider>
  );
};

export default App;
