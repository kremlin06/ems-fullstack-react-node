import { StyledButton, StyledSecondaryButton, ButtonContainer } from '../styles/Button.styles';

const Button = ({ children, onClick, variant = 'primary' }) => {
   const ButtonComponent = variant === 'secondary' ? StyledSecondaryButton : StyledButton;

   return <ButtonComponent onClick={onClick}>{children}</ButtonComponent>
}

export default Button;
export { ButtonContainer };

