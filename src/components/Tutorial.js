import styled from 'styled-components';

const Tutorial = styled.div`
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

export default Tutorial;
