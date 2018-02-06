import styled from 'styled-components';

const Tutorial = styled.div`
  position: relative;
  height: 100%;
  display: grid;
  grid-template-columns:
    ${props => props.theme.spacing(3.75)}
    1fr
    ${props => props.theme.spacing(3.75)};
  grid-template-rows:
    ${props => props.theme.spacing(3.75)}
    1fr
    ${props => props.theme.spacing(3.75)};
  grid-template-areas:
    '. header spinner'
    'navigation chapter .'
    '. chapter .';
  background-image: linear-gradient(135deg, #fef6f5 0%, #c5cdf6 100%);

  @media (min-width: 1440px) {
    grid-template-columns:
      ${props => props.theme.largeSpacing()}
      1fr
      ${props => props.theme.largeSpacing()};
    grid-template-rows:
      ${props => props.theme.largeSpacing()}
      1fr
      ${props => props.theme.largeSpacing()};
  }
`;

export default Tutorial;
