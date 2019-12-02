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

import { BehaviorSubject, fromEvent, interval } from 'rxjs';
import { debounce } from 'rxjs/operators';
import { IScreenSizes } from './IScreenSize';

export default class ScreenSizeService {
	public sizes = new BehaviorSubject(ScreenSizeService.CalculateScreenSizes());

	static CalculateScreenSizes(): IScreenSizes {
		return {
			mobile: screen.width <= 320,
			tablet: screen.width > 320 && screen.width <= 672,
			desktopS: screen.width > 672 && screen.width <= 1056,
			desktop: screen.width > 1056 && screen.width <= 1312,
			desktopXL: screen.width > 1312 && screen.width <= 1584,
			desktopMAX: screen.width > 1584
		};
	}

	constructor() {
		fromEvent(window, 'resize').pipe(
			debounce(() => interval(500))
		).subscribe(this._updateScreenSizes);
	}

	private _updateScreenSizes = (): void => {
		this.sizes.next(ScreenSizeService.CalculateScreenSizes());
	};
}
