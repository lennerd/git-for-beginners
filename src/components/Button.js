import Title from './Title';

const TitleButton = Title.withComponent('button');

const Button = TitleButton.extend`
  line-height: inherit;
  border: 0;
  background-repeat: no-repeat;
  padding: 0;
  color: ${props => props.theme.color.interactive};
`;

export default Button;
