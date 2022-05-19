import { Button } from '@synthetixio/ui';
import { ArrowLinkOffIcon, ButtonCard, Card, Colors } from 'components/old-ui';
import CouncilsCarousel from 'components/CouncilsCarousel';
import { H1 } from 'components/Headlines/H1';
import { H2 } from 'components/Headlines/H2';
import { H4 } from 'components/Headlines/H4';
import NominateModal from 'components/Modals/Nominate';
import { Text } from 'components/Text/text';
import { TransparentText } from 'components/Text/transparent';
import Modal from 'containers/Modal';
import { DeployedModules } from 'containers/Modules/Modules';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useCurrentEpochDatesQuery from 'queries/epochs/useCurrentEpochDatesQuery';
import useCurrentPeriod, { EpochPeriods } from 'queries/epochs/useCurrentPeriodQuery';
import useCouncilMembersQuery from 'queries/members/useCouncilMembersQuery';
import useNomineesQuery from 'queries/nomination/useNomineesQuery';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import CouncilCard from 'components/CouncilCard';

export default function LandingPage() {
	const { t } = useTranslation();
	const { push } = useRouter();
	const { setContent, setIsOpen } = Modal.useContainer();

	const { data: spartanCurrentPeriod } = useCurrentPeriod(DeployedModules.SPARTAN_COUNCIL);
	const { data: grantsCurrentPeriod } = useCurrentPeriod(DeployedModules.GRANTS_COUNCIL);
	const { data: ambassadorCurrentPeriod } = useCurrentPeriod(DeployedModules.AMBASSADOR_COUNCIL);
	const { data: treasuryCurrentPeriod } = useCurrentPeriod(DeployedModules.TREASURY_COUNCIL);

	// TODO @MF calculate next epoch and display the number in the card
	const [spartanEpoch, spartanNominees, spartanMembers] = [
		useCurrentEpochDatesQuery(DeployedModules.SPARTAN_COUNCIL),
		useNomineesQuery(DeployedModules.SPARTAN_COUNCIL),
		useCouncilMembersQuery(DeployedModules.SPARTAN_COUNCIL),
	];
	const [grantsEpoch, grantsNominees, grantsMembers] = [
		useCurrentEpochDatesQuery(DeployedModules.GRANTS_COUNCIL),
		useNomineesQuery(DeployedModules.GRANTS_COUNCIL),
		useCouncilMembersQuery(DeployedModules.GRANTS_COUNCIL),
	];
	const [ambassadorEpoch, ambassadorNominees, ambassadorMembers] = [
		useCurrentEpochDatesQuery(DeployedModules.AMBASSADOR_COUNCIL),
		useNomineesQuery(DeployedModules.AMBASSADOR_COUNCIL),
		useCouncilMembersQuery(DeployedModules.AMBASSADOR_COUNCIL),
	];
	const [treasuryEpoch, treasuryNominees, treasuryMembers] = [
		useCurrentEpochDatesQuery(DeployedModules.TREASURY_COUNCIL),
		useNomineesQuery(DeployedModules.TREASURY_COUNCIL),
		useCouncilMembersQuery(DeployedModules.TREASURY_COUNCIL),
	];
	const spartanCouncilInfo =
		spartanCurrentPeriod && parseIndex(EpochPeriods[spartanCurrentPeriod.currentPeriod]);
	const grantsCouncilInfo =
		grantsCurrentPeriod && parseIndex(EpochPeriods[grantsCurrentPeriod.currentPeriod]);
	const ambassadorCouncilInfo =
		ambassadorCurrentPeriod && parseIndex(EpochPeriods[ambassadorCurrentPeriod.currentPeriod]);
	const treasuryCouncilInfo =
		treasuryCurrentPeriod && parseIndex(EpochPeriods[treasuryCurrentPeriod.currentPeriod]);

	return (
		<div className="flex flex-col align-center">
			<H1>{t('landing-page.headline')}</H1>
			<Text>{t('landing-page.subline')}</Text>
			<div className="flex justify-center flex-wrap">
				<CouncilCard
					{...spartanCouncilInfo}
					membersCount={spartanMembers.data?.length}
					nomineesCount={spartanNominees.data?.length}
					period={spartanCurrentPeriod?.currentPeriod || 'ADMINISTRATION'}
				/>
				<StyledCard color="purple">
					<StyledCardContent className="h-full flex flex-col justify-around align-center darker-60">
						<Image src="/logos/grants-council.svg" width={64} height={64} />
						<H4>{t('landing-page.cards.gc')}</H4>
						{grantsCouncilInfo && (
							<>
								<StyledCTALabel color={grantsCouncilInfo.color}>
									{t(grantsCouncilInfo.cta)}
								</StyledCTALabel>
								<StyledSpacer />
								<div className="flex justify-around">
									<Text>{t(grantsCouncilInfo.headlineLeft)}</Text>
									<Text>{t(grantsCouncilInfo.headlineRight)}</Text>
								</div>
								<div className="flex justify-around">
									<H2>
										{grantsCurrentPeriod.currentPeriod === 'NOMINATION' ||
										grantsCurrentPeriod.currentPeriod === 'VOTING'
											? grantsNominees.data?.length
											: grantsMembers.data?.length}
									</H2>
									{/* TODO @DEV implement votes received or live votes when available */}
									<H2>
										{grantsCurrentPeriod.currentPeriod === 'NOMINATION'
											? grantsNominees.data?.length
											: grantsMembers.data?.length}
									</H2>
								</div>
								{grantsCouncilInfo.secondButton && (
									<TransparentText
										gradient="lightBlue"
										onClick={() => {
											push({
												pathname: '/councils',
												query: {
													council: 'grants',
													nominees: true,
												},
											});
										}}
										clickable
									>
										{t(grantsCouncilInfo.secondButton)}
									</TransparentText>
								)}
								<Button
									variant={grantsCouncilInfo.variant}
									className="w-full"
									size="lg"
									onClick={() => {
										if (grantsCurrentPeriod?.currentPeriod === 'NOMINATION') {
											setContent(<NominateModal />);
											setIsOpen(true);
										} else if (grantsCurrentPeriod?.currentPeriod === 'VOTING') {
											push({
												pathname: '/vote',
												query: {
													council: 'grants',
												},
											});
										} else {
											push({
												pathname: '/councils',
												query: {
													council: 'grants',
												},
											});
										}
									}}
								>
									{t(grantsCouncilInfo.button)}
								</Button>
							</>
						)}
					</StyledCardContent>
				</StyledCard>
				<StyledCard color="purple">
					<StyledCardContent className="h-full flex flex-col justify-around align-center darker-60">
						<Image src="/logos/ambassador-council.svg" width={69} height={61} />
						<H4>{t('landing-page.cards.ac')}</H4>
						{ambassadorCouncilInfo && (
							<>
								<StyledCTALabel color={ambassadorCouncilInfo.color}>
									{t(ambassadorCouncilInfo.cta)}
								</StyledCTALabel>
								<StyledSpacer />
								<div className="flex justify-around">
									<Text>{t(ambassadorCouncilInfo.headlineLeft)}</Text>
									<Text>{t(ambassadorCouncilInfo.headlineRight)}</Text>
								</div>
								<div className="flex justify-around">
									<H2>
										{ambassadorCurrentPeriod.currentPeriod === 'NOMINATION' ||
										ambassadorCurrentPeriod.currentPeriod === 'VOTING'
											? ambassadorNominees.data?.length
											: ambassadorMembers.data?.length}
									</H2>
									{/* TODO @DEV implement votes received or live votes when available */}
									<H2>
										{ambassadorCurrentPeriod.currentPeriod === 'NOMINATION'
											? ambassadorNominees.data?.length
											: grantsMembers.data?.length}
									</H2>
								</div>
								{ambassadorCouncilInfo.secondButton && (
									<TransparentText
										gradient="lightBlue"
										onClick={() => {
											push({
												pathname: '/councils',
												query: {
													council: 'ambassador',
													nominees: true,
												},
											});
										}}
										clickable
									>
										{t(ambassadorCouncilInfo.secondButton)}
									</TransparentText>
								)}
								<Button
									variant={ambassadorCouncilInfo.variant}
									className="w-full"
									size="lg"
									onClick={() => {
										if (ambassadorCurrentPeriod.currentPeriod === 'NOMINATION') {
											setContent(<NominateModal />);
											setIsOpen(true);
										} else if (ambassadorCurrentPeriod.currentPeriod === 'VOTING') {
											push({
												pathname: '/vote',
												query: {
													council: 'ambassador',
												},
											});
										} else {
											push({
												pathname: '/councils',
												query: {
													council: 'ambassador',
												},
											});
										}
									}}
								>
									{t(ambassadorCouncilInfo.button)}
								</Button>
							</>
						)}
					</StyledCardContent>
				</StyledCard>
				<StyledCard color="purple">
					<StyledCardContent className="h-full flex flex-col justify-around align-center darker-60">
						<Image src="/logos/treasury-council.svg" width={84} height={84} />
						<H4>{t('landing-page.cards.tc')}</H4>
						{treasuryCouncilInfo && (
							<>
								<StyledCTALabel color={treasuryCouncilInfo.color}>
									{t(treasuryCouncilInfo.cta)}
								</StyledCTALabel>
								<StyledSpacer />
								<div className="flex justify-around">
									<Text>{t(treasuryCouncilInfo.headlineLeft)}</Text>
									<Text>{t(treasuryCouncilInfo.headlineRight)}</Text>
								</div>
								<div className="flex justify-around">
									<H2>
										{treasuryCurrentPeriod.currentPeriod === 'NOMINATION' ||
										treasuryCurrentPeriod.currentPeriod === 'VOTING'
											? treasuryNominees.data?.length
											: treasuryMembers.data?.length}
									</H2>
									{/* TODO @DEV implement votes received or live votes when available */}
									<H2>
										{treasuryCurrentPeriod.currentPeriod === 'NOMINATION'
											? treasuryNominees.data?.length
											: treasuryMembers.data?.length}
									</H2>
								</div>
								{treasuryCouncilInfo.secondButton && (
									<TransparentText
										gradient="lightBlue"
										onClick={() => {
											push({
												pathname: '/councils',
												query: {
													council: 'treasury',
													nominees: true,
												},
											});
										}}
										clickable
									>
										{t(treasuryCouncilInfo.secondButton)}
									</TransparentText>
								)}
								<Button
									variant={treasuryCouncilInfo.variant}
									className="w-full"
									size="lg"
									onClick={() => {
										if (treasuryCurrentPeriod.currentPeriod === 'NOMINATION') {
											setContent(<NominateModal />);
											setIsOpen(true);
										} else if (treasuryCurrentPeriod.currentPeriod === 'VOTING') {
											push({
												pathname: '/vote',
												query: {
													council: 'treasury',
												},
											});
										} else {
											push({
												pathname: '/councils',
												query: {
													council: 'treasury',
												},
											});
										}
									}}
								>
									{t(treasuryCouncilInfo.button)}
								</Button>
							</>
						)}
					</StyledCardContent>
				</StyledCard>
			</div>
			<H1>{t('landing-page.second-headline')}</H1>
			<Text>{t('landing-page.second-subline')}</Text>
			<div className="flex flex-wrap justify-center">
				<Link href="/councils">
					<StyledButtonCards
						headline={t('landing-page.button-cards.all-members')}
						subline={t('landing-page.button-cards.all-members-subline')}
						icon={<ArrowLinkOffIcon active />}
						arrowDirection="right"
					></StyledButtonCards>
				</Link>
				<Link href="https://sips.synthetix.io/all-sip/">
					<StyledButtonCards
						headline={t('landing-page.button-cards.sccp')}
						subline={t('landing-page.button-cards.sccp-subline')}
						icon={<ArrowLinkOffIcon active />}
						arrowDirection="right"
					></StyledButtonCards>
				</Link>
			</div>
			<div className="flex flex-wrap justify-center">
				<Link href="https://discord.com/invite/HQSTqXH84t">
					<StyledButtonCards
						headline={t('landing-page.button-cards.forum')}
						subline={t('landing-page.button-cards.forum-subline')}
						icon={<ArrowLinkOffIcon active />}
						arrowDirection="right"
					></StyledButtonCards>
				</Link>
				<Link href="https://gov.synthetix.io/#/">
					<StyledButtonCards
						headline={t('landing-page.button-cards.records')}
						subline={t('landing-page.button-cards.records-subline')}
						icon={<ArrowLinkOffIcon active />}
						arrowDirection="right"
					></StyledButtonCards>
				</Link>
			</div>
			<H1>{t('landing-page.tabs-headline')}</H1>
			<Text>{t('landing-page.tabs-subline')}</Text>
			<CouncilsCarousel />
			<Button
				onClick={() => {
					push({ pathname: '/councils' });
				}}
				size="md"
				className="mx-auto my-10 min-w-[140px]"
			>
				{t('landing-page.carousel-btn')}
			</Button>
		</div>
	);
}

