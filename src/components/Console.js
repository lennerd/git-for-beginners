import styled, { css } from 'styled-components';

const Console = styled.div`
  ${props => props.theme.mixins.monospaced};
  line-height: ${props => props.theme.spacing(1.1)};

  & > * + * {
    border-top: 1px solid ${props => props.theme.color.highlight.alpha(0.2)};
  }
`;

export const ConsoleSection = styled.div`
  display: flex;
  padding: ${props => props.theme.spacing(0.45)} 0;
  flex-shrink: 0;
  align-items: baseline;

  &:before,
  &:after {
    content: '\00a0';
    flex-shrink: 0;
  }

  ${props => props.error && css`background-color: ${props => props.theme.color.fileDeleted.alpha(0.1)}`};
`;

export const ConsoleLog = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const ConsoleTitle = styled.div`
  display: flex;
  color: ${props => props.theme.color.highlight};
  white-space: nowrap;
  padding: ${props => props.theme.spacing(0.25)} 0;

  &:before,
  &:after {
    content: '\00a0';
  }
`;

export const ConsoleMessage = styled.div`
  display: flex;
  padding: ${props => props.theme.spacing(0.25)} 0;

  &:before,
  &:after {
    content: '\00a0';
  }

  pre {
    margin: 0;
  }
`;

export const ConsoleLabel = styled.div`
  display: flex;
  padding: ${props => props.theme.spacing(0.25)} 0;
  color: grey;
  white-space: nowrap;

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

export const ConsoleCommandList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
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

export const ConsoleInput = styled.div`
  width: 100%;
  padding: ${props => props.theme.spacing(0.25)} 0;
  display: flex;

  &:before,
  &:after {
    content: '\00a0';
  }

  input {
    color: ${props => props.theme.color.interactive};

    &::placeholder {
      color: ${props => props.theme.color.interactive.alpha(0.5)};
    }
  }

  span:first-child {
    color: ${props => props.theme.color.interactive};
  }

  & > * + * {
    &:before {
      content: '\00a0';
    }
  }
`;

export default Console;
