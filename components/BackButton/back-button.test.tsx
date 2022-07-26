import { act, fireEvent, render, screen } from '@testing-library/react';
import BackButton from '.';
import enJSON from '../../i18n/en.json';

const useRouter = jest.spyOn(require('next/router'), 'useRouter');

jest.mock('react-i18next', () => ({
	useTranslation() {
		return {
			t: () => enJSON.components['back-btn'],
		};
	},
}));

test('BackButton component should have "back" as translation text', () => {
	useRouter.mockImplementationOnce(() => ({
		push: jest.fn(),
	}));
	render(<BackButton />);
	expect(screen.getAllByTestId('back-button-text')[0].textContent).toBe('Back');
});

test('BackButton component should have "back" as translation text wrapped in a span element', () => {
	useRouter.mockImplementationOnce(() => ({
		push: jest.fn(),
	}));
	render(<BackButton />);
	expect(screen.getAllByTestId('back-button-text')[0].nodeName === 'SPAN').toBeTruthy();
});

test('BackButton should navigate back to homepage when being clicked', () => {
	let state = '/defaultRoute';
	useRouter.mockImplementationOnce(() => ({
		push: (route: string) => (state = route),
	}));
	render(<BackButton />);
	const backButton = screen.getByTestId('back-button-icon');
	act(() => {
		fireEvent.click(backButton!);
	});
	expect(state).toBe('/');
});
