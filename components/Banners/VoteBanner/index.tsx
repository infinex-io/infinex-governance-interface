import { Banner, BannerText, TimeWrapper } from 'components/Banners';
import { Timer } from 'components/Timer';
import { DeployedModules } from 'containers/Modules/Modules';
import useVotingPeriodDatesQuery from 'queries/epochs/useVotingPeriodDatesQuery';
import { useTranslation } from 'react-i18next';

export default function VoteBanner({ deployedModule }: { deployedModule: DeployedModules }) {
	const { t } = useTranslation();
	const { data } = useVotingPeriodDatesQuery(deployedModule);

	return (
		<Banner color="green" justifyContent="center" alignItems="center">
			<BannerText>{t('banner.vote.headline')}</BannerText>
			<TimeWrapper className="darker-60" alignItems="center">
				{t('banner.vote.closes')}
				{data?.votingPeriodStartDate && <Timer expiryTimestamp={data.votingPeriodStartDate} />}
			</TimeWrapper>
		</Banner>
	);
}
