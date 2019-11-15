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

import React, {FC, useState, MouseEvent, useContext} from 'react';
import { IconButton, Menu, MenuItem } from '@material-ui/core';

import { AccountCircle } from '@material-ui/icons';
import SessionContext from '../../session/SessionContext';

const UserMenu: FC<{}> = () => {

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const sessionCtx = useContext(SessionContext);

  function openMenu(event: MouseEvent<HTMLButtonElement>): void {
    setAnchorEl(event.currentTarget);
  }

  function closeMenu(): void {
    setAnchorEl(null);
  }

  function doLogout(): void {
    sessionCtx.doLogout().then(() => undefined);
    setAnchorEl(null)
  }

  return (
    <>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="menu"
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={openMenu}
      >
        <AccountCircle />
      </IconButton>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={closeMenu}
      >
        <MenuItem onClick={doLogout}>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};
export default UserMenu;
