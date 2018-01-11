import styled from 'styled-components';

import Title from './Title';

const Header = styled.div`
  display: flex;
  align-self: center;
  justify-content: space-between;
  grid-area: header;
`;


const TitleHeadline = Title.withComponent('h1');

export const HeaderTitle = TitleHeadline.extend`
  color: ${props => props.theme.color.interactive};
`;

export default Header;
