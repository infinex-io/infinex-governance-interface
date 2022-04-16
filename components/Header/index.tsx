import styled from 'styled-components';
import { theme, IconButton, SettingsIcon, SNXIcon, Button } from '@synthetixio/ui';
import { useTranslation } from 'react-i18next';
import SpotlightButton from '../SpotlightButton';
import { useRouter } from 'next/router';
import { useConnector } from '../../hooks/useConnector';

export default function Header() {
	const { push, route } = useRouter();
	const { t } = useTranslation();
	const { connectWallet, ensName, ensAvatar, walletAddress } = useConnector();

	const routes = [
		t('header.routes.home'),
		t('header.routes.elections'),
		t('header.routes.sips'),
		t('header.routes.discuss'),
		t('header.routes.vote'),
	];

	const handleIndexAndRouteChange = (index: number) => {
		push(index === 0 ? '' : routes[index].toLowerCase());
	};

	const isActiveRoute = (index: number) => {
		if (!index) return true;
		const splitRoute = route.split('/');
		return routes[index].toLowerCase() === splitRoute[0].toLowerCase();
	};
	return (
		<StyledHeader>
			<SNXIcon />
			<StyledHeaderHeadline>Governance</StyledHeaderHeadline>
			{routes.map((translation, index) => {
				const isActive = isActiveRoute(index);
				return (
					<StyledSpotlightButton
						text={translation}
						onClick={() => handleIndexAndRouteChange(index)}
						active={isActive}
						key={translation}
					/>
				);
			})}
			<ButtonContainer>
				<IconButton
					icon={<SettingsIcon />}
					size="tiny"
					active={true}
					onClick={() => console.info('implement me')}
				/>
				<StyledConnectWalletButton
					text={
						!walletAddress
							? t('header.connect-wallet')
							: ensName
							? ensName
							: walletAddress!
									.slice(0, 5)
									.concat('...')
									.concat(walletAddress.slice(walletAddress.length - 3))
					}
					variant="secondary"
					secondaryBackgroundColor={theme.colors.backgroundColor}
					onClick={connectWallet}
				>
					{ensAvatar && <StyledENSAvatar src={ensAvatar} />}
				</StyledConnectWalletButton>
			</ButtonContainer>
		</StyledHeader>
	);
}

const StyledHeader = styled.header`
	background-color: ${theme.colors.backgroundColor};
	width: 100%;
	min-height: 66px;
	padding-left: ${theme.spacings.margin.biggest};
	display: flex;
	align-items: center;
	border-bottom: 1px solid rgba(130, 130, 149, 0.3);
`;

const StyledHeaderHeadline = styled.h1`
	font-family: 'Lustra Text';
	font-style: normal;
	font-weight: 400;
	font-size: 1.16rem;
	color: white;
	margin-left: ${theme.spacings.margin.tiny};
	margin-right: ${theme.spacings.margin.biggest};
`;

const StyledSpotlightButton = styled(SpotlightButton)`
	margin-right: ${theme.spacings.margin.medium};
	:last-of-type {
		margin-right: auto;
	}
`;

const ButtonContainer = styled.div`
	display: flex;
	justify-content: space-between;
	min-width: 200px;
	margin-right: ${theme.spacings.margin.superBig};
`;

const StyledConnectWalletButton = styled(Button)`
	min-width: 138px;
`;

const StyledENSAvatar = styled.img`
	border-radius: 50%;
	width: 16px;
	height: 16px;
	margin-right: ${theme.spacings.margin.tiny};
`;