function parseIndex(index: number): {
	cta: string;
	button: string;
	variant: 'default' | 'outline';
	color: Colors;
	headlineLeft: string;
	headlineRight: string;
	secondButton?: string;
} {
	switch (index) {
		case 1:
			return {
				cta: 'landing-page.cards.cta.nomination',
				button: 'landing-page.cards.button.nomination',
				color: 'orange',
				variant: 'default',
				headlineLeft: 'landing-page.cards.candidates',
				headlineRight: 'landing-page.cards.received',
				secondButton: 'landing-page.cards.nominees',
			};
		case 2:
			return {
				cta: 'landing-page.cards.cta.vote',
				button: 'landing-page.cards.button.vote',
				color: 'green',
				variant: 'default',
				headlineLeft: 'landing-page.cards.candidates',
				headlineRight: 'landing-page.cards.received',
			};
		default:
			return {
				cta: 'landing-page.cards.cta.closed',
				button: 'landing-page.cards.button.closed',
				color: 'purple',
				variant: 'outline',
				headlineLeft: 'landing-page.cards.members',
				headlineRight: 'landing-page.cards.received',
			};
	}
}

const StyledCard = styled(Card)`
	width: 264px;
	height: 358px;
	margin: ${({ theme }) => theme.spacings.medium};
`;

const StyledCardContent = styled.div`
	padding: ${({ theme }) => theme.spacings.medium};
`;

const StyledCTALabel = styled(H4)<{ color: Colors }>`
	background-color: ${({ theme, color }) => theme.colors[color]};
	border-radius: 32px;
	padding: ${({ theme }) => theme.spacings.tiniest};
	font-size: 1rem;
`;

const StyledSpacer = styled.span`
	height: 1px;
	width: 203px;
	background: linear-gradient(73.6deg, #8e2de2 2.11%, #4b01e0 90.45%);
`;

const StyledButtonCards = styled(ButtonCard)`
	width: 350px;
	height: 112px;
	margin: ${({ theme }) => theme.spacings.small};
`;
