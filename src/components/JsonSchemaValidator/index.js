import React, { useEffect, useState } from 'react'
import { Templates } from '@rjsf/mui'
import { RJSFSchema } from '@rjsf/utils'
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

LicenseInfo.setLicenseKey("a3d6a1e3cdca760ace01b65d01608642Tz03MTE1NixFPTE3MjE1NDQ2NzEwMDAsUz1wcmVtaXVtLExNPXN1YnNjcmlwdGlvbixLVj0y");


// Import all the schemas 
function importAll(r) {
  const mods = {}
  r.keys().forEach(element => {
    mods[element.substring(2, element.length - 3)] = r(element);
  });
  return mods;
}

export const schemaImports = importAll(require.context('./Schemas/', false, /\.(js)$/));


// Allow for grouping of items into collapsible fields
// Get default object field template to pass to
export const ObjectFieldTemplates = Templates.ObjectFieldTemplate


// template that uses the group part of each property as a detail block
export const ObjectFieldTemplateGroupsGenerator2 = () => (props) => {
  // only apply difference at top level
  if (props.idSchema['$id'] === 'root') {
    // Get all the group names in a dict, with each field in the array that is the key
    const groupNames = {};
    Object.keys(props.schema.properties).forEach((key, index) => {
      if (props.schema.properties[key].group in groupNames) {
        groupNames[props.schema.properties[key].group].push(key)
      } else { //Need to add the key and the array
        groupNames[props.schema.properties[key].group] = [key]
      }
    })
    return (
      <>
        {Object.keys(groupNames).map((group, index) => {
          // filter to just the relevant props
          const childProps = getPropsForGroup2(groupNames[group], props)
          return (
            <Details key={group} summary={group}>
              <ObjectFieldTemplates key={group} {...childProps} />
            </Details>
          )
        })}
      </>
    )
  }
  return <ObjectFieldTemplates {...props} />
}

// Filter props to where they have the name listed in the groups fields
export const getPropsForGroup2 = (groupValues, props) => {
  return {
    ...props,
    properties: props.properties.filter((p) => groupValues.includes(p.name)).sort((a, b) => a.name.localeCompare(b.name)),
  }
}

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

// Drop down button
export function SelectSchemaVersion({ value, onChange, versions, label }) {

  return (
    <>
      <Autocomplete
        value={value}
        disablePortal
        id="dbt-select-schema-version"
        options={versions}
        onChange={
          (event, newValue) => {
            { onChange(newValue) };
          }
        }
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label={label} />}
      />
    </>
  );
}

// Config Generator
export const JsonSchemaGenerator = (props) => {
  const [formData, setFormData] = React.useState(null)
  const { colorMode, setColorMode } = useColorMode()
  return (
    <>
      <ThemeProvider theme={colorMode === 'dark' ? darkTheme : lightTheme}>
        <div className="JsonValidator">
          <Form
            experimental_defaultFormStateBehavior={{
              arrayMinItems: { populate: 'requiredOnly' },
            }}
            schema={props.versionedSchema}
            formData={formData}
            onChange={(e) => setFormData(e.formData)}
            validator={validator}
            showErrorList="bottom"
            templates={{
              ObjectFieldTemplate: props.group
                ? ObjectFieldTemplateGroupsGenerator2()
                : ObjectFieldTemplates,
            }}
            liveValidate
            {...props}
          >
            <div />
          </Form>
        </div>
        {props.output(formData)}
      </ThemeProvider>
    </>
  )
}

// Table of config details
export function JsonToTable({ data }) {
  const { colorMode, setColorMode } = useColorMode()
  const properties = data.properties;

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
        if (params.value){
        return(<div style={{ width: '100%' }}>
          <Tooltip title={'snowplow__' + params.value}><code>{params.value}</code></Tooltip>
        </div>)
        } else {
        return(<div style={{ width: '100%' }}>
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
          <ReactMarkdown children={params.value} />
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
      ...data.initialState,
      pagination: { paginationModel: { pageSize: 10 } },
    },
  });

  // Loop over all the headers and output a table for each, filtering and sorting the rows per
  return (
    <>
      {Object.keys(groupedObjects).map((header, index) => (
        <>
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
            pagination
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
        </>
      ))}
    </>
  )
};

export const DbtCongfigurationPage = ({ schemaName, versions, label, output, group }) => {
  const [schemaVersion, setSchemaVersion] = React.useState(versions[0]);

  if (schemaVersion === null || schemaVersion === undefined) {
    return ([false,
      <>
        <SelectSchemaVersion value={schemaVersion} onChange={setSchemaVersion} versions={versions} label={label} />
        <p><em>Please select a version to see the configuration options</em></p>
      </>,
      <></>,
      <></>]
    )
  }

  const versionedSchema = schemaImports[schemaName + '_' + schemaVersion].Schema;

  return (
    [
      true,
      <SelectSchemaVersion value={schemaVersion} onChange={setSchemaVersion} versions={versions} label={label} />,
      <JsonToTable data={versionedSchema} />,
      <JsonSchemaGenerator versionedSchema={versionedSchema} group={group} output={output} />,
    ]
  )

}



// DEPRECATED, to remove from all places
export const JsonApp = (props) => {
  // Props should contain:
  // props.schema - the schema to validate against
  // props.template - the template to use, if provided
  // props.output - a function that renders an output, taking the formData as an input
  const [formData, setFormData] = React.useState(null)
  const { colorMode, setColorMode } = useColorMode()

  return (
    <>
      <ThemeProvider theme={colorMode === 'dark' ? darkTheme : lightTheme}>
        <div className="JsonValidator">
          <Form
            experimental_defaultFormStateBehavior={{
              arrayMinItems: { populate: 'requiredOnly' },
            }}
            schema={props.schema}
            formData={formData}
            onChange={(e) => setFormData(e.formData)}
            validator={validator}
            showErrorList="bottom"
            templates={{
              ObjectFieldTemplate: props.template
                ? props.template
                : ObjectFieldTemplates,
            }}
            liveValidate
            {...props}
          >
            <div />
          </Form>
        </div>
        {props.output(formData)}
      </ThemeProvider>
    </>
  )
}

// DEPRECATED, to remove from all places
// generator to make a function that is a object field template valid function
export const ObjectFieldTemplateGroupsGenerator = (groups) => (props) => {
  // only apply difference at top level
  if (props.idSchema['$id'] === 'root') {
    return (
      <>
        {groups.map((group, index) => {
          // filter to just the relevant props
          const childProps = getPropsForGroup(group, props)
          return (
            <>
              <Details summary={group.title}>
                <ObjectFieldTemplates key={group.title} {...childProps} />
              </Details>
            </>
          )
        })}
      </>
    )
  }
  return <ObjectFieldTemplates {...props} />
}

// DEPRECATED, to remove from all places
// Filter props to where they have the name listed in the groups fields
export const getPropsForGroup = (group, props) => {
  return {
    ...props,
    properties: props.properties.filter((p) => group.fields.includes(p.name)).sort((a, b) => a.name.localeCompare(b.name)),
  }
}
