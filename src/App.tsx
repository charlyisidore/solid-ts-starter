import { ParentComponent } from 'solid-js';
import { A } from '@solidjs/router';

import styles from './App.module.scss';

/**
 * App root component.
 */
const App: ParentComponent = (props) => {
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
      {props.children}
    </div>
  );
};

export default App;
