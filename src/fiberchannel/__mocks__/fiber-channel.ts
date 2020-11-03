/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2020 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

export default jest.fn().mockImplementation(() => ({
	getAppFiberChannelSink: jest.fn(),
	getAppFiberChannel: jest.fn(),
	getInternalFiberChannelSink: jest.fn(),
	getInternalFiberChannel: jest.fn(),
}));
