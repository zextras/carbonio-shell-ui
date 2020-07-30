import React, { useState, useMemo, useCallback, useReducer, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled, {css} from 'styled-components';
import { some, isEmpty } from 'lodash';
import Container from '../layout/Container';
import Divider from '../layout/Divider';
import Dropdown from '../display/Dropdown';
import Icon from '../basic/Icon';
import Padding from '../layout/Padding';
import Row from '../layout/Row';
import Text from '../basic/Text';
import defaultTheme from "../../theme/Theme";

const Label = styled(Text)`
  position: absolute;
  top: ${props => props.selected ? `calc(${props.theme.sizes.padding.small} - 1px)` : '50%'};
  left: ${(props) => props.theme.sizes.padding.large};
  transform: translateY(${props => props.selected ? '0' : '-50%'});
  transition: 150ms ease-out;
`;
const ContainerEl = styled(Container)`
	transition: background 0.2s ease-out;
	&:hover {
		background: ${(props) => props.theme.palette[props.background].hover};
	}
	${(props) => props.focus && css`
		background: ${props.theme.palette[props.background].focus}
	`}
`;
const DefaultLabelFactory = ({ selected, label, open, focus, background }) => {
  return (
    <>
      <ContainerEl
        orientation="horizontal"
        width="fill"
        crossAlignment="flex-end"
        mainAlignment="space-between"
        borderRadius="half"
        padding={{
          horizontal: 'large',
          vertical: 'small'
        }}
        background={background}
        focus={focus}
      >
        <Row takeAvailableSpace={true} mainAlignment="unset">
          <Padding top="medium" style={{width: '100%'}}>
            <Text size="medium" style={{minHeight: '1.167em'}}>{ !isEmpty(selected) && selected.reduce((arr, obj) => ([...arr, obj.label]), []).join(', ') }</Text>
          </Padding>
          <Label selected={!isEmpty(selected)} size={!isEmpty(selected) ? 'small' : 'medium'} color={open || focus ? 'primary' : 'secondary'}>
            {label}
          </Label>
        </Row>
        <Icon size="medium" icon={open ? 'ArrowUp' : 'ArrowDown'} color={open || focus ? 'primary' : 'secondary'} style={{ alignSelf: 'center' }} />
      </ContainerEl>
      <Divider color={open || focus ? 'primary' : 'gray2'} />
    </>
  );
};

const TabContainer = styled(Container)`
	position: relative;
  cursor: pointer;
  
  &:focus{
    outline: none;
  }
`;

function selectedReducer(state, action) {
  if (!action.multiple) {
    action.onChange(action.item.value);
    return action.item ? [action.item] : [];
  }
  switch (action.type) {
    case 'push': {
      const newState = [...state, {...action.item}];
      action.onChange(newState);
      return newState;
    }
    case 'remove': {
      const newState = state.filter(obj => obj.value !== action.item.value);
      action.onChange(newState);
      return newState;
    }
    case 'selectAll': {
      const newState = [...action.items];
      action.onChange(newState);
      return newState;
    }
    case 'reset': {
      const newState = [];
      action.onChange(newState);
      return newState;
    }
    default:
      throw new Error();
  }
}
const Select = React.forwardRef(function({
  background,
  disabled,
  items,
  label,
  onChange,
  defaultSelection,
  multiple,
  i18nAllLabel,
  display,
  dropdownWidth,
  dropdownMaxWidth,
  LabelFactory
}, ref) {
  const [selected, dispatchSelected] = useReducer(selectedReducer, defaultSelection ? (multiple ? defaultSelection : [defaultSelection]) : []);
  const [open, setOpen] = useState(false);
  const [focus, setFocus] = useState(false);

  const mappedItems = useMemo(() => {
    return items.map(
      (item, index) => {
        const isSelected = some(selected, { 'value': item.value });
        return {
          id: `${index}-${item.label}`,
          label: item.label,
          icon: isSelected ? 'CheckmarkSquare' : 'Square',
          click: () => {
            if (multiple && isSelected) {
              dispatchSelected({type: 'remove', item: item, multiple: multiple, onChange: onChange});
            }
            else if((!multiple && (isEmpty(selected) || item.value !== selected[0].value)) || multiple) {
              dispatchSelected({type: 'push', item: item, multiple: multiple, onChange: onChange});
            }
          },
          selected: isSelected
        };
      }
    );
  }, [items, selected, multiple, onChange]);

  const onOpen = useCallback(() => setOpen(true), []);
  const onClose = useCallback(() => setOpen(false), []);
  const onFocus = useCallback(() => setFocus(true), []);
  const onBlur = useCallback(() => setFocus(false), []);

  const multipleMappedItems = useMemo(() => {
    if (!multiple) return [];
    const isSelected = selected.length === items.length;
    return [
      {
        id: 'all',
        label: i18nAllLabel,
        icon: isSelected ? 'CheckmarkSquare' : 'Square',
        click: () => {
          dispatchSelected({ type: isSelected ? 'reset' : 'selectAll', items: items, multiple: multiple, onChange: onChange });
        },
        selected: isSelected
      },
      ...mappedItems
    ];
  }, [multiple, mappedItems, onChange]);

  return (
    <Dropdown
      display={display}
      width={dropdownWidth}
      maxWidth={dropdownMaxWidth}
      items={multiple ? multipleMappedItems : mappedItems}
      handleTriggerEvents={true}
      multiple={multiple}
      disabled={disabled}
      onOpen={onOpen}
      onClose={onClose}
      placement="bottom-end"
    >
      <TabContainer
        ref={ref}
        onFocus={onFocus}
        onBlur={onBlur}
        tabIndex="0"
      >
        <LabelFactory
          label={label}
          open={open}
          focus={focus}
          background={background}
          multiple={multiple}
          disabled={disabled}
          selected={selected}
        />
      </TabContainer>
    </Dropdown>
  );
});

Select.propTypes = {
  label: PropTypes.string,
  background: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.oneOf(Object.keys(defaultTheme.palette.light))
  ]),
  disabled: PropTypes.bool,
  items: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, value: PropTypes.string })),
  defaultSelection: PropTypes.oneOfType([
    PropTypes.shape({ label: PropTypes.string, value: PropTypes.string }),
    PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, value: PropTypes.string }))
  ]),
  onChange: PropTypes.func,
  /** Css display property of select */
  display: Dropdown.propTypes.display,
  /** Css width property of dropdown */
  dropdownWidth: Dropdown.propTypes.width,
  /** Css max-width property of dropdown */
  dropdownMaxWidth: Dropdown.propTypes.maxWidth,
  LabelFactory: PropTypes.func,
  multiple: PropTypes.bool,
  i18nAllLabel: PropTypes.string,
};

Select.defaultProps = {
  disabled: false,
  background: 'gray5',
  multiple: false,
  i18nAllLabel: 'All',
  display: 'block',
  dropdownWidth: '100%',
  LabelFactory: DefaultLabelFactory
};

export default Select;
