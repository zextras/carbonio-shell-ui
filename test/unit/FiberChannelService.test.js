import FiberChannelService from "../../src/fc/FiberChannelService";

describe('FiberChannelService', () => {

	test('Receive an event without destination', () => {
		const fiberChannelSrvc = new FiberChannelService();
		const fc = fiberChannelSrvc.getFiberChannelForExtension('com_zextras_test');
		const spy = jest.fn();

		fc.subscribe(spy);

		fiberChannelSrvc._fiberChannel.next({ data: true });

		expect(spy).toHaveBeenCalled();
	});

	test('Receive an event with destination', () => {
		const fiberChannelSrvc = new FiberChannelService();
		const fc = fiberChannelSrvc.getFiberChannelForExtension('com_zextras_test');
		const spy = jest.fn();

		fc.subscribe(spy);

		fiberChannelSrvc._fiberChannel.next({ data: true, to: 'com_zextras_test' });

		expect(spy).toHaveBeenCalled();
	});

	test('Ignore an event with another destination', () => {
		const fiberChannelSrvc = new FiberChannelService();
		const fc = fiberChannelSrvc.getFiberChannelForExtension('com_zextras_test');
		const spy = jest.fn();

		fc.subscribe(spy);

		fiberChannelSrvc._fiberChannel.next({ data: true, to: 'com_zextras_test_2' });

		expect(spy).not.toHaveBeenCalled();
	});

	test('Send an event', () => {
		const fiberChannelSrvc = new FiberChannelService();
		const fcSink = fiberChannelSrvc.getFiberChannelSinkForExtension('com_zextras_test', '0.0.0');
		const spy = jest.fn();

		fiberChannelSrvc._fiberChannel.subscribe(spy);
		fcSink({ data: true });

		expect(spy).toHaveBeenCalledWith({ data: true, from: 'com_zextras_test', version: '0.0.0' });
	});

});
