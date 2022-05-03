import { ArrowRightIcon, IconButton } from '@synthetixio/ui';
import { BannerText, Banner, TimeWrapper } from 'components/Banners';
import RemainingTime from 'components/RemainingTime';
import { DeployedModules } from 'containers/Modules/Modules';
import { useRouter } from 'next/router';
import useCurrentEpochDatesQuery from 'queries/epochs/useCurrentEpochDatesQuery';
import { useTranslation } from 'react-i18next';
import { parseRemainingTime } from 'utils/time';

export default function NominateSelfBanner({ hideButton }: BannerProps) {
	const { t } = useTranslation();
	const { push } = useRouter();
	const { data } = useCurrentEpochDatesQuery(DeployedModules.SPARTAN_COUNCIL);
	const remainingTime = data?.epochStartDate && parseRemainingTime(data.epochStartDate);
	return (
		<Banner gradientColor="orange" justifyContent="center">
			<BannerText>{t('banner.nominate.headline')}</BannerText>
			<TimeWrapper alignItems="center" className="darker-60">
				{t('banner.nominate.closes')}
				{remainingTime && <RemainingTime>{remainingTime}</RemainingTime>}
			</TimeWrapper>
			{!hideButton && (
				<IconButton
					onClick={() => {
						push({ pathname: 'elections' });
					}}
					size="tiny"
					active
					rounded
				>
					{t('banner.nominate.self')}
					<ArrowRightIcon />
				</IconButton>
			)}
		</Banner>
	);
}
