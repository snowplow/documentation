import React, { Children, useState, cloneElement } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { Autocomplete, TextField } from '@mui/material';
import { useColorMode } from '@docusaurus/theme-common'
import validator from '@rjsf/validator-ajv8'
import Form from '@rjsf/mui'
import Details from '@theme/Details'
import Tooltip from '@mui/material/Tooltip';
import ReactMarkdown from 'react-markdown';


import { DataGridPremium, GridToolbar, useGridApiRef, useKeepGroupedColumnsHidden, gridClasses, } from '@mui/x-data-grid-premium';
import { LicenseInfo } from '@mui/x-license-pro';

LicenseInfo.setLicenseKey(process.env.PUBLIC_MUI_LICENSE_KEY);

// Import all the schemas
function importAll(r) {
  const mods = {}
  r.keys().forEach(element => {
    mods[element.substring(2, element.length - 5)] = r(element);
  });
  return mods;
}

export const schemaImports = importAll(require.context('./Schemas/', false, /\.(json)$/));

// Theming
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
})

// Config Generator
export function JsonSchemaGenerator({ output, children, versionedSchema }) {
  const [formData, setFormData] = useState(null)
  const { colorMode, setColorMode } = useColorMode()

  if (versionedSchema === null) {
    return <></>
  }

  const versionedSchemas = {}
  Object.keys(versionedSchema.properties).forEach((property) => {
    if (versionedSchema.properties[property].group in versionedSchemas) {
      versionedSchemas[versionedSchema.properties[property].group] = { properties: { ...versionedSchemas[versionedSchema.properties[property].group].properties, [property]: versionedSchema.properties[property] }, definitions: versionedSchema.definitions }
    } else {

      if (versionedSchema.definitions) {
        versionedSchemas[versionedSchema.properties[property].group] = { properties: { [property]: versionedSchema.properties[property] }, definitions: versionedSchema.definitions }
      } else {
        versionedSchemas[versionedSchema.properties[property].group] = { properties: { [property]: versionedSchema.properties[property] } }
      }
    }
  })

  return (
    <ThemeProvider theme={colorMode === 'dark' ? darkTheme : lightTheme}>
      {children}
      <div className="JsonValidator">
        {Object.keys(versionedSchemas).map((group) => (
          <Details key={group} summary={group}>
            <Form
              experimental_defaultFormStateBehavior={{
                arrayMinItems: { populate: 'requiredOnly' },
              }}
              schema={versionedSchemas[group]}
              formData={formData}
              onChange={(e) => setFormData(e.formData)}
              validator={validator}
              showErrorList="bottom"
              liveValidate
              children={true}
            />
          </Details>
        ))}
      </div>
      {output(formData)}
    </ThemeProvider>
  )
}

