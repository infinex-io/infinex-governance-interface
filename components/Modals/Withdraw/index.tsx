import { Button, Checkbox, Flex } from '@synthetixio/ui';
import Connector from 'containers/Connector';
import { DeployedModules } from 'containers/Modules/Modules';
import useWithdrawNominationMutation from 'mutations/nomination/useWithdrawNominationMutation';
import useCurrentPeriod from 'queries/epochs/useCurrentPeriodQuery';
import useIsNominated from 'queries/nomination/useIsNominatedQuery';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import BaseModal from '../BaseModal';

export default function WithdrawModal() {
	const { t } = useTranslation();
	const { walletAddress, ensName, connectWallet } = Connector.useContainer();
	const [activeCouncil, setActiveCouncil] = useState('spartan council');
	const withdrawNomination = useWithdrawNominationMutation(DeployedModules.SPARTAN_COUNCIL);
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
	return (
		<BaseModal headline={t('modals.withdraw.edit')}>
			<StyledBlackBox direction="column" alignItems="center">
				<StyledBlackBoxSubline>...</StyledBlackBoxSubline>
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
						setActiveCouncil('spartan');
					}}
					label={t('modals.nomination.checkboxes.spartan')}
					color="lightBlue"
					checked={activeCouncil === 'spartan'}
					disabled={
						isAlreadyNominatedForSpartan.data ||
						Number(isInNominationPeriodSpartan.data?.currentPeriod) === 1
					}
				/>
				<Checkbox
					id="grants-council-checkbox"
					onChange={() => {
						setActiveCouncil('grants');
					}}
					label={t('modals.nomination.checkboxes.grants')}
					color="lightBlue"
					checked={activeCouncil === 'grants'}
					disabled={
						isAlreadyNominatedForGrants.data ||
						Number(isInNominationPeriodGrants.data?.currentPeriod) === 1
					}
				/>
				<Checkbox
					id="ambassador-council-checkbox"
					onChange={() => {
						setActiveCouncil('ambassador');
					}}
					label={t('modals.nomination.checkboxes.ambassador')}
					color="lightBlue"
					checked={activeCouncil === 'ambassador'}
					disabled={
						isAlreadyNominatedForAmbassador.data ||
						Number(isInNominationPeriodAmbassador.data?.currentPeriod) === 1
					}
				/>
				<Checkbox
					id="treasury-council-checkbox"
					onChange={() => {
						setActiveCouncil('treasury');
					}}
					label={t('modals.nomination.checkboxes.treasury')}
					color="lightBlue"
					checked={activeCouncil === 'treasury'}
					disabled={
						isAlreadyNominatedForTreasury.data ||
						Number(isInNominationPeriodTreasury.data?.currentPeriod) === 1
					}
				/>
			</StyledCheckboxWrapper>
			<StyledButton onClick={() => {}}>{t('modals.withdraw.button')} </StyledButton>
		</BaseModal>
	);
}

const StyledBlackBox = styled(Flex)`
	background-color: ${({ theme }) => theme.colors.black};
	max-width: 314px;
	height: 80px;
	padding: 16px 50px;
	margin-bottom: ${({ theme }) => theme.spacings.medium};
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
const StyledButton = styled(Button)`
	max-width: 312px;
`;
