// styles/Signup.styles.js
import styled from 'styled-components';

/*
this file uses our ACTUAL theme structure from theme.js
if you add new styles, check theme.js first to see what properties exist
don't invent new property names or the app will crash and you'll waste hours debugging
*/

// main container for the entire signup page
export const SignupPageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.bgPrimary};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-family: ${({ theme }) => theme.fonts.primary};
  transition: ${({ theme }) => theme.transitions.default};
`;

// container for the two-column layout
export const SignupContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md};
  }
`;

// wrapper for the content grid
export const SignupWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xxl};
  max-width: 1200px;
  width: 100%;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.xl};
  }
`;

// left side: info section with title, description, features
export const SignupInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    text-align: center;
    align-items: center;
    order: 2;
  }
`;

// main heading
export const SignupTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.h2};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
  line-height: ${({ theme }) => theme.lineHeights.tight};

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: ${({ theme }) => theme.fontSizes.h3};
  }
`;

// description text
export const SignupDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.body};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.lineHeights.normal};
  margin: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    font-size: ${({ theme }) => theme.fontSizes.bodySm};
  }
`;

// features list container
export const SignupFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: ${({ theme }) => theme.spacing.md} 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

// individual feature item
export const SignupFeature = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  color: ${({ theme }) => theme.colors.textPrimary};

  svg {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    color: ${({ theme }) => theme.colors.success};
  }
`;

// right side: form container
export const SignupFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    order: 1;
  }
`;

// the actual form box with shadow and padding
export const SignupBox = styled.div`
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadowMd};
  padding: ${({ theme }) => theme.spacing.xl};
  width: 100%;
  max-width: 480px;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    box-shadow: ${({ theme }) => theme.colors.shadowLg};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

// form heading
export const SignupHeading = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.h4};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
  text-align: center;
`;

// form element
export const SignupForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

// footer text with login link
export const SignupFooter = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  text-align: center;

  p {
    margin: 0;
    font-size: ${({ theme }) => theme.fontSizes.bodySm};
    color: ${({ theme }) => theme.colors.textSecondary};

    a {
      color: ${({ theme }) => theme.colors.textLink};
      text-decoration: none;
      font-weight: ${({ theme }) => theme.fontWeights.medium};
      transition: ${({ theme }) => theme.transitions.default};

      &:hover {
        text-decoration: underline;
        color: ${({ theme }) => theme.colors.accentHover};
      }
    }
  }
`;

// bottom links (privacy, terms, help)
export const SignupBottomLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.md};

  a {
    font-size: ${({ theme }) => theme.fontSizes.bodyXs};
    color: ${({ theme }) => theme.colors.textTertiary};
    text-decoration: none;
    transition: ${({ theme }) => theme.transitions.default};

    &:hover {
      color: ${({ theme }) => theme.colors.textLink};
      text-decoration: underline;
    }
  }
`;

// password strength indicator
export const PasswordStrength = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSizes.bodyXs};
  color: ${({ theme, $strength }) => {
    if ($strength === 'weak') return theme.colors.error;
    if ($strength === 'medium') return theme.colors.warning;
    if ($strength === 'strong') return theme.colors.success;
    return theme.colors.textTertiary;
  }};
`;

// terms checkbox container
export const TermsCheckbox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.sm};
  margin: ${({ theme }) => theme.spacing.sm} 0;
`;

// terms link
export const TermsLink = styled.a`
  color: ${({ theme }) => theme.colors.textLink};
  text-decoration: none;
  font-weight: ${({ theme }) => theme.fontWeights.medium};

  &:hover {
    text-decoration: underline;
  }
`;