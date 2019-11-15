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

export interface IFCPartialEvent<T extends {} | string | unknown> {
  to?: string;
  event: string;
  data: T;
  internalOnly?: boolean;
}

export interface IFCEvent<T extends {} | string | unknown> extends IFCPartialEvent<T> {
  from: string;
  version: string;
}

export type IFCSink = <T extends {} | string | unknown>(event: string | IFCPartialEvent<T>, data?: T) => void;
