import React from 'react'
import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'
import CodeBlock from '@theme/CodeBlock'
import EventQuery from '@site/docs/reusable/event-query/_index.md'
import { cn } from '../../lib/utils'

export default function SchemaProperties(props) {
  const schemaName = props.schema.self.name
  const badgeText = props.overview
    ? props.overview.event
      ? 'Event'
      : 'Entity'
    : 'Schema'
  const description = props.info || props.schema.description
  const hasProperties = props.schema.properties && Object.keys(props.schema.properties).length > 0

  return (
    <div className="flex flex-col w-full bg-card rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-border justify-start items-start overflow-hidden mb-4">
      <div className="flex self-stretch flex-row justify-between items-start gap-4 p-6">
        <div className="flex flex-col gap-1 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg text-card-foreground font-bold not-prose m-0">
              {schemaName}
            </h3>
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-normal transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground">
              {badgeText}
            </span>
          </div>
          {description && (
            <span className="text-base text-muted-foreground">
              {description}
            </span>
          )}
        </div>
      </div>
      <div className="p-6 pt-0 w-full">
        <div className="space-y-4">
          <div className="gap-2 text-base leading-none font-bold flex flex-col items-start">
            <span>Schema URI</span>
            <span className="text-muted-foreground leading-snug font-normal">
              iglu:{props.schema.self.vendor}/{props.schema.self.name}/
              {props.schema.self.format}/{props.schema.self.version}
            </span>
          </div>

          {props.example && hasProperties && (
            <details>
              <summary className="cursor-pointer text-base font-semibold">
                Example
              </summary>
              <div className="mt-2 text-base">
                <CodeBlock language="json">
                  {JSON.stringify(props.example, null, 2)}
                </CodeBlock>
              </div>
            </details>
          )}

          <details>
            <summary className="cursor-pointer text-base font-semibold">
              Properties and schema
            </summary>
            <div className="mt-2">
              <Tabs
                className="text-base not-prose"
                groupId="schema-view"
                queryString
              >
                <TabItem value="table" label="Table">
                  {hasProperties ? (
                    <table className="w-full not-prose text-sm">
                      <thead>
                        <tr>
                          <th>Property</th>
                          <th>Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.keys(props.schema.properties).map((property) => (
                          <tr key={property}>
                            <td>
                              <code>{property}</code>
                              {props.schema.properties[property].title
                                ? ' (' +
                                  props.schema.properties[property].title +
                                  ')'
                                : null}
                              <br />
                              <i>
                                {Array.isArray(
                                  props.schema.properties[property].type
                                )
                                  ? props.schema.properties[property].type[0]
                                  : props.schema.properties[property].type}
                              </i>
                            </td>
                            <td>
                              <i>
                                {(props.schema.required || []).includes(property)
                                  ? 'Required.'
                                  : 'Optional.'}
                              </i>{' '}
                              {props.schema.properties[property].description}
                              {props.schema.properties[property].enum && (
                                <>
                                  <br />
                                  Must be one of:{' '}
                                  {props.schema.properties[property].enum.map(
                                    (value, index) => (
                                      <React.Fragment key={index}>
                                        <code>{value}</code>
                                        {index <
                                        props.schema.properties[property].enum
                                          .length -
                                          1
                                          ? ', '
                                          : ''}
                                      </React.Fragment>
                                    )
                                  )}
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-muted-foreground text-sm">This schema has no properties.</p>
                  )}
                </TabItem>
                <TabItem value="json" label="JSON schema">
                  <CodeBlock language="json">
                    {JSON.stringify(props.schema, null, 2)}
                  </CodeBlock>
                </TabItem>
              </Tabs>
            </div>
          </details>

          {props.overview && props.overview.event && (
            <details>
              <summary className="cursor-pointer text-base font-semibold">
                Warehouse query
              </summary>
              <div className="mt-2 text-base not-prose">
                <EventQuery
                  vendor={props.schema.self.vendor}
                  name={props.schema.self.name}
                  version={props.schema.self.version}
                />
              </div>
            </details>
          )}
        </div>
      </div>
    </div>
  )
}
