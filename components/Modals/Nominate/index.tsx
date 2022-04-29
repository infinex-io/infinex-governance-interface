import { Button, Checkbox, CloseIcon, Flex, IconButton } from '@synthetixio/ui';
import Connector from 'containers/Connector';
import Modal from 'containers/Modal';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

export default function NominateModal() {
	const { t } = useTranslation();
	const { setIsOpen } = Modal.useContainer();
	const [activeCheckbox, setActiveCheckbox] = useState('');
	const { walletAddress, ensName, connectWallet } = Connector.useContainer();
	return (
		<StyledNominateModalWrapper direction="column" alignItems="center">
			<StyledIconButton onClick={() => setIsOpen(false)} active rounded>
				<CloseIcon active />
			</StyledIconButton>
			<StyledModalHeadline>{t('modals.nomination.headline')}</StyledModalHeadline>
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
						<Button
							onClick={() => connectWallet()}
							variant="primary"
							size="small"
							text={t('modals.nomination.checkboxes.connect-wallet')}
						/>
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
				/>
				<Checkbox
					id="grants-council-checkbox"
					onChange={() => {
						setActiveCheckbox('grants');
					}}
					label={t('modals.nomination.checkboxes.grants')}
					color="lightBlue"
					checked={activeCheckbox === 'grants'}
				/>
				<Checkbox
					id="ambassador-council-checkbox"
					onChange={() => {
						setActiveCheckbox('ambassador');
					}}
					label={t('modals.nomination.checkboxes.ambassador')}
					color="lightBlue"
					checked={activeCheckbox === 'ambassador'}
				/>
				<Checkbox
					id="treasury-council-checkbox"
					onChange={() => {
						setActiveCheckbox('treasury');
					}}
					label={t('modals.nomination.checkboxes.treasury')}
					color="lightBlue"
					checked={activeCheckbox === 'treasury'}
				/>
			</StyledCheckboxWrapper>
			<Button
				variant="primary"
				onClick={() => {
					console.log('implement me');
				}}
				text="Nominate Self"
			/>
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

const StyledBlackBox = styled(Flex)`
	background-color: ${({ theme }) => theme.colors.black};
	max-width: 314px;
	height: 80px;
	padding: 16px 50px;
`;

const StyledIconButton = styled(IconButton)`
	position: absolute;
	top: 40px;
	right: 40px;
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
