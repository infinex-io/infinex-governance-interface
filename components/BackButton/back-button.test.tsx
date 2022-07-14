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
	render(<BackButton />);
	expect(screen.getAllByTestId('back-button-text')[0].innerHTML).toBe('Back');
});

test('BackButton component should have "back" as translation text wrapped in a span element', () => {
	render(<BackButton />);
	expect(screen.getAllByTestId('back-button-text')[0].nodeName === 'SPAN').toBeTruthy();
});

test.only('BackButton should navigate back to homepage when being clicked', () => {
	let state = '/defaultRoute';
	useRouter.mockImplementationOnce(() => ({
		push: (route: string) => (state = route),
	}));
	const { container } = render(<BackButton />);
	const backButton = container.querySelector('.bg-gradient-to-l');
	act(() => {
		fireEvent.click(backButton!);
	});
	expect(state).toBe('/');
});
