import styled from 'styled-components';

// token keys for each status — no hardcoded colors
const STATUS_MAP = {
  Confirmed: { bg: 'successBg',  text: 'success'       },
  Pending: { bg: 'warningBg',  text: 'warning'       },
  Cancelled: { bg: 'errorBg',    text: 'error'         },
  Upcoming: { bg: 'infoBg',     text: 'info'          },
  Ongoing: { bg: 'successBg',  text: 'success'       },
  Completed: { bg: 'bgTertiary', text: 'textSecondary' },
  Draft: { bg: 'bgTertiary', text: 'textTertiary'  },
  Present: { bg: 'successBg',  text: 'success'       },
  Late: { bg: 'warningBg',  text: 'warning'       },
  Absent: { bg: 'errorBg',    text: 'error'         },
};

// no border per spec — background + text only
const Badge = styled.span`
  display: inline-block;
  padding: 2px 10px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.bodyXs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  background: ${({ $bg, theme }) => theme.colors[$bg] || theme.colors.bgTertiary};
  color: ${({ $text, theme }) => theme.colors[$text] || theme.colors.textSecondary};
  white-space: nowrap;
`;

const StatusBadge = ({ status, className }) => {
  const { bg, text } = STATUS_MAP[status] || { bg: 'bgTertiary', text: 'textSecondary' };
  return (
    <Badge $bg={bg} $text={text} className={className} aria-label={`Status: ${status}`}>
      {status}
    </Badge>
  );
};

export default StatusBadge;
