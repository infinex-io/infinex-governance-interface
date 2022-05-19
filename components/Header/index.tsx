import { Button, SNXIcon, SpotlightButton, theme } from 'components/old-ui';
import { useConnectorContext } from 'containers/Connector';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

export default function Header() {
	const { push, pathname } = useRouter();
	const { t } = useTranslation();
	const [activeRoute, setActiveRoute] = useState('home');

	const { connectWallet, disconnectWallet, walletAddress, ensAvatar, ensName } =
		useConnectorContext();

	const routes = [t('header.routes.home'), t('header.routes.councils'), t('header.routes.vote')];

	const handleIndexAndRouteChange = (index: number) => {
		push(index === 0 ? '/' : routes[index].toLowerCase());
		setActiveRoute(routes[index].toLowerCase());
	};

	useEffect(() => {
		const splitRoute = pathname.split('/')[1];
		setActiveRoute(splitRoute ? splitRoute : 'home');
	}, [pathname]);

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
				<StyledConnectWalletButton
					variant="quaternary"
					onClick={walletAddress ? disconnectWallet : connectWallet}
				>
					{ensAvatar && <StyledENSAvatar src={ensAvatar} />}
					<StyledWalletAddress>
						{!walletAddress
							? t('header.connect-wallet')
							: ensName
							? ensName
							: walletAddress!
									.slice(0, 5)
									.concat('...')
									.concat(walletAddress.slice(walletAddress.length - 3))}
					</StyledWalletAddress>
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
	font-size: 0.87rem;
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
	padding: ${({ theme }) => theme.spacings.tiniest};
	cursor: pointer;
`;

const StyledWalletAddress = styled.span`
	color: ${({ theme }) => theme.colors.white};
	font-family: 'Inter Bold';
	font-size: 0.75rem;
	text-align: center;
	display: block;
	padding: 10px;
`;

const StyledENSAvatar = styled.img`
	border-radius: 50%;
	width: 16px;
	height: 16px;
	margin-right: ${theme.spacings.tiny};
`;
