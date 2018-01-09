import styled from 'styled-components';

const Tutorial = styled.div`
  height: 100%;
  display: grid;
  grid-template-columns: 90px repeat(12, auto) 90px;
  grid-template-rows: 90px auto 90px;
  grid-template-areas:
    ". header header header header header header header header header header header header ."
    "navigation . . main main main main . . . . . . .";
  background-image: linear-gradient(135deg, #FEF6F5 0%, #C5CDF6 100%);
`;

export default Tutorial;
