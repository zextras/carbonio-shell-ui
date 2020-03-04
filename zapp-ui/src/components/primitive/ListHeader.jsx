import React from 'react';
import PropTypes from 'prop-types';
import Container from "./Container";
import Breadcrumbs from "./Breadcrumbs";
import IconButton from "./IconButton";
import Responsive from "../utilities/Responsive";
import { map } from "lodash";
import styled from "styled-components";
import useSplitVisibility from '../../hooks/useSplitVisibility'
import {IconDropdownButton} from "./DropdownButton";
import Text from "./Text";
import {WrappedItemActionShape} from "../../types";

const ListHeader = ({
  breadCrumbs,
  onBackClick,
  selecting,
  allSelected,
  onSelectAll,
  onDeselectAll,
  actionStack
}) => {
  return (
    <Container orientation="horizontal" mainAlignment="space-between" width="fill" height="fit" padding={{ horizontal: 'extrasmall' }}>
      <Responsive mode="mobile">
        <IconButton icon="ArrowBack" onClick={onBackClick}/>
      </Responsive>
      <Container width="fill" orientation="horizontal" mainAlignment="space-between">
        <Container width="70%" mainAlignment="flex-start" orientation="horizontal">
          { selecting
          ? <>
              <IconButton icon={allSelected ? 'CheckmarkSquare' : 'Square' } onClick={allSelected ? onDeselectAll : onSelectAll }/>
              <Text>{allSelected ? 'Deselect all' : 'Select all'}</Text>
            </>
          : <Breadcrumbs crumbs={breadCrumbs} />
          }
        </Container>
        <Container width="30%">
          {
            actionStack.length > 0
            && <ActionGroup actionStack={actionStack} />
          }
        </Container>
      </Container>
    </Container>
  );
};


const CheckDiv = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: end;
  width: 100%;
  overflow-x: hidden;
`;

const ActionGroup = ({
  actionStack,
}) => {
  const [visibleActions, hiddenActions, containerRef] = useSplitVisibility(actionStack);

  return (
    <CheckDiv ref={containerRef} >
      <Container orientation="horizontal" width="fit">
        {
          map(visibleActions, (action) => (
            <IconButton
              key={action.id}
              icon={action.icon}
              onClick={action.onActivate}
            />
          ))
        }
        {
          hiddenActions.length > 0 &&
          <IconDropdownButton
            icon="MoreVertical"
            items={
              map(
                hiddenActions,
                (action) => ({
                  id: action.id,
                  icon: action.icon,
                  label: action.label,
                  click: action.onActivate
                })
              )
            }
          />
        }
      </Container>
    </CheckDiv>
  )
};

ListHeader.propTypes = {
  breadCrumbs: Breadcrumbs.propTypes.crumbs,
  onBackClick: PropTypes.func,
  selecting: PropTypes.bool,
  allSelected: PropTypes.bool,
  onSelectAll: PropTypes.func,
  onDeselectAll: PropTypes.func,
  actionStack: PropTypes.arrayOf(
    WrappedItemActionShape
  )
};

export default ListHeader;
