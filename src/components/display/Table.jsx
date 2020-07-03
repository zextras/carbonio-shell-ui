import React, {
	useState,
	useEffect,
	useRef,
	useReducer,
	useCallback,
	useMemo
} from 'react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import Checkbox from '../inputs/Checkbox';
import Container from '../layout/Container';
import Icon from '../basic/Icon';
import Select from '../inputs/Select';
import Text from '../basic/Text';
import Row from '../layout/Row';

const TableRow = styled.tr`
	transition: background-color 0.2s ease-out;
	&:nth-child(odd) {
		background-color: ${props => props.theme.palette.gray6.regular};
		&:hover {
			background-color: ${props => props.theme.palette.gray6.hover};
		}
	}
	&:nth-child(even) {
		background-color: ${props => props.theme.palette.gray5.regular};
		&:hover {
			background-color: ${props => props.theme.palette.gray5.hover};
		}
	}
	${(props) => (props.selected || props.highlight) && css`
		background-color: ${props => props.theme.palette.highlight.regular} !important;
	`}
	${(props) => props.clickable && css`
		cursor: pointer;
	`}
`;
const TableContainer = styled.div`
	position: relative;
	display: block;
`;
const StyledTable = styled.table`
	border-collapse: collapse;
	table-layout: fixed;
	
	&, thead, tbody, tr {
		width: 100%;
	}

	thead {
		&, th {
			background-color: ${props => props.theme.palette.gray3.regular};
		}
		th {
			position: sticky;
			top: 0;
		}
	}
	th, td {
    padding: 0 8px;
	}
`;

const DefaultHeaderFactory = ({ headers, onChange, allSelected, selectionMode }) => {
	const [showCkb, setShowCkb] = useState(false);
	const LabelFactory = useCallback(({ selected, label, open, focus }) => {
		return (
			<Container
				orientation="horizontal"
				width="fill"
				crossAlignment="center"
				mainAlignment="space-between"
				borderRadius="half"
				padding={{
					vertical: 'small'
				}}
			>
				<Row takeAvailableSpace={true} mainAlignment="unset">
					<Text size="medium" color={open || focus ? 'primary' : 'text'}>{label}</Text>
				</Row>
				<Icon size="medium" icon={open ? 'ArrowIosUpwardOutline' : 'ArrowIosDownwardOutline'} color={open || focus ? 'primary' : 'text'} style={{ alignSelf: 'center' }} />
			</Container>
		);
	}, []);
	return (
		<tr
			onMouseEnter={() => setShowCkb(true)}
			onMouseLeave={() => setShowCkb(false)}
			onFocus={() => setShowCkb(true)}
			onBlur={() => setShowCkb(false)}
		>
			<th width="30px" height="30px" align="center">{ (showCkb || selectionMode || allSelected) && <Checkbox iconSize="medium" value={allSelected} onClick={onChange} iconColor={selectionMode ? 'primary' : 'text'} /> }</th>
			{
				Object.keys(headers).map((column) => {
					const hasItems = !isEmpty(headers[column].items);
					return (
						<th key={headers[column].id} align={headers[column].align || 'left'} width={headers[column].width}>
							{ hasItems &&
									<Select
										label={headers[column].label} multiple={true}
										items={headers[column].items}
										i18nAllLabel={headers[column].i18nAllLabel || 'All'}
										dropdownWidth="auto"
										onChange={headers[column].onChange}
										LabelFactory={LabelFactory}
									/>
							}
							{ !hasItems && <Text>{ headers[column].label }</Text> }
						</th>
					)
				})
			}
		</tr>
	);
};
const DefaultRowFactory = ({ index, row, onChange, selected, selectionMode } ) => {
	const ckbRef = useRef(undefined);
	const [showCkb, setShowCkb] = useState(selected || selectionMode);
	const _onChange = () => onChange(row.id);
	const onClick = useCallback(
		(e) => e.target !== ckbRef.current && !ckbRef.current.contains(e.target) && row.onClick && row.onClick(e),
		[row]
	);

	return (
		<TableRow
			onMouseEnter={() => setShowCkb(true)}
			onMouseLeave={() => setShowCkb(false)}
			onFocus={() => setShowCkb(true)}
			onBlur={() => setShowCkb(false)}
			onClick={onClick}
			selected={selected}
			highlight={row.highlight}
			clickable={row.clickable}
		>
			<td width="30px" height="30px" align="center">
				{ !(showCkb || selected || selectionMode) && <Text>{ index }</Text> }
				{ (showCkb || selected || selectionMode) && <Checkbox ref={ckbRef} iconSize="medium" value={selected} onClick={_onChange} iconColor={selectionMode ? 'primary' : 'text'} /> }
			</td>
			{ row.columns.map((column, index) => <td key={index}>{ typeof column === 'string' ? <Text>{ column }</Text> : column }</td>) }
		</TableRow>
	);
};

