import styled from 'styled-components';

export const Nav = styled.nav`
   position: fixed;
   top: 0;
   left: 0;
   right: 0;
   z-index: 1000;
   background: ${props => props.theme.colors.bgSecondary};
   backdrop-filter: blur(12px);
   // border-bottom: 1px solid ${props => props.theme.colors.borderColor};
`;

export const NavContainer = styled.div`
   max-width: 1200px;
   margin: 0 auto;
   padding: 1rem 2rem;
   display: flex;
   justify-content: space-between;
   align-items: center;

   @media (max-width: 968px) {
      padding: 1rem 1.5rem;
   }
`;

export const NavBrand = styled.div`
   display: flex;
   align-items: center;
   gap: 12px;
   text-decoration: none;
   color: ${props => props.theme.colors.textPrimary};
`;

export const BrandName = styled.span`
   font-size: 1.5rem;
   font-weight: 400;
   letter-spacing: -0.5px;
`;

export const NavLinks = styled.div`
   display: flex;
   align-items: center;
   gap: 2rem;

   @media (max-width: 968px) {
      display: none;
   }
`;

export const NavLink = styled.a`
   color: ${props => props.theme.colors.textSecondary};
   text-decoration: none;
   font-size: 0.95rem;
   font-weight: 500;
   transition: ${props => props.theme.transitions.default};

   &:hover {
      color: ${props => props.theme.colors.textPrimary};
   }
`;

export const MobileMenuBtn = styled.button`
   display: none;
   flex-direction: column;
   gap: 5px;
   background: none;
   border: none;
   cursor: pointer;
   padding: 5px;

   span {
      width: 25px;
      height: 2px;
      background: ${props => props.theme.colors.textPrimary};
      transition: ${props => props.theme.transitions.default};
   }

   @media (max-width: 968px) {
      display: flex;
   }
`;
