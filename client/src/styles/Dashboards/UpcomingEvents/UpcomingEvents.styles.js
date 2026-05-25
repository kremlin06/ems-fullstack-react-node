// src/styles/Dashboards/UpcomingEvents.styles.js
import styled from 'styled-components';
import { Link } from 'react-router-dom';

/**
 * =============================================================================
 * UPCOMING EVENTS STYLED COMPONENTS
 * =============================================================================
 * Purpose: Visual styling for upcoming events list component
 * Usage: Import into UpcomingEvents.jsx
 * Theme: All spacing/colors/typography reference `theme` for consistency
 * Props: $ prefixed props are for styling only (not passed to DOM)
 * =============================================================================
 */

/**
 * Main card container with section styling
 */
export const EventsCard = styled.section`
  background: ${({ theme }) => theme.colors.cardBg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.colors.shadowSm};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

/**
 * Card header with title and actions
 */
export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor};
`;

/**
 * Card title text
 */
export const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.h4};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0;
`;

/**
 * Card actions container
 */
export const CardActions = styled.div`
  display: flex;
  align-items: center;
`;

/**
 * Action link styling
 */
export const CardLink = styled(Link)`
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  color: ${({ theme }) => theme.colors.textLink};
  text-decoration: none;
  font-weight: ${({ theme }) => theme.fontWeights.medium};

  &:hover {
    text-decoration: underline;
  }
`;

/**
 * Scrollable event list container
 */
export const EventList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 280px;
  overflow-y: auto;
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.bgSecondary};
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: 3px;
    &:hover {
      background: ${({ theme }) => theme.colors.textTertiary};
    }
  }
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => theme.colors.border} ${({ theme }) => theme.colors.bgSecondary};
`;

/**
 * Individual event item (clickable link)
 */
export const EventItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor};
  text-decoration: none;
  color: inherit;
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.bgHover};
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.accentPrimary};
    outline-offset: -2px;
  }
`;

/**
 * Event date badge with icon
 */
export const EventDate = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSizes.bodyXs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
  background: ${({ theme }) => theme.colors.bgTertiary};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  flex-shrink: 0;
  white-space: nowrap;
`;

/**
 * Event details wrapper (title + meta)
 */
export const EventDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0; /* Enables text truncation */
`;

/**
 * Event title text with truncation
 */
export const EventTitle = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  
  /* Truncate long titles */
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
`;

/**
 * Event meta info (attendees count)
 */
export const EventMeta = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSizes.bodyXs};
  color: ${({ theme }) => theme.colors.textTertiary};
`;

/**
 * Status badge with semantic colors
 * @prop {string} $bg - Background color
 * @prop {string} $color - Text color
 */
export const EventStatus = styled.span`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.bodyXs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  background: ${({ $bg }) => $bg};
  color: ${({ $color }) => $color};
  white-space: nowrap;
  flex-shrink: 0;
`;

/**
 * Empty state container
 */
export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl} ${({ theme }) => theme.spacing.lg};
  text-align: center;
  color: ${({ theme }) => theme.colors.textTertiary};
  min-height: 180px;
`;

/**
 * Empty state icon
 */
export const EmptyIcon = styled.span`
  font-size: 2rem;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  opacity: 0.6;
`;

/**
 * Empty state message
 */
export const EmptyText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  margin: 0 0 ${({ theme }) => theme.spacing.md};
`;

/**
 * Empty state action button
 */
export const EmptyAction = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.accentPrimary};
  color: ${({ theme }) => theme.colors.bgSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.bodySm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  text-decoration: none;
  transition: opacity ${({ theme }) => theme.transitions.fast};

  &:hover {
    opacity: 0.9;
  }
`;

/**
 * Loading skeleton for event list
 */
export const EventsSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};

  .skeleton-item {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
    padding: ${({ theme }) => theme.spacing.md} 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor};
    
    &:last-child {
      border-bottom: none;
    }
    
    .skeleton-date {
      width: 70px;
      height: 24px;
      border-radius: ${({ theme }) => theme.borderRadius.full};
      background: ${({ theme }) => theme.colors.bgTertiary};
      flex-shrink: 0;
    }
    
    .skeleton-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 6px;
      
      .skeleton-title {
        width: 70%;
        height: 16px;
        border-radius: ${({ theme }) => theme.borderRadius.sm};
        background: ${({ theme }) => theme.colors.bgTertiary};
      }
      
      .skeleton-meta {
        width: 40%;
        height: 12px;
        border-radius: ${({ theme }) => theme.borderRadius.sm};
        background: ${({ theme }) => theme.colors.bgTertiary};
      }
    }
    
    .skeleton-status {
      width: 60px;
      height: 20px;
      border-radius: ${({ theme }) => theme.borderRadius.full};
      background: ${({ theme }) => theme.colors.bgTertiary};
      flex-shrink: 0;
    }
  }
  
  .skeleton-date,
  .skeleton-title,
  .skeleton-meta,
  .skeleton-status {
    animation: skeletonPulse 1.5s infinite ease-in-out;
  }
  
  @keyframes skeletonPulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
`;