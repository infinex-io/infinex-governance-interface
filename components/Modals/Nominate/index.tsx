import { ConnectButton } from 'components/ConnectButton';
import { Checkbox, ExternalLink, useTransactionModalContext } from '@synthetixio/ui';
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
import parseCouncil from 'utils/parseCouncil';
import { CopyClipboard } from 'components/CopyClipboard/CopyClipboard';
import EtherscanIcon from 'components/Icons/EtherscanIcon';
import Link from 'next/link';

interface Council {
	council: "trade" | "ecosystem" | "core-contributor" | "treasury"
}

export default function NominateModal({ council } : Council) {
	const { t } = useTranslation();
	const { push } = useRouter();
	const { setIsOpen } = useModalContext();
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
					push('/councils/'.concat(council));
				});
		}
	}, [state, setIsOpen, push, visible, setVisible, queryClient, walletAddress]);

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
			switch (council) {
				case 'trade':
					setContent(setCTA('Trader'));
					const tradeTx = await nominateForTradeCouncil.mutateAsync();
					setTxHash(tradeTx.hash);
					break;
				case 'ecosystem':
					setContent(setCTA('Ecosystem'));
					const ecosystemTx = await nominateForEcosystemCouncil.mutateAsync();
					setTxHash(ecosystemTx.hash);
					break;
				case 'core-contributor':
					setContent(setCTA('Core Contributor'));
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
				<div className="mt-10">
					<ConnectButton />
				</div>
			) : (
				<div className="px-2 flex flex-col items-center max-w-[700px]">
					<span
						className={`bg-[#15262A] text-[#31C690] p-2 rounded font-medium text-xs 
						text-center my-2 w-fit self-center`}
						data-testid="cta-text"
					>
						{`${parseCouncil(council)} Seat`}
					</span>
					<div className="flex flex-col items-center px-12 py-6 rounded mt-1">
						<h5 className="text-sm font-semibold text-slate-100 mb-3 uppercase">
							{t('modals.nomination.nominationAddress')}
						</h5>
						<div className="flex items-center gap-2">
							<h3 className="text-slate-0 font-black">{ensName || truncateAddress(walletAddress!)}</h3>
							<CopyClipboard fill='#BCC1D7' text={walletAddress || ""} />
							<Link href={`https://optimistic.etherscan.io/address/${walletAddress}`} target="_blank">
								<EtherscanIcon fill='#BCC1D7' width={16} height={14.8}/>
							</Link>
						</div>
					</div>
					{isAlreadyNominated && 
					<div className="text-sm mt-10"> 
						{t('modals.nomination.already-nominated')}
					</div>
					}
					<Button
						onClick={() => handleNomination()}
						label={t('modals.nomination.button') as string}
						disabled={isAlreadyNominated}
						variant={isAlreadyNominated ? "destructive" : "primary"}
						className={`px-8 mt-10 ${isAlreadyNominated ? "cursor-not-allowed" : ""}`}
					/>
				</div>
			)}
		</BaseModal>
	);
}
