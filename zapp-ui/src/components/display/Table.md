The Table component can be used to list long lists.

Each element of *headers* property represent a column in the head section of the table.
If *items* is provided the column will render the *label* provided as a **Select** component, otherwise as a string.

The *HeaderFactory* is responsible of rendering the head of the Table and it receives these parameters:

- items: array - Each item of items represent a column of the header
- onChange: func - Callback of select all rows
- allSelected: bool - Whether or not all elements of the table are selected
- selectionMode: bool - Whether or not the table is in selection mode

The *RowFactory* is responsible of rendering a single row of table and it receives these parameters:

- index: int - Index of the row, starting from 1
- item: object - Object representing the row
- onChange: func - callback of row selection
- selected: bool - Whether or not the row is selected
- selectionMode: bool - Whether or not the table is in selection mode
- clickable: bool - Whether or not the row is clickable

```jsx
import { useState } from 'react';
import { Button, Container, Icon, Padding, Row, Text, Tooltip } from '@zextras/zapp-ui';

const [selectedRows, setSelectedRows] = useState([]);
const headers = [
  {
    id: 'date',
    label: "Date",
    width: "20%",
  },
  {
    id: 'server',
    label: "Server",
    width: "20%",
    i18nAllLabel: 'All',
    items: [
      { label: 'Servername_1', value: '1'},
      { label: 'Servername_2', value: '2'},
      { label: 'Servername_3', value: '3'},
      { label: 'Servername_4', value: '4'},
      { label: 'Servername_5', value: '5'},
      { label: 'Servername_6', value: '6'},
      { label: 'Servername_7', value: '7'},
      { label: 'Servername_8', value: '8'},
    ],
    onChange: (e) => console.log("Filter changed", e)
  },
  {
    id: 'type',
    label: "Type",
    i18nAllLabel: 'All',
    width: "60px",
    items: [
      { label: 'Information', value: '1'},
      { label: 'Warning', value: '2'},
      { label: 'Error', value: '3'},
    ],
    onChange: (e) => console.log("Filter changed", e)
  },
  {
    id: 'obj',
    label: "Object",
    width: "40%",
  }
];
const items = [
  {
    id: "1",
    columns: ["30 nov 2020, 06:01 AM", "Servernamerverylong", <Container><Icon icon="Info" color="primary" /></Container>, "Zextras Backup Notifcation, Lorem ipsum dolor sit amet, consectetur adipiscing elit."],
    onClick: (e) => console.log("Row clicked", e),
    clickable: true,
  },
  {
    id: "2",
    columns: ["30 nov 2020, 06:01 AM", "Servernamerverylong", <Container><Icon icon="AlertTriangle" color="warning" /></Container>, <Tooltip label="Zextras Backup Notifcation, Lorem ipsum dolor sit amet, consectetur adipiscing elit."><Text>Zextras Backup Notifcation, Lorem ipsum dolor sit amet, consectetur adipiscing elit.</Text></Tooltip>],
    highlight: true,
    onClick: (e) => console.log("Row clicked", e),
  },
  {
    id: "3",
    columns: ["30 nov 2020, 06:01 AM", "Servernamerverylong", <Container><Icon icon="CloseSquare" color="error" /></Container>, "Zextras Backup Notifcation, Lorem ipsum dolor sit amet, consectetur adipiscing elit."],
    onClick: (e) => console.log("Row clicked", e),
    clickable: true,
  },
  {
    id: "4",
    columns: ["30 nov 2020, 06:01 AM", "Servernamerverylong", <Container><Icon icon="CloseSquare" color="error" /></Container>, "Zextras Backup Notifcation, Lorem ipsum dolor sit amet, consectetur adipiscing elit."],
    onClick: (e) => console.log("Row clicked", e),
    clickable: true,
  },
];

<>
    <Padding bottom="large"><Text size="large" weight="bold">Uncontrolled table</Text></Padding>    
    <Table
      rows={items}
      headers={headers}
      controlled={false}
      defaultSelection={['2', '3']}
      onSelectionChange={(selected) => console.log("Uncontrolled selection onChange", selected)}
    />
    <Row padding={{top: 'extralarge', bottom: 'large'}} mainAlignment="space-between" width="100%">
      <Text size="large" weight="bold">Controlled table</Text>
      <Button label="Reset" color="error" onClick={() => setSelectedRows([])} />
    </Row>    
    <Table
      rows={items}
      headers={headers}
      controlled={true}
      selectedRows={selectedRows}
      onSelectionChange={setSelectedRows}
    />
</>
```
