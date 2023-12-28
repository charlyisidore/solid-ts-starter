/* @refresh reload */
import { render } from 'solid-js/web';
import { Router } from '@solidjs/router';

import './index.scss';
import App from './App';
import { AppStateProvider } from './AppState';
import routes from './routes';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error('Root element not found');
}

render(
  () => (
    <Router
      root={(props) => (
        <AppStateProvider>
          <App>{props.children}</App>
        </AppStateProvider>
      )}
    >
      {routes}
    </Router>
  ),
  root as HTMLElement,
);
