import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import mobile from 'ismobilejs';

import TutorialContainer from './TutorialContainer';
import TutorialNoMobile from './TutorialNoMobile';

const AppWrapper = styled.div`
  height: 100%;
  line-height: ${props => props.theme.spacing(1.25)};
`;

function App() {
  return (
    <AppWrapper>
      <Helmet
        titleTemplate="%s — Git for Beginners"
        defaultTitle="Git for Beginners"
      />
      {mobile.any ? <TutorialNoMobile /> : <TutorialContainer />}
    </AppWrapper>
  );
}

export default App;
