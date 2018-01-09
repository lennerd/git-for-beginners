import styled from 'styled-components';
import { Link as BaseLink } from 'react-router-dom';

const Link = styled(BaseLink)`
  color: ${props => props.theme.color.interactive};
  text-decoration: none;
`;

export default Link;
