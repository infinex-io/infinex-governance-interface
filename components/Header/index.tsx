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
			className={`bg-background-dark w-full m-h-[66px] p-3 flex 
				items-center md:justify-center justify-between border-b-gray-800 border-b border-b-solid`}
		>
			<Link href="/" passHref legacyBehavior>
				<div className="md:flex items-center cursor-pointer mr-8 hidden">
					<svg height="22" viewBox="0 0 252 53" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M86.1111 9.22561V44.6503H79.2222V9.22561H86.1111Z" fill="#FF9B69"/>
						<path d="M119.685 9.22561V44.6503H114.444L99.4815 23.0008V44.6503H92.5926V9.22561H97.8333L112.796 30.8375V9.22561H119.685Z" fill="#FF9B69"/>
						<path d="M133.056 15.8971V24.2975H146.611V30.969H133.056V44.6315H126.167V9.22561H147.019V15.8971H133.056Z" fill="#FF9B69"/>
						<path d="M158.944 9.22561V44.6503H152.056V9.22561H158.944Z" fill="#FF9B69"/>
						<path d="M192.5 9.22561V44.6503H187.259L172.296 23.0008V44.6503H165.407V9.22561H170.648L185.611 30.8375V9.22561H192.5Z" fill="#FF9B69"/>
						<path d="M220.574 37.96V44.6315H198.982V9.22561H220.315V15.8971H205.852V23.4331H219.074V30.0106H205.852V37.96H220.574Z" fill="#FF9B69"/>
						<path d="M244.167 44.6315L237.389 33.0926L230.611 44.6315H222.833L233.5 26.4587L223.37 9.20681H231.148L237.389 19.8248L243.63 9.20681H251.407L241.278 26.4023L252 44.6127H244.167V44.6315Z" fill="#FF9B69"/>
						<path d="M41.5 16.2917V52.75H0V0.75H11.463V9.18802H7.96296V44.669H33.537V16.2917H41.5Z" fill="#FF9B69"/>
						<path d="M58.4074 0.75V52.75H46.9444V44.669H50.4444V8.83095H24.8519V37.2083H16.8889V0.75H58.4074Z" fill="#FF9B69"/>
					</svg>
				</div>
			</Link>
			<div className="hidden md:flex gap-5 w-full">
				{routes.map((route) => (
					<Link key={route.label} href={`/${route.link}`} passHref legacyBehavior>
						<Button
							variant='nav'
							className={`last-of-type:mr-auto gt-america-font tg-content 
							${asPath === `/${route.link}` ? 'border-b border-primary' : ''}`}
							onClick={() => setBurgerMenuOpen(false)}
							key={route.label}
							label={t(route.label) as string}
						/>
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
									variant='nav'
									className={`last-of-type:mr-auto gt-america-font tg-content mb-10
									${asPath === `/${route.link}` ? 'border-b border-primary' : ''}`}
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
				className="!bg-slate-900 !border-slate-300 !text-white h-[40px]"
				variant="outline"
				onClick={() => {
					if (!connected) {
						onOpen();
					}
				}}
				label={connected ? 'Safe Connected' : 'Safe'}
			/>
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
								wallet to Infinex Governance.
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
			<div className="flex md:mr-1 h-[40px] justify-end items-center ml-[16px]">
				{!isWalletConnected &&
					<div className="flex justify-center">
					 <ConnectButton />
					</div>

				}
				{isWalletConnected && walletAddress && (
					<Dropdown
						triggerElement={
							<Button className="min-w-[142px] h-[40px] flex justify-center items-center" variant="secondary"
							label={ensName || truncateAddress(walletAddress)}
							/>
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
