import { Button, CloseIcon, Flex, IconButton } from '@synthetixio/ui';
import Connector from 'containers/Connector';
import Modal from 'containers/Modal';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

interface WithdrawModalProps {
	council: string;
}

export default function WithdrawModal({ council }: WithdrawModalProps) {
	const { t } = useTranslation();
	const { setIsOpen } = Modal.useContainer();
	const [activeCheckbox, setActiveCheckbox] = useState('');
	const { walletAddress, ensName, connectWallet } = Connector.useContainer();
	return (
		<StyledNominateModalWrapper direction="column" alignItems="center">
			<StyledIconButton onClick={() => setIsOpen(false)} active rounded>
				<CloseIcon active />
			</StyledIconButton>
			<StyledModalHeadline>{t('modals.withdraw.headline')}</StyledModalHeadline>
			<StyledBlackBox direction="column" alignItems="center">
				<StyledBlackBoxSubline>
					{t('modals.withdraw.nomination-for', { council })}
				</StyledBlackBoxSubline>
				<StyledWalletAddress>
					{ensName ? (
						ensName
					) : walletAddress ? (
						walletAddress
							.substring(0, 5)
							.concat('...')
							.concat(walletAddress.substring(walletAddress.length - 4))
					) : (
						<Button
							onClick={() => connectWallet()}
							variant="primary"
							size="small"
							text={t('modals.nomination.checkboxes.connect-wallet')}
						/>
					)}
				</StyledWalletAddress>
			</StyledBlackBox>
			<Button onClick={() => {}} text={t('modals.withdraw.nomination')} />
		</StyledNominateModalWrapper>
	);
}

const StyledNominateModalWrapper = styled(Flex)`
	background: url('/images/modal-background.svg');
	height: 100%;
	width: 100%;
	background-repeat: no-repeat;
	background-size: contain;
	position: relative;
	padding-top: 10%;
`;

const StyledModalHeadline = styled.h1`
	font-family: 'Inter Bold';
	font-size: 3.33rem;
	color: ${({ theme }) => theme.colors.white};
`;

const StyledIconButton = styled(IconButton)`
	position: absolute;
	top: 40px;
	right: 40px;
`;

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
