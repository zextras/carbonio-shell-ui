import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Text from "./Text";
import Dropdown from "./Dropdown";
import Container from "./Container";
import Divider from "./Divider";
import Padding from "./Padding";
import Icon from "./Icon";

const Label = styled.div`
position: absolute;
top: 6px;
left: 8px;
`;

const TabContainer = styled(Container)`
cursor: pointer;
position: relative;
:focus {
  outline: none;
}
`
function Select({ background, items, label, onChange, defaultSelection }) {
  const [ selected, setSelected ] = useState(defaultSelection);
  const [ open, setOpen ] = useState(false);

  return (
    <Container
      crossAlignment="flex-start"
    >
      <TabContainer
        tabIndex="0"

        orientation="horizontal"
        width="fill"
        height="48px"
        crossAlignment="flex-end"
        mainAlignment="space-between"
        background={background}
        borderRadius="half"
        onClick={() => setOpen(true)}
        padding={{
          horizontal: 'large',
          vertical: 'small'
        }}
      >
        <Padding top="medium" bottom="extrasmall">
          <Text size="medium" color={selected ? 'txt_1' : 'txt_4'}>{selected ? selected.label : label}</Text>
        </Padding>
        { selected
          && <Label>
            <Text size="small" color={open ? 'txt_2' : 'txt_4'}>{label}</Text>
          </Label>
        }
        <Icon size="medium" icon="ArrowDown" color={open ? 'txt_2' : 'txt_4'} style={{ alignSelf: 'center' }}/>
      </TabContainer>
      <Dropdown
        items={
          items.map(
            (item, index) => ({
              id: `${index}-${item.label}`,
              label: item.label,
              icon: (selected && item.value === selected.value) ? 'CheckmarkSquare' : 'Square',
              click: () => {
                setSelected(item);
                onChange(item.value);
              }
            })
          )
        }
        open={open}
        top="2px"
        left="0"
        closeFunction={() => setOpen(false)}
      />
      <Divider color={open ? 'bd_2' : 'bd_1'} />
    </Container>
  );
}

Select.propTypes = {
  label: PropTypes.string,
  background: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, value: PropTypes.string })),
  defaultSelection: PropTypes.shape({ label: PropTypes.string, value: PropTypes.string }),
  onChange: PropTypes.func
};

Select.defaultProps = {};

export default Select;
