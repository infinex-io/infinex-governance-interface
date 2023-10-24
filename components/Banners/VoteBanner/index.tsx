import { Timer } from 'components/Timer';
import { DeployedModules } from 'containers/Modules/Modules';
import useVotingPeriodDatesQuery from 'queries/epochs/useVotingPeriodDatesQuery';
import { useTranslation } from 'react-i18next';

export default function VoteBanner({ deployedModule }: { deployedModule: DeployedModules }) {
	const { t } = useTranslation();
	const { data } = useVotingPeriodDatesQuery(deployedModule);

	return (
		<div className="flex justify-center md:flex-nowrap flex-wrap items-center bg-secondary p-2 w-full">
			<div
				className="md:mr-8 text-black tg-caption-bold md:p-0 p-2"
				data-testid="vote-banner-headline"
			>
				{t('banner.vote.headline')}
			</div>
			<div className="darker-60 flex py-2 rounded px-4" data-testid="vote-banner-timer-text">
				{t('banner.vote.closes')}
				{data?.votingPeriodEndDate && (
					<Timer
						expiryTimestamp={data.votingPeriodEndDate}
						className="ml-5"
						data-testid="vote-banner-timer"
					></Timer>
				)}
			</div>
		</div>
	);
}
