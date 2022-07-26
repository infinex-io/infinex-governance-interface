import { render, screen } from '@testing-library/react';
import { DeployedModules } from 'containers/Modules';
import { getWrapper } from 'utils/__test__/wrapper';
import VoteBanner from './';
import enJSON from 'i18n/en.json';

jest.mock('queries/epochs/useVotingPeriodDatesQuery', () => ({
	__esModule: true,
	default: () => ({
		data: { votingPeriodEndDate: new Date().getTime() },
	}),
}));

jest.mock('react-i18next', () => ({
	useTranslation() {
		return {
			t: (path: string) => {
				if (path === 'banner.vote.headline') {
					return enJSON.banner.vote.headline;
				} else {
					return enJSON.banner.vote.closes;
				}
			},
		};
	},
}));

test('Vote Banner component should render the correct headline', () => {
	const Wrapper = getWrapper();
	render(
		<Wrapper>
			<VoteBanner deployedModule={DeployedModules.SPARTAN_COUNCIL}></VoteBanner>
		</Wrapper>
	);
	expect(screen.getByTestId('vote-banner-headline').textContent).toBe(enJSON.banner.vote.headline);
});

test('Vote Banner component should render the correct button text', () => {
	const Wrapper = getWrapper();
	render(
		<Wrapper>
			<VoteBanner deployedModule={DeployedModules.SPARTAN_COUNCIL}></VoteBanner>
		</Wrapper>
	);
	expect(
		screen.getByTestId('vote-banner-timer-text').textContent?.includes(enJSON.banner.vote.closes)
	).toBe(true);
});
test('Vote Banner component should render the time component when time is provided', () => {
	const Wrapper = getWrapper();
	render(
		<Wrapper>
			<VoteBanner deployedModule={DeployedModules.SPARTAN_COUNCIL} />
		</Wrapper>
	);
	expect(screen.getByTestId('vote-banner-timer').nodeName === 'DIV').toBe(true);
});
