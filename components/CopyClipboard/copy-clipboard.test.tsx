import { act, fireEvent, render, screen } from '@testing-library/react';
import { CopyClipboard } from './CopyClipboard';
import enJSON from 'i18n/en.json';

Object.assign(navigator, {
	clipboard: {
		writeText: () => {},
	},
});
jest.spyOn(navigator.clipboard, 'writeText');
let latestPath = '';
jest.mock('react-i18next', () => ({
	useTranslation() {
		return {
			t: (path: string) => {
				latestPath = path;
				enJSON.components['copy-clipboard-message'];
			},
		};
	},
}));

describe('Copy Clipboard component', () => {
	afterAll(() => jest.clearAllMocks());
	test('Copy Clipboard component should copy text unaltered to the clipboard', () => {
		render(<CopyClipboard text="test-text"></CopyClipboard>);
		act(() => {
			fireEvent.click(screen.getByTestId('copy-clipboard-svg'));
		});
		expect(navigator.clipboard.writeText).toBeCalledWith('test-text');
		expect(latestPath).toBe('components.copy-clipboard-message');
	});
});
