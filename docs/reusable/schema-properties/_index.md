```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import CodeBlock from '@theme/CodeBlock';
import Admonition from '@theme/Admonition';
import PayloadExample from "@site/docs/reusable/payload-example/_index.md"
import EventQuery from "@site/docs/reusable/event-query/_index.md"
```

<Admonition type="note" title={(props.overview ? (props.overview.event ? 'Event': 'Context entity') : 'Schema') + ': ' + props.schema.self.name}>
  <p>{props.info || props.schema.description}</p>
  <p>
    Schema URI: <code>
    iglu://{props.schema.self.vendor}/{props.schema.self.name}/{props.schema.self.format}/{props.schema.self.version}
    </code>
  </p>
  {
    props.overview ?  (<table>
      <thead>
        <tr>
          <th>Web</th>
          <th>Mobile</th>
          <th>Tracked automatically</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            {props.overview.web ? '✅' : '❌'}
          </td>
          <td>
            {props.overview.mobile ? '✅' : '❌'}
          </td>
          <td>
            {props.overview.automatic ? '✅' : '❌'}
          </td>
        </tr>
      </tbody>
    </table>) : null
    }
    {props.example ? <><p><b>Example:</b></p> <PayloadExample example={props.example} /></> : null }

  <details>
    <summary>📃 Schema properties definition</summary>
  <div>

  <Tabs groupId="schema-view" queryString>
  <TabItem value="table" label="Table">

  <table>
    <thead>
      <tr>
        <th>Property</th>
        <th>Type</th>
        <th>Description</th>
        <th>Required?</th>
      </tr>
    </thead>
    <tbody>
      {Object.keys(props.schema.properties).map(property => (<tr>
        <td>
          <code>{property}</code>
          {props.schema.properties[property].title ? ' (' + props.schema.properties[property].title + ')' : null}
        </td>
        <td>
          {props.schema.properties[property].enum ? 'One of: ' + props.schema.properties[property].enum.join(', ') : <code>
            {JSON.stringify(props.schema.properties[property].type)}
          </code>}
        </td>
        <td>
          {props.schema.properties[property].description}
        </td>
        <td>
          {(props.schema.required || []).includes(property) ? '✅' : '❌'}
        </td>
      </tr>))}
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

<>{(props.overview && props.overview.event) ? (<details>
  <summary>❓ How to query the event in the warehouse?</summary>
  <div>
    <EventQuery
      vendor={props.schema.self.vendor}
      name={props.schema.self.name}
      version={props.schema.self.version} />
  </div>
</details>) : null}</>

</Admonition>
