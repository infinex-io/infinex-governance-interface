import { Button } from 'components/button';
import SNXIcon from 'components/Icons/SNXIcon';
import EditNominationModal from 'components/Modals/EditNomination';
import NominateModal from 'components/Modals/Nominate';
import { DeployedModules } from 'constants/config';
import { useConnectorContext } from 'containers/Connector';
import { useModalContext } from 'containers/Modal';
import { useCurrentPeriods } from 'queries/epochs/useCurrentPeriodQuery';
import useIsNominated from 'queries/nomination/useIsNominatedQuery';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export const NominateInVotingBanner: React.FC = () => {
	const { setIsOpen, setContent } = useModalContext();
	const { t } = useTranslation();
	const periodsData = useCurrentPeriods();
	const { walletAddress } = useConnectorContext();

	const isAlreadyNominatedForTrade = useIsNominated(
		DeployedModules.TRADE_COUNCIL,
		walletAddress || ''
	);
	const isAlreadyNominatedForEcosystem = useIsNominated(
		DeployedModules.ECOSYSTEM_COUNCIL,
		walletAddress || ''
	);
	const isAlreadyNominatedForCoreContributor = useIsNominated(
		DeployedModules.CORE_CONTRIBUTOR_COUNCIL,
		walletAddress || ''
	);
	const isAlreadyNominatedForTreasury = useIsNominated(
		DeployedModules.TREASURY_COUNCIL,
		walletAddress || ''
	);
	const isAlreadyNominated =
		isAlreadyNominatedForTrade.data ||
		isAlreadyNominatedForEcosystem.data ||
		isAlreadyNominatedForCoreContributor.data ||
		isAlreadyNominatedForTreasury.data;

	if (periodsData.find((periodData) => periodData.data?.currentPeriod !== 'VOTING')) return null;

	return (
		<div className="w-full p-[1px] bg-primary-dark rounded-[1px] mx-auto mt-4">
			<div className="flex md:flex-row flex-col gap-2 items-center justify-between w-full h-full bg-[#1B0F09] p-5">
				<div className="flex md:flex-row flex-col gap-2 items-center">
					<div className="bg-background-dark rounded-full h-10 w-10 flex items-center justify-center md:mr-4">
						<SNXIcon />
					</div>
					<div className="text-center md:text-left">
						<h3 className="tg-title-h3">{t('landing-page.nominate-banner.title')}</h3>
						<p className="tg-content mt-1">{t('landing-page.nominate-banner.subtitle')}</p>
					</div>
				</div>
				<Button
					onClick={() => {
						if (!walletAddress) {
							toast.warning('Please connect your wallet');
						}
						if (isAlreadyNominated) {
							toast.error('You already nominated yourself');
						}
						if (walletAddress && !isAlreadyNominated) {
							setContent(<NominateModal />);
							setIsOpen(true);
						}
					}}
					className="border-primary-dark"
					variant="outline"
					label={t('landing-page.nominate-banner.cta') as string}
				/>
			</div>
		</div>
	);
};
