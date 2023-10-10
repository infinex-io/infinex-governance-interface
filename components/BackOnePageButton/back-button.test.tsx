import { act, fireEvent, render, screen } from '@testing-library/react';
import BackButton from '.';
import enJSON from '../../i18n/en.json';

const useRouter = jest.spyOn(require('next/router'), 'useRouter');
let latestPath = '';
jest.mock('react-i18next', () => ({
	useTranslation() {
		return {
			t: (path: string) => {
				latestPath = path;
				return enJSON.components['back-btn'];
			},
		};
	},
}));
describe('Back Button Component', () => {
	afterAll(() => jest.clearAllMocks());

	test('BackButton component should have "back" as translation text', () => {
		useRouter.mockImplementationOnce(() => ({
			push: jest.fn(),
		}));
		render(<BackButton />);
		expect(screen.getByTestId('back-button-text').textContent).toBe('Back');
		expect(latestPath).toBe('components.back-btn');
	});

	test('BackButton component should have "back" as translation text wrapped in a span element', () => {
		useRouter.mockImplementationOnce(() => ({
			push: jest.fn(),
		}));
		render(<BackButton />);
		expect(screen.getByTestId('back-button-text').nodeName === 'SPAN').toBeTruthy();
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
});
