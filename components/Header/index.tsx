import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrentPeriods } from 'queries/epochs/useCurrentPeriodQuery';
import { Dropdown } from '@synthetixio/ui';
import { Button } from 'components/button';
import { useConnectorContext } from 'containers/Connector';
import { truncateAddress } from 'utils/truncate-address';
import { ConnectButton } from 'components/ConnectButton';
import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk';
import {
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	useDisclosure,
	Modal,
	Box,
	Text,
	Button as ChakraButton,
	Image,
	Flex,
	Divider,
	Heading,
} from '@chakra-ui/react';
import DisconnectIcon from 'components/Icons/DisconnectIcon';
import ProfileIcon from 'components/Icons/ProfileIcon';
import classNames from 'classnames';
import styles from 'styles/yams.module.css';
import InfinexLogo from 'components/Icons/InfinexLogo';

const routesDic = [
	{ label: 'header.routes.home', link: '' },
	{ label: 'header.routes.councils', link: 'councils' },
	{ label: 'header.routes.vote', link: 'vote' },
	{ label: 'header.routes.farming', link: 'farming' },
];

export default function Header() {
	const { asPath, push } = useRouter();
	const { t } = useTranslation();
	const { ensName, walletAddress, disconnectWallet, isWalletConnected } = useConnectorContext();
	const [burgerMenuOpen, setBurgerMenuOpen] = useState(false);
	const periodsData = useCurrentPeriods();
	const { connected } = useSafeAppsSDK();
	const { isOpen, onClose, onOpen } = useDisclosure();
	const [isYams, setIsYams] = useState(false);

	useEffect(() => {
		if (asPath.includes('/farming')) setIsYams(true);
		else setIsYams(false);
	}, [asPath]);

	useEffect(() => {
		if (burgerMenuOpen) {
			document.documentElement.classList.add('stop-scrolling');
		} else document.documentElement.classList.remove('stop-scrolling');
	}, [burgerMenuOpen]);

	const oneCouncilIsInVotingPeriod = !!periodsData.find(
		(periodData) => periodData.data?.currentPeriod === 'VOTING'
	);

	const routes = routesDic.filter((route) => oneCouncilIsInVotingPeriod || route.link !== 'vote');

	const navStyling = (route: { label: string; link: string }) => {
		if (isYams)
			return isYams &&
				((asPath.includes(route.link) && route.link !== '') ||
					(route.link === '' && route.link.concat('/') === asPath))
				? 'text-slate-1000 border-b border-primary'
				: 'text-slate-700';
		else
			return (asPath.includes(route.link) && route.link !== '') ||
				(route.link === '' && route.link.concat('/') === asPath)
				? 'text-white border-b border-primary'
				: 'text-slate-400';
	};

	return (
		<header
			className={`${
				isYams ? 'bg-primary-light' : 'bg-background-dark border-b-gray-800 border-b border-b-solid'
			} 
			w-full m-h-[66px] p-3 sm:px-10 flex relative items-center md:justify-center justify-between`}
		>
			<Link href="/" passHref legacyBehavior>
				<div className="md:flex items-center cursor-pointer mr-8 hidden">
					<InfinexLogo fill={isYams ? 'var(--color-slate-900)' : 'var(--color-primary)'} />
				</div>
			</Link>
			<div className="hidden md:flex gap-2 w-full">
				{routes.map((route) => {
					return (
						<Link key={route.label} href={`/${route.link}`} passHref legacyBehavior>
							<Button
								variant="nav"
								className={`last-of-type:mr-auto text-[0.8rem] font-semibold
								${navStyling(route)}`}
								onClick={() => setBurgerMenuOpen(false)}
								key={route.label}
								label={
									t(route.label) === 'Farming'
										? `🧑‍🌾  ${String.fromCharCode(160).repeat(1)} Farming`
										: (t(route.label) as string)
								}
							/>
						</Link>
					);
				})}
			</div>
			<button
				className="md:hidden flex flex-col items-center max-width-[30px] max-h-[30px]"
				onClick={() => setBurgerMenuOpen(!burgerMenuOpen)}
			>
				{!burgerMenuOpen ? (
					<>
						<span className="min-w-[24px] h-[2px] bg-black m-[2px] rounded"></span>
						<span className="min-w-[24px] h-[2px] bg-black m-[2px] rounded"></span>
						<span className="min-w-[24px] h-[2px] bg-black m-[2px] rounded"></span>
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
						{routes.map((route) => (
							<Link key={route.label} href={`/${route.link}`} passHref legacyBehavior>
								<Button
									variant="nav"
									className={`last-of-type:mr-auto text-[0.8rem] font-semibold
									${
										(asPath.includes(`${route.link}`) && route.link !== '') ||
										(route.link === '' && route.link.concat('/') === asPath)
											? 'border-b border-primary'
											: 'text-slate-400'
									}`}
									onClick={() => setBurgerMenuOpen(false)}
									key={route.label}
									label={t(route.label) as string}
								/>
							</Link>
						))}
					</div>
				</div>
			)}
			<Button
				className={classNames(
					`${
						isYams ? 'bg-slate-1000 rounded-3xl' : '!bg-slate-900 !border-slate-300 !text-white'
					} whitespace-nowrap text-[0.8rem] hidden sm:block`,
					styles.blackButtonShadow
				)}
				variant="outline"
				onClick={() => {
					if (!connected) {
						onOpen();
					}
				}}
				label={connected ? 'Safe Connected' : 'Safe Wallet'}
			/>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent
					bg="blackAlpha.900"
					borderColor="gray.900"
					borderWidth="1px"
					borderStyle="solid"
				>
					<ModalHeader>
						<Heading fontSize={'2xl'} color="white" textAlign={'center'} mt="8">
							Connect to Safe
						</Heading>
					</ModalHeader>
					<ModalCloseButton color="white" />
					<ModalBody>
						<Box
							m="4"
							p="4"
							borderRadius="base"
							borderWidth="1px"
							borderStyle="solid"
							display="flex"
							flexDirection="column"
							alignItems="center"
						>
							<Image
								src="/images/Connecting-to-Safe-Wallet.png"
								alt="image with text connecting to safe wallet"
								onClick={() =>
									window.open(
										'https://docs.infinex.io/governance/elections-and-voting/connecting-a-gnosis-safe',
										'_blank'
									)
								}
								cursor="pointer"
							/>
							<Text color="gray.500" fontWeight="400" mt="2">
								This blog post will provide a detailed guide on how to connect your Safe Wallet
								wallet to Infinex Governance.
							</Text>
						</Box>
						<Flex m="4" flexDirection="column" alignItems="center">
							<Button
								style={{ fontSize: 16 }}
								onClick={() =>
									window.open(
										'https://docs.infinex.io/governance/elections-and-voting/connecting-a-gnosis-safe',
										'_blank'
									)
								}
								label="View Tutorial"
							/>
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
			<div className="flex md:mr-1 justify-end items-center ml-[16px]">
				{!isWalletConnected && (
					<div className="flex items-center">
						<ConnectButton
							className={classNames(
								`${isYams ? 'rounded-3xl hover:bg-primary' : ''} whitespace-nowrap`,
								isYams ? styles.primaryButtonShadow : ''
							)}
						/>
					</div>
				)}
				{isWalletConnected && walletAddress && (
					<Dropdown
						triggerElement={
							<Button
								className={classNames(
									`min-w-[142px] flex justify-center items-center text-[0.8rem]
							${isYams ? 'bg-primary rounded-3xl text-black' : 'bg-slate-900'}`,
									isYams ? styles.primaryButtonShadow : ''
								)}
								variant="nav"
								label={ensName || truncateAddress(walletAddress)}
							/>
						}
						contentClassName={`flex flex-col overflow-hidden p-2 border-t border-primary 
						${isYams ? 'rounded-xl bg-primary' : 'rounded-none bg-slate-900'}`}
						triggerElementProps={({ isOpen }: any) => ({ isActive: isOpen })}
						contentAlignment="right"
					>
						<span
							className={`px-3 ${
								isYams ? 'text-black' : 'hover:bg-slate-800 text-white'
							} text-xs cursor-pointer flex items-center`}
							onClick={() => {
								push('/profile/' + walletAddress);
							}}
						>
							<div className="mr-5">
								<ProfileIcon width={18} fill={isYams ? '#ff550099' : '#8B8FA3'} />
							</div>
							{t('header.view-profile')}
						</span>
						<hr className="my-1" />
						<span
							className={`p-3 ${
								isYams ? 'text-black' : 'hover:bg-slate-800 text-white'
							} text-xs cursor-pointer flex items-center`}
							onClick={disconnectWallet}
						>
							<div className="mr-5">
								<DisconnectIcon width={18} fill={isYams ? '#ff550099' : '#8B8FA3'} />
							</div>
							{t('header.disconnect-wallet')}
						</span>
					</Dropdown>
				)}
			</div>
		</header>
	);
}
