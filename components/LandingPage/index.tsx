import { Button } from '@synthetixio/ui';
import { ArrowLinkOffIcon, ButtonCard, Colors } from 'components/old-ui';
import CouncilsCarousel from 'components/CouncilsCarousel';
import { H1 } from 'components/Headlines/H1';
import { Text } from 'components/Text/text';
import { DeployedModules } from 'containers/Modules';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useEpochDatesQuery from 'queries/epochs/useEpochDatesQuery';
import useCurrentPeriod, { EpochPeriods } from 'queries/epochs/useCurrentPeriodQuery';
import useCouncilMembersQuery from 'queries/members/useCouncilMembersQuery';
import useNomineesQuery from 'queries/nomination/useNomineesQuery';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import CouncilCard from 'components/CouncilCard';
import { parseIndex } from 'utils/parse';

export default function LandingPage() {
	const { t } = useTranslation();
	const { push } = useRouter();

	const { data: spartanCurrentPeriod } = useCurrentPeriod(DeployedModules.SPARTAN_COUNCIL);
	const { data: grantsCurrentPeriod } = useCurrentPeriod(DeployedModules.GRANTS_COUNCIL);
	const { data: ambassadorCurrentPeriod } = useCurrentPeriod(DeployedModules.AMBASSADOR_COUNCIL);
	const { data: treasuryCurrentPeriod } = useCurrentPeriod(DeployedModules.TREASURY_COUNCIL);

	// TODO @MF calculate next epoch and display the number in the card
	const [spartanEpoch, spartanNominees, spartanMembers] = [
		useEpochDatesQuery(DeployedModules.SPARTAN_COUNCIL),
		useNomineesQuery(DeployedModules.SPARTAN_COUNCIL),
		useCouncilMembersQuery(DeployedModules.SPARTAN_COUNCIL),
	];
	const [grantsEpoch, grantsNominees, grantsMembers] = [
		useEpochDatesQuery(DeployedModules.GRANTS_COUNCIL),
		useNomineesQuery(DeployedModules.GRANTS_COUNCIL),
		useCouncilMembersQuery(DeployedModules.GRANTS_COUNCIL),
	];
	const [ambassadorEpoch, ambassadorNominees, ambassadorMembers] = [
		useEpochDatesQuery(DeployedModules.AMBASSADOR_COUNCIL),
		useNomineesQuery(DeployedModules.AMBASSADOR_COUNCIL),
		useCouncilMembersQuery(DeployedModules.AMBASSADOR_COUNCIL),
	];
	const [treasuryEpoch, treasuryNominees, treasuryMembers] = [
		useEpochDatesQuery(DeployedModules.TREASURY_COUNCIL),
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
			<div className="flex justify-center flex-wrap space-x-8">
				{spartanCouncilInfo && (
					<CouncilCard
						{...spartanCouncilInfo}
						membersCount={spartanMembers.data?.length}
						nomineesCount={spartanNominees.data?.length}
						period={spartanCurrentPeriod?.currentPeriod}
						image="/logos/spartan-council.svg"
						council="spartan"
					/>
				)}
				{grantsCouncilInfo && (
					<CouncilCard
						{...grantsCouncilInfo}
						membersCount={grantsMembers.data?.length}
						nomineesCount={grantsNominees.data?.length}
						period={grantsCurrentPeriod?.currentPeriod}
						image="/logos/grants-council.svg"
						council="grants"
					/>
				)}
				{ambassadorCouncilInfo && (
					<CouncilCard
						{...ambassadorCouncilInfo}
						membersCount={ambassadorMembers.data?.length}
						nomineesCount={ambassadorNominees.data?.length}
						period={ambassadorCurrentPeriod?.currentPeriod}
						image="/logos/ambassador-council.svg"
						council="ambassador"
					/>
				)}
				{treasuryCouncilInfo && (
					<CouncilCard
						{...treasuryCouncilInfo}
						membersCount={treasuryMembers.data?.length}
						nomineesCount={treasuryNominees.data?.length}
						period={treasuryCurrentPeriod.currentPeriod}
						image="/logos/treasury-council.svg"
						council="treasury"
					/>
				)}
			</div>
			<H1>{t('landing-page.second-headline')}</H1>
			<Text>{t('landing-page.second-subline')}</Text>
			<div className="flex flex-wrap justify-center">
				<Link href="/councils" passHref>
					<StyledButtonCards
						headline={t('landing-page.button-cards.all-members')}
						subline={t('landing-page.button-cards.all-members-subline')}
						icon={<ArrowLinkOffIcon active />}
						arrowDirection="right"
					></StyledButtonCards>
				</Link>
				<Link href="https://sips.synthetix.io/all-sip/" passHref>
					<StyledButtonCards
						headline={t('landing-page.button-cards.sccp')}
						subline={t('landing-page.button-cards.sccp-subline')}
						icon={<ArrowLinkOffIcon active />}
						arrowDirection="right"
					></StyledButtonCards>
				</Link>
			</div>
			<div className="flex flex-wrap justify-center">
				<Link href="https://discord.com/invite/HQSTqXH84t" passHref>
					<StyledButtonCards
						headline={t('landing-page.button-cards.forum')}
						subline={t('landing-page.button-cards.forum-subline')}
						icon={<ArrowLinkOffIcon active />}
						arrowDirection="right"
					></StyledButtonCards>
				</Link>
				<Link href="https://gov.synthetix.io/#/" passHref>
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

const StyledButtonCards = styled(ButtonCard)`
	width: 350px;
	height: 112px;
	margin: ${({ theme }) => theme.spacings.small};
`;
