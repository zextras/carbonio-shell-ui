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
import NetworkService from '../../src/network/NetworkService';

describe('NetworkService', () => {

	test('Authentication PASS', () => {
		global.fetch = jest.fn().mockImplementationOnce(() => new Promise(resolve => resolve({
			ok: true,
			status: 200,
			json: () => new Promise(r => r({
				Header: {
					context: {
						session: {
							id: 'session_id'
						}
					}
				},
				Body: {
					AuthResponse: {
						authToken: [{_content: 'auth_token'}]
					}
				}
			}))
		})));
		global.PACKAGE_VERSION = '0.0.0';

		const sink = jest.fn();
		const ns = new NetworkService(sink);

		return expect(ns.sendSOAPRequest('Auth', {})).resolves.toBeDefined();
	});

	test('Authentication FAIL', () => {
		global.fetch = jest.fn().mockImplementationOnce(() => new Promise(resolve => resolve({
			ok: false,
			status: 500,
			json: () => new Promise(r => r({}))
		})));
		global.PACKAGE_VERSION = '0.0.0';

		const sink = jest.fn();
		const ns = new NetworkService(sink);

		return expect(ns.sendSOAPRequest('Auth', {})).rejects.toEqual(new Error('Authentication Error'));
	});

	test('Auth, GetInfo and send a request', async () => {
		const fetch = jest.fn();
		fetch.mockImplementationOnce(() => new Promise(resolve => resolve({
			ok: true,
			status: 200,
			json: () => new Promise(r => r({
				Header: {
					context: {
						session: {
							id: 'session_id'
						}
					}
				},
				Body: {
					AuthResponse: {
						authToken: [{_content: 'auth_token'}]
					}
				}
			}))
		})));
		fetch.mockImplementationOnce(() => new Promise(resolve => resolve({
			ok: true,
			status: 200,
			json: () => new Promise(r => r({
				Header: {
					context: {
					}
				},
				Body: {
					GetInfoResponse: {
						id: 'account_id',
						name: 'user_name'
					}
				}
			}))
		})));
		fetch.mockImplementationOnce(() => new Promise(resolve => resolve({
			ok: true,
			status: 200,
			json: () => new Promise(r => r({
				Header: {
					context: {}
				},
				Body: {
					TestResponse: {}
				}
			}))
		})));
		global.fetch = fetch;
		global.PACKAGE_VERSION = '0.0.0';

		const sink = jest.fn();
		const ns = new NetworkService(sink);

		await ns.sendSOAPRequest('Auth', {});
		await ns.sendSOAPRequest('GetInfo', {});
		await ns.sendSOAPRequest('Test', {}, 'urn:test');
		expect(JSON.parse(fetch.mock.calls[2][1].body).Header.context.account).toEqual( {
			by: 'name',
			_content: 'user_name'
		});
		expect(JSON.parse(fetch.mock.calls[2][1].body).Header.context.session).toEqual({
			id: 'session_id',
			_content: 'session_id'
		});
	});

	test('Detect notifications', async () => {
		const fetch = jest.fn();
		fetch.mockImplementationOnce(() => new Promise(resolve => resolve({
			ok: true,
			status: 200,
			json: () => new Promise(r => r({
				Header: {
					context: {
						notify: []
					}
				},
				Body: {
					TestResponse: {}
				}
			}))
		})));
		global.fetch = fetch;
		global.PACKAGE_VERSION = '0.0.0';
		const sink = jest.fn();
		const ns = new NetworkService(sink);
		const spy = jest.spyOn(ns, '_handleNotifications');
		await ns.sendSOAPRequest('Test', {}, 'urn:test');
		expect(spy).toHaveBeenCalledWith([]);
	});

	test('Handle notifications registering a parser [Created]', async () => {
		const rawNotification = { id: 'test_object_id' };
		const fetch = jest.fn();
		fetch.mockImplementationOnce(() => new Promise(resolve => resolve({
			ok: true,
			status: 200,
			json: () => new Promise(r => r({
				Header: {
					context: {
						notify: [{ seq: 1, created: { test: [rawNotification] } }]
					}
				},
				Body: {
					TestResponse: {}
				}
			}))
		})));
		global.fetch = fetch;
		global.PACKAGE_VERSION = '0.0.0';
		const sink = jest.fn();
		const ns = new NetworkService(sink);
		const parser = jest.fn().mockImplementation((type) => ({ event: `notification.${type}.test` }));
		ns.registerNotificationParser('test', parser);
		await ns.sendSOAPRequest('Test', {}, 'urn:test');
		expect(parser).toHaveBeenCalledWith('created', rawNotification);
		expect(sink).toHaveBeenCalledWith({ event: `notification.created.test` });
	});

	test('Handle notifications registering a parser [Deleted]', async () => {
		const rawNotification = { id: 'test_object_id' };
		const fetch = jest.fn();
		fetch.mockImplementationOnce(() => new Promise(resolve => resolve({
			ok: true,
			status: 200,
			json: () => new Promise(r => r({
				Header: {
					context: {
						notify: [{ seq: 1, deleted: { test: [rawNotification] } }]
					}
				},
				Body: {
					TestResponse: {}
				}
			}))
		})));
		global.fetch = fetch;
		global.PACKAGE_VERSION = '0.0.0';
		const sink = jest.fn();
		const ns = new NetworkService(sink);
		const parser = jest.fn().mockImplementation((type) => ({ event: `notification.${type}.test` }));
		ns.registerNotificationParser('test', parser);
		await ns.sendSOAPRequest('Test', {}, 'urn:test');
		expect(parser).toHaveBeenCalledWith('deleted', rawNotification);
		expect(sink).toHaveBeenCalledWith({ event: `notification.deleted.test` });
	});

	test('Handle notifications registering a parser [Modified]', async () => {
		const rawNotification = { id: 'test_object_id' };
		const fetch = jest.fn();
		fetch.mockImplementationOnce(() => new Promise(resolve => resolve({
			ok: true,
			status: 200,
			json: () => new Promise(r => r({
				Header: {
					context: {
						notify: [{ seq: 1, modified: { test: [rawNotification] } }]
					}
				},
				Body: {
					TestResponse: {}
				}
			}))
		})));
		global.fetch = fetch;
		global.PACKAGE_VERSION = '0.0.0';
		const sink = jest.fn();
		const ns = new NetworkService(sink);
		const parser = jest.fn().mockImplementation((type) => ({ event: `notification.${type}.test` }));
		ns.registerNotificationParser('test', parser);
		await ns.sendSOAPRequest('Test', {}, 'urn:test');
		expect(parser).toHaveBeenCalledWith('modified', rawNotification);
		expect(sink).toHaveBeenCalledWith({ event: `notification.modified.test` });
	});

	test('Register and unregister a notification parser', async () => {
		const rawNotification = { id: 'test_object_id' };
		const fetch = jest.fn();
		fetch.mockImplementationOnce(() => new Promise(resolve => resolve({
			ok: true,
			status: 200,
			json: () => new Promise(r => r({
				Header: {
					context: {
						notify: [{ seq: 1, modified: { test: [rawNotification] } }]
					}
				},
				Body: {
					TestResponse: {}
				}
			}))
		})));
		global.fetch = fetch;
		global.PACKAGE_VERSION = '0.0.0';
		const sink = jest.fn();
		const ns = new NetworkService(sink);
		const parser = jest.fn().mockImplementation((type) => ({ event: `notification.${type}.test` }));
		const id = ns.registerNotificationParser('test', parser);
		ns.unregisterNotificationParserById(id);
		await ns.sendSOAPRequest('Test', {}, 'urn:test');
		expect(parser).not.toHaveBeenCalled();
		expect(sink).not.toHaveBeenCalled();
	});

});