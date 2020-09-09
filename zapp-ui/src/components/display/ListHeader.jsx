import React, { useContext, useMemo, Fragment } from 'react';
import { map } from 'lodash';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Container from '../layout/Container';
import Breadcrumbs from '../navigation/Breadcrumbs';
import IconButton from '../inputs/IconButton';
import Dropdown from './Dropdown';
import Text from '../basic/Text';
import Padding from '../layout/Padding';
import Responsive from '../utilities/Responsive';
import { useSplitVisibility } from '../../hooks/useSplitVisibility';
import ThemeContext from '../../theme/ThemeContext';

const ListHeader = React.forwardRef(function({
  breadCrumbs,
  onBackClick,
  selecting,
  allSelected,
  onSelectAll,
  onDeselectAll,
  actionStack,
  itemsCount,
  ...rest
}, ref) {
  const theme = useContext(ThemeContext);
  const actionsWidth = useMemo(() => {
    return `calc((${theme.sizes.icon['large']} + (${theme.sizes.padding['small']} * 2 )) * ${actionStack.length > 4 ? 4 : actionStack.length})`;
  }, [actionStack, theme.sizes]);

  return (
    <Container
      ref={ref}
      orientation="horizontal"
      mainAlignment="space-between"
      width="fill"
      height="fit"
      padding={{ horizontal: 'extrasmall' }}
      {...rest}
    >
      <Responsive mode="mobile">
        <IconButton icon="ArrowBack" onClick={onBackClick}/>
      </Responsive>
      { selecting
        ? <Container width="fill" orientation="horizontal" mainAlignment="space-between">
          <Container width={`calc(100% - ${actionsWidth})`} mainAlignment="flex-start" orientation="horizontal">
            <IconButton
              iconColor="primary"
              icon={allSelected ? 'CheckmarkSquare2' : 'Square' }
              onClick={allSelected ? onDeselectAll : onSelectAll }
            />
            <Text color="primary">{allSelected ? 'Deselect all' : 'Select all'}</Text>
          </Container>
          <Container width={actionsWidth}>
            {
              actionStack.length > 0
              && <ActionGroup actionStack={actionStack} deselectAll={onDeselectAll} />
            }
          </Container>
        </Container>
        :
        <Fragment>
          <Breadcrumbs crumbs={breadCrumbs} />
          <Padding right="small">
            <Text>
              {itemsCount > 100 ? '100+' : itemsCount}
            </Text>
          </Padding>
        </Fragment>
      }
    </Container>
  );
});


const CheckDiv = styled.div`
  display: flex;
  width: 100%;
`;
const VisibleActionsWrapper = styled.div`
  display: flex;
  width: 100%;
  overflow-x: hidden;
`;

function ActionGroup({
  actionStack,
  deselectAll
}) {
  const [visibleActions, hiddenActions, containerRef] = useSplitVisibility(actionStack, 'end');

  const mappedHiddenItems = useMemo(() => {
    return map(
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
  }, [hiddenActions, deselectAll]);

  return (
    <CheckDiv>
      <Container orientation="horizontal" width="100%">
        <VisibleActionsWrapper ref={containerRef}>
        {
          map(visibleActions, (action) => (
            <IconButton
              iconColor='primary'
              key={action.id}
              icon={action.icon}
              onClick={() => {
                action.onActivate();
                deselectAll();
              }}
            />
          ))
        }
        </VisibleActionsWrapper>
        {
          hiddenActions.length > 0 &&
          <Dropdown
            placement="bottom-end"
            items={mappedHiddenItems}
          >
            <IconButton
              iconColor="primary"
              icon="MoreVertical"
            />
          </Dropdown>
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
