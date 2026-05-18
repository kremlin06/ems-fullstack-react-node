// styles/Dashboard.styles.js
import styled, { keyframes } from 'styled-components';

const fadeUp = keyframes`
   from { opacity: 0; transform: translateY(10px); }
   to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
   0%, 100% { opacity: 1; transform: scale(1); }
   50% { opacity: 0.5; transform: scale(1.3); }
`;

export const DashboardContainer = styled.div`
   display: flex;
   flex-direction: column;
   gap: ${({ theme }) => theme.spacing.lg};
   animation: ${fadeUp} 0.3s ease;
   width: 100%;
   padding: ${({ theme }) => theme.spacing.lg};
   background: ${({ theme }) => theme.colors.bgPrimary};
   min-height: calc(100vh - 64px); // account for fixed navbar
`;

export const Header = styled.div`
   display: flex;
   align-items: flex-start;
   justify-content: space-between;
   gap: ${({ theme }) => theme.spacing.lg};
   flex-wrap: wrap;

   .dash-title {
      font-size: ${({ theme }) => theme.fontSizes.h3};
      font-weight: ${({ theme }) => theme.fontWeights.semibold};
      color: ${({ theme }) => theme.colors.textPrimary};
      margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
   }

   .dash-sub {
      font-size: ${({ theme }) => theme.fontSizes.bodySm};
      color: ${({ theme }) => theme.colors.textSecondary};
      margin: 0;
   }

   .dash-header-right {
      display: flex;
      align-items: center;
      gap: ${({ theme }) => theme.spacing.md};

      .date-chip {
         display: flex;
         align-items: center;
         gap: ${({ theme }) => theme.spacing.xs};
         font-size: ${({ theme }) => theme.fontSizes.bodySm};
         color: ${({ theme }) => theme.colors.textSecondary};
         background: ${({ theme }) => theme.colors.bgTertiary};
         padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
         border-radius: ${({ theme }) => theme.borderRadius.full};
      }

      .icon-btn {
         background: none;
         border: none;
         color: ${({ theme }) => theme.colors.textSecondary};
         cursor: pointer;
         padding: ${({ theme }) => theme.spacing.xs};
         border-radius: ${({ theme }) => theme.borderRadius.md};
         position: relative;
         display: flex;
         align-items: center;
         justify-content: center;
         transition: ${({ theme }) => theme.transitions.fast};

         &:hover {
            background: ${({ theme }) => theme.colors.bgHover};
            color: ${({ theme }) => theme.colors.textPrimary};
         }

         .notif-dot {
            position: absolute;
            top: 4px;
            right: 4px;
            width: 8px;
            height: 8px;
            background: ${({ theme }) => theme.colors.error};
            border-radius: 50%;
            border: 2px solid ${({ theme }) => theme.colors.cardBg};
         }
      }
   }
`;

export const StatsGrid = styled.div`
   display: grid;
   grid-template-columns: repeat(4, 1fr);
   gap: ${({ theme }) => theme.spacing.md};

   @media (max-width: ${({ theme }) => theme.breakpoints.lg}) { 
      grid-template-columns: repeat(2, 1fr); 
   }
   @media (max-width: ${({ theme }) => theme.breakpoints.sm}) { 
      grid-template-columns: 1fr; 
   }
`;

export const StatCardWrapper = styled.div`
   background: ${({ theme }) => theme.colors.cardBg};
   border-radius: ${({ theme }) => theme.borderRadius.lg};
   padding: ${({ theme }) => theme.spacing.lg};
   box-shadow: ${({ theme }) => theme.colors.shadowSm};
   border-top: 3px solid ${props => props.$color || props.theme.colors.accentPrimary};
   transition: ${({ theme }) => theme.transitions.default};

   &:hover { 
      transform: translateY(-2px); 
      box-shadow: ${({ theme }) => theme.colors.shadowMd};
   }
`;

