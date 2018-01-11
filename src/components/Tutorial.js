import styled from 'styled-components';

import arrowRightLarge from '../images/arrowRightLarge.svg';
import Button from './Button';

const Tutorial = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 95px repeat(12, 1fr) 95px;
  grid-template-rows: 95px 1fr 1fr 95px;
  grid-template-areas:
    ". header header header header header header header header header header header header ."
    "navigation . . main main main main . . . . . . ."
    "navigation . . main main main main . . . next-chapter next-chapter next-chapter .";
  background-image: linear-gradient(135deg, #FEF6F5 0%, #C5CDF6 100%);
`;

export const Main = styled.div`
  justify-self: stretch;
  align-self: center;
  grid-area: main;
`;

export const NextChapterButton = Button.extend`
  grid-area: next-chapter;
  justify-self: right;
  align-self: end;
  background-image: url(${arrowRightLarge});
  background-position: 100% 0;
  padding-right: ${props => props.theme.spacing(1.5)};
  height: ${props => props.theme.spacing(2)};
`;

export default Tutorial;
