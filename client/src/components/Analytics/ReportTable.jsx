// src/components/Analytics/ReportTable.jsx
// Paginated, sortable attendance report table.
// Phase 8 update: StatusBadges for reg/attendance status, all inline styles removed.
//
// columns  : Name, Email, Student ID, Department, Session, Reg. Status,
//            Attendance, Check-In, Registered
// masking  : rows with _masked=true → email and studentId rendered as MaskedCell
// sort     : clicking any header toggles asc/desc; parent owns sort state
// pages    : parent owns page + pageSize; page-size picker uses theme-styled select

import * as S from '../../styles/Analytics/AnalyticsView.styles';
import { SkeletonLine } from '../Shared/Skeleton';

// ── Sort chevron — rotates to show asc or desc; dims when column is not active ─
const SortIcon = ({ active, dir }) => (
  <S.SortIconWrap $active={active} aria-hidden="true">
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      {dir === 'asc'
        ? <polyline points="6 15 12 9 18 15" />
        : <polyline points="6 9 12 15 18 9" />}
    </svg>
  </S.SortIconWrap>
);

const COLUMNS = [
  { key: 'fullName',           label: 'Name',        sortable: true  },
  { key: 'email',              label: 'Email',       sortable: true  },
  { key: 'studentId',          label: 'Student ID',  sortable: false },
  { key: 'department',         label: 'Department',  sortable: false },
  { key: 'sessionTitle',       label: 'Session',     sortable: false },
  { key: 'registrationStatus', label: 'Reg. Status', sortable: true  },
  { key: 'attendanceStatus',   label: 'Attendance',  sortable: false },
  { key: 'checkInTime',        label: 'Check-In',    sortable: true  },
  { key: 'registeredAt',       label: 'Registered',  sortable: true  },
];

const PAGE_SIZES = [10, 20, 50];

