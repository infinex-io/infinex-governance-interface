import { Banner, BannerText, TimeWrapper } from 'components/Banners';
import RemainingTime from 'components/RemainingTime';
import { DeployedModules } from 'containers/Modules/Modules';
import useVotingPeriodDatesQuery from 'queries/epochs/useVotingPeriodDatesQuery';
import { useTranslation } from 'react-i18next';
import { parseRemainingTime } from 'utils/time';

export default function VoteBanner() {
	const { t } = useTranslation();
	const { data } = useVotingPeriodDatesQuery(DeployedModules.SPARTAN_COUNCIL);
	const remainingTime =
		data?.votingPeriodStartDate && parseRemainingTime(data.votingPeriodStartDate);

	return (
		<Banner color="green" justifyContent="center" alignItems="center">
			<BannerText>{t('banner.vote.headline')}</BannerText>
			<TimeWrapper className="darker-60" alignItems="center">
				{t('banner.vote.closes')}
				{remainingTime && <RemainingTime>{remainingTime}</RemainingTime>}
			</TimeWrapper>
		</Banner>
	);
}
