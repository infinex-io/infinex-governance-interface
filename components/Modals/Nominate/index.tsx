import { Button, useTransactionModalContext } from '@synthetixio/ui';
import { Checkbox, Flex } from 'components/old-ui';
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
import styled from 'styled-components';
import { truncateAddress } from 'utils/truncate-address';
import BaseModal from '../BaseModal';

export default function NominateModal() {
	const { t } = useTranslation();
	const { push } = useRouter();
	const { setIsOpen } = useModalContext();
	const [activeCheckbox, setActiveCheckbox] = useState('');
	const { walletAddress, ensName, connectWallet } = useConnectorContext();
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
		walletAddress || ''
	);
	const isAlreadyNominatedForGrants = useIsNominated(
		DeployedModules.GRANTS_COUNCIL,
		walletAddress || ''
	);
	const isAlreadyNominatedForAmbassador = useIsNominated(
		DeployedModules.AMBASSADOR_COUNCIL,
		walletAddress || ''
	);
	const isAlreadyNominatedForTreasury = useIsNominated(
		DeployedModules.TREASURY_COUNCIL,
		walletAddress || ''
	);

	useEffect(() => {
		if (state === 'confirmed' && visible) {
			setTimeout(() => {
				queryClient.refetchQueries({
					active: true,
					queryKey: ['allCouncilMembers'],
				});
				queryClient.resetQueries({
					queryKey: 'nominees',
				});
				setIsOpen(false);
				setVisible(false);
				push('/councils/'.concat(activeCheckbox));
			}, 2000);
		}
	}, [state, setIsOpen, push, activeCheckbox, visible, setVisible, queryClient]);

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
				<h3 className="tg-title-h3">{ensName || truncateAddress(walletAddress!)}</h3>
			</>
		);
	};

	const handleNomination = async () => {
		setState('signing');
		setVisible(true);
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
	};

	return (
		<BaseModal headline={t('modals.nomination.headline')}>
			<div className="flex flex-col items-center bg-black px-12 py-3 rounded">
				<StyledBlackBoxSubline>{t('modals.nomination.nominationAddress')}</StyledBlackBoxSubline>
				<div className="text-white tg-title-h5">
					{ensName ? (
						ensName
					) : walletAddress ? (
						truncateAddress(walletAddress)
					) : (
						<Button variant="outline" className="mt-2" onClick={() => connectWallet()}>
							{t('modals.nomination.checkboxes.connect-wallet')}
						</Button>
					)}
				</div>
			</div>
			<StyledCheckboxWrapper justifyContent="center">
				<Checkbox
					id="spartan-council-checkbox"
					onChange={() => {
						setActiveCheckbox('spartan');
					}}
					label={t('modals.nomination.checkboxes.spartan')}
					color="lightBlue"
					checked={activeCheckbox === 'spartan'}
					disabled={
						isAlreadyNominated || isInNominationPeriodSpartan.data?.currentPeriod !== 'NOMINATION'
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
						isAlreadyNominated || isInNominationPeriodGrants.data?.currentPeriod !== 'NOMINATION'
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
						isAlreadyNominated || isInNominationPeriodTreasury.data?.currentPeriod !== 'NOMINATION'
					}
				/>
			</StyledCheckboxWrapper>
			<Button disabled={!activeCheckbox} className="w-[313px]" onClick={() => handleNomination()}>
				{t('modals.nomination.button')}
			</Button>
		</BaseModal>
	);
}

const StyledBlackBoxSubline = styled.h6`
	font-family: 'Inter Bold';
	font-size: 0.75rem;
	color: ${({ theme }) => theme.colors.grey};
	margin: 0;
`;

const StyledCheckboxWrapper = styled(Flex)`
	margin: ${({ theme }) => theme.spacings.superBig} 0px;
	width: 100%;
	> * {
		margin: ${({ theme }) => theme.spacings.medium};
	}
`;