const ReportTable = ({
  rows = [],
  total = 0,
  page = 1,
  pageSize = 20,
  sort = 'registeredAt',
  sortDir = 'desc',
  loading,
  onPageChange,
  onPageSizeChange,
  onSort,
}) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const handleSort = (key) => {
    if (!COLUMNS.find(c => c.key === key)?.sortable) return;
    onSort(key, sort === key ? (sortDir === 'asc' ? 'desc' : 'asc') : 'asc');
  };

  // build page button array with ellipsis gaps
  const buildPageButtons = () => {
    const btns = [];
    const WING = 1;
    for (let p = 1; p <= totalPages; p++) {
      if (p === 1 || p === totalPages || (p >= page - WING && p <= page + WING)) {
        btns.push(p);
      } else if (btns[btns.length - 1] !== '…') {
        btns.push('…');
      }
    }
    return btns;
  };

  return (
    <>
      <S.TableWrapper>
        <S.Table aria-label="Attendance report">
          <S.Thead>
            <tr>
              {COLUMNS.map(col => (
                <S.Th
                  key={col.key}
                  $sortable={col.sortable}
                  onClick={() => col.sortable && handleSort(col.key)}
                  aria-sort={
                    sort === col.key
                      ? sortDir === 'asc' ? 'ascending' : 'descending'
                      : col.sortable ? 'none' : undefined
                  }
                  tabIndex={col.sortable ? 0 : undefined}
                  onKeyDown={e => col.sortable && e.key === 'Enter' && handleSort(col.key)}
                >
                  {col.label}
                  {col.sortable && (
                    <SortIcon active={sort === col.key} dir={sort === col.key ? sortDir : 'desc'} />
                  )}
                </S.Th>
              ))}
            </tr>
          </S.Thead>

          <tbody>
            {loading ? (
              // skeleton rows while data loads
              Array.from({ length: 5 }).map((_, i) => (
                <S.Tr key={`skel-${i}`} aria-hidden="true">
                  {COLUMNS.map(col => (
                    <S.Td key={col.key}>
                      <SkeletonLine
                        $h="12px"
                        $w={col.key === 'email' || col.key === 'fullName' ? '80%' : '60%'}
                        $mb="0"
                      />
                    </S.Td>
                  ))}
                </S.Tr>
              ))
            ) : !rows.length ? (
              <tr>
                {/* uses EmptyTableCell to avoid inline textAlign/padding styles */}
                <S.EmptyTableCell colSpan={COLUMNS.length}>
                  No records match the current filters.
                </S.EmptyTableCell>
              </tr>
            ) : rows.map((row, i) => (
              <S.Tr key={row.registrationId ?? i}>
                {/* Name */}
                <S.Td title={row.fullName}>{row.fullName || '—'}</S.Td>

                {/* Email — masked cell if backend returned a masked value */}
                {row._masked
                  ? <S.MaskedCell title="Masked for your role">{row.email || '—'}</S.MaskedCell>
                  : <S.Td title={row.email}>{row.email || '—'}</S.Td>}

                {/* Student ID — masked for Organizer role */}
                {row._masked
                  ? <S.MaskedCell title="Masked for your role">{row.studentId || '—'}</S.MaskedCell>
                  : <S.Td>{row.studentId || '—'}</S.Td>}

                <S.Td>{row.department || '—'}</S.Td>
                <S.Td title={row.sessionTitle}>{row.sessionTitle || 'N/A'}</S.Td>

                {/* Registration status badge */}
                <S.Td>
                  {row.registrationStatus
                    ? <S.RegStatusBadge $status={row.registrationStatus}>{row.registrationStatus}</S.RegStatusBadge>
                    : '—'}
                </S.Td>

                {/* Attendance status badge */}
                <S.Td>
                  {row.attendanceStatus
                    ? <S.AttendanceBadge $status={row.attendanceStatus}>{row.attendanceStatus}</S.AttendanceBadge>
                    : <S.AttendanceBadge $status="">Not recorded</S.AttendanceBadge>}
                </S.Td>

                <S.Td>
                  {row.checkInTime
                    ? new Date(row.checkInTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                    : '—'}
                </S.Td>

                <S.Td>
                  {row.registeredAt
                    ? new Date(row.registeredAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : '—'}
                </S.Td>
              </S.Tr>
            ))}
          </tbody>
        </S.Table>
      </S.TableWrapper>

      <S.Pagination>
        <S.PaginationInfo>
          {total === 0
            ? 'No results'
            : `Showing ${((page - 1) * pageSize) + 1}–${Math.min(page * pageSize, total)} of ${total.toLocaleString()}`}
          {' · '}
          {/* page-size picker — uses PageSizeLabel + PageSizeSelect to avoid inline styles */}
          <S.PageSizeLabel htmlFor="rt-pagesize">
            Rows:
            <S.PageSizeSelect
              id="rt-pagesize"
              value={pageSize}
              onChange={e => onPageSizeChange(Number(e.target.value))}
            >
              {PAGE_SIZES.map(n => <option key={n} value={n}>{n}</option>)}
            </S.PageSizeSelect>
          </S.PageSizeLabel>
        </S.PaginationInfo>

        <S.PaginationControls aria-label="Page navigation">
          <S.PageBtn
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1 || loading}
            aria-label="Previous page"
          >
            ‹
          </S.PageBtn>

          {buildPageButtons().map((btn, i) =>
            btn === '…'
              ? <S.PageBtn key={`ellipsis-${i}`} disabled>…</S.PageBtn>
              : (
                <S.PageBtn
                  key={btn}
                  $active={btn === page}
                  aria-current={btn === page ? 'page' : undefined}
                  onClick={() => onPageChange(btn)}
                  disabled={loading}
                >
                  {btn}
                </S.PageBtn>
              )
          )}

          <S.PageBtn
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages || loading}
            aria-label="Next page"
          >
            ›
          </S.PageBtn>
        </S.PaginationControls>
      </S.Pagination>
    </>
  );
};

export default ReportTable;
