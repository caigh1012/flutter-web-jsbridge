import { StrictMode } from 'react';
import App from './App.tsx';
import generatePage from './helpers/generate-page.tsx';

import './index.css';

generatePage(
  <StrictMode>
    <App />
  </StrictMode>,
);
