/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2020 ZeXtras
 *
 * The contents of this file are subject to the ZeXtras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import FiberChannelFactory from './fiber-channel';

describe('Fiber Channel', () => {

	test('Internal fiber channel and sink', () => {
		const fcf = new FiberChannelFactory();
		const sink = fcf.getInternalFiberChannelSink();
		const checker = jest.fn();
		const ev = {
			from: 'com_example_package',
			version: '0.0.0',
			event: 'event',
			data: {}
		}
		fcf.getInternalFiberChannel().subscribe(checker);
		sink(ev);
		expect(checker).toBeCalledWith(ev);
	});

	test('Internal fiber channel and sink, Promised event', async () => {
		const fcf = new FiberChannelFactory();
		const sink = fcf.getInternalFiberChannelSink();
		const fc = fcf.getInternalFiberChannel();
		const checker = jest.fn();
		checker.mockImplementation(({ sendResponse }) => sendResponse('return-value'));
		fc.subscribe(checker);
		const returned = await sink({
			asPromise: true,
			from: 'com_example_package',
			version: '0.0.0',
			event: 'event',
			data: {}
		});
		expect(checker).toHaveBeenCalled();
		expect(returned).toBe('return-value');
	});

	test('Internal fiber channel and App Sink', () => {
		const fcf = new FiberChannelFactory();
		const sink = fcf.getAppFiberChannelSink({ name: 'com_example_package', version: '0.0.0' });
		const checker = jest.fn();
		fcf.getInternalFiberChannel().subscribe(checker);
		sink({
			event: 'event',
			data: {}
		});
		expect(checker).toBeCalledWith({
			from: 'com_example_package',
			version: '0.0.0',
			event: 'event',
			data: {}
		});
	});

	test('App fiber channel and App Sink', () => {
		const fcf = new FiberChannelFactory();
		const sink = fcf.getAppFiberChannelSink({ name: 'com_example_package', version: '0.0.0' });
		const checker = jest.fn();
		fcf.getAppFiberChannel({ name: 'com_example_package', version: '0.0.0' }).subscribe(checker);
		sink({ event: 'event' });
		expect(checker).toBeCalledWith({
			from: 'com_example_package',
			version: '0.0.0',
			event: 'event',
			data: {}
		});
	});

	test('App fiber channel and App Sink, event for App', () => {
		const fcf = new FiberChannelFactory();
		const sink = fcf.getAppFiberChannelSink({ name: 'com_example_package', version: '0.0.0' });
		const checker = jest.fn();
		fcf.getAppFiberChannel({ name: 'com_example_package', version: '0.0.0' }).subscribe(checker);
		sink({ to: 'com_example_package', event: 'event' });
		expect(checker).toBeCalledWith({
			from: 'com_example_package',
			to: 'com_example_package',
			version: '0.0.0',
			event: 'event',
			data: {}
		});
	});

	test('App fiber channel and App Sink, event for another App', () => {
		const fcf = new FiberChannelFactory();
		const sink = fcf.getAppFiberChannelSink({ name: 'com_example_package', version: '0.0.0' });
		const checker = jest.fn();
		fcf.getAppFiberChannel({ name: 'com_example_package', version: '0.0.0' }).subscribe(checker);
		sink({ to: 'com_example_another_package', event: 'event' });
		expect(checker).not.toBeCalled();
	});

	test('App fiber channel and App Sink, Promised event', async () => {
		const fcf = new FiberChannelFactory();
		const sink = fcf.getAppFiberChannelSink({ name: 'com_example_package', version: '0.0.0' });
		const fc = fcf.getAppFiberChannel({ name: 'com_example_package', version: '0.0.0' });
		const checker = jest.fn();
		checker.mockImplementation(({ sendResponse }) => sendResponse('return-value'));
		fc.subscribe(checker);
		const returned = await sink({ event: 'input-event', asPromise: true });
		expect(checker).toHaveBeenCalled();
		expect(returned).toBe('return-value');
	});

});
