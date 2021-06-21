/*
 * *** BEGIN LICENSE BLOCK *****
 * Copyright (C) 2011-2021 Zextras
 *
 *  The contents of this file are subject to the Zextras EULA;
 * you may not use this file except in compliance with the EULA.
 * You may obtain a copy of the EULA at
 * http://www.zextras.com/zextras-eula.html
 * *** END LICENSE BLOCK *****
 */

import FiberChannelFactory from './fiber-channel';

function setAllAppsLoaded(fcf) {
	fcf.getShellFiberChannelSink()({
		to: {
			// eslint-disable-next-line no-undef
			version: PACKAGE_VERSION,
			// eslint-disable-next-line no-undef
			app: PACKAGE_NAME
		},
		event: 'all-apps-loaded',
		data: {
			com_example_package: {
				pkg: {
					package: 'com_example_package',
					version: '0.0.0'
				}
			}
		}
	});
}

describe('Fiber Channel', () => {
	test('Internal fiber channel and sink', () => {
		const fcf = new FiberChannelFactory();
		setAllAppsLoaded(fcf);
		const sink = fcf.getInternalFiberChannelSink();
		const checker = jest.fn();
		const ev = {
			from: 'com_example_package',
			version: '0.0.0',
			event: 'event',
			data: {}
		};
		fcf
			.getInternalFiberChannel({ name: 'com_example_package', version: '0.0.0' })
			.subscribe(checker);
		sink(ev);
		expect(checker).toBeCalledWith(ev);
	});

	test('Internal fiber channel and sink, Promised event', async () => {
		const fcf = new FiberChannelFactory();
		setAllAppsLoaded(fcf);
		const sink = fcf.getInternalFiberChannelSink();
		const fc = fcf.getInternalFiberChannel({ name: 'com_example_package', version: '0.0.0' });
		const checker = jest.fn();
		checker.mockImplementationOnce(({ sendResponse }) => sendResponse('return-value'));
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
		setAllAppsLoaded(fcf);
		const sink = fcf.getAppFiberChannelSink({ package: 'com_example_package', version: '0.0.0' });
		const checker = jest.fn();
		fcf
			.getInternalFiberChannel({ package: 'com_example_package', version: '0.0.0' })
			.subscribe(checker);
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
		setAllAppsLoaded(fcf);
		const sink = fcf.getAppFiberChannelSink({ package: 'com_example_package', version: '0.0.0' });
		const checker = jest.fn();
		fcf.getAppFiberChannel({ package: 'com_example_package', version: '0.0.0' }).subscribe(checker);
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
		setAllAppsLoaded(fcf);
		const sink = fcf.getAppFiberChannelSink({ package: 'com_example_package', version: '0.0.0' });
		const checker = jest.fn();
		fcf.getAppFiberChannel({ package: 'com_example_package', version: '0.0.0' }).subscribe(checker);
		sink({ to: { app: 'com_example_package', version: '0.0.0' }, event: 'event' });
		expect(checker).toBeCalledWith({
			from: 'com_example_package',
			to: {
				app: 'com_example_package',
				version: '0.0.0'
			},
			version: '0.0.0',
			event: 'event',
			data: {}
		});
	});

	test('App fiber channel and App Sink, event for another App', () => {
		const fcf = new FiberChannelFactory();
		setAllAppsLoaded(fcf);
		const sink = fcf.getAppFiberChannelSink({ package: 'com_example_package', version: '0.0.0' });
		const checker = jest.fn();
		fcf.getAppFiberChannel({ package: 'com_example_package', version: '0.0.0' }).subscribe(checker);
		sink({ to: { app: 'com_example_another_package', version: '0.0.0' }, event: 'event' });
		expect(checker).not.toBeCalled();
	});

	test('App fiber channel and App Sink, Promised event', async () => {
		const fcf = new FiberChannelFactory();
		setAllAppsLoaded(fcf);
		const sink = fcf.getAppFiberChannelSink({ package: 'com_example_package', version: '0.0.0' });
		const fc = fcf.getAppFiberChannel({ package: 'com_example_package', version: '0.0.0' });
		const checker = jest.fn();
		checker.mockImplementationOnce(({ sendResponse }) => sendResponse('return-value'));
		fc.subscribe(checker);
		const returned = await sink({ event: 'input-event', asPromise: true });
		expect(checker).toHaveBeenCalled();
		expect(returned).toBe('return-value');
	});

	test('Cache an event until apps are loaded', () => {
		const fcf = new FiberChannelFactory();
		const sink = fcf.getAppFiberChannelSink({ package: 'com_example_package', version: '0.0.0' });
		const checker = jest.fn();
		fcf.getAppFiberChannel({ package: 'com_example_package', version: '0.0.0' }).subscribe(checker);
		sink({ event: 'event' });
		expect(checker).not.toHaveBeenCalled();
		setAllAppsLoaded(fcf);
		expect(checker).toBeCalledWith({
			from: 'com_example_package',
			version: '0.0.0',
			event: 'event',
			data: {}
		});
	});

	test('Throw error on missing API Version', () => {
		const fcf = new FiberChannelFactory();
		setAllAppsLoaded(fcf);
		const sink = fcf.getAppFiberChannelSink({ package: 'com_example_package', version: '0.0.0' });
		const checker = jest.fn();
		fcf.getAppFiberChannel({ package: 'com_example_package', version: '0.0.0' }).subscribe(checker);
		try {
			sink({ to: { app: 'com_example_package' }, event: 'event' });
		} catch (err) {
			expect(err.message).toBe('API Version not specified.');
		} finally {
			expect(checker).not.toHaveBeenCalled();
		}
	});

	test('Throw error on unsupported API Version', () => {
		const fcf = new FiberChannelFactory();
		setAllAppsLoaded(fcf);
		const sink = fcf.getAppFiberChannelSink({ package: 'com_example_package', version: '0.0.0' });
		const checker = jest.fn();
		fcf.getAppFiberChannel({ package: 'com_example_package', version: '0.0.0' }).subscribe(checker);
		try {
			sink({ to: { app: 'com_example_package', version: '1.0.0' }, event: 'event' });
		} catch (err) {
			expect(err.message).toBe('API Version cannot be satisfied.');
		} finally {
			expect(checker).not.toHaveBeenCalled();
		}
	});

	test('Reject on error on unsupported API Version', async () => {
		const fcf = new FiberChannelFactory();
		setAllAppsLoaded(fcf);
		const sink = fcf.getAppFiberChannelSink({ package: 'com_example_package', version: '0.0.0' });
		const checker = jest.fn();
		fcf.getAppFiberChannel({ package: 'com_example_package', version: '0.0.0' }).subscribe(checker);
		try {
			const returned = await sink({
				to: { app: 'com_example_package', version: '1.0.0' },
				asPromise: true,
				event: 'event'
			});
		} catch (err) {
			expect(err.message).toBe('API Version cannot be satisfied.');
		} finally {
			expect(checker).not.toHaveBeenCalled();
		}
	});
});
