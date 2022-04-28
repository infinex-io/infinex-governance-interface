import { CloseIcon, Flex, IconButton } from '@synthetixio/ui';
import Modal from 'containers/Modal';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

export default function NominateModal() {
	const { t } = useTranslation();
	const { setIsOpen } = Modal.useContainer();
	return (
		<StyledNominateModalWrapper direction="column" alignItems="center">
			<StyledIconButton onClick={() => setIsOpen(false)} active rounded>
				<CloseIcon active />
			</StyledIconButton>
			<StyledModalHeadline>{t('modals.nomination.headline')}</StyledModalHeadline>
			<StyledBlackBox direction="column" alignItems="center">
				<StyledBlackBoxSubline>{t('modals.nomination.nominationAddress')}</StyledBlackBoxSubline>
				<StyledWalletAddress>0x0...000</StyledWalletAddress>
			</StyledBlackBox>
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
