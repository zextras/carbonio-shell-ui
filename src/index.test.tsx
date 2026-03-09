/*
 * SPDX-FileCopyrightText: 2025 Zextras <https://www.zextras.com>
 *
 * SPDX-License-Identifier: AGPL-3.0-only
 */
import '@testing-library/jest-dom';

vi.mock('react-dom/client', () => ({
	default: {
		createRoot: vi.fn().mockImplementation(() => ({
			render: vi.fn(),
			unmount: vi.fn()
		}))
	},
	createRoot: vi.fn().mockImplementation(() => ({
		render: vi.fn(),
		unmount: vi.fn()
	}))
}));

describe('index.tsx - Context Menu Behavior', () => {
	let originalGetSelection: typeof window.getSelection;

	beforeAll(async () => {
		originalGetSelection = window.getSelection;
		await import('./index');
	});

	beforeEach(() => {
		vi.clearAllMocks();
		window.getSelection = originalGetSelection;
		document.body.innerHTML = '';
	});

	it('should block context menu for regular elements', () => {
		const target = document.body;
		const event = new MouseEvent('contextmenu', {
			bubbles: true,
			cancelable: true,
			composed: true
		});
		const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

		target.dispatchEvent(event);

		expect(preventDefaultSpy).toHaveBeenCalled();
	});

	it('should allow context menu for A tags', () => {
		const link = document.createElement('a');
		document.body.appendChild(link);
		const event = new MouseEvent('contextmenu', {
			bubbles: true,
			cancelable: true,
			composed: true
		});
		const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

		link.dispatchEvent(event);

		expect(preventDefaultSpy).not.toHaveBeenCalled();
	});

	it('should allow context menu for IMG tags', () => {
		const img = document.createElement('img');
		document.body.appendChild(img);
		const event = new MouseEvent('contextmenu', {
			bubbles: true,
			cancelable: true,
			composed: true
		});
		const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

		img.dispatchEvent(event);

		expect(preventDefaultSpy).not.toHaveBeenCalled();
	});

	it('should allow context menu for bypass-class elements', () => {
		const div = document.createElement('div');
		div.classList.add('carbonio-bypass-context-menu');
		document.body.appendChild(div);
		const event = new MouseEvent('contextmenu', {
			bubbles: true,
			cancelable: true,
			composed: true
		});
		const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

		div.dispatchEvent(event);

		expect(preventDefaultSpy).not.toHaveBeenCalled();
	});

	it('should allow context menu for text selections', () => {
		const range = document.createRange();
		const textNode = document.createTextNode('selectable text');
		document.body.appendChild(textNode);
		range.selectNode(textNode);

		window.getSelection = vi.fn(
			() =>
				({
					type: 'Range',
					rangeCount: 1,
					getRangeAt: vi.fn(() => range)
				}) as never
		);

		const event = new MouseEvent('contextmenu', {
			bubbles: true,
			cancelable: true,
			composed: true
		});
		const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

		textNode.dispatchEvent(event);

		expect(preventDefaultSpy).not.toHaveBeenCalled();

		document.body.childNodes.forEach((n) => n.nodeType === Node.TEXT_NODE && n.remove());
	});
});
