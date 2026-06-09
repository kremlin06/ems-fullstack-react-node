// Class component — React render errors can only be caught by class-based
// error boundaries; hooks cannot fulfill this role.
//
// IMPORTANT: this component is mounted in main.jsx ABOVE StyledThemeProvider,
// so its styled-components have no theme context when rendering the fallback.
// every theme access uses optional chaining (?.) + a dark-mode fallback value
// so the error screen never itself crashes.
//
// dev mode: shows a detailed crash report with component stack.
// prod mode: shows a minimal friendly message with a reload button.
import { Component } from 'react';
import styled from 'styled-components';

// styled components — all theme accesses guarded with ?. + dark fallback

const Shell = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: ${({ theme }) => theme?.colors?.bgPrimary ?? '#0a0a0a'};
`;

const Card = styled.div`
  max-width: 520px;
  width: 100%;
  background: ${({ theme }) => theme?.colors?.cardBg ?? '#111111'};
  border: 1px solid ${({ theme }) => theme?.colors?.borderColor ?? '#27272a'};
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: ${({ theme }) => theme?.colors?.shadowMd ?? '0 4px 12px rgba(0,0,0,0.4)'};
  text-align: center;
`;

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme?.colors?.textPrimary   ?? '#ffffff'};
  margin: 0 0 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme?.colors?.textTertiary  ?? '#71717a'};
  margin: 0 0 1.5rem;
  line-height: 1.5;
`;

const ReloadBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background: ${({ theme }) => theme?.colors?.accentPrimary ?? '#3b82f6'};
  color: #fff;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme?.colors?.accentHover  ?? '#60a5fa'};
  }
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme?.colors?.accentPrimary ?? '#3b82f6'};
    outline-offset: 3px;
  }
`;

// dev-only detail block
const DevDetail = styled.details`
  margin-top: 1.5rem;
  text-align: left;
`;

const DevSummary = styled.summary`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme?.colors?.error         ?? '#ef4444'};
  cursor: pointer;
  margin-bottom: 0.5rem;
`;

const PreBlock = styled.pre`
  font-size: 0.7rem;
  line-height: 1.5;
  color: ${({ theme }) => theme?.colors?.textSecondary ?? '#a1a1aa'};
  background: ${({ theme }) => theme?.colors?.bgTertiary    ?? '#1a1a1a'};
  border: 1px solid ${({ theme }) => theme?.colors?.borderColor ?? '#27272a'};
  border-radius: 6px;
  padding: 0.75rem;
  overflow: auto;
  max-height: 240px;
  white-space: pre-wrap;
  word-break: break-word;
`;

// component

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, componentStack: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    this.setState({ componentStack: info.componentStack });

    // in production, send the error to the server-side logger via a fire-and-forget fetch
    if (import.meta.env.PROD) {
      try {
        fetch('/api/logs/client-error', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // 5s timeout — if the server is unreachable just move on
          signal: AbortSignal.timeout?.(5000),
          body: JSON.stringify({
            message: error?.message,
            stack: error?.stack,
            componentStack: info.componentStack,
            url: window.location.href,
          }),
        }).catch(() => {/* silently swallow network failures */});
      } catch {
        // silently swallow any synchronous error from fetch setup
      }
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const isDev = import.meta.env.DEV;

    return (
      <Shell>
        <Card role="alert" aria-live="assertive">
          <Title>Something went wrong</Title>
          <Subtitle>
            {isDev
              ? 'A render error occurred. See the details below.'
              : 'An unexpected error occurred. Please reload the page or contact support if the issue persists.'}
          </Subtitle>

          <ReloadBtn onClick={() => window.location.reload()}>
            Reload page
          </ReloadBtn>

          {isDev && (
            <DevDetail>
              <DevSummary>
                {this.state.error?.message || 'Unknown error'} (click to expand)
              </DevSummary>
              <PreBlock>
                {this.state.error?.stack}
                {this.state.componentStack && (
                  `\n\nComponent stack:${this.state.componentStack}`
                )}
              </PreBlock>
            </DevDetail>
          )}
        </Card>
      </Shell>
    );
  }
}

export default ErrorBoundary;
