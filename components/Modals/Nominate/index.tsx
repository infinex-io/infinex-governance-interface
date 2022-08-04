import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Button, Checkbox, useTransactionModalContext } from '@synthetixio/ui';
import { COUNCILS_DICTIONARY } from 'constants/config';
import { useConnectorContext } from 'containers/Connector';
import { useModalContext } from 'containers/Modal';
import { DeployedModules } from 'containers/Modules';
import useNominateMutation from 'mutations/nomination/useNominateMutation';
import { useRouter } from 'next/router';
import { useCurrentPeriods } from 'queries/epochs/useCurrentPeriodQuery';
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
	const periodsData = useCurrentPeriods();

	const shouldBeDisabled = (council: string) => {
		const periodForCouncil = periodsData.find((periodData) => periodData.data?.council === council);
		return periodForCouncil ? periodForCouncil.data?.currentPeriod !== 'NOMINATION' : true;
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
	}, [state, setIsOpen, push, activeCheckbox, visible, setVisible, queryClient, data?.address]);

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
						{COUNCILS_DICTIONARY.map((council) => (
							<Checkbox
								key={`${council.slug}-council-checkbox`}
								id={`${council.slug}-council-checkbox`}
								onChange={() => setActiveCheckbox(council.slug)}
								label={t('modals.nomination.checkboxes'.concat(council.slug))}
								color="lightBlue"
								checked={activeCheckbox === council.slug}
								disabled={shouldBeDisabled(council.slug)}
							/>
						))}
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
