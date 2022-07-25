import { render, screen } from '@testing-library/react';
import { DeployedModules } from 'containers/Modules';
import { getWrapper } from 'utils/__test__/wrapper';
import NominateSelfBanner from '.';
import enJSON from '../../../i18n/en.json';

jest.mock('react-i18next', () => ({
	useTranslation() {
		return {
			t: (path: string) => {
				if (path === 'banner.nominate.headline') {
					return enJSON.banner.nominate.headline;
				} else {
					return enJSON.banner.nominate.closes;
				}
			},
		};
	},
}));

jest.mock('containers/Modal/Modal', () => ({
	useModalContext: () => ({ setContent: jest.fn(), setIsOpen: jest.fn() }),
}));

jest.mock('queries/epochs/useNominationPeriodDatesQuery', () => ({
	__esModule: true,
	default: () => ({
		data: { nominationPeriodEndDate: new Date().getTime() },
	}),
}));

jest.mock('hooks/useIsMobile', () => ({
	__esModule: true,
	default: () => true,
}));

test('Nominate Self Banner should display the nomination time', () => {
	const Wrapper = getWrapper();
	const { container } = render(
		<Wrapper>
			<NominateSelfBanner deployedModule={DeployedModules.SPARTAN_COUNCIL} />
		</Wrapper>
	);

	expect(!!container.querySelector('.flex .items-center .gt-america-mono')).toBe(true);
});

test('Nominate Self Banner should display the closes text when it is rendered', () => {
	const Wrapper = getWrapper();
	render(
		<Wrapper>
			<NominateSelfBanner deployedModule={DeployedModules.SPARTAN_COUNCIL} />
		</Wrapper>
	);
	expect(
		screen
			.getByTestId('nominate-self-banner-container')
			?.textContent?.includes(enJSON.banner.nominate.closes)
	).toEqual(true);
});

test('Nominate Self Banner should display no text when screen is mobile', () => {
	const Wrapper = getWrapper();
	const { container } = render(
		<Wrapper>
			<NominateSelfBanner deployedModule={DeployedModules.SPARTAN_COUNCIL} />
		</Wrapper>
	);
	const elements = container.getElementsByClassName('p-2');
	const buttonToTest = elements.item(elements.length - 1);
	expect(buttonToTest?.textContent === '').toEqual(true);
});
