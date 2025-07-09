import React from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import EventQuery from "@site/docs/reusable/event-query/_index.md";
import { cn } from '../../lib/utils';

export default function SchemaProperties(props) {
  const schemaName = props.schema.self.name;
  const badgeText = props.overview ? (props.overview.event ? 'Event' : 'Entity') : 'Schema';
  const description = props.info || props.schema.description;
  
  return (
    <div className="flex flex-col w-full bg-card rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-border justify-start items-start overflow-hidden">
      <div className="flex self-stretch flex-row justify-between items-start gap-4 p-6">
        <div className="flex flex-col gap-1 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg text-card-foreground font-bold not-prose m-0">
              {schemaName}
            </h3>
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-normal transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-[#dcd0f1] text-[#301a56]">
              {badgeText}
            </span>
          </div>
          {description && (
            <span className="text-sm text-muted-foreground">
              {description}
            </span>
          )}
        </div>
      </div>
      <div className="p-6 pt-0 w-full">
        <div className="space-y-4">
        <div className="gap-2 text-sm leading-none font-bold flex flex-col items-start">
          <span>Schema URI</span>
          <span className="text-muted-foreground leading-snug font-normal">iglu:{props.schema.self.vendor}/{props.schema.self.name}/{props.schema.self.format}/{props.schema.self.version}</span>
        </div>
        {props.overview && (
          <div className="gap-2 text-sm leading-none font-bold flex flex-col items-start">
            <span>Tracker Compatibility</span>
            <div className="flex gap-3">
              <span className="text-sm font-normal text-muted-foreground flex-initial">Web: {props.overview.web ? '✅' : '❌'}</span>
              <span className="text-sm font-normal text-muted-foreground flex-initial">Mobile: {props.overview.mobile ? '✅' : '❌'}</span>
              <span className="text-sm font-normal text-muted-foreground flex-initial">Tracked Automatically: {(typeof props.overview.automatic === 'string') ? props.overview.automatic : (props.overview.automatic ? '✅' : '❌')}</span>
            </div>
          </div>
        )}

        {props.example && (
          <details>
            <summary className="cursor-pointer text-sm font-semibold">Example</summary>
            <div className="mt-2">
              <CodeBlock language="json">
                {JSON.stringify(props.example, null, 2)}
              </CodeBlock>
            </div>
          </details>
        )}

        <details>
          <summary className="cursor-pointer text-sm font-semibold"><b>Schema</b></summary>
          <div className="mt-2">
            <Tabs groupId="schema-view" queryString>
              <TabItem value="table" label="Table">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th>Property</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(props.schema.properties).map(property => (
                      <tr key={property}>
                        <td>
                          <code>{property}</code>
                          {props.schema.properties[property].title ? ' (' + props.schema.properties[property].title + ')' : null}<br />
                          <i>{Array.isArray(props.schema.properties[property].type) ? props.schema.properties[property].type[0] : props.schema.properties[property].type}</i>
                        </td>
                        <td>
                          <i>{(props.schema.required || []).includes(property) ? 'Required.' : 'Optional.'}</i> {props.schema.properties[property].description}
                          {props.schema.properties[property].enum && (
                            <>
                              <br />
                              Must be one of: {props.schema.properties[property].enum.map((value, index) => (
                                <React.Fragment key={index}>
                                  <code>{value}</code>
                                  {index < props.schema.properties[property].enum.length - 1 ? ', ' : ''}
                                </React.Fragment>
                              ))}
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TabItem>
              <TabItem value="json" label="JSON schema">
                <CodeBlock language="json">
                  {JSON.stringify(props.schema, null, 2)}
                </CodeBlock>
              </TabItem>
            </Tabs>
          </div>
        </details>

        {(props.overview && props.overview.event) && (
          <details>
            <summary className="cursor-pointer text-sm font-semibold"><b>Warehouse query</b></summary>
            <div className="mt-2">
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
  );
}