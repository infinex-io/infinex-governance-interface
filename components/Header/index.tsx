import { Button } from '@synthetixio/ui';
import { SNXIcon, SpotlightButton, theme } from 'components/old-ui';
import { useConnectorContext } from 'containers/Connector';
import { DeployedModules } from 'containers/Modules';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useCurrentPeriod from 'queries/epochs/useCurrentPeriodQuery';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { slide as BurgerMenu } from 'react-burger-menu';
import './header.module.scss';

export default function Header() {
	const { push, pathname } = useRouter();
	const { t } = useTranslation();
	const [activeRoute, setActiveRoute] = useState('home');
	const [routes, setRoutes] = useState([
		t('header.routes.home'),
		t('header.routes.councils'),
		t('header.routes.vote'),
	]);
	const spartanQuery = useCurrentPeriod(DeployedModules.SPARTAN_COUNCIL);
	const grantsQuery = useCurrentPeriod(DeployedModules.GRANTS_COUNCIL);
	const ambassadorQuery = useCurrentPeriod(DeployedModules.AMBASSADOR_COUNCIL);
	const treasuryQuery = useCurrentPeriod(DeployedModules.TREASURY_COUNCIL);

	const oneCouncilIsInVotingPeriod = !![
		spartanQuery,
		grantsQuery,
		ambassadorQuery,
		treasuryQuery,
	].find((item) => item.data?.currentPeriod === 'VOTING');

	const { connectWallet, disconnectWallet, walletAddress, ensAvatar, ensName } =
		useConnectorContext();

	useEffect(() => {
		if (!oneCouncilIsInVotingPeriod)
			setRoutes([t('header.routes.home'), t('header.routes.councils')]);
		else setRoutes([t('header.routes.home'), t('header.routes.councils'), t('header.routes.vote')]);
	}, [oneCouncilIsInVotingPeriod, t]);

	const handleIndexAndRouteChange = (index: number) => {
		push(index === 0 ? '/' : '/'.concat(routes[index].toLowerCase()));
		setActiveRoute(routes[index].toLowerCase());
	};

	useEffect(() => {
		const splitRoute = pathname.split('/')[1];
		setActiveRoute(splitRoute ? splitRoute : 'home');
	}, [pathname]);

	return (
		<>
			<header className="bg-dark-blue w-full m-h-[66px] p-3 flex items-center justify-center border-b-gray-800 border-b-[1px] border-b-solid">
				<Link href="/" passHref>
					<div className="flex items-center cursor-pointer mr-8">
						<SNXIcon />
						<StyledHeaderHeadline>Governance</StyledHeaderHeadline>
					</div>
				</Link>
				<div className="invisible md:visible flex justify-center w-full">
					{routes.map((translation, index) => (
						<StyledSpotlightButton
							text={translation}
							onClick={() => handleIndexAndRouteChange(index)}
							active={activeRoute === translation.toLowerCase()}
							key={translation}
						/>
					))}
				</div>
				<div className="flex mr-1">
					<Button
						className="min-w-[143px]"
						variant="outline"
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
					</Button>
				</div>
			</header>
			<div className="bm-burger-button"></div>
			<BurgerMenu isOpen={false} className="md:invisible">
				{routes.map((translation, index) => (
					<StyledSpotlightButton
						text={translation}
						onClick={() => handleIndexAndRouteChange(index)}
						active={activeRoute === translation.toLowerCase()}
						key={translation}
					/>
				))}
			</BurgerMenu>
		</>
	);
}

const StyledHeaderHeadline = styled.h1`
	font-family: 'Lustra Text';
	font-style: normal;
	font-weight: 400;
	font-size: 0.87rem;
	color: white;
	margin-left: ${theme.spacings.tiny};
`;

const StyledSpotlightButton = styled(SpotlightButton)`
	margin-right: ${theme.spacings.medium};
	:last-of-type {
		margin-right: auto;
	}
`;

const StyledWalletAddress = styled.span`
	color: ${({ theme }) => theme.colors.white};
	font-family: 'Inter Bold';
	font-size: 0.75rem;
	text-align: center;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const StyledENSAvatar = styled.img`
	border-radius: 50%;
	width: 16px;
	height: 16px;
	margin-right: ${theme.spacings.tiny};
`;
