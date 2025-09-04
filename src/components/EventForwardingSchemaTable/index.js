import React from 'react';

export default function EventForwardingSchemaTable({ schema }) {
  if (!schema) {
    return <p>No schema provided.</p>;
  }

  // Handle array schemas (like Braze purchases)
  let properties, requiredFields, schemaForConditionals;
  if (schema.type === 'array' && schema.items && schema.items.properties) {
    properties = schema.items.properties;
    requiredFields = schema.items.required || [];
    schemaForConditionals = schema.items;
  } else if (schema.properties) {
    properties = schema.properties;
    requiredFields = schema.required || [];
    schemaForConditionals = schema;
  } else {
    return <p>No schema properties found.</p>;
  }
  
  // Check for conditional requirements (anyOf/oneOf)
  const conditionallyRequired = new Set();
  if (schemaForConditionals.anyOf) {
    schemaForConditionals.anyOf.forEach(condition => {
      if (condition.oneOf) {
        condition.oneOf.forEach(subCondition => {
          if (subCondition.required) {
            subCondition.required.forEach(field => conditionallyRequired.add(field));
          }
        });
      }
      if (condition.required) {
        condition.required.forEach(field => conditionallyRequired.add(field));
      }
    });
  }
  
  if (schemaForConditionals.oneOf) {
    schemaForConditionals.oneOf.forEach(condition => {
      if (condition.required) {
        condition.required.forEach(field => conditionallyRequired.add(field));
      }
    });
  }

  const formatType = (property) => {
    if (property.type === 'array' && property.items) {
      return `array of ${property.items.type || 'object'}`;
    }
    return property.type || 'unknown';
  };

  const formatDefault = (property) => {
    if (property.consoleDefault) {
      return <code>{property.consoleDefault}</code>;
    }
    if (property.default !== undefined) {
      if (typeof property.default === 'string') {
        return <code>"{property.default}"</code>;
      }
      return <code>{property.default}</code>;
    }
    return 'N/A';
  };

  const isRequired = (fieldName, parentRequired = requiredFields) => {
    // Don't mark as required if it's conditionally required (anyOf/oneOf)
    if (conditionallyRequired.has(fieldName)) {
      return false;
    }
    return parentRequired.includes(fieldName);
  };

  const formatEnums = (property) => {
    if (property.enum) {
      const enumValues = property.enum.map(value => 
        value === null ? <code key={value}>null</code> : <code key={value}>{value}</code>
      );
      return (
        <>
          <br />Must be one of: {enumValues.reduce((prev, curr, index) => 
            index === 0 ? [curr] : [...prev, ', ', curr], []
          )}
        </>
      );
    }
    return null;
  };

  const renderPropertyRow = (fieldName, property, parentRequired = requiredFields, parentFieldPath = '', isNested = false) => {
    const type = formatType(property);
    const required = isRequired(fieldName, parentRequired);
    const defaultValue = formatDefault(property);
    const enumInfo = formatEnums(property);
    
    const requiredText = required ? <><em>Required.</em> </> : <><em>Optional.</em> </>;
    const description = property.description || '';
    
    const fullFieldPath = parentFieldPath ? `${parentFieldPath}.${fieldName}` : fieldName;
    const rowKey = fullFieldPath;
    const displayName = isNested ? fullFieldPath : fieldName;
    
    const rows = [(
      <tr key={rowKey}>
        <td>{isNested ? '↳ ' : ''}<code>{displayName}</code> <em>({type})</em></td>
        <td>
          {requiredText}{description}{enumInfo}<br />
          Default: {defaultValue}
        </td>
      </tr>
    )];
    
    // Handle nested object properties
    if (property.type === 'object' && property.properties) {
      const nestedRequired = property.required || [];
      Object.entries(property.properties).forEach(([nestedFieldName, nestedProperty]) => {
        rows.push(...renderPropertyRow(nestedFieldName, nestedProperty, nestedRequired, fullFieldPath, true));
      });
    }
    
    return rows;
  };

  const renderTableRows = () => {
    const allRows = [];
    Object.entries(properties).forEach(([fieldName, property]) => {
      allRows.push(...renderPropertyRow(fieldName, property));
    });
    return allRows;
  };

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
          {renderTableRows()}
        </tbody>
      </table>
    </div>
  );
}