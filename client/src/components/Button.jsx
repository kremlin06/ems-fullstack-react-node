import { StyledButton, StyledSecondaryButton, ButtonContainer } from '../styles/Button.styles';

const Button = ({ children, onClick, variant = 'primary', as: Component = 'button', ...props }) => {
   const ButtonComponent = variant === 'secondary' ? StyledSecondaryButton : StyledButton;

   // as={Component} render as <Link>, <a>, or <button>
   // {...props} pass to, href, etc. to the rendered component

   // to use Buttons that redirect to other pages, we can now do:    // <Button as={Link} to="/login" variant="primary">Get Started</Button>
   // that is a primary button that navigates via React Router

   // a secondary button that is just a regular button
   // <Button variant="secondary" onClick={handleClick}>Click Me</Button>
   return <ButtonComponent as={Component} onClick={onClick} {...props}>{children}</ButtonComponent>
}

export default Button;
export { ButtonContainer };

