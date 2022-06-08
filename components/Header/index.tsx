import { SNXIcon, SpotlightButton, theme } from 'components/old-ui';
import { DeployedModules } from 'containers/Modules';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useCurrentPeriod from 'queries/epochs/useCurrentPeriodQuery';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

const routesDic = [
	{ label: 'header.routes.home', link: '' },
	{ label: 'header.routes.councils', link: 'councils' },
	{ label: 'header.routes.profile', link: 'profile' },
	{ label: 'header.routes.vote', link: 'vote' },
];

export default function Header() {
	const { push, pathname } = useRouter();
	const { t } = useTranslation();
	const { data } = useAccount();
	const [burgerMenuOpen, setBurgerMenuOpen] = useState(false);
	const [activeRoute, setActiveRoute] = useState('');
	const [routes, setRoutes] = useState(routesDic);
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

	useEffect(() => {
		if (!oneCouncilIsInVotingPeriod)
			setRoutes((state) => state.filter((route) => route.link !== 'vote'));
		if (data?.address)
			setRoutes((state) =>
				state.map((route) => {
					if (route.link === 'profile') {
						return { ...route, link: 'profile/' + data.address };
					}
					return route;
				})
			);
	}, [oneCouncilIsInVotingPeriod, t, data?.address]);

	const handleIndexAndRouteChange = (index: number) => {
		push(index === 0 ? '/' : '/'.concat(routes[index].link.toLowerCase()));
		setActiveRoute(routes[index].link);
	};

	useEffect(() => {
		if (burgerMenuOpen) {
			document.documentElement.classList.add('stop-scrolling');
		} else document.documentElement.classList.remove('stop-scrolling');
	}, [burgerMenuOpen]);

	useEffect(() => {
		const splitRoute = pathname.split('/')[1];
		setActiveRoute(splitRoute ? splitRoute : '');
	}, [pathname]);

	return (
		<>
			<header
				className={`bg-dark-blue w-full m-h-[66px] p-3 flex 
				items-center md:justify-center justify-between border-b-gray-800 border-b-[1px] border-b-solid`}
			>
				<Link href="/" passHref>
					<div className="flex items-center cursor-pointer mr-8">
						<SNXIcon />
						<StyledHeaderHeadline>Governance</StyledHeaderHeadline>
					</div>
				</Link>
				<div className="hidden md:flex justify-center w-full">
					{routes.map((translation, index) => (
						<SpotlightButton
							className="last-of-type:mr-auto m-2"
							text={t(translation.label)}
							onClick={() => handleIndexAndRouteChange(index)}
							active={activeRoute === translation.link}
							key={translation.label}
						/>
					))}
				</div>
				<button
					className="md:hidden flex flex-col items-center max-width-[30px] max-h-[30px]"
					onClick={() => setBurgerMenuOpen(!burgerMenuOpen)}
				>
					{!burgerMenuOpen ? (
						<>
							<span className="min-w-[30px] h-[2px] bg-white m-1 rounded"></span>
							<span className="min-w-[30px] h-[2px] bg-white m-1 rounded"></span>
							<span className="min-w-[30px] h-[2px] bg-white m-1 rounded"></span>
						</>
					) : (
						<svg
							width="36"
							height="36"
							viewBox="0 0 36 36"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M9 9L27 27"
								stroke="white"
								strokeWidth="2"
								strokeMiterlimit="10"
								strokeLinecap="round"
							/>
							<path
								d="M27 9L9 27"
								stroke="white"
								strokeWidth="2"
								strokeMiterlimit="10"
								strokeLinecap="round"
							/>
						</svg>
					)}
				</button>
				{burgerMenuOpen && (
					<div className="fixed w-full h-full z-100 bg-black bg-opacity-70 top-[66px] left-0">
						<div className="flex flex-col items-center">
							{routes.map((translation, index) => (
								<SpotlightButton
									className="m-4"
									size="lg"
									text={translation.label}
									onClick={() => {
										handleIndexAndRouteChange(index);
										setBurgerMenuOpen(!burgerMenuOpen);
									}}
									active={activeRoute === translation.label.toLowerCase()}
									key={translation.label}
								/>
							))}
						</div>
					</div>
				)}
				<div className="flex mr-1 min-w-[170px]">
					<ConnectButton accountStatus="full" showBalance={false} />
				</div>
			</header>
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
