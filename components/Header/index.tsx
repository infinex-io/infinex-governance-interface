import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrentPeriods } from 'queries/epochs/useCurrentPeriodQuery';
import { Button, Dropdown } from '@synthetixio/ui';
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

const routesDic = [
	{ label: 'header.routes.home', link: '' },
	{ label: 'header.routes.councils', link: 'councils' },
	{ label: 'header.routes.vote', link: 'vote' },
];

export default function Header() {
	const { asPath, push } = useRouter();
	const { t } = useTranslation();
	const { ensName, walletAddress, disconnectWallet, isWalletConnected } = useConnectorContext();
	const [burgerMenuOpen, setBurgerMenuOpen] = useState(false);
	const periodsData = useCurrentPeriods();
	const { connected } = useSafeAppsSDK();
	const { isOpen, onClose, onOpen } = useDisclosure();

	useEffect(() => {
		if (burgerMenuOpen) {
			document.documentElement.classList.add('stop-scrolling');
		} else document.documentElement.classList.remove('stop-scrolling');
	}, [burgerMenuOpen]);

	const oneCouncilIsInVotingPeriod = !!periodsData.find(
		(periodData) => periodData.data?.currentPeriod === 'VOTING'
	);

	const routes = routesDic.filter((route) => oneCouncilIsInVotingPeriod || route.link !== 'vote');
	return (
		<header
			className={`bg-dark-blue w-full m-h-[66px] p-3 flex 
				items-center md:justify-center justify-between border-b-gray-800 border-b border-b-solid`}
		>
			<Link href="/" passHref legacyBehavior>
				<div className="md:flex items-center cursor-pointer mr-8 hidden">
					<svg
						width="162"
						height="22"
						viewBox="0 0 162 22"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M6.81239 5.58926C6.61525 5.35964 6.37254 5.24456 6.08372 5.24456H0.177C0.124536 5.24456 0.0816109 5.22765 0.0492845 5.19384C0.0164282 5.16057 0 5.12293 0 5.08257V1.02966C0 0.989301 0.0164282 0.952214 0.0492845 0.918399C0.0816109 0.884583 0.124536 0.867676 0.177 0.867676H6.41864C7.99362 0.867676 9.35239 1.52325 10.4944 2.83332L12.0106 4.7177L9.05721 8.38555L6.81239 5.58926ZM17.7207 2.81314C18.8627 1.51616 20.2278 0.867676 21.8161 0.867676H28.0381C28.0906 0.867676 28.1298 0.881311 28.1563 0.908036C28.1822 0.935306 28.1955 0.975666 28.1955 1.02966V5.08257C28.1955 5.12293 28.1822 5.16057 28.1563 5.19384C28.1298 5.22765 28.0906 5.24456 28.0381 5.24456H22.1314C21.8426 5.24456 21.5998 5.35964 21.4027 5.58926L17.0514 10.9795L21.4223 16.4101C21.6195 16.6266 21.8553 16.7346 22.1314 16.7346H28.0381C28.0906 16.7346 28.1298 16.7515 28.1563 16.7854C28.1822 16.8192 28.1955 16.8633 28.1955 16.9168V20.9697C28.1955 21.0101 28.1822 21.0477 28.1563 21.081C28.1298 21.1148 28.0906 21.1317 28.0381 21.1317H21.8161C20.2278 21.1317 18.8691 20.4767 17.7403 19.166L14.1176 14.6675L10.4944 19.166C9.35239 20.4767 7.98727 21.1317 6.39903 21.1317H0.177C0.124536 21.1317 0.0847905 21.1148 0.0588234 21.081C0.0323264 21.0472 0.0196078 21.0035 0.0196078 20.949V16.8961C0.0196078 16.8557 0.0323264 16.8186 0.0588234 16.7848C0.0847905 16.751 0.124536 16.7341 0.177 16.7341H6.08372C6.35929 16.7341 6.602 16.6195 6.81239 16.3894L11.0848 11.0804L17.7207 2.81314Z"
							fill="#2ED9FF"
						/>
						<path
							d="M43.1956 15.88C42.4956 15.88 41.9156 15.3 41.9156 14.6V7.4C41.9156 6.7 42.4956 6.14 43.1956 6.14H48.1756C48.8756 6.14 49.4356 6.7 49.4356 7.4V8.08H51.9556V7.12C51.9556 5.42 50.4756 4 48.8156 4H42.5356C40.8356 4 39.4156 5.46 39.4156 7.12V14.9C39.4156 16.6 40.8956 18 42.5356 18H48.8156C50.5556 18 51.9556 16.54 51.9556 14.9V10.12H45.7156V12.26H49.4356V14.6C49.4356 15.3 48.8556 15.88 48.1556 15.88H43.1956ZM61.8756 7.16H57.0756C55.5156 7.16 54.2556 8.48 54.2556 10V15.16C54.2556 16.74 55.5756 18 57.0756 18H61.8756C63.4756 18 64.7156 16.7 64.7156 15.16V10C64.7156 8.42 63.4156 7.16 61.8756 7.16ZM62.3956 14.84C62.3956 15.5 61.8956 16 61.2556 16H57.7156C57.0756 16 56.5556 15.5 56.5556 14.84V10.32C56.5556 9.68 57.0756 9.18 57.7156 9.18H61.2556C61.8956 9.18 62.3956 9.68 62.3956 10.32V14.84ZM75.1184 7.16L71.7384 15.58H71.6784L68.3184 7.16H65.8184L70.5384 18H72.9184L77.6184 7.16H75.1184ZM85.4677 9.14C86.1077 9.14 86.5677 9.6 86.5677 10.24V11.54H81.0277V10.3C81.0277 9.64 81.5277 9.14 82.1677 9.14H85.4677ZM85.9877 18C87.5277 18 88.8277 16.88 88.8277 15.3V14.58H86.5677V14.86C86.5677 15.52 86.0477 16.02 85.4077 16.02H82.1677C81.5277 16.02 81.0277 15.52 81.0277 14.86V13.32H88.8277V9.94C88.8277 8.4 87.6077 7.16 86.0477 7.16H81.5677C80.0077 7.16 78.7477 8.42 78.7477 10V15.16C78.7477 16.72 80.0077 18 81.5677 18H85.9877ZM93.4948 9.86C93.4948 9.46 93.8148 9.18 94.1948 9.18H98.5948V7.16H95.1748L93.4948 8.52V7.16H91.1948V18H93.4948V9.86ZM102.46 9.86C102.46 9.46 102.78 9.18 103.16 9.18H107.02C107.66 9.18 108.16 9.68 108.16 10.32V18H110.48V10C110.48 8.42 109.18 7.16 107.64 7.16H104.14L102.46 8.58V7.16H100.16V18H102.46V9.86ZM116.309 16C115.669 16 115.149 15.5 115.149 14.84V10.32C115.149 9.68 115.669 9.18 116.309 9.18H120.629V15.3C120.629 15.7 120.309 16 119.929 16H116.309ZM118.889 18L120.629 16.52V18H122.929V7.16H115.689C114.169 7.16 112.849 8.42 112.849 10V15.16C112.849 16.68 114.109 18 115.689 18H118.889ZM127.831 9.86C127.831 9.46 128.151 9.18 128.531 9.18H132.391C133.031 9.18 133.531 9.68 133.531 10.32V18H135.851V10C135.851 8.42 134.551 7.16 133.011 7.16H129.511L127.831 8.58V7.16H125.531V18H127.831V9.86ZM145.36 18C146.9 18 148.2 16.74 148.2 15.16V14.16H145.9V14.84C145.9 15.5 145.38 16 144.74 16H141.68C141.04 16 140.52 15.5 140.52 14.84V10.32C140.52 9.68 141.04 9.18 141.68 9.18H144.74C145.38 9.18 145.9 9.68 145.9 10.32V11.02H148.2V10C148.2 8.42 146.9 7.16 145.36 7.16H141.04C139.46 7.16 138.22 8.46 138.22 10V15.16C138.22 16.74 139.52 18 141.04 18H145.36ZM157.05 9.14C157.69 9.14 158.15 9.6 158.15 10.24V11.54H152.61V10.3C152.61 9.64 153.11 9.14 153.75 9.14H157.05ZM157.57 18C159.11 18 160.41 16.88 160.41 15.3V14.58H158.15V14.86C158.15 15.52 157.63 16.02 156.99 16.02H153.75C153.11 16.02 152.61 15.52 152.61 14.86V13.32H160.41V9.94C160.41 8.4 159.19 7.16 157.63 7.16H153.15C151.59 7.16 150.33 8.42 150.33 10V15.16C150.33 16.72 151.59 18 153.15 18H157.57Z"
							fill="#FEFEFF"
						/>
					</svg>
				</div>
			</Link>
			<div className="hidden md:flex justify-center w-full">
				{routes.map((route) => (
					<Link key={route.label} href={`/${route.link}`} passHref legacyBehavior>
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
						{routes.map((route) => (
							<Link key={route.label} href={`/${route.link}`} passHref legacyBehavior>
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
			<ChakraButton
				variant="outline"
				onClick={() => {
					if (!connected) {
						onOpen();
					}
				}}
				minW={connected ? '150px' : '70px'}
			>
				{connected ? 'Safe Connected' : 'Safe'}
			</ChakraButton>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent bg="navy.900" borderColor="gray.900" borderWidth="1px" borderStyle="solid">
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
										'https://docs.synthetix.io/dao/elections-and-voting/voting-with-a-gnosis-safe',
										'_blank'
									)
								}
								cursor="pointer"
							/>
							<Text color="gray.500" fontWeight="400" mt="2">
								This blog post will provide a detailed guide on how to connect your Safe Wallet
								wallet to Synthetix Governance.
							</Text>
						</Box>
						<Flex m="4" flexDirection="column" alignItems="center">
							<Divider w="100%" mb="16px" />
							<ChakraButton
								variant="solid"
								w="100%"
								onClick={() =>
									window.open(
										'https://docs.synthetix.io/dao/elections-and-voting/voting-with-a-gnosis-safe',
										'_blank'
									)
								}
							>
								View Tutorial
							</ChakraButton>
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
			<div className="flex md:mr-1 h-[40px] justify-end ml-[16px]">
				{!isWalletConnected && <ConnectButton />}
				{isWalletConnected && walletAddress && (
					<Dropdown
						triggerElement={
							<Button className="min-w-[142px]" variant="secondary">
								{ensName || truncateAddress(walletAddress)}
							</Button>
						}
						contentClassName="bg-navy-dark-1 flex flex-col dropdown-border overflow-hidden"
						triggerElementProps={({ isOpen }: any) => ({ isActive: isOpen })}
						contentAlignment="right"
					>
						<span
							className="p-3 hover:bg-navy text-primary cursor-pointer"
							onClick={() => push('/profile/' + walletAddress)}
						>
							{t('header.view-profile')}
						</span>
						<span
							className="p-3 hover:bg-navy text-primary cursor-pointer"
							onClick={disconnectWallet}
						>
							{t('header.disconnect-wallet')}
						</span>
					</Dropdown>
				)}
			</div>
		</header>
	);
}
