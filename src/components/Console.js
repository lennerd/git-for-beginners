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
  line-height: ${props => props.theme.spacing(1.1)};

  > * + * {
    border-top: 1px solid ${props => props.theme.color.highlight.alpha(0.1)};
  }
`;

export const ConsoleSection = styled.div`
  padding: ${props => props.theme.spacing(0.45)} ${props => props.theme.spacing(0.75)};
`;

export const ConsoleCommandName = styled.div`
  color: ${props => props.theme.color.highlight};
`;

export const ConsoleCommandMessage = styled.div`
  ${ConsoleCommandName} + & {
    margin-top: ${props => props.theme.spacing(0.25)};
  }
`;

export const ConsoleInput = styled(Textarea)`
  width: 100%;
  color: ${props => props.theme.color.interactive};
`;

export default Console;
