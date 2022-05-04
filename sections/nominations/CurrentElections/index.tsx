import { DeployedModules } from 'containers/Modules/Modules';
import useNominationPeriodDatesQuery from 'queries/epochs/useNominationPeriodDatesQuery';
import { H1 } from 'components/Headlines/H1';
import { useTranslation } from 'react-i18next';
import { Button, Card, Colors, Flex } from '@synthetixio/ui';
import styled from 'styled-components';
import Image from 'next/image';
import { H4 } from 'components/Headlines/H4';
import useEpochIndexQuery from 'queries/epochs/useEpochIndexQuery';
import Link from 'next/link';

export default function CurrentElections() {
	const { t } = useTranslation();
	const { data: spartanNominationTime } = useNominationPeriodDatesQuery(
		DeployedModules.SPARTAN_COUNCIL
	);
	const { data: grantsNominationTime } = useNominationPeriodDatesQuery(
		DeployedModules.GRANTS_COUNCIL
	);
	const { data: ambassadorNominationTime } = useNominationPeriodDatesQuery(
		DeployedModules.AMBASSADOR_COUNCIL
	);
	const { data: treasuryNominationTime } = useNominationPeriodDatesQuery(
		DeployedModules.TREASURY_COUNCIL
	);

	const { data: spartanEpochIndex } = useEpochIndexQuery(DeployedModules.SPARTAN_COUNCIL);
	const { data: grantsEpochIndex } = useEpochIndexQuery(DeployedModules.GRANTS_COUNCIL);
	const { data: ambassadorEpochIndex } = useEpochIndexQuery(DeployedModules.AMBASSADOR_COUNCIL);
	const { data: treasuryEpochIndex } = useEpochIndexQuery(DeployedModules.TREASURY_COUNCIL);

	const spartanCouncilInfo = spartanEpochIndex && parseIndex(spartanEpochIndex);
	const grantsCouncilInfo = grantsEpochIndex && parseIndex(grantsEpochIndex);
	const ambassadorCouncilInfo = ambassadorEpochIndex && parseIndex(ambassadorEpochIndex);
	const treasuryCouncilInfo = treasuryEpochIndex && parseIndex(treasuryEpochIndex);

	return (
		<CurrentElectionsWrapper direction="column">
			<StyledHeadline>{t('elections.nomination.headline')}</StyledHeadline>
			<Flex wrap justifyContent="center">
				<StyledCard withBackgroundColor="purple">
					<StyledCardContent direction="column" alignItems="center" className="darker-60">
						<Image src="/logos/spartan-council.svg" width={70} height={80} />
						<H4>{t('elections.nomination.cards.sc')}</H4>
						{spartanCouncilInfo && (
							<>
								<StyledCardBanner color={spartanCouncilInfo.color}>
									{t(spartanCouncilInfo.cta)}
								</StyledCardBanner>
								{spartanEpochIndex === 1 && (
									<Link href={`/elections/members?council=spartan`}>
										{t('elections.nomination.cards.nominees')}
									</Link>
								)}
								<Button onClick={() => {}} variant={spartanCouncilInfo.variant}>
									{t(spartanCouncilInfo.button)}
								</Button>
							</>
						)}
					</StyledCardContent>
				</StyledCard>
				<StyledCard withBackgroundColor="purple">
					<StyledCardContent direction="column" alignItems="center" className="darker-60">
						<Image src="/logos/grants-council.svg" width={70} height={80} />
						<H4>{t('elections.nomination.cards.gc')}</H4>
						{grantsCouncilInfo && (
							<>
								<StyledCardBanner color={grantsCouncilInfo.color}>
									{t(grantsCouncilInfo.cta)}
								</StyledCardBanner>
								{grantsEpochIndex === 1 && (
									<Link href={`/elections/members?council=grants`}>
										text={t('elections.nomination.cards.nominees')}
									</Link>
								)}
								<Button onClick={() => {}} variant={grantsCouncilInfo.variant}>
									{t(grantsCouncilInfo.button)}
								</Button>
							</>
						)}
					</StyledCardContent>
				</StyledCard>
				<StyledCard withBackgroundColor="purple">
					<StyledCardContent direction="column" alignItems="center" className="darker-60">
						<Image src="/logos/ambassador-council.svg" width={70} height={80} />
						<H4>{t('elections.nomination.cards.ac')}</H4>
						{ambassadorCouncilInfo && (
							<>
								<StyledCardBanner color={ambassadorCouncilInfo.color}>
									{t(ambassadorCouncilInfo.cta)}
								</StyledCardBanner>
								{ambassadorEpochIndex === 1 && (
									<Link href={`/elections/members?council=ambassador`}>
										{t('elections.nomination.cards.nominees')}
									</Link>
								)}
								<Button onClick={() => {}} variant={ambassadorCouncilInfo.variant}>
									{t(ambassadorCouncilInfo.button)}
								</Button>
							</>
						)}
					</StyledCardContent>
				</StyledCard>
				<StyledCard withBackgroundColor="purple">
					<StyledCardContent direction="column" alignItems="center" className="darker-60">
						<Image src="/logos/treasury-council.svg" width={70} height={80} />
						<H4>{t('elections.nomination.cards.tc')}</H4>
						{treasuryCouncilInfo && (
							<>
								<StyledCardBanner color={treasuryCouncilInfo.color}>
									{t(treasuryCouncilInfo.cta)}
								</StyledCardBanner>
								{treasuryEpochIndex === 1 && (
									<Link href={`/elections/members?council=treasury`}>
										{t('elections.nomination.cards.nominees')}
									</Link>
								)}
								<Button onClick={() => {}} variant={treasuryCouncilInfo.variant}>
									{t(treasuryCouncilInfo.button)}
								</Button>
							</>
						)}
					</StyledCardContent>
				</StyledCard>
			</Flex>
		</CurrentElectionsWrapper>
	);
}

function parseIndex(index: number): {
	cta: string;
	button: string;
	variant: 'primary' | 'secondary';
	color: Colors;
} {
	switch (index) {
		case 1:
			return {
				cta: 'elections.nomination.cards.cta.nomination',
				button: 'elections.nomination.cards.button.nomination',
				color: 'orange',
				variant: 'primary',
			};
		case 2:
			return {
				cta: 'elections.nomination.cards.cta.vote',
				button: 'elections.nomination.cards.button.vote',
				color: 'green',
				variant: 'primary',
			};
		default:
			return {
				cta: 'elections.nomination.cards.cta.closed',
				button: 'elections.nomination.cards.button.closed',
				color: 'purple',
				variant: 'secondary',
			};
	}
}

const CurrentElectionsWrapper = styled(Flex)`
	min-height: 100vh;
`;

const StyledHeadline = styled(H1)`
	margin-top: 80px;
`;

const StyledCard = styled(Card)`
	max-width: 264px;
	max-height: 357px;
	margin: 25px;
`;

const StyledCardContent = styled(Flex)`
	width: 100%;
	height: 100%;
	padding: 32px;
`;

const StyledCardBanner = styled.span<{ color: Colors }>`
	color: ${({ color, theme }) => (color === 'purple' ? theme.colors.white : theme.colors.black)};
	background: ${({ color, theme }) =>
		color === 'orange' ? theme.colors.gradients.orange : theme.colors[color]};
	padding: ${({ theme }) => theme.spacings.tiny};
	border-radius: 32px;
	font-family: 'GT America';
	font-size: 1rem;
	font-weight: 400;
`;
