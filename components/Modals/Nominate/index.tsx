import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button, useTransactionModalContext } from '@synthetixio/ui';
import { Checkbox } from 'components/old-ui';
import { useConnectorContext } from 'containers/Connector';
import { useModalContext } from 'containers/Modal';
import { DeployedModules } from 'containers/Modules';
import useNominateMutation from 'mutations/nomination/useNominateMutation';
import { useRouter } from 'next/router';
import useCurrentPeriod from 'queries/epochs/useCurrentPeriodQuery';
import useIsNominated from 'queries/nomination/useIsNominatedQuery';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from 'react-query';
import { truncateAddress } from 'utils/truncate-address';
import { useAccount } from 'wagmi';
import BaseModal from '../BaseModal';

export default function NominateModal() {
	const { t } = useTranslation();
	const { push } = useRouter();
	const { setIsOpen } = useModalContext();
	const [activeCheckbox, setActiveCheckbox] = useState('');
	const { ensName } = useConnectorContext();
	const { data } = useAccount();
	const { setVisible, setTxHash, setContent, state, visible, setState } =
		useTransactionModalContext();
	const queryClient = useQueryClient();
	const nominateForSpartanCouncil = useNominateMutation(DeployedModules.SPARTAN_COUNCIL);
	const nominateForGrantsCouncil = useNominateMutation(DeployedModules.GRANTS_COUNCIL);
	const nominateForAmbassadorCouncil = useNominateMutation(DeployedModules.AMBASSADOR_COUNCIL);
	const nominateForTreasuryCouncil = useNominateMutation(DeployedModules.TREASURY_COUNCIL);
	const isInNominationPeriodSpartan = useCurrentPeriod(DeployedModules.SPARTAN_COUNCIL);
	const isInNominationPeriodGrants = useCurrentPeriod(DeployedModules.GRANTS_COUNCIL);
	const isInNominationPeriodAmbassador = useCurrentPeriod(DeployedModules.AMBASSADOR_COUNCIL);
	const isInNominationPeriodTreasury = useCurrentPeriod(DeployedModules.TREASURY_COUNCIL);

	const isAlreadyNominatedForSpartan = useIsNominated(
		DeployedModules.SPARTAN_COUNCIL,
		data?.address || ''
	);
	const isAlreadyNominatedForGrants = useIsNominated(
		DeployedModules.GRANTS_COUNCIL,
		data?.address || ''
	);
	const isAlreadyNominatedForAmbassador = useIsNominated(
		DeployedModules.AMBASSADOR_COUNCIL,
		data?.address || ''
	);
	const isAlreadyNominatedForTreasury = useIsNominated(
		DeployedModules.TREASURY_COUNCIL,
		data?.address || ''
	);

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
	}, [state, setIsOpen, push, activeCheckbox, visible, setVisible, queryClient, data?.address]);
	/* @dev only for security reasons. For whatever the user ends up in a nomination modal although he already nominated himself, 
	we should block all the councils radio button */
	const isAlreadyNominated =
		isAlreadyNominatedForSpartan.data ||
		isAlreadyNominatedForGrants.data ||
		isAlreadyNominatedForAmbassador.data ||
		isAlreadyNominatedForTreasury.data;

	const setCTA = (council: string) => {
		return (
			<>
				<h6 className="tg-title-h6">{t('modals.nomination.cta', { council })}</h6>
				<h3 className="tg-title-h3">{ensName || truncateAddress(data?.address!)}</h3>
			</>
		);
	};

	const handleNomination = async () => {
		setState('signing');
		setVisible(true);
		try {
			switch (activeCheckbox) {
				case 'spartan':
					setContent(setCTA('Spartan'));
					const spartanTx = await nominateForSpartanCouncil.mutateAsync();
					setTxHash(spartanTx.hash);
					break;
				case 'grants':
					setContent(setCTA('Grants'));
					const grantsTx = await nominateForGrantsCouncil.mutateAsync();
					setTxHash(grantsTx.hash);
					break;
				case 'ambassador':
					setContent(setCTA('Ambassador'));
					const ambassadorTx = await nominateForAmbassadorCouncil.mutateAsync();
					setTxHash(ambassadorTx.hash);
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
			{!data?.connector ? (
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
						<h3 className="text-white tg-title-h3">{ensName || truncateAddress(data!.address!)}</h3>
					</div>
					<div className="flex justify-center flex-col md:flex-row gap-4 m-10 max-w-[190px] w-full md:max-w-none">
						<Checkbox
							id="spartan-council-checkbox"
							onChange={() => {
								setActiveCheckbox('spartan');
							}}
							label={t('modals.nomination.checkboxes.spartan')}
							color="lightBlue"
							checked={activeCheckbox === 'spartan'}
							disabled={
								isAlreadyNominated ||
								isInNominationPeriodSpartan.data?.currentPeriod !== 'NOMINATION'
							}
						/>
						<Checkbox
							id="grants-council-checkbox"
							onChange={() => {
								setActiveCheckbox('grants');
							}}
							label={t('modals.nomination.checkboxes.grants')}
							color="lightBlue"
							checked={activeCheckbox === 'grants'}
							disabled={
								isAlreadyNominated ||
								isInNominationPeriodGrants.data?.currentPeriod !== 'NOMINATION'
							}
						/>
						<Checkbox
							id="ambassador-council-checkbox"
							onChange={() => {
								setActiveCheckbox('ambassador');
							}}
							label={t('modals.nomination.checkboxes.ambassador')}
							color="lightBlue"
							checked={activeCheckbox === 'ambassador'}
							disabled={
								isAlreadyNominated ||
								isInNominationPeriodAmbassador.data?.currentPeriod !== 'NOMINATION'
							}
						/>
						<Checkbox
							id="treasury-council-checkbox"
							onChange={() => {
								setActiveCheckbox('treasury');
							}}
							label={t('modals.nomination.checkboxes.treasury')}
							color="lightBlue"
							checked={activeCheckbox === 'treasury'}
							disabled={
								isAlreadyNominated ||
								isInNominationPeriodTreasury.data?.currentPeriod !== 'NOMINATION'
							}
						/>
					</div>
					<Button
						className="w-[313px]"
						onClick={() => handleNomination()}
						disabled={!activeCheckbox}
					>
						{t('modals.nomination.button')}
					</Button>
				</div>
			)}
		</BaseModal>
	);
}
