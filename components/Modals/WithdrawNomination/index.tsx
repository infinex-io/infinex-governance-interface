import { useTransactionModalContext } from '@synthetixio/ui';
import { Button, Flex } from 'components/old-ui';
import { useConnectorContext } from 'containers/Connector';
import { useModalContext } from 'containers/Modal';
import { DeployedModules } from 'containers/Modules';
import useWithdrawNominationMutation from 'mutations/nomination/useWithdrawNominationMutation';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { capitalizeString } from 'utils/capitalize';
import { truncateAddress } from 'utils/truncate-address';
import BaseModal from '../BaseModal';

interface WithdrawNominationModalProps {
	deployedModule: DeployedModules;
	council: string;
}

export default function WithdrawNominationModal({
	deployedModule,
	council,
}: WithdrawNominationModalProps) {
	const { t } = useTranslation();
	const { push } = useRouter();
	const { setIsOpen } = useModalContext();
	const { walletAddress, ensName, connectWallet } = useConnectorContext();
	const { setTxHash, setContent, setVisible, state, visible } = useTransactionModalContext();
	const withdrawNomination = useWithdrawNominationMutation(deployedModule);

	useEffect(() => {
		if (state === 'confirmed' && visible) {
			setTimeout(() => {
				setIsOpen(false);
				setVisible(false);
				push('/profile/' + walletAddress);
			}, 3000);
		}
	}, [state, push, setIsOpen, walletAddress, setVisible, visible]);

	const handleWithdrawNomination = async () => {
		setVisible(true);
		setContent(
			<>
				<h6 className="tg-tile-h6">
					{t('modals.withdraw.nomination-for', { council: capitalizeString(council) })}
				</h6>
				<h3 className="tg-title-h3">{ensName ? ensName : truncateAddress(walletAddress!)}</h3>
			</>
		);
		const tx = await withdrawNomination.mutateAsync();
		setTxHash(tx.hash);
	};

	return (
		<BaseModal headline={t('modals.withdraw.headline')}>
			<StyledBlackBox direction="column" alignItems="center">
				<StyledBlackBoxSubline>
					{t('modals.withdraw.nomination-for', { council: capitalizeString(council) })}
				</StyledBlackBoxSubline>
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
			<StyledButton onClick={() => handleWithdrawNomination()}>
				{t('modals.withdraw.button')}
			</StyledButton>
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
	font-size: 0.75rem;
	color: ${({ theme }) => theme.colors.grey};
	margin: 0;
`;

const StyledWalletAddress = styled.h3`
	font-family: 'Inter Bold';
	font-size: 1.5rem;
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
