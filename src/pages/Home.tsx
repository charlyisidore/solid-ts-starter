import Hello from '../components/Hello';

import styles from './Home.module.scss';

/**
 * Home page.
 */
const Home = () => (
  <div class={styles.page}>
    <Hello />
  </div>
);

export default Home;
