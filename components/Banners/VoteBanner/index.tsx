import { Timer } from 'components/Timer';
import { DeployedModules } from 'containers/Modules/Modules';
import useVotingPeriodDatesQuery from 'queries/epochs/useVotingPeriodDatesQuery';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function VoteBanner({ deployedModule }: { deployedModule: DeployedModules }) {
	const { t } = useTranslation();
	const { data } = useVotingPeriodDatesQuery(deployedModule);
	const [isMobile, setIsMobile] = useState(false);
	useEffect(() => {
		if (typeof window !== 'undefined') {
			setIsMobile(window.innerWidth > 758);
		}
	}, []);

	return (
		<div className="flex justify-center items-center bg-green p-2">
			<h3 className="tg-title-h3">{t('banner.vote.headline')}</h3>
			<div className="darker-60">
				{t('banner.vote.closes')}
				{data?.votingPeriodEndDate && <Timer expiryTimestamp={data.votingPeriodEndDate}></Timer>}
			</div>
		</div>
	);
}
