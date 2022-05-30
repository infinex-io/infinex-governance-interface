import { Banner, TimeWrapper } from 'components/Banners';
import NominateModal from 'components/Modals/Nominate';
import RemainingTime from 'components/RemainingTime';
import { DeployedModules } from 'containers/Modules';
import { useModalContext } from 'containers/Modal';
import useCurrentEpochDatesQuery from 'queries/epochs/useEpochDatesQuery';
import { useTranslation } from 'react-i18next';
import { parseRemainingTime } from 'utils/time';

import { ArrowRightIcon, IconButton } from 'components/old-ui';

export default function NominateSelfBanner({
	deployedModule,
}: {
	deployedModule: DeployedModules;
}) {
	const { t } = useTranslation();
	const { data } = useCurrentEpochDatesQuery(deployedModule);
	const remainingTime = data?.epochStartDate && parseRemainingTime(data.epochStartDate);
	const { setContent, setIsOpen } = useModalContext();

	return (
		<Banner gradientColor="orange" justifyContent="center">
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
