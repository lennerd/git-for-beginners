import styled from 'styled-components';

const Tutorial = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 95px repeat(12, 1fr) 95px;
  grid-template-rows: 95px auto 95px;
  grid-template-areas:
    ". header header header header header header header header header header header header ."
    "navigation . . main main main main . . . . . . .";
  background-image: linear-gradient(135deg, #FEF6F5 0%, #C5CDF6 100%);
`;

export default Tutorial;

export const Main = styled.div`
  justify-self: stretch;
  align-self: center;
  grid-area: main;
`;