export const StatCardHeader = styled.div`
   display: flex;
   align-items: center;
   justify-content: space-between;
   margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const StatIcon = styled.div`
   display: flex;
   align-items: center;
   justify-content: center;
   width: 40px;
   height: 40px;
   background: ${props => props.$color}20;
   color: ${props => props.$color};
   border-radius: ${({ theme }) => theme.borderRadius.md};
`;

export const StatTrend = styled.span`
   font-size: ${({ theme }) => theme.fontSizes.bodyXs};
   font-weight: ${({ theme }) => theme.fontWeights.medium};
   padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
   border-radius: ${({ theme }) => theme.borderRadius.full};
`;

export const StatValue = styled.div`
   font-size: ${({ theme }) => theme.fontSizes.h3};
   font-weight: ${({ theme }) => theme.fontWeights.bold};
   color: ${({ theme }) => theme.colors.textPrimary};
   margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const StatLabel = styled.div`
   font-size: ${({ theme }) => theme.fontSizes.bodySm};
   color: ${({ theme }) => theme.colors.textSecondary};
`;

export const Card = styled.div`
   background: ${({ theme }) => theme.colors.cardBg};
   border-radius: ${({ theme }) => theme.borderRadius.lg};
   box-shadow: ${({ theme }) => theme.colors.shadowSm};
   overflow: hidden;
   margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const CardHeader = styled.div`
   display: flex;
   align-items: center;
   justify-content: space-between;
   padding: ${({ theme }) => theme.spacing.lg};
   border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor};
`;

export const CardTitle = styled.h3`
   font-size: ${({ theme }) => theme.fontSizes.h4};
   font-weight: ${({ theme }) => theme.fontWeights.semibold};
   color: ${({ theme }) => theme.colors.textPrimary};
   margin: 0;
`;

export const CardSubtitle = styled.p`
   font-size: ${({ theme }) => theme.fontSizes.bodySm};
   color: ${({ theme }) => theme.colors.textTertiary};
   margin: ${({ theme }) => theme.spacing.xs} 0 0 0;
`;

export const CardActions = styled.div`
   display: flex;
   align-items: center;
   gap: ${({ theme }) => theme.spacing.sm};
`;

export const CardLink = styled.a`
   font-size: ${({ theme }) => theme.fontSizes.bodySm};
   color: ${({ theme }) => theme.colors.textLink};
   text-decoration: none;
   font-weight: ${({ theme }) => theme.fontWeights.medium};

   &:hover {
      text-decoration: underline;
   }
`;

export const CardBody = styled.div`
   padding: ${({ theme }) => theme.spacing.lg};
`;

export const BottomGrid = styled.div`
   display: grid;
   grid-template-columns: 1fr 360px;
   gap: ${({ theme }) => theme.spacing.lg};

   @media (max-width: ${({ theme }) => theme.breakpoints.lg}) { 
      grid-template-columns: 1fr; 
   }
`;

export const LeftColumn = styled.div`
   display: flex;
   flex-direction: column;
   gap: ${({ theme }) => theme.spacing.lg};
`;

export const RightColumn = styled.div`
   display: flex;
   flex-direction: column;
   gap: ${({ theme }) => theme.spacing.lg};
`;

// Quick Action Menu Styles
export const ActionGrid = styled.div`
   display: grid;
   grid-template-columns: repeat(2, 1fr);
   gap: ${({ theme }) => theme.spacing.sm};
   padding: 0 ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.lg};
`;

export const ActionButton = styled.button`
   display: flex;
   align-items: center;
   gap: ${({ theme }) => theme.spacing.sm};
   padding: ${({ theme }) => theme.spacing.md};
   background: ${({ theme, $variant }) => {
     if ($variant === 'primary') return theme.colors.accentPrimary;
     if ($variant === 'secondary') return theme.colors.bgTertiary;
     return 'transparent';
   }};
   color: ${({ theme, $variant }) => {
     if ($variant === 'primary') return theme.colors.bgSecondary;
     if ($variant === 'secondary') return theme.colors.textPrimary;
     return theme.colors.textSecondary;
   }};
   border: ${({ $variant }) => $variant === 'ghost' ? `1px solid ${({ theme }) => theme.colors.borderColor}` : 'none'};
   border-radius: ${({ theme }) => theme.borderRadius.md};
   cursor: pointer;
   text-align: left;
   transition: ${({ theme }) => theme.transitions.default};
   font-size: ${({ theme }) => theme.fontSizes.bodySm};

   &:hover {
      background: ${({ theme, $variant }) => {
        if ($variant === 'primary') return theme.colors.accentHover;
        if ($variant === 'secondary') return theme.colors.bgHover;
        return theme.colors.bgHover;
      }};
      transform: translateY(-1px);
   }
