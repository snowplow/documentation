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

import { DataGridPro, GridToolbar } from '@mui/x-data-grid-pro';

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



// template that uses the group part of each property?
export const ObjectFieldTemplateGroupsGenerator2 = () => (props) => {
  // only apply difference at top level
  // console.log(props);
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
          const childProps = getPropsForGroup(groupNames[group], props)
          return (
            <>
              <Details summary={group}>
                <ObjectFieldTemplates key={group} {...childProps} />
              </Details>
            </>
          )
        })}
      </>
    )
  }
  return <ObjectFieldTemplates {...props} />
}

// Filter props to where they have the name listed in the groups fields
export const getPropsForGroup = (groupValues, props) => {
  console.log(groupValues)
  console.log(props)
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

// Section for drop down button
export function SelectSchemaVersion({ onChange, versions, label}) {

  return (
    <>
      <Autocomplete
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

export const JsonSchemaGenerator = (props) => {
  const [formData, setFormData] = React.useState(null)
  const { colorMode, setColorMode } = useColorMode()
  console.log(props)
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

  const columns = [
    {
      field: 'variableName',
      headerName: 'Variable Name',
      description: 'The name of the variable',
      renderCell: (params) => (
        <Tooltip title={'snowplow__' + params.value}><code>{params.value}</code></Tooltip>
      ),
    },
    {
      field: 'longDescription',
      headerName: 'Description',
      description: 'A description of the variables usage',
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span>{params.value}</span>
        </Tooltip>
      ),
      flex: 1
    },
    {
      field: 'default',
      headerName: 'Default',
      description: 'The default value in the package'
    },
  ];

  const columnsWithWarehouse = [{
    field: 'warehouse',
    headerName: 'Warehouse',
    description: 'The warehouse the field is relevant for',
    filterable: true
  },].concat(columns)

  const rows = Object.keys(properties).map((list, index) => (
    { id: index, variableName: list.substring(10), longDescription: properties[list].longDescription, default: properties[list].packageDefault, group: properties[list].group, warehouse: properties[list].warehouse }
  ))

  return (
    <>
      {Object.keys(groupedObjects).map((header, index) => (
        <>
          <h3>{header}</h3>
          <DataGridPro
            autosizeOnMount
            autosizeOptions={{
              columns: ['variableName', 'longDescription', 'default'],
              includeOutliers: true,
              includeHeaders: false,
            }}
            pagination
            initialState={{
              ...data.initialState,
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            rows={rows
              .filter(row => row.group === header) // Filter rows based on 'group' property
              .sort((a, b) => a.variableName.localeCompare(b.variableName)) // Sort based on 'variableName'
            }
            columns={header != 'Warehouse Specific' ? columns : columnsWithWarehouse}
            slots={{ toolbar: GridToolbar }}
            disableColumnSelector
            disableExport
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
                borderRight: `1px solid ${
                  colorMode !== 'dark' ? '#E0E0E0' : '#303030'
                }`,
              },
            }}
          />
        </>
      ))}
    </>
  )
};

export const DbtCongfigurationPage = ({ schemaName, versions, label, output, group }) => {
  const [schemaVersion, setSchemaVersion] = React.useState(null);

  if (schemaVersion === null || schemaVersion === undefined) {
    return (<>
      <SelectSchemaVersion onChange={setSchemaVersion} versions={versions} label={label} />
      <p>Please select a version to see the configuration options</p>
    </>
    )
  }

  const versionedSchema = schemaImports[schemaName + '_' + schemaVersion].Schema;

  return (
    <>
      <SelectSchemaVersion onChange={setSchemaVersion} versions={versions} label={label} />
      <JsonToTable data={versionedSchema} />
      <JsonSchemaGenerator versionedSchema={versionedSchema} group={group} output={output} />
    </>
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
