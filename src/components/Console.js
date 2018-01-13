import styled from 'styled-components';
import Textarea from "react-autosize-textarea";

const Console = styled.div`
  ${props => props.theme.mixins.monospaced};
  background-color: white;
  border-radius: ${props => props.theme.borderRadius.large};
  margin-bottom: ${props => props.theme.spacing()};
  max-height: ${props => props.theme.spacing(8)};
  overflow: auto;
  overflow-x: hidden;
  line-height: ${props => props.theme.spacing(1.1)};
  display: flex;
  flex-direction: column;

  > * + * {
    border-top: 1px solid ${props => props.theme.color.highlight.alpha(0.1)};
  }
`;

export const ConsoleSection = styled.div`
  display: flex;
  padding: ${props => props.theme.spacing(0.45)} 0;
  align-items: baseline;

  &:before,
  &:after {
    content: '\00a0';
    flex-shrink: 0;
  }
`;

export const ConsoleLog = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ConsoleTitle = styled.div`
  display: flex;
  color: ${props => props.theme.color.highlight};
  white-space: nowrap;

  &:before,
  &:after {
    content: '\00a0';
  }
`;

export const ConsoleMessage = styled.div`
  display: flex;

  &:before,
  &:after {
    content: '\00a0';
  }

  ${ConsoleTitle} + & {
    margin-top: ${props => props.theme.spacing(0.45)};
  }
`;

export const ConsoleLabel = styled.div`
  display: flex;

  &:before,
  &:after {
    content: '\00a0';
  }
`;

export const ConsoleCommand = styled.button`
  display: flex;
  color: ${props => props.theme.color.interactive};
  width: 100%;
  padding: ${props => props.theme.spacing(0.25)} 0;
  border-radius: ${props => props.theme.borderRadius.normal};

  &:hover {
    background-color: ${props => props.theme.color.interactive.alpha(0.1)};
  }

  &:before,
  &:after {
    content: '\00a0';
  }
`;

export const ConsoleIcon = styled.strong`
  font-weight: 700;
  display: inline-flex;

  &:before {
    content: '${props => '\\00a0'.repeat(props.offset)}';
  }

  &:after {
    content: '\00a0';
  }
`;

export const ConsoleInput = styled(Textarea)`
  width: 100%;
  color: ${props => props.theme.color.interactive};
  white-space: nowrap;
`;

export default Console;