`;

export const ActionIcon = styled.div`
   display: flex;
   align-items: center;
   justify-content: center;
   width: 32px;
   height: 32px;
   background: ${({ theme }) => theme.colors.bgSecondary}40;
   border-radius: ${({ theme }) => theme.borderRadius.sm};
   color: currentColor;
`;

export const ActionContent = styled.div`
   display: flex;
   flex-direction: column;
   gap: 2px;
`;

export const ActionLabel = styled.span`
   font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

export const ActionDesc = styled.span`
   font-size: ${({ theme }) => theme.fontSizes.bodyXs};
   opacity: 0.8;
`;

// Chart Styles
export const ChartContainer = styled.div`
   display: flex;
   align-items: flex-end;
   justify-content: space-between;
   height: 120px;
   gap: ${({ theme }) => theme.spacing.xs};
   padding: ${({ theme }) => theme.spacing.md} 0;
`;

export const ChartBarWrapper = styled.div`
   display: flex;
   flex-direction: column;
   align-items: center;
   gap: ${({ theme }) => theme.spacing.xs};
   flex: 1;
`;

export const ChartBar = styled.div`
   width: 100%;
   max-width: 32px;
   height: ${props => props.$height}%;
   background: ${props => props.$color};
   border-radius: ${({ theme }) => theme.borderRadius.sm} ${({ theme }) => theme.borderRadius.sm} 0 0;
   transition: ${({ theme }) => theme.transitions.default};

   &:hover {
      opacity: 0.8;
   }
`;

export const ChartLabel = styled.span`
   font-size: ${({ theme }) => theme.fontSizes.bodyXs};
   color: ${({ theme }) => theme.colors.textTertiary};
`;

export const ChartValue = styled.span`
   font-size: ${({ theme }) => theme.fontSizes.bodyXs};
   font-weight: ${({ theme }) => theme.fontWeights.medium};
   color: ${({ theme }) => theme.colors.textPrimary};
`;

export const ChartSummary = styled.div`
   display: flex;
   justify-content: space-around;
   padding-top: ${({ theme }) => theme.spacing.md};
   border-top: 1px solid ${({ theme }) => theme.colors.borderColor};
`;

export const SummaryItem = styled.div`
   text-align: center;
`;

export const SummaryValue = styled.div`
   font-size: ${({ theme }) => theme.fontSizes.h4};
   font-weight: ${({ theme }) => theme.fontWeights.semibold};
   color: ${({ theme }) => theme.colors.textPrimary};
`;

export const SummaryLabel = styled.div`
   font-size: ${({ theme }) => theme.fontSizes.bodyXs};
   color: ${({ theme }) => theme.colors.textTertiary};
`;

// Activity List Styles
export const ActivityList = styled.div`
   display: flex;
   flex-direction: column;
   gap: ${({ theme }) => theme.spacing.sm};
   padding: 0 ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.lg};
   max-height: 280px;
   overflow-y: auto;
`;

export const ActivityItem = styled.div`
   display: flex;
   align-items: flex-start;
   gap: ${({ theme }) => theme.spacing.sm};
   padding: ${({ theme }) => theme.spacing.sm} 0;
   border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor};

   &:last-child {
      border-bottom: none;
   }
`;

export const ActivityIcon = styled.div`
   display: flex;
   align-items: center;
   justify-content: center;
   width: 28px;
   height: 28px;
   background: ${props => props.$color}20;
   color: ${props => props.$color};
   border-radius: ${({ theme }) => theme.borderRadius.full};
   flex-shrink: 0;
`;

