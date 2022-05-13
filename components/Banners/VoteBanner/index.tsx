import { ArrowRightIcon, IconButton } from '@synthetixio/ui';
import { Banner, BannerText, TimeWrapper } from 'components/Banners';
import RemainingTime from 'components/RemainingTime';
import { DeployedModules } from 'containers/Modules/Modules';
import { useRouter } from 'next/router';
import useVotingPeriodDatesQuery from 'queries/epochs/useVotingPeriodDatesQuery';
import { useTranslation } from 'react-i18next';
import { parseRemainingTime } from 'utils/time';

export default function VoteBanner() {
	const { push } = useRouter();
	const { t } = useTranslation();
	const { data } = useVotingPeriodDatesQuery(DeployedModules.SPARTAN_COUNCIL);
	const remainingTime = data?.votingPeriodEndDate && parseRemainingTime(data.votingPeriodEndDate);

	return (
		<Banner color="green" justifyContent="center">
			<BannerText>{t('banner.vote.headline')}</BannerText>
			<TimeWrapper className="darker-60" alignItems="center">
				{t('banner.vote.closes')}
				{remainingTime && <RemainingTime>{remainingTime}</RemainingTime>}
			</TimeWrapper>
			<IconButton
				onClick={() => {
					push({ pathname: 'elections' });
				}}
				size="tiny"
				active
				rounded
			>
				{t('banner.vote.button')}
				<ArrowRightIcon />
			</IconButton>
		</Banner>
	);
}