// Table of config details
export function JsonToTable({ children, versionedSchema }) {
  const { colorMode, setColorMode } = useColorMode()

  if (versionedSchema === null) {
    return <></>
  }

  const properties = versionedSchema.properties;

  // Initialize an empty object to store the grouped objects
  const groupedObjects = {};

  // Iterate through the keys of the main object
  for (const key in properties) {
    const innerObject = properties[key];
    const group = innerObject.group;

    // If the group doesn't exist in the groupedObjects, create an empty array for it
    if (!groupedObjects[group]) {
      groupedObjects[group] = [];
    }

    // Push the inner object into the corresponding group
    groupedObjects[group].push(innerObject);
  }

  // column definitions for the MUI data grids
  const columns = [
    {
      field: 'variableName',
      headerName: 'Variable Name',
      description: 'The name of the variable',
      // make these code format
      renderCell: (params) => {
        if (params.value) {
          return (<div style={{ width: '100%' }}>
            <Tooltip title={'snowplow__' + params.value}><code>{params.value}</code></Tooltip>
          </div>)
        } else {
          return (<div style={{ width: '100%' }}>
            {params.value}
          </div>)
        }
      },
      flex: 0.2,
    },
    {
      field: 'longDescription',
      headerName: 'Description',
      description: 'A description of the variables usage',
      // tooltip to show the full line on hover, doing auto-height means the columns can't be autosized
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <>
            <ReactMarkdown children={params.value} />
          </>
        </Tooltip>
      ),
      flex: 1,
    },
    {
      field: 'default',
      headerName: 'Default',
      description: 'The default value in the package',
      flex: 0.2,
      renderCell: (params) => (
        <div style={{ width: '100%' }}>
          <Tooltip title={params.value}><em>{params.value}</em></Tooltip>
        </div>
      ),
    },
  ];

  // only one table needs the warehouse column
  const columnsWithWarehouse = [{
    field: 'warehouse',
    headerName: 'Warehouse',
    description: 'The warehouse the field is relevant for',
    filterable: true
  },].concat(columns)

  // generate the rows of data from the properties
  const rows = Object.keys(properties).map((list, index) => (
    { id: index, variableName: list.substring(10), longDescription: properties[list].longDescription, default: properties[list].packageDefault, group: properties[list].group, warehouse: properties[list].warehouse }
  ))

  // This just came from the MUI docs
  const apiRef = useGridApiRef();
  const initialState = useKeepGroupedColumnsHidden({
    apiRef,
    initialState: {
      rowGrouping: {
        model: ['warehouse'],
      },
      pagination: { paginationModel: { pageSize: 10 } },
    },
  });

  // Loop over all the headers and output a table for each, filtering and sorting the rows per
  return (
    <>
      {children}
      {Object.keys(groupedObjects).map((header, index) => (
        <div key={header}>
          <h3>{header}</h3>
          <DataGridPremium
            apiRef={apiRef}
            initialState={initialState}
            autosizeOnMount
            autosizeOptions={{
              columns: ['warehouse', 'variableName', 'longDescription', 'default'],
              includeOutliers: true,
              includeHeaders: true,
            }}
            getRowHeight={() => 'auto'}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            rows={rows
              .filter(row => row.group === header) // Filter rows based on 'group' property
              .sort((a, b) => a.variableName.localeCompare(b.variableName)) // Sort based on 'variableName'
            }
            columns={header != 'Warehouse Specific' ? columns : columnsWithWarehouse}
            slots={{ toolbar: GridToolbar }}
            disableColumnSelector
            disableExport
            flex
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                printOptions: { disableToolbarButton: true },
                csvOptions: { disableToolbarButton: true },
              },
            }}
            sx={{
              ".MuiDataGrid-virtualScroller": {
                borderTop: "1px solid rgba(224, 224, 224, 1)"
              },
              '.MuiDataGrid-cell': {
                borderTop: `1px solid ${colorMode !== 'dark' ? '#303030' : '#A08ACA'
                  }`,
              },
              [`& .${gridClasses.cell}`]: {
                py: 0.5,
              },
            }}
          />
          <br />
        </div>
      ))}
    </>
  )
};

export function DbtCongfigurationPage({ schemaName, versions, label, children }) {
  const [schemaVersion, setSchemaVersion] = useState(versions[0]);
  var versionedSchema = null

  if ((schemaName + '_' + schemaVersion) in schemaImports) {
    versionedSchema = schemaImports[schemaName + '_' + schemaVersion];
  }

  const childProps = Children.map(children, (child) => {
    return cloneElement(child, { schemaVersion: schemaVersion, schemaName: schemaName, versionedSchema: versionedSchema })
  })

  function SelectSchemaVersion({ versions, label }) {
    return (
      <>
        {schemaVersion === null ? <p><em>Please select a version to see the configuration options</em></p> : <></>}
        <Autocomplete
          value={schemaVersion}
          onChange={(event, newValue) => {
            setSchemaVersion(newValue);
          }}
          id="dbt-select-schema-version"
          options={versions}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label={label} />}
        />
        {versionedSchema !== null && childProps}
      </>
    );
  }

  return (
    <SelectSchemaVersion versions={versions} label={label} />
  )
}


// Function to return a list of versions from the schema folder that start with a specific name
export function getSchemaVersions(schemaName) {
    const schemaVersions = [];
    Object.keys(schemaImports).forEach((key) => {
      if (key.startsWith(schemaName)) {
        schemaVersions.push(key.split('_')[1]);
      }
    });
    // reverse it
    schemaVersions.reverse();
    return schemaVersions;
  }