export const ActivityContent = styled.div`
   display: flex;
   flex-direction: column;
   gap: 2px;
   min-width: 0;
`;

export const ActivityMessage = styled.span`
   font-size: ${({ theme }) => theme.fontSizes.bodySm};
   color: ${({ theme }) => theme.colors.textPrimary};
   line-height: 1.4;
`;

export const ActivityTime = styled.span`
   font-size: ${({ theme }) => theme.fontSizes.bodyXs};
   color: ${({ theme }) => theme.colors.textTertiary};
`;

// Event List Styles
export const EventList = styled.div`
   display: flex;
   flex-direction: column;
   gap: ${({ theme }) => theme.spacing.sm};
   padding: 0 ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.lg};
   max-height: 320px;
   overflow-y: auto;
`;

export const EventItem = styled.a`
   display: flex;
   align-items: center;
   gap: ${({ theme }) => theme.spacing.md};
   padding: ${({ theme }) => theme.spacing.md};
   background: ${({ theme }) => theme.colors.bgTertiary};
   border-radius: ${({ theme }) => theme.borderRadius.md};
   text-decoration: none;
   transition: ${({ theme }) => theme.transitions.default};

   &:hover {
      background: ${({ theme }) => theme.colors.bgHover};
      transform: translateX(4px);
   }
`;

export const EventDate = styled.div`
   display: flex;
   align-items: center;
   gap: ${({ theme }) => theme.spacing.xs};
   font-size: ${({ theme }) => theme.fontSizes.bodySm};
   font-weight: ${({ theme }) => theme.fontWeights.medium};
   color: ${({ theme }) => theme.colors.textPrimary};
   min-width: 70px;
`;

export const EventDetails = styled.div`
   flex: 1;
   min-width: 0;
`;

export const EventTitle = styled.div`
   font-size: ${({ theme }) => theme.fontSizes.bodySm};
   font-weight: ${({ theme }) => theme.fontWeights.medium};
   color: ${({ theme }) => theme.colors.textPrimary};
   white-space: nowrap;
   overflow: hidden;
   text-overflow: ellipsis;
`;

export const EventMeta = styled.div`
   display: flex;
   align-items: center;
   gap: ${({ theme }) => theme.spacing.xs};
   font-size: ${({ theme }) => theme.fontSizes.bodyXs};
   color: ${({ theme }) => theme.colors.textTertiary};
`;

export const EventStatus = styled.span`
   font-size: ${({ theme }) => theme.fontSizes.bodyXs};
   font-weight: ${({ theme }) => theme.fontWeights.medium};
   padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
   border-radius: ${({ theme }) => theme.borderRadius.full};
   white-space: nowrap;
`;

// Empty State
export const EmptyState = styled.div`
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
   text-align: center;
   color: ${({ theme }) => theme.colors.textTertiary};
`;

export const EmptyIcon = styled.div`
   font-size: 2rem;
   margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export const EmptyText = styled.p`
   font-size: ${({ theme }) => theme.fontSizes.bodySm};
   margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
`;

export const EmptyAction = styled.a`
   font-size: ${({ theme }) => theme.fontSizes.bodySm};
   color: ${({ theme }) => theme.colors.textLink};
   text-decoration: none;
   font-weight: ${({ theme }) => theme.fontWeights.medium};

   &:hover {
      text-decoration: underline;
   }
`;

// Skeleton Loading States
export const Skeleton = styled.div`
   background: ${({ theme }) => theme.colors.bgTertiary};
   border-radius: ${({ theme }) => theme.borderRadius.md};
   animation: pulse 1.5s infinite ease-in-out;
   
   @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
   }
`;

export const SkeletonCard = styled.div`
   background: ${({ theme }) => theme.colors.cardBg};
   border-radius: ${({ theme }) => theme.borderRadius.lg};
   padding: ${({ theme }) => theme.spacing.lg};
   box-shadow: ${({ theme }) => theme.colors.shadowSm};
   height: ${props => props.height || '120px'};
   animation: pulse 1.5s infinite ease-in-out;
   
   @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
   }
`;