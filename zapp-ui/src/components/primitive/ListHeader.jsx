import React, { useContext } from 'react';
import { map } from 'lodash';
import PropTypes from 'prop-types';

import Container from './Container';
import Breadcrumbs from './Breadcrumbs';
import IconButton from './IconButton';
import Responsive from '../utilities/Responsive';
import styled from 'styled-components';
import { useSplitVisibility } from '../../hooks/useSplitVisibility'
import { IconDropdownButton } from './DropdownButton';
import Text from './Text';
import Padding from './Padding';
import ThemeContext from '../../theme/ThemeContext';

function ListHeader({
  breadCrumbs,
  onBackClick,
  selecting,
  allSelected,
  onSelectAll,
  onDeselectAll,
  actionStack,
  itemsCount
}) {
  const theme = useContext(ThemeContext);
  const actionsWidth = `calc((${theme.sizes.icon['large']} + (${theme.sizes.padding['small']} * 2 )) * ${actionStack.length > 4 ? 4 : actionStack.length})`;

  return (
    <Container orientation="horizontal" mainAlignment="space-between" width="fill" height="fit" padding={{ horizontal: 'extrasmall' }}>
      <Responsive mode="mobile">
        <IconButton icon="ArrowBack" onClick={onBackClick}/>
      </Responsive>
      { selecting
        ? <Container width="fill" orientation="horizontal" mainAlignment="space-between">
          <Container width={`calc(100% - ${actionsWidth})`} mainAlignment="flex-start" orientation="horizontal">
            <IconButton
              iconColor="txt_2"
              icon={allSelected ? 'CheckmarkSquare2' : 'Square' }
              onClick={allSelected ? onDeselectAll : onSelectAll }
            />
            <Text color="txt_2">{allSelected ? 'Deselect all' : 'Select all'}</Text>
          </Container>
          <Container width={actionsWidth}>
            {
              actionStack.length > 0
              && <ActionGroup actionStack={actionStack} deselectAll={onDeselectAll} />
            }
          </Container>
        </Container>
        :
        <>
          <Breadcrumbs crumbs={breadCrumbs} />
          <Padding right="small">
            <Text>
              {itemsCount > 100 ? '100+' : itemsCount}
            </Text>
          </Padding>
        </>
      }
    </Container>
  );
}


const CheckDiv = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: end;
  width: 100%;
  overflow-x: hidden;
`;

function ActionGroup({
  actionStack,
  deselectAll
}) {
  const [visibleActions, hiddenActions, containerRef] = useSplitVisibility(actionStack);

  return (
    <CheckDiv ref={containerRef} >
      <Container orientation="horizontal" width="fit">
        {
          map(visibleActions, (action) => (
            <IconButton
              iconColor='txt_2'
              key={action.id}
              icon={action.icon}
              onClick={() => {
                action.onActivate();
                deselectAll();
              }}
            />
          ))
        }
        {
          hiddenActions.length > 0 &&
          <IconDropdownButton
            iconColor='txt_2'
            icon="MoreVertical"
            items={
              map(
                hiddenActions,
                (action) => ({
                  id: action.id,
                  icon: action.icon,
                  label: action.label,
                  click: () => {
                    action.onActivate();
                    deselectAll();
                  }
                })
              )
            }
          />
        }
      </Container>
    </CheckDiv>
  )
}

ListHeader.propTypes = {
  breadCrumbs: Breadcrumbs.propTypes.crumbs,
  onBackClick: PropTypes.func,
  selecting: PropTypes.bool,
  allSelected: PropTypes.bool,
  onSelectAll: PropTypes.func,
  onDeselectAll: PropTypes.func,
  actionStack: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string.isRequired,
      label: PropTypes.string,
      onActivate: PropTypes.func.isRequired,
      id: PropTypes.string
    })
  ),
  itemsCount: PropTypes.number
};

export default ListHeader;
