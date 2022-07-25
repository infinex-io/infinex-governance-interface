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
	const renderedText = screen
		.getByTestId('nominate-self-banner-container')
		?.textContent?.includes(enJSON.banner.nominate.closes);
	expect(renderedText).toEqual(true);
});
