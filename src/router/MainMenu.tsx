/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2019 ZeXtras
 *
 * The contents of this file are subject to the ZeXtras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import React, { FC, ReactElement, useContext, useEffect, useRef, useState } from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import {Subscription} from 'rxjs';
import RouterContext from './RouterContext';
import { map } from 'lodash';
import { IMainMenuItemData } from './IRouterService';

interface IListItemLinkProps {
  icon?: ReactElement;
  primary: string;
  to: string;
}

const ListItemLink: FC<IListItemLinkProps> = ({ icon, primary, to }) => {
  const renderLink = React.useMemo(
    () =>
      React.forwardRef<HTMLAnchorElement, Omit<RouterLinkProps, 'innerRef' | 'to'>>(
        (itemProps, ref) => (
          // With react-router-dom@^6.0.0 use `ref` instead of `innerRef`
          // See https://github.com/ReactTraining/react-router/issues/6056
          <RouterLink to={to} {...itemProps} innerRef={ref} />
        ),
      ),
    [to],
  );

  return (
    <li>
      <ListItem button component={renderLink}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={primary} />
      </ListItem>
    </li>
  );
};

const MainMenu: FC<{}> = () => {
  const [mainMenuItems, setMainMenuItems] = useState<Array<IMainMenuItemData>>([]);
  const routerCtx = useContext(RouterContext);
  const mainMenuItemsSubRef = useRef<Subscription>();

  useEffect(() => {
    mainMenuItemsSubRef.current = routerCtx.mainMenuItems.subscribe(setMainMenuItems);

    return (): void => {
      if (mainMenuItemsSubRef.current) {
        mainMenuItemsSubRef.current.unsubscribe();
        mainMenuItemsSubRef.current = undefined;
      }
    };
  }, [routerCtx.mainMenuItems]);

  const menuItems = map(
    mainMenuItems,
    (v) => (<ListItemLink key={v.to} to={v.to} primary={v.label} icon={v.icon} />)
  );

  return (
    <List>
      { menuItems }
    </List>
  );
};
export default MainMenu;
