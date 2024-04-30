// import {  } from 'react';
import './index.css';
import './assets/libertyisland.ttf';

import { createRoot } from 'react-dom/client';

import App from './App';
import { StateProvider } from './store';

const domNode = document.getElementById('root');
if (domNode) {
  const root = createRoot(domNode);
  root.render(
    <StateProvider>
      <App />
    </StateProvider>
  );
}
