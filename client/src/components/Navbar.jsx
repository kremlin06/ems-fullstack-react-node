import { Nav, NavContainer, NavBrand, BrandName, NavLinks, NavLink, MobileMenuBtn, } from '../styles/Navbar.styles';
import Button from './Button';
// import ThemeToggle from './ThemeToggle';

const Navbar = () => {
   return (
      <Nav>
      <NavContainer>
         <NavBrand>
            {/* <LogoSVG /> */}
            <BrandName>Event Management System</BrandName>
         </NavBrand>
         <NavLinks>
            <NavLink href="#features">Features</NavLink>
            <NavLink href="#how-it-works">How it Works</NavLink>
            <NavLink href="#footer-manifesto">Manifesto</NavLink>
            <NavLink href="#login">Login</NavLink>
            {/* <ThemeToggle /> */}
            <Button variant="primary">Get Started</Button>
         </NavLinks>
         <MobileMenuBtn>
            <span></span>
            <span></span>
            <span></span>
         </MobileMenuBtn>
      </NavContainer>
   </Nav>
   );
};

export default Navbar;