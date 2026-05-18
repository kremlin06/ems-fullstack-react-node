import styled, { keyframes } from 'styled-components';

// Extracting keyframes makes the code cleaner and reusable
const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const Spinner = styled.div`
   width: ${props => props.size === 'large' ? '24px' : '20px'};
   height: ${props => props.size === 'large' ? '24px' : '20px'};
   border: 2px solid rgba(255, 255, 255, 0.3);
   border-top-color: ${props => props.color || '#ffffff'};
   border-radius: 50%;
   animation: ${spin} 0.8s linear infinite;
   display: inline-block;
   vertical-align: middle;
   margin-right: 8px;
`;