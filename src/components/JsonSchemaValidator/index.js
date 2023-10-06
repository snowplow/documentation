import React, { useEffect, useState } from 'react'
import { Templates } from '@rjsf/mui'
import { RJSFSchema } from '@rjsf/utils'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { useColorMode } from '@docusaurus/theme-common'
import validator from '@rjsf/validator-ajv8'
import Form from '@rjsf/mui'
import Details from '@theme/Details'
// Allow for grouping of items into collapsible fields
// Get default object field template to pass to
export const ObjectFieldTemplates = Templates.ObjectFieldTemplate

// generator to make a function that is a object field template valid function
export const ObjectFieldTemplateGroupsGenerator = (groups) => (props) => {
  // only apply difference at top level
  if (props.idSchema['$id'] === 'root') {
    return (
      <>
        {groups.map((group) => {
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

// Filter props to where they have the name listed in the groups fields
export const getPropsForGroup = (group, props) => {
  return {
    ...props,
    properties: props.properties.filter((p) => group.fields.includes(p.name)).sort((a, b) => a.name.localeCompare(b.name)),
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

// main applet
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
