import styled from 'styled-components';

const Tutorial = styled.div`
  position: relative;
  height: 100%;
  display: grid;
  grid-template-columns:
    ${props => props.theme.largeSpacing()}
    1fr
    ${props => props.theme.largeSpacing()};
  grid-template-rows:
    ${props => props.theme.largeSpacing()}
    1fr
    ${props => props.theme.largeSpacing()};
  grid-template-areas:
    ". header ."
    "navigation chapter ."
    ". chapter .";
  background-image: linear-gradient(135deg, #FEF6F5 0%, #C5CDF6 100%);
`;

export const TutorialReset = styled.button`
  padding: ${props => props.theme.spacing(0.5)} ${props => props.theme.spacing()};
  font-size: 10px;
  position: absolute;
  bottom: 0;
  right: 0;
`;

export default Tutorial;
