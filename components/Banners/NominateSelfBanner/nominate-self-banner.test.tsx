import { render, screen } from '@testing-library/react';
import { DeployedModules } from 'containers/Modules';
import { getWrapper } from 'utils/__test__/wrapper';
import NominateSelfBanner from '.';
import enJSON from '../../../i18n/en.json';
import * as mobileHook from 'hooks/useIsMobile';

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
	render(
		<Wrapper>
			<NominateSelfBanner deployedModule={DeployedModules.SPARTAN_COUNCIL} />
		</Wrapper>
	);

	expect(!!screen.getByTestId('nominate-self-banner-timer')).toBe(true);
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
	jest.spyOn(mobileHook, 'default').mockReturnValue(true);
	render(
		<Wrapper>
			<NominateSelfBanner deployedModule={DeployedModules.SPARTAN_COUNCIL} />
		</Wrapper>
	);
	expect(screen.getByTestId('nominate-self-banner-button-mobile')?.textContent === '').toEqual(
		true
	);
});
test('Nominate Self Banner should display text when screen is not mobile', () => {
	const Wrapper = getWrapper();
	jest.spyOn(mobileHook, 'default').mockReturnValue(false);
	render(
		<Wrapper>
			<NominateSelfBanner deployedModule={DeployedModules.SPARTAN_COUNCIL} />
		</Wrapper>
	);
	expect(
		screen
			.getByTestId('nominate-self-banner-button-desktop')
			?.textContent?.includes(enJSON.banner.nominate.headline)
	).toEqual(true);
});
