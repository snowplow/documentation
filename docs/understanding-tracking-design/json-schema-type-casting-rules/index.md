---
title: "Type casting rules for json schemas"
date: "2021-12-30"
sidebar_position: 100
hide_table_of_contents: true
---

```mdx-code-block
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
```

_The row order in this table is important.  Type lookup stops after first match is found scanning from top to bottom (with the single exception of "null" - first row in the table)_
<Tabs groupId="type-casting">
  <TabItem value="redshift" label="Redshift" default>

<table>
<thead>
<td>Json Schema</td>
<td>Redshift Type</td>
<td>Notes</td>
</thead>
<tbody>
<tr>
<td >
<pre lang="json">&#123;<br/>
    &nbsp;&nbsp;"type": ["null", T1, ...]<br/>
&#125;</pre>
OR
<pre lang="json">&#123;<br/>
    &nbsp;&nbsp;"enum": ["null", E1, ...]<br/>
&#125;</pre>
</td>
<td >
<code>NULLABLE</code>
</td>
<td><code>"null"</code> is not considered for type casting logic. Only for nullability constraint. Type lookup will continue down the table.
</td>
</tr>
<tr>
<td>
<pre lang="json">&#123;<br/>
    &nbsp;&nbsp;"enum": [E1, E2, ...]<br/>
&#125;</pre>
</td>
<td><code>VARCHAR(M)</code></td>
<td> Where <code>M</code> is maximum size of <code>json.stringify(E*)</code><br/><br/>
<code>enum</code> contains more than <b>one</b> JavaScript type - <code>string</code>, <code>number|integer</code>, <code>boolean</code>.<br/>
For the purposes of this  <code>number</code> and <code>integer</code> are the same.<br/>
<br/>
<code>array</code>, <code>object</code>, <code>NaN</code> and other types in enum will error.   

</td>
</tr>
<tr>
<td>
<pre lang="json">&#123;<br/>
    &nbsp;&nbsp;"type": [T1, T2, ...]<br/>
&#125;</pre>
</td>
<td>
<code>VARCHAR(10)</code>
</td>
<td>
Where <code>T1, T2, ..</code>. only contains <code>"boolean"</code> <b>and</b> <code>"integer"</code>
</td>
</tr>
<tr>
<td>
<pre lang="json">&#123;<br/>
    &nbsp;&nbsp;"type": [T1, T2, ...]<br/>
&#125;</pre>
</td>
<td>
<code>VARCHAR(4096)</code>
</td>
<td></td>
</tr>
<tr>
<td>
<pre lang="json">&#123;<br/>
    &nbsp;&nbsp;"type": "string",<br/>
    &nbsp;&nbsp;"format": "date-time"<br/>
&#125;</pre>
</td>
<td>
<code>TIMESTAMP</code>
</td>
<td></td>
</tr>
<tr>
<td>
<pre lang="json">&#123;<br/>
    &nbsp;&nbsp;"type": "string",<br/>
    &nbsp;&nbsp;"format": "date"<br/>
&#125;</pre>
</td>
<td>
<code>DATE</code>
</td><td></td>
</tr>
<tr>
<td>
<pre lang="json">&#123;<br/>
    &nbsp;&nbsp;"type": "array"<br/>
&#125;</pre>
</td>
<td>
<code>VARCHAR(65535)</code>
</td><td></td>
</tr>
<tr>
<td>
<pre lang="json">&#123;<br/>
    &nbsp;&nbsp;"type": "integer",<br/>
    &nbsp;&nbsp;"maximum": M<br/>
&#125;</pre>
</td>
<td>
<code>SMALLINT</code>
</td>
<td>
Where <code>M</code> &le; 32767
</td>
</tr>
<tr>
<td>
<pre lang="json">&#123;<br/>
    &nbsp;&nbsp;"type": "integer",<br/>
    &nbsp;&nbsp;"maximum": M<br/>
&#125;</pre>
</td>
<td>
<code>INT</code>
</td>
<td>
Where 32767 &lt; <code>M</code> &le; 2147483647
</td>
</tr>
<tr>
<td>
<pre lang="json">&#123;<br/>
    &nbsp;&nbsp;"type": "integer",<br/>
    &nbsp;&nbsp;"maximum": M<br/>
&#125;</pre>
</td>
<td>
<code>BIGINT</code>
</td>
<td>
Where <code>M</code> > 2147483647
</td>
</tr>
<tr>
<td>
<pre lang="json">&#123;<br/>
    &nbsp;&nbsp;"type": "integer",<br/>
    &nbsp;&nbsp;"enum": [E1, E2, ...]<br/>
&#125;</pre>
</td>
<td>
<code>SMALLINT</code>
</td>
<td>
Where maximum <code>E*</code> &le; 32767
</td>
</tr>
<tr>
<td>
<pre lang="json">&#123;<br/>
    &nbsp;&nbsp;"type": "integer",<br/>
    &nbsp;&nbsp;"enum": [E1, E2, ...]<br/>
