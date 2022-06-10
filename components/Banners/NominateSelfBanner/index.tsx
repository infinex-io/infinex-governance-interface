import { Banner } from 'components/Banners';
import NominateModal from 'components/Modals/Nominate';
import { DeployedModules } from 'containers/Modules';
import { useModalContext } from 'containers/Modal';
import { useTranslation } from 'react-i18next';
import { ArrowRightIcon, IconButton } from 'components/old-ui';
import { Timer } from 'components/Timer';
import useNominationPeriodDatesQuery from 'queries/epochs/useNominationPeriodDatesQuery';
import { useEffect, useState } from 'react';

export default function NominateSelfBanner({
	deployedModule,
}: Record<'deployedModule', DeployedModules>) {
	const { t } = useTranslation();
	const { data } = useNominationPeriodDatesQuery(deployedModule);
	const { setContent, setIsOpen } = useModalContext();
	const [isMobile, setIsMobile] = useState(false);
	useEffect(() => {
		setIsMobile(window.innerWidth > 758);
	}, []);
	return (
		<Banner gradientColor="orange" justifyContent="center">
			<div className="flex px-2 darker-60 text-white items-center flex-wrap rounded max-w-[200px] md:mr-4 md:max-w-[400px] mr-auto">
				{t('banner.nominate.closes')}&nbsp;
				{data?.nominationPeriodEndDate && <Timer expiryTimestamp={data.nominationPeriodEndDate} />}
			</div>
			{isMobile ? (
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
			) : (
				<IconButton
					onClick={() => {
						setContent(<NominateModal />);
						setIsOpen(true);
					}}
					size="tiny"
					active
					rounded
				>
					<ArrowRightIcon />
				</IconButton>
			)}
		</Banner>
	);
}
