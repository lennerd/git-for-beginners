import styled from 'styled-components';

const Title = styled.span`
  font-size: 1rem;
  font-weight: normal;
  font-variant-caps: all-small-caps;
  letter-spacing: 1.5px;
  opacity: ${props => props.minor ? 0.5 : 1};
  color: ${props => props.theme.color.highlight};
`;

export default Title;
