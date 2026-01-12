// Utility functions
const formatType = (property) => {
  if (property.type === 'array' && property.items) {
    return `array of ${property.items.type || 'object'}`
  }
  return property.type || 'unknown'
}

const formatDefaultValue = (property) => {
  if (property.consoleDefault) {
    return <code>{property.consoleDefault}</code>
  }
  if (property.default !== undefined) {
    const value =
      typeof property.default === 'string'
        ? `"${property.default}"`
        : property.default
    return <code>{value}</code>
  }
  return null
}

const hasDefaultValue = (property) => {
  return property.consoleDefault || property.default !== undefined
}

const formatEnumValues = (property) => {
  if (!property.enum) return null

  const enumValues = property.enum.map((value) =>
    value === null ? (
      <code key="null">null</code>
    ) : (
      <code key={value}>{value}</code>
    )
  )

  return (
    <>
      Must be one of:{' '}
      {enumValues.reduce(
        (prev, curr, index) => (index === 0 ? [curr] : [...prev, ', ', curr]),
        []
      )}
    </>
  )
}

const renderMarkdownCode = (text) => {
  if (!text) return text

  const parts = text.split(/(`[^`]+`)/g)

  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      const codeContent = part.slice(1, -1)
      return <code key={index}>{codeContent}</code>
    }
    return part
  })
}

// Schema parsing functions
const parseSchemaStructure = (schema) => {
  if (!schema) {
    return { properties: null, requiredFields: [], schemaForConditionals: null }
  }

  // Handle array schemas (like Braze purchases)
  if (schema.type === 'array' && schema.items?.properties) {
    return {
      properties: schema.items.properties,
      requiredFields: schema.items.required || [],
      schemaForConditionals: schema.items,
    }
  }

  // Handle object schemas
  if (schema.properties) {
    return {
      properties: schema.properties,
      requiredFields: schema.required || [],
      schemaForConditionals: schema,
    }
  }

  return { properties: null, requiredFields: [], schemaForConditionals: null }
}

const extractConditionallyRequiredFields = (schema) => {
  const conditionallyRequiredFields = new Set()

  const processConditions = (conditions) => {
    conditions?.forEach((condition) => {
      if (condition.oneOf) {
        condition.oneOf.forEach((subCondition) => {
          subCondition.required?.forEach((field) =>
            conditionallyRequiredFields.add(field)
          )
        })
      }
      condition.required?.forEach((field) =>
        conditionallyRequiredFields.add(field)
      )
    })
  }

  processConditions(schema.anyOf)
  processConditions(schema.oneOf)

  return conditionallyRequiredFields
}

export default function EventForwardingSchemaTable({ schema }) {
  const { properties, requiredFields, schemaForConditionals } =
    parseSchemaStructure(schema)

  const conditionallyRequiredFields = extractConditionallyRequiredFields(
    schemaForConditionals || {}
  )

  const isFieldRequired = (
    fieldName,
    parentRequiredFields = requiredFields
  ) => {
    // Don't mark as required if it's conditionally required (anyOf/oneOf)
    if (conditionallyRequiredFields.has(fieldName)) {
      return false
    }
    return parentRequiredFields.includes(fieldName)
  }

  const sortedProperties = !properties
    ? []
    : Object.entries(properties).sort(([fieldNameA], [fieldNameB]) => {
        const isRequiredA = isFieldRequired(fieldNameA)
        const isRequiredB = isFieldRequired(fieldNameB)
        if (isRequiredA && !isRequiredB) return -1
        if (!isRequiredA && isRequiredB) return 1
        return 0
      })

  // Early returns for invalid schemas
  if (!schema) {
    return <p>No schema provided.</p>
  }

  if (!properties) {
    return <p>No schema properties found.</p>
  }

  const renderNestedProperties = (nestedProps, nestedRequiredFields = []) => (
    <>
      Properties:
      <ul>
        {Object.entries(nestedProps).map(([fieldName, property]) => {
          const type = formatType(property)
          const isRequired = isFieldRequired(fieldName, nestedRequiredFields)
          const requirementLabel = isRequired ? ', required' : ', optional'
          const enumInfo = formatEnumValues(property)
          const defaultValue = formatDefaultValue(property)
          return (
            <li key={fieldName}>
              <code>{fieldName}</code> ({type}
              {requirementLabel}):{' '}
              {renderMarkdownCode(property.description) || ''}
              {enumInfo && (
                <>
                  <br />
                  {enumInfo}
                </>
              )}
              {hasDefaultValue(property) && (
                <>
                  <br />
                  Default mapping: {defaultValue}
                </>
              )}
            </li>
          )
        })}
      </ul>
    </>
  )

  const renderPropertyRow = (fieldName, property) => {
    const type = formatType(property)
    const isRequired = isFieldRequired(fieldName)
    const defaultValue = formatDefaultValue(property)
    const enumInfo = formatEnumValues(property)
    const description = property.description || ''

    const requirementLabel = isRequired ? (
      <>
        <em>Required.</em>{' '}
      </>
    ) : (
      <>
        <em>Optional.</em>{' '}
      </>
    )

    return (
      <tr key={fieldName}>
        <td>
          <code>{fieldName}</code>
          <br />
          <em>{type}</em>
        </td>
        <td>
          <p>
            {requirementLabel}
            {renderMarkdownCode(description)} {enumInfo}
          </p>
          {hasDefaultValue(property) && <>Default mapping: {defaultValue}</>}
          {property.type === 'object' &&
            property.properties &&
            renderNestedProperties(
              property.properties,
              property.required || []
            )}
        </td>
      </tr>
    )
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Field</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {sortedProperties.map(([fieldName, property]) =>
            renderPropertyRow(fieldName, property)
          )}
        </tbody>
      </table>
    </div>
  )
}
