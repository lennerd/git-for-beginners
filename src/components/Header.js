import styled from 'styled-components';

import Title from './Title';

const Header = styled.div`
  display: flex;
  align-self: center;
  justify-content: space-between;
  grid-area: header;
  position: relative;
  z-index: 1;
  pointer-events: none;
`;


const TitleHeadline = Title.withComponent('h1');

export const HeaderTitle = TitleHeadline.extend`
  color: ${props => props.theme.color.interactive};
  pointer-events: auto;
`;

export default Header;
