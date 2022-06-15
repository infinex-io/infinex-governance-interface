import { Timer } from 'components/Timer';
import { DeployedModules } from 'containers/Modules/Modules';
import useVotingPeriodDatesQuery from 'queries/epochs/useVotingPeriodDatesQuery';
import { useTranslation } from 'react-i18next';

export default function VoteBanner({ deployedModule }: { deployedModule: DeployedModules }) {
	const { t } = useTranslation();
	const { data } = useVotingPeriodDatesQuery(deployedModule);

	return (
		<div className="flex justify-center md:flex-nowrap flex-wrap items-center bg-[#2cc294] p-2">
			<div className="md:mr-8 text-black tg-caption-bold md:p-0 p-2">
				{t('banner.vote.headline')}
			</div>
			<div className="darker-60 flex py-2 rounded px-4">
				{t('banner.vote.closes')}
				{data?.votingPeriodEndDate && (
					<Timer expiryTimestamp={data.votingPeriodEndDate} className="ml-5"></Timer>
				)}
			</div>
		</div>
	);
}
