// src/components/Analytics/ReportFilters.jsx
// Vertical filter sections for the Analytics Filter Side Panel (Blueprint 8).
// Renders as a React fragment — no outer container — so the parent can place
// these sections inside either FilterSidePanel (desktop) or FilterDrawerBody (mobile).
//
// old: horizontal FilterBar with flex-wrap layout
// new: stacked FilterSectionGroup sections that fit a narrow 258px side panel

import * as S from '../../styles/Analytics/AnalyticsView.styles';
import { SearchSVG } from '../SVGs';

const ReportFilters = ({ filters, events, sessions, onFilterChange, loading }) => {
  const set = (key, value) => onFilterChange({ ...filters, [key]: value || undefined });

  return (
    <>
      {/* Event selector */}
      <S.FilterSectionGroup>
        <S.FilterSectionLabel htmlFor="rf-event">Event</S.FilterSectionLabel>
        <S.FilterSelectWrap>
          <S.FilterSelect
            id="rf-event"
            value={filters.eventId || ''}
            onChange={e =>
              onFilterChange({ ...filters, eventId: e.target.value || undefined, sessionId: undefined })
            }
            disabled={loading}
          >
            <option value="">All events</option>
            {events.map(ev => (
              <option key={ev.id} value={ev.id}>{ev.title ?? ev.name}</option>
            ))}
          </S.FilterSelect>
        </S.FilterSelectWrap>
      </S.FilterSectionGroup>

      {/* Session selector — disabled until an event is chosen */}
      <S.FilterSectionGroup>
        <S.FilterSectionLabel htmlFor="rf-session">Session</S.FilterSectionLabel>
        <S.FilterSelectWrap>
          <S.FilterSelect
            id="rf-session"
            value={filters.sessionId || ''}
            onChange={e => set('sessionId', e.target.value)}
            disabled={loading || !filters.eventId}
          >
            <option value="">All sessions</option>
            {sessions.map(s => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </S.FilterSelect>
        </S.FilterSelectWrap>
      </S.FilterSectionGroup>

      {/* Date range: From → To */}
      <S.FilterSectionGroup>
        <S.FilterSectionLabel>Date Range</S.FilterSectionLabel>
        <S.FilterInput
          id="rf-start"
          type="date"
          value={filters.startDate || ''}
          onChange={e => set('startDate', e.target.value)}
          disabled={loading}
          aria-label="Start date"
        />
        <S.FilterDateSep aria-hidden="true">to</S.FilterDateSep>
        <S.FilterInput
          id="rf-end"
          type="date"
          value={filters.endDate || ''}
          onChange={e => set('endDate', e.target.value)}
          min={filters.startDate || undefined}
          disabled={loading}
          aria-label="End date"
        />
      </S.FilterSectionGroup>

      {/* Text search — debounced 300ms in parent */}
      <S.FilterSectionGroup>
        <S.FilterLabelWithIcon htmlFor="rf-q">
          <SearchSVG size={12} aria-hidden="true" />
          Search
        </S.FilterLabelWithIcon>
        <S.FilterInput
          id="rf-q"
          type="search"
          placeholder="Name, email, student ID..."
          value={filters.q || ''}
          onChange={e => set('q', e.target.value)}
          disabled={loading}
          aria-label="Search by name, email, or student ID"
        />
      </S.FilterSectionGroup>
    </>
  );
};

export default ReportFilters;
