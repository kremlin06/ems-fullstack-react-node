import { useState } from 'react';
import { exportReport } from '../../services/analytics';
import * as S from '../../styles/Analytics/AnalyticsView.styles';

const DownloadSVG = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const ExportButton = ({ filters, disabled }) => {
  const [exportingCsv, setExportingCsv] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);

  const handleExport = async (format) => {
    const setter = format === 'csv' ? setExportingCsv : setExportingPdf;
    setter(true);
    try {
      await exportReport({ ...filters, format, limit: 10000 });
    } catch (err) {
      console.error('[ExportButton] export failed:', err);
    } finally {
      setter(false);
    }
  };

  const busy = exportingCsv || exportingPdf;

  return (
    <S.ExportGroup>
      <S.ExportBtn
        onClick={() => handleExport('csv')}
        disabled={disabled || busy}
        aria-label="Export report as CSV"
        title="Export as CSV"
      >
        {exportingCsv ? <S.Spinner aria-hidden="true" /> : <DownloadSVG />}
        CSV
      </S.ExportBtn>
      <S.ExportBtn
        onClick={() => handleExport('pdf')}
        disabled={disabled || busy}
        aria-label="Export report as PDF"
        title="Export as PDF"
      >
        {exportingPdf ? <S.Spinner aria-hidden="true" /> : <DownloadSVG />}
        PDF
      </S.ExportBtn>
    </S.ExportGroup>
  );
};

export default ExportButton;
