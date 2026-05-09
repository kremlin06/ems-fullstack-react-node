import styled from 'styled-components';

// Headings
export const H1 = styled.h1`
  font-size: ${props => props.theme.fontSizes.h1};
  font-weight: ${props => props.theme.fontWeights.bold};
  line-height: ${props => props.theme.lineHeights.tight};
  font-family: ${props => props.theme.fonts.primary};
`;

export const H2 = styled.h2`
  font-size: ${props => props.theme.fontSizes.h2};
  font-weight: ${props => props.theme.fontWeights.bold};
  line-height: ${props => props.theme.lineHeights.tight};
  font-family: ${props => props.theme.fonts.primary};
`;

export const H3 = styled.h3`
  font-size: ${props => props.theme.fontSizes.h3};
  font-weight: ${props => props.theme.fontWeights.semibold};
  line-height: ${props => props.theme.lineHeights.tight};
  font-family: ${props => props.theme.fonts.primary};
`;

export const H4 = styled.h4`
  font-size: ${props => props.theme.fontSizes.h4};
  font-weight: ${props => props.theme.fontWeights.semibold};
  font-family: ${props => props.theme.fonts.primary};
`;

export const H5 = styled.h5`
  font-size: ${props => props.theme.fontSizes.h5};
  font-weight: ${props => props.theme.fontWeights.medium};
  font-family: ${props => props.theme.fonts.primary};
`;

export const H6 = styled.h6`
  font-size: ${props => props.theme.fontSizes.h6};
  font-weight: ${props => props.theme.fontWeights.medium};
  font-family: ${props => props.theme.fonts.primary};
`;

// Body text
export const Body = styled.p`
  font-size: ${props => props.theme.fontSizes.body};
  font-weight: ${props => props.theme.fontWeights.regular};
  line-height: ${props => props.theme.lineHeights.normal};
  font-family: ${props => props.theme.fonts.secondary};
`;

export const BodyMd = styled.p`
  font-size: ${props => props.theme.fontSizes.bodyMd};
  font-weight: ${props => props.theme.fontWeights.regular};
  line-height: ${props => props.theme.lineHeights.normal};
  font-family: ${props => props.theme.fonts.secondary};
`;

export const BodySm = styled.p`
  font-size: ${props => props.theme.fontSizes.bodySm};
  font-weight: ${props => props.theme.fontWeights.regular};
  line-height: ${props => props.theme.lineHeights.normal};
  font-family: ${props => props.theme.fonts.secondary};
`;

export const BodyXs = styled.p`
  font-size: ${props => props.theme.fontSizes.bodyXs};
  font-weight: ${props => props.theme.fontWeights.regular};
  font-family: ${props => props.theme.fonts.secondary};
`;

// Subtitle/Secondary text
export const Subtitle = styled.p`
  font-size: ${props => props.theme.fontSizes.bodyMd};
  font-weight: ${props => props.theme.fontWeights.medium};
  color: ${props => props.theme.colors.textSecondary};
  line-height: ${props => props.theme.lineHeights.relaxed};
  font-family: ${props => props.theme.fonts.secondary};
`;

// Label text
export const Label = styled.label`
  font-size: ${props => props.theme.fontSizes.bodySm};
  font-weight: ${props => props.theme.fontWeights.medium};
  color: ${props => props.theme.colors.textSecondary};
  font-family: ${props => props.theme.fonts.secondary};
`;
