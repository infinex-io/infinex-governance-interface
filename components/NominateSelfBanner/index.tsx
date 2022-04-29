import { ArrowRightIcon, Flex, IconButton } from '@synthetixio/ui';
import { BannerText, Banner, TimeWrapper } from 'components/Banner';
import NominateModal from 'components/Modals/Nominate';
import RemainingTime from 'components/RemainingTime';
import Modal from 'containers/Modal';
import { DeployedModules } from 'containers/Modules/Modules';
import useCurrentEpochDatesQuery from 'queries/epochs/useCurrentEpochDatesQuery';
import { useTranslation } from 'react-i18next';
import { parseRemainingTime } from 'utils/time';

export default function NominateSelfBanner() {
	const { setIsOpen, setContent } = Modal.useContainer();
	const { t } = useTranslation();
	const { data } = useCurrentEpochDatesQuery(DeployedModules.SPARTAN_COUNCIL);
	const remainingTime = data?.epochStartDate && parseRemainingTime(data.epochStartDate);
	return (
		<Banner gradientColor="orange" justifyContent="center">
			<BannerText>{t('banner.nominate.headline')}</BannerText>
			<TimeWrapper alignItems="center" className="darker-60">
				{t('banner.nominate.closes')}
				{remainingTime && <RemainingTime>{remainingTime}</RemainingTime>}
			</TimeWrapper>
			<IconButton
				onClick={() => {
					setContent(<NominateModal />);
					setIsOpen(true);
				}}
				size="tiny"
				active
				rounded
			>
				{t('banner.nominate.self')}
				<ArrowRightIcon />
			</IconButton>
		</Banner>
	);
}
