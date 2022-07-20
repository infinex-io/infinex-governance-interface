import { render } from '@testing-library/react';
import { DeployedModules } from 'containers/Modules';
import { createContext } from 'react';
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
	default: () =>
		jest.fn().mockImplementationOnce(() => ({
			useNominationPeriodDatesQuery: () => ({
				data: { nominationPeriodEndDate: new Date().getTime() },
			}),
		})),
}));

test.only('Nominate Self Banner should display the nomination time', () => {
	const Wrapper = getWrapper();
	const { container } = render(
		<Wrapper children={<NominateSelfBanner deployedModule={DeployedModules.SPARTAN_COUNCIL} />} />
	);
	expect(!!container.getElementsByClassName('.gt-america-mono')).toBe(true);
});
