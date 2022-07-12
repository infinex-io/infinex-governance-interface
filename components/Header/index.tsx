import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { COUNCIL_SLUGS } from 'constants/config';
import useCurrentPeriod from 'queries/epochs/useCurrentPeriodQuery';
import { Button } from '@synthetixio/ui';
import SNXIcon from 'components/Icons/SNXIcon';

const routesDic = [
	{ label: 'header.routes.home', link: '' },
	{ label: 'header.routes.councils', link: 'councils' },
	{ label: 'header.routes.profile', link: 'profile' },
	{ label: 'header.routes.vote', link: 'vote' },
];

export default function Header() {
	const { asPath } = useRouter();
	const { t } = useTranslation();
	const { data } = useAccount();
	const [burgerMenuOpen, setBurgerMenuOpen] = useState(false);
	const [routes, setRoutes] = useState(routesDic);
	const allPeriods = useCurrentPeriod();
	const oneCouncilIsInVotingPeriod = !!COUNCIL_SLUGS.find((council, index) =>
		Array.isArray(allPeriods.data) && allPeriods.data?.length
			? allPeriods.data[index][council] === 'VOTING'
			: false
	);

	useEffect(() => {
		if (data?.address) {
			setRoutes((state) =>
				state.map((route) => {
					if (route.link.includes('profile')) {
						return { ...route, link: 'profile/' + data.address };
					}
					return route;
				})
			);
		}
	}, [oneCouncilIsInVotingPeriod, t, data?.address]);

	useEffect(() => {
		if (burgerMenuOpen) {
			document.documentElement.classList.add('stop-scrolling');
		} else document.documentElement.classList.remove('stop-scrolling');
	}, [burgerMenuOpen]);

	const filterRoutes = (route: any) =>
		(oneCouncilIsInVotingPeriod || route.link !== 'vote') &&
		(route.link !== 'profile' || data?.address);

	return (
		<header
			className={`bg-dark-blue w-full m-h-[66px] p-3 flex 
				items-center md:justify-center justify-between border-b-gray-800 border-b border-b-solid`}
		>
			<Link href="/" passHref>
				<div className="md:flex items-center cursor-pointer mr-8 hidden">
					<SNXIcon />
					<h1 className="lustra tg-title-h5 text-white ml-2">Governance</h1>
				</div>
			</Link>
			<div className="hidden md:flex justify-center w-full">
				{routes.filter(filterRoutes).map((route) => (
					<Link key={route.label} href={`/${route.link}`} passHref>
						<Button
							variant="spotlight"
							className="last-of-type:mr-auto gt-america-font tg-content"
							size="sm"
							onClick={() => setBurgerMenuOpen(false)}
							spotlightActive={route.link === '' ? asPath === '/' : asPath.includes(route.link)}
							key={route.label}
						>
							{t(route.label)}
						</Button>
					</Link>
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
				<div className="fixed w-full h-full z-100 bg-dark-blue top-[65px] left-0 py-4">
					<div className="flex flex-col items-center">
						{routes.filter(filterRoutes).map((route) => (
							<Link key={route.label} href={`/${route.link}`} passHref>
								<Button
									variant="spotlight"
									className="m-4 gt-america-font tg-main"
									size="md"
									onClick={() => setBurgerMenuOpen(false)}
									spotlightActive={route.link === '' ? asPath === '/' : asPath.includes(route.link)}
									key={route.label}
								>
									{t(route.label)}
								</Button>
							</Link>
						))}
					</div>
				</div>
			)}
			<div className="flex md:mr-1 min-w-[170px] h-[40px] justify-end">
				<ConnectButton accountStatus="full" showBalance={false} />
			</div>
		</header>
	);
}
