import React, { useMemo } from 'react';
import {
	Table,
	Container,
	Icon
} from '../../src';

const icon = (status) => {
	switch (status) {
			case 1: return <Container><Icon icon="CheckmarkCircle2" size="large" color="success" /></Container>
			case 3: return <Container><Icon icon="CloseCircle" size="large" color="error" /></Container>
			case 2:
			default: return <Container><Icon icon="Clock" size="large" color="info" /></Container>
	}
};
const headers = [
	{
		id: 'feature',
		label: "Feature",
		width: "20%",
	},
	{
		id: 'status',
		label: "Status",
		width: "32px",
	},
	{
		id: 'notes',
		label: "Notes",
		width: "50%"
	}
];

const StatusTable = ({ items }) => {

	const rows = useMemo(() => items.map(
			(item, index) => ({
					id: item.feature+index,
					columns: [item.feature, icon(item.status), item.notes],
			})
	), [items]);

	return (
		<Table
			mutliSelect={false}
			rows={rows}
			headers={headers}
			controlled={false}
		/>
	);
};

export default StatusTable;