function selectedReducer(state, action) {
	switch (action.type) {
		case 'toggle': {
			return state.includes(action.id) ? state.filter(id => id !== action.id) : [...state, action.id];
		}
		case 'addAll': {
			return [...action.rows.map(row => row.id)];
		}
		case 'reset': {
			return [];
		}
		case 'set': {
			return [...action.ids];
		}
	}
}
const Table = React.forwardRef(function({
	rows,
	headers,
	RowFactory,
	HeaderFactory,
	onSelectionChange,
	defaultSelection,
	selectedRows
}, ref) {
	const [selected, dispatchSelected] = useReducer(selectedReducer, defaultSelection || selectedRows || []);

	const controlledMode = useMemo(() => typeof selectedRows !== 'undefined', []);

	const controlledOnToggle = useCallback((id) => {
		onSelectionChange && onSelectionChange(selected.includes(id) ? selected.filter(_id => _id !== id) : [...selected, id]);
	}, [onSelectionChange, selected]);
	const uncontrolledOnToggle = useCallback((id) => dispatchSelected({type: 'toggle', id: id}), []);

	const controlledOnToggleAll = useCallback(() => {
		selected.length === rows.length ?
			onSelectionChange([])
			: onSelectionChange([...rows.map(row => row.id)]);
	}, [selected, rows, onSelectionChange]);
	const uncontrolledOnToggleAll = useCallback(() => {
		selected.length === rows.length ?
			dispatchSelected({type: 'reset'})
			: dispatchSelected({type: 'addAll', rows: rows});
	}, [selected, rows]);

	const isFirstRun = useRef(true);
	useEffect(() => {
		if (!controlledMode) {
			!isFirstRun.current && onSelectionChange && onSelectionChange(selected);
			if (isFirstRun.current) isFirstRun.current = false;
		}
	}, [selected, controlledMode, onSelectionChange]);

	useEffect(() => {
		if (controlledMode) {
			!isFirstRun.current && dispatchSelected({type: 'set', ids: selectedRows});
			if (isFirstRun.current) isFirstRun.current = false;
		}
	}, [controlledMode, selectedRows]);

	return (
		<TableContainer>
			<StyledTable ref={ref}>
				<thead>
					<HeaderFactory
						headers={headers}
						onChange={controlledMode ? controlledOnToggleAll : uncontrolledOnToggleAll}
						allSelected={selected.length === rows.length}
						selectionMode={selected.length > 0}
					/>
				</thead>
				<tbody>
					{ rows && rows.map((row, index) => (
						<RowFactory
							key={row.id}
							index={index + 1}
							row={row}
							onChange={controlledMode ? controlledOnToggle : uncontrolledOnToggle}
							selected={selected.includes(row.id)}
							selectionMode={selected.length > 0}
						/>
					))}
				</tbody>
			</StyledTable>
		</TableContainer>
	);
});

Table.propTypes = {
	/** Table rows */
	rows: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.string.isRequired,
		/** Each column can be a string or a React component */
		columns: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.element])),
		/** Whether or not highlight this row */
		highlight: PropTypes.bool,
		/** Row click callback */
		onClick: PropTypes.func
	})),
	/** Table headers */
	headers: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired,
		/** th align attribute */
		align: PropTypes.string,
		/** th width attribute */
		width: PropTypes.string,
		/** Select 'All' label translation */
		i18nAllLabel: PropTypes.string,
		/** Select.propTypes.items */
		items: Select.propTypes.items,
		/** De/Select all rows callback */
		onChange: PropTypes.func
	})),
	/** Function to generate the single row */
	RowFactory: PropTypes.func,
	/** Function to generate the table head section */
	HeaderFactory: PropTypes.func,
	/** Callback function, called when user changes selection of rows in table. */
	onSelectionChange: PropTypes.func,
	/** Row selected by default in the table (Array of rows ids). */
	defaultSelection: PropTypes.arrayOf(PropTypes.string),
	/** Array of the selected rows (Array of rows ids). To use only if you want the table to be in controlled mode. */
	selectedRows: PropTypes.arrayOf(PropTypes.string),
};
Table.defaultProps = {
	rows: [],
	headers: [],
	RowFactory: DefaultRowFactory,
	HeaderFactory: DefaultHeaderFactory
};

export default Table;