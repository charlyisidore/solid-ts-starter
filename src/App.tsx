import { ConfigProvider } from './config';
import Main from './pages/Main';

/**
 * App root component.
 */
const App = () => (
  <ConfigProvider>
    <Main />
  </ConfigProvider>
);

export default App;
