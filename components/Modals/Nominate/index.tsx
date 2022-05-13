import { Button, Checkbox, Flex } from '@synthetixio/ui';
import Connector from 'containers/Connector';
import { DeployedModules } from 'containers/Modules/Modules';
import useNominateMutation from 'mutations/nomination/useNominateMutation';
import { useRouter } from 'next/router';
import useIsNominated from 'queries/nomination/useIsNominatedQuery';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import BaseModal from '../BaseModal';

export default function NominateModal() {
	const { t } = useTranslation();
	const { push } = useRouter();
	const [activeCheckbox, setActiveCheckbox] = useState('');
	const { walletAddress, ensName, connectWallet } = Connector.useContainer();
	const nominateForSpartanCouncil = useNominateMutation(DeployedModules.SPARTAN_COUNCIL);
	const nominateForGrantsCouncil = useNominateMutation(DeployedModules.GRANTS_COUNCIL);
	const nominateForAmbassadorCouncil = useNominateMutation(DeployedModules.AMBASSADOR_COUNCIL);
	const nominateForTreasuryCouncil = useNominateMutation(DeployedModules.TREASURY_COUNCIL);

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

	const handleNomination = async () => {
		switch (activeCheckbox) {
			case 'spartan':
				const spartanTx = await nominateForSpartanCouncil.mutateAsync();
				if (spartanTx) {
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
						walletAddress
							.substring(0, 5)
							.concat('...')
							.concat(walletAddress.substring(walletAddress.length - 4))
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
					disabled={isAlreadyNominatedForSpartan.data}
				/>
				<Checkbox
					id="grants-council-checkbox"
					onChange={() => {
						setActiveCheckbox('grants');
					}}
					label={t('modals.nomination.checkboxes.grants')}
					color="lightBlue"
					checked={activeCheckbox === 'grants'}
					disabled={isAlreadyNominatedForGrants.data}
				/>
				<Checkbox
					id="ambassador-council-checkbox"
					onChange={() => {
						setActiveCheckbox('ambassador');
					}}
					label={t('modals.nomination.checkboxes.ambassador')}
					color="lightBlue"
					checked={activeCheckbox === 'ambassador'}
					disabled={isAlreadyNominatedForAmbassador.data}
				/>
				<Checkbox
					id="treasury-council-checkbox"
					onChange={() => {
						setActiveCheckbox('treasury');
					}}
					label={t('modals.nomination.checkboxes.treasury')}
					color="lightBlue"
					checked={activeCheckbox === 'treasury'}
					disabled={isAlreadyNominatedForTreasury.data}
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

const StyledWalletAddress = styled.h3`
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
