import React from 'react';
import { DataGridPremium } from '@mui/x-data-grid-premium';
import { LicenseInfo } from '@mui/x-license-pro';

LicenseInfo.setLicenseKey(process.env.PUBLIC_MUI_LICENSE_KEY);

const MarkdownTableToMuiDataGrid = (markdownTable, datagridProps = {}) => {
  // Split the markdown table into rows
  const rows = markdownTable.split('\n').filter(row => row.trim() !== '');

  // Extract header and data
  const header = rows[0].split('|').filter(cell => cell.trim() !== '');
  const data = rows.slice(2).map(row => row.split('|').filter(cell => cell.trim() !== ''));
  // Create MUI DataGrid columns
  const columns = header.map((col, index) => ({
    field: `col${index}`,
    headerName: col.trim(),
    flex: 1,
  }));

  // Create MUI DataGrid rows
  const gridData = data.map((row, rowIndex) => ({
    id: rowIndex,
    ...row.reduce((acc, cell, colIndex) => {
      acc[`col${colIndex}`] = cell.trim();
      return acc;
    }, {}),
  }));

  return (
    <div style={{  width: '100%' }}>
      <DataGridPremium
        rows={gridData}
        columns={columns}
        autoHeight
        density="compact"
        {...datagridProps}
      />
      <br/>
    </div>
  );
};

export default MarkdownTableToMuiDataGrid;
