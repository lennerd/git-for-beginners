import styled from 'styled-components';
import Textarea from "react-autosize-textarea";

const Console = styled.div`
  ${props => props.theme.mixins.monospaced};
  justify-self: stretch;
  align-self: end;
  grid-area: console;
  background-color: white;
  border-radius: ${props => props.theme.border.radiusLarge};
  margin-bottom: ${props => props.theme.spacing(2)};
  max-height: ${props => props.theme.spacing(8)};
  overflow: auto;
  overflow-x: hidden;
  line-height: ${props => props.theme.spacing(1.1)};

  > * + * {
    border-top: 1px solid ${props => props.theme.color.highlight.alpha(0.1)};
  }
`;

export const ConsoleSection = styled.div`
  padding: ${props => props.theme.spacing(0.25)} ${props => props.theme.spacing(0.5)};
`;

export const ConsoleCommand = styled.div`
  color: ${props => props.theme.color.highlight};
  padding: ${props => props.theme.spacing(0.25)} ${props => props.theme.spacing(0.25)};
  white-space: nowrap;
`;

export const ConsoleInput = styled(Textarea)`
  width: 100%;
  color: ${props => props.theme.color.interactive};
  padding: ${props => props.theme.spacing(0.25)} ${props => props.theme.spacing(0.25)};
  white-space: nowrap;
`;

export default Console;
