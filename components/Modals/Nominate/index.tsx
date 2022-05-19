import { Button, Checkbox, Flex } from 'components/old-ui';
import { H3 } from 'components/Headlines/H3';
import { useConnectorContext } from 'containers/Connector';
import { useModalContext } from 'containers/Modal';
import { DeployedModules } from 'containers/Modules';
import useNominateMutation from 'mutations/nomination/useNominateMutation';
import { useRouter } from 'next/router';
import useCurrentPeriod from 'queries/epochs/useCurrentPeriodQuery';
import useIsNominated from 'queries/nomination/useIsNominatedQuery';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { truncateAddress } from 'utils/truncate-address';
import BaseModal from '../BaseModal';

export default function NominateModal() {
	const { t } = useTranslation();
	const { push } = useRouter();
	const { setIsOpen } = useModalContext();
	const [activeCheckbox, setActiveCheckbox] = useState('');
	const { walletAddress, ensName, connectWallet } = useConnectorContext();
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

	/* @dev only for security reasons. For whatever the user ends up in a nomination modal although he already nominated himself, 
	we should block all the councils radio button */
	const isAlreadyNominated =
		isAlreadyNominatedForSpartan.data ||
		isAlreadyNominatedForGrants.data ||
		isAlreadyNominatedForAmbassador.data ||
		isAlreadyNominatedForTreasury.data;

	const handleNomination = async () => {
		switch (activeCheckbox) {
			case 'spartan':
				const spartanTx = await nominateForSpartanCouncil.mutateAsync();
				if (spartanTx) {
					setIsOpen(false);
					push({
						pathname: '/councils',
						query: {
							council: 'spartan',
							nominees: true,
						},
					});
				}
				break;
			case 'grants':
				const grantsTx = await nominateForGrantsCouncil.mutateAsync();
				if (grantsTx) {
					setIsOpen(false);
					push({
						pathname: '/councils',
						query: {
							council: 'grants',
							nominees: true,
						},
					});
				}
				break;
			case 'ambassador':
				const ambassadorTx = await nominateForAmbassadorCouncil.mutateAsync();
				if (ambassadorTx) {
					setIsOpen(false);
					push({
						pathname: '/councils',
						query: {
							council: 'ambassador',
							nominees: true,
						},
					});
				}
				break;
			case 'treasury':
				const treasuryTx = await nominateForTreasuryCouncil.mutateAsync();
				if (treasuryTx) {
					setIsOpen(false);
					push({
						pathname: '/councils',
						query: {
							council: 'treasury',
							nominees: true,
						},
					});
				}
				break;
			default:
				console.info('no matching entity found');
		}
	};

	return (
		<BaseModal headline={t('modals.nomination.headline')}>
			<StyledBlackBox direction="column" alignItems="center">
				<StyledBlackBoxSubline>{t('modals.nomination.nominationAddress')}</StyledBlackBoxSubline>
				<StyledWalletAddress>
					{ensName ? (
						ensName
					) : walletAddress ? (
						truncateAddress(walletAddress)
					) : (
						<Button onClick={() => connectWallet()} variant="primary" size="small">
							{t('modals.nomination.checkboxes.connect-wallet')}
						</Button>
					)}
				</StyledWalletAddress>
			</StyledBlackBox>
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
			<StyledNominateButton variant="primary" onClick={() => handleNomination()}>
				{t('modals.nomination.button')}
			</StyledNominateButton>
		</BaseModal>
	);
}

const StyledBlackBox = styled(Flex)`
	background-color: ${({ theme }) => theme.colors.black};
	max-width: 314px;
	height: 80px;
	padding: 16px 50px;
`;

const StyledBlackBoxSubline = styled.h6`
	font-family: 'Inter Bold';
	font-size: 1rem;
	color: ${({ theme }) => theme.colors.grey};
	margin: 0;
`;

const StyledWalletAddress = styled(H3)`
	font-family: 'Inter Bold';
	font-size: 2rem;
	margin: ${({ theme }) => theme.spacings.tiniest};
	color: ${({ theme }) => theme.colors.white};
`;

const StyledCheckboxWrapper = styled(Flex)`
	margin: ${({ theme }) => theme.spacings.superBig} 0px;
	width: 100%;
	> * {
		margin: ${({ theme }) => theme.spacings.medium};
	}
`;

const StyledNominateButton = styled(Button)`
	max-width: 312px;
`;
