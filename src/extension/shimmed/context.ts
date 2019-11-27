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
import { Context } from 'react';
import { IOfflineContext } from '../../offline/IOfflineContext';
import { IScreenSizeContext } from '../../screenSize/IScreenSizeContext';
import { ISyncContext } from '../../sync/ISyncContext';
import { II18nContext } from '../../i18n/II18nContext';

export declare const OfflineCtxt: Context<IOfflineContext>;

export declare const ScreenSizeCtxt: Context<IScreenSizeContext>;

export declare const SyncCtxt: Context<ISyncContext>;

export declare const I18nCtxt: Context<II18nContext>;