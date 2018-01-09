import React from 'react';
import { render } from 'react-dom';
import { TweenLite, Power1 } from 'gsap';
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import { BrowserRouter, Route } from 'react-router-dom'
import { ThemeProvider } from 'styled-components';

import App, { AppStore } from './components/App';
import VisualisationStore from './components/Visualisation/VisualisationStore';
import theme from './theme';
import './injectGlobal';

TweenLite.defaultEase = Power1.easeInOut;
TweenLite.defaultOverwrite = 'concurrent';
useStrict(true);

const app = new AppStore();
const visualisation = new VisualisationStore(TweenLite.ticker);

render((
  <Provider
    app={app}
    visualisation={visualisation}
  >
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Route component={App} />
      </BrowserRouter>
    </ThemeProvider>
  </Provider>
), document.getElementById('root'));
