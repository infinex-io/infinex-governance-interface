import { ConnectButton } from 'components/ConnectButton';
import { Checkbox, useTransactionModalContext } from '@synthetixio/ui';
import { Button } from 'components/button';
import { COUNCILS_DICTIONARY } from 'constants/config';
import { useConnectorContext } from 'containers/Connector';
import { useModalContext } from 'containers/Modal';
import { DeployedModules } from 'containers/Modules';
import useNominateMutation from 'mutations/nomination/useNominateMutation';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { truncateAddress } from 'utils/truncate-address';
import BaseModal from '../BaseModal';
import useIsNominated from 'queries/nomination/useIsNominatedQuery';
import { useCurrentPeriods } from 'queries/epochs/useCurrentPeriodQuery';

export default function NominateModal() {
	const { t } = useTranslation();
	const { push } = useRouter();
	const { setIsOpen } = useModalContext();
	const [activeCheckbox, setActiveCheckbox] = useState('');
	const { ensName, walletAddress, isWalletConnected } = useConnectorContext();
	const { setVisible, setTxHash, setContent, state, visible, setState } =
		useTransactionModalContext();
	const queryClient = useQueryClient();

	const nominateForTradeCouncil = useNominateMutation(DeployedModules.TRADE_COUNCIL);
	const nominateForEcosystemCouncil = useNominateMutation(DeployedModules.ECOSYSTEM_COUNCIL);
	const nominateForCoreContributorCouncil = useNominateMutation(DeployedModules.CORE_CONTRIBUTOR_COUNCIL);
	const nominateForTreasuryCouncil = useNominateMutation(DeployedModules.TREASURY_COUNCIL);

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

	const periodsData = useCurrentPeriods();

	const shouldBeDisabled = (council: string) => {
		const periodForCouncil = periodsData.find((periodData) => periodData.data?.council === council);
		if (periodForCouncil) {
			return periodForCouncil.data?.currentPeriod === 'ADMINISTRATION';
		}
		return true;
	};

	useEffect(() => {
		if (state === 'confirmed' && visible) {
			queryClient.invalidateQueries({
				queryKey: ['nominees'],
			});
			queryClient
				.refetchQueries({
					stale: true,
					active: true,
				})
				.then(() => {
					setIsOpen(false);
					setVisible(false);
					push('/councils/'.concat(activeCheckbox));
				});
		}
	}, [state, setIsOpen, push, activeCheckbox, visible, setVisible, queryClient, walletAddress]);

	const setCTA = (council: string) => {
		return (
			<>
				<h6 className="tg-title-h6">{t('modals.nomination.cta', { council })}</h6>
				<h3 className="tg-title-h3">{ensName || truncateAddress(walletAddress!)}</h3>
			</>
		);
	};

	const handleNomination = async () => {
		setState('signing');
		setVisible(true);
		try {
			switch (activeCheckbox) {
				case 'trade':
					setContent(setCTA('Trade'));
					const tradeTx = await nominateForTradeCouncil.mutateAsync();
					setTxHash(tradeTx.hash);
					break;
				case 'ecosystem':
					setContent(setCTA('Ecosystem'));
					const ecosystemTx = await nominateForEcosystemCouncil.mutateAsync();
					setTxHash(ecosystemTx.hash);
					break;
				case 'core-contributor':
					setContent(setCTA('CoreContributor'));
					const coreContributorTx = await nominateForCoreContributorCouncil.mutateAsync();
					setTxHash(coreContributorTx.hash);
					break;
				case 'treasury':
					setContent(setCTA('Treasury'));
					const treasuryTx = await nominateForTreasuryCouncil.mutateAsync();
					setTxHash(treasuryTx.hash);
					break;
				default:
					console.info('no matching entity found');
			}
		} catch (error) {
			console.error(error);
			setState('error');
		}
	};

	return (
		<BaseModal headline={t('modals.nomination.headline')}>
			{!isWalletConnected ? (
				<ConnectButton />
			) : (
				<div className="px-2 flex flex-col items-center max-w-[700px]">
					<span className="tg-content text-gray-500 py-2 text-center">
						{t('modals.nomination.subline')}
					</span>
					<div className="flex flex-col items-center bg-black px-12 py-8 rounded mt-4">
						<h5 className="tg-title-h5 text-gray-300 mb-1">
							{t('modals.nomination.nominationAddress')}
						</h5>
						<h3 className="text-white tg-title-h3">{ensName || truncateAddress(walletAddress!)}</h3>
					</div>
					<div className="flex justify-center flex-col md:flex-row gap-4 m-10 max-w-[190px] w-full md:max-w-none">
						{COUNCILS_DICTIONARY.map((council) => (
							<Checkbox
								key={`${council.slug}-council-checkbox`}
								id={`${council.slug}-council-checkbox`}
								onChange={() => setActiveCheckbox(council.slug)}
								label={t('modals.nomination.checkboxes.'.concat(council.slug))}
								color="lightBlue"
								checked={activeCheckbox === council.slug}
								disabled={shouldBeDisabled(council.slug) || isAlreadyNominated}
							/>
						))}
					</div>
					<Button
						className="w-[313px]"
						onClick={() => handleNomination()}
						disabled={!activeCheckbox}
						label={t('modals.nomination.button') as string}
					/>
				</div>
			)}
		</BaseModal>
	);
}