&#125;</pre>
</td>
<td>
<code>INT</code>
</td>
<td>
32767 &lt; maximum <code>E*</code> &le; 2147483647
</td>
</tr>
<tr>
<td>
<pre lang="json">&#123;<br/>
    &nbsp;&nbsp;"type": "integer",<br/>
    &nbsp;&nbsp;"enum": [E1, E2, ...]<br/>
&#125;</pre>
</td>
<td>
<code>BIGINT</code>
</td>
<td>
maximum <code>E*</code> &gt; 2147483647
</td>
</tr>
<tr>
<td>
<pre lang="json">&#123;<br/>
    &nbsp;&nbsp;"type": "integer"<br/>
&#125;</pre>
</td>
<td>
<code>BIGINT</code>
</td><td></td>
</tr>
<tr>
<td>
<pre lang="json">&#123;<br/>
    &nbsp;&nbsp;"multipleOf": B<br/>
&#125;</pre>
</td>
<td>
<code>INT</code>
</td><td></td>
</tr>
<tr>
<td>
<pre lang="json">&#123;<br/>
    &nbsp;&nbsp;"type": "number",<br/>
    &nbsp;&nbsp;"multipleOf": B<br/>
&#125;</pre>
</td>
<td>
<code>DECIMAL(36,2)</code>
</td>
<td>
Only works for <code>B</code>=2
</td>
</tr>
<tr>
<td>
<pre lang="json">&#123;<br/>
    &nbsp;&nbsp;"type": ["number", "integer"]<br/>
&#125;</pre>
</td>
<td>
<code>DOUBLE</code>
</td><td></td>
</tr>
<tr>
<td>
<pre lang="json">&#123;<br/>
    &nbsp;&nbsp;"type": "number"<br/>
&#125;</pre>
</td>
<td>
<code>DOUBLE</code>
</td><td></td>
</tr>
<tr>
<td>
<pre lang="json">&#123;<br/>
    &nbsp;&nbsp;"type": "boolean"<br/>
&#125;</pre>
</td>
<td><code>BOOLEAN</code></td><td></td>
</tr>
<tr>
<td>
<pre lang="json">&#123;<br/>
    &nbsp;&nbsp;"type": "string",<br/>
    &nbsp;&nbsp;"minimum": M,<br/>
    &nbsp;&nbsp;"maximum": M<br/>
&#125;</pre>
</td>
<td>
<code>CHAR(M)</code>
</td>
<td>
Where <code>M</code> is the same in maximum and maximum
</td>
</tr>
<tr>
<td>
<pre lang="json">&#123;<br/>
    &nbsp;&nbsp;"type": "string",<br/>
    &nbsp;&nbsp;"format": "uuid"<br/>
&#125;</pre>
</td>
<td>
<code>CHAR(36)</code>
</td>
</tr>
<tr>
<td>
<pre lang="json">&#123;<br/>
    &nbsp;&nbsp;"type": "string",<br/>
    &nbsp;&nbsp;"format": "ipv6"<br/>
&#125;</pre>
</td>
<td>
<code>VARCHAR(39)</code>
</td><td></td>
</tr>
<tr>
<td>
<pre lang="json">&#123;<br/>
    &nbsp;&nbsp;"type": "string",<br/>
    &nbsp;&nbsp;"format": "ipv4"<br/>
&#125;</pre>
</td>
<td>
<code>VARCHAR(15)</code>
</td><td></td>
</tr>
<tr>
<td>
<pre lang="json">&#123;<br/>
    &nbsp;&nbsp;"type": "string",<br/>
    &nbsp;&nbsp;"format": "email"<br/>
&#125;</pre>
</td>
<td>
<code>VARCHAR(255)</code>
</td><td></td>
</tr>
<tr>
<td>
<pre lang="json">&#123;<br/>
    &nbsp;&nbsp;"type": "string",<br/>
    &nbsp;&nbsp;"maxLength": M<br/>
&#125;</pre>
</td>
<td>
<code>VARCHAR(M)</code>
</td>
<td>
<code>enum</code> is not defined
</td>
</tr>
<tr>
<td>
<pre lang="json">&#123;<br/>
    &nbsp;&nbsp;"enum": ["E1"]<br/>
&#125;</pre>
</td>
<td>
<code>CHAR(M))</code>
</td>
<td>
Where <code>M</code> is the size of json.stringify("E1"). <br/>
<code>E1</code> is only element
</td>
</tr>
<tr>
<td>
<pre lang="json">&#123;<br/>
    &nbsp;&nbsp;"enum": ["E1", "E2"]<br/>
&#125;</pre>
</td>
<td>
<code>VARCHAR(M)</code>
</td>
<td>Where <code>M</code> maximum size of <code>json.stringify("E*")</code></td>
</tr>
<tr>
<td>
fallback
</td>
<td>
<code>VARCHAR(65535)</code>
</td>
<td>
Used when none of the rules above match.
</td>
</tr>
</tbody>
</table>
</TabItem>
</Tabs>