import { Banner, TimeWrapper } from 'components/Banners';
import NominateModal from 'components/Modals/Nominate';
import { DeployedModules } from 'containers/Modules';
import { useModalContext } from 'containers/Modal';
import { useTranslation } from 'react-i18next';
import { ArrowRightIcon, IconButton } from 'components/old-ui';
import { Timer } from 'components/Timer';
import useNominationPeriodDatesQuery from 'queries/epochs/useNominationPeriodDatesQuery';

export default function NominateSelfBanner({
	deployedModule,
}: Record<'deployedModule', DeployedModules>) {
	const { t } = useTranslation();
	const { data } = useNominationPeriodDatesQuery(deployedModule);

	const { setContent, setIsOpen } = useModalContext();

	return (
		<Banner gradientColor="orange" justifyContent="center">
			<TimeWrapper alignItems="center" className="darker-60">
				{t('banner.nominate.closes')}
				{data?.nominationPeriodEndDate && <Timer expiryTimestamp={data.nominationPeriodEndDate} />}
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
