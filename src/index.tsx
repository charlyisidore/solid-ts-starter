/* @refresh reload */
import { render } from 'solid-js/web';

import './index.scss';
import App from './App';
import { Router } from '@solidjs/router';
import { ConfigProvider } from './config';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error('Root element not found');
}

render(
  () => (
    <Router>
      <ConfigProvider>
        <App />
      </ConfigProvider>
    </Router>
  ),
  root as HTMLElement,
);
