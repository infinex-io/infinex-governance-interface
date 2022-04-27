import styled from 'styled-components';
import { theme, IconButton, SettingsIcon, SNXIcon, Button, SpotlightButton } from '@synthetixio/ui';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import Connector from 'containers/Connector';
import { useState } from 'react';

export default function Header() {
	const { push } = useRouter();
	const { t } = useTranslation();
	const [activeRoute, setActiveRoute] = useState('home');

	const { connectWallet, disconnectWallet, walletAddress, ensAvatar, ensName } =
		Connector.useContainer();

	const routes = [
		t('header.routes.home'),
		t('header.routes.elections'),
		t('header.routes.sips'),
		t('header.routes.discuss'),
		t('header.routes.vote'),
	];

	const handleIndexAndRouteChange = (index: number) => {
		push(index === 0 ? '/' : routes[index].toLowerCase());
		setActiveRoute(routes[index].toLowerCase());
	};

	return (
		<StyledHeader>
			<SNXIcon />
			<StyledHeaderHeadline>Governance</StyledHeaderHeadline>
			{routes.map((translation, index) => {
				return (
					<StyledSpotlightButton
						text={translation}
						onClick={() => handleIndexAndRouteChange(index)}
						active={activeRoute === translation.toLowerCase()}
						key={translation}
					/>
				);
			})}
			<ButtonContainer>
				<IconButton size="tiny" active={true}>
					<SettingsIcon onClick={() => console.info('implement me')} />
				</IconButton>
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
					onClick={walletAddress ? disconnectWallet : connectWallet}
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
	padding-left: ${theme.spacings.biggest};
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
	margin-left: ${theme.spacings.tiny};
	margin-right: ${theme.spacings.biggest};
`;

const StyledSpotlightButton = styled(SpotlightButton)`
	margin-right: ${theme.spacings.medium};
	:last-of-type {
		margin-right: auto;
	}
`;

const ButtonContainer = styled.div`
	display: flex;
	justify-content: space-between;
	min-width: 200px;
	margin-right: ${theme.spacings.superBig};
`;

const StyledConnectWalletButton = styled(Button)`
	min-width: 138px;
`;

const StyledENSAvatar = styled.img`
	border-radius: 50%;
	width: 16px;
	height: 16px;
	margin-right: ${theme.spacings.tiny};
`;
