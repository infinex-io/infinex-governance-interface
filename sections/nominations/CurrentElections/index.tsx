import { DeployedModules } from 'containers/Modules/Modules';
import { H1 } from 'components/Headlines/H1';
import { useTranslation } from 'react-i18next';
import { Button, Card, Colors, Flex } from '@synthetixio/ui';
import styled from 'styled-components';
import Image from 'next/image';
import { H4 } from 'components/Headlines/H4';
import useEpochIndexQuery from 'queries/epochs/useEpochIndexQuery';
import Link from 'next/link';
import useCouncilMembersQuery from 'queries/members/useCouncilMembersQuery';
import RemainingTime from 'components/RemainingTime';
import { parseRemainingTime } from 'utils/time';
import useCurrentEpochDatesQuery from 'queries/epochs/useCurrentEpochDatesQuery';
import useNomineesQuery from 'queries/nomination/useNomineesQuery';
import Modal from 'containers/Modal';
import NominateModal from 'components/Modals/Nominate';
import { useRouter } from 'next/router';

export default function CurrentElections() {
	const { t } = useTranslation();
	const { setIsOpen, setContent } = Modal.useContainer();
	const { push } = useRouter();

	const { data: spartanEpochIndex } = useEpochIndexQuery(DeployedModules.SPARTAN_COUNCIL);
	const { data: grantsEpochIndex } = useEpochIndexQuery(DeployedModules.GRANTS_COUNCIL);
	const { data: ambassadorEpochIndex } = useEpochIndexQuery(DeployedModules.AMBASSADOR_COUNCIL);
	const { data: treasuryEpochIndex } = useEpochIndexQuery(DeployedModules.TREASURY_COUNCIL);

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

	const spartanCouncilInfo = spartanEpochIndex && parseIndex(spartanEpochIndex);
	const grantsCouncilInfo = grantsEpochIndex && parseIndex(grantsEpochIndex);
	const ambassadorCouncilInfo = ambassadorEpochIndex && parseIndex(ambassadorEpochIndex);
	const treasuryCouncilInfo = treasuryEpochIndex && parseIndex(treasuryEpochIndex);

	return (
		<CurrentElectionsWrapper direction="column">
			<StyledHeadline>{t('elections.nomination.headline')}</StyledHeadline>
			<Flex wrap justifyContent="center">
				<StyledCard color="purple">
					<StyledCardContent direction="column" alignItems="center" className="darker-60">
						<Image src="/logos/spartan-council.svg" width={70} height={80} />
						<H4>{t('elections.nomination.cards.sc')}</H4>
						{spartanCouncilInfo && (
							<>
								<StyledCardBanner color={spartanCouncilInfo.color}>
									{t(spartanCouncilInfo.cta)}
								</StyledCardBanner>
								{(spartanEpochIndex === 1 || spartanEpochIndex === 2) && (
									<RemainingTime color={spartanEpochIndex === 1 ? 'orange' : 'green'}>
										{!Array.isArray(spartanEpoch.data) &&
											spartanEpoch.data?.epochEndDate &&
											parseRemainingTime(spartanEpoch.data.epochEndDate)}
									</RemainingTime>
								)}
								{spartanEpochIndex === 1 && (
									<>
										{Array.isArray(spartanNominees.data) && spartanNominees.data.length} - nominees
										<Link href={'/elections/members?council=spartan'}>
											{t('elections.nomination.cards.nominees')}
										</Link>
									</>
								)}
								{spartanEpochIndex === 0 && (
									<>{spartanMembers.data?.length && spartanMembers.data?.length} - Members</>
								)}
								<Button
									onClick={() => {
										if (spartanEpochIndex === 1) {
											setContent(<NominateModal />);
											setIsOpen(true);
										} else if (spartanEpochIndex === 2) {
											// TODO @MF figure out route
											push({ pathname: '/vote/nominees?council=spartan' });
										} else {
											// TODO @MF figure out route
											push({ pathname: '/elected/nominees?council=spartan' });
										}
									}}
									variant={spartanCouncilInfo.variant}
								>
									{t(spartanCouncilInfo.button)}
								</Button>
							</>
						)}
					</StyledCardContent>
				</StyledCard>
				<StyledCard color="purple">
					<StyledCardContent direction="column" alignItems="center" className="darker-60">
						<Image src="/logos/grants-council.svg" width={70} height={80} />
						<H4>{t('elections.nomination.cards.gc')}</H4>
						{grantsCouncilInfo && (
							<>
								<StyledCardBanner color={grantsCouncilInfo.color}>
									{t(grantsCouncilInfo.cta)}
								</StyledCardBanner>
								{(grantsEpochIndex === 1 || grantsEpochIndex === 2) && (
									<RemainingTime color={grantsEpochIndex === 1 ? 'orange' : 'green'}>
										{!Array.isArray(grantsEpoch.data) &&
											grantsEpoch.data?.epochEndDate &&
											parseRemainingTime(grantsEpoch.data.epochEndDate)}
									</RemainingTime>
								)}
								{grantsEpochIndex === 1 && (
									<>
										{Array.isArray(grantsNominees.data) && grantsNominees.data.length} - nominees
										<Link href={`/elections/members?council=grants`}>
											{t('elections.nomination.cards.nominees')}
										</Link>
									</>
								)}
								{grantsEpochIndex === 0 && (
									<>{grantsMembers.data?.length && grantsMembers.data?.length} - Members</>
								)}
								<Button
									onClick={() => {
										if (grantsEpochIndex === 1) {
											setContent(<NominateModal />);
											setIsOpen(true);
										} else if (grantsEpochIndex === 2) {
											// TODO @MF figure out route
											push({ pathname: '/vote/nominees?council=spartan' });
										} else {
											// TODO @MF figure out route
											push({ pathname: '/elected/nominees?council=spartan' });
										}
									}}
									variant={grantsCouncilInfo.variant}
								>
									{t(grantsCouncilInfo.button)}
								</Button>
							</>
						)}
					</StyledCardContent>
				</StyledCard>
				<StyledCard color="purple">
					<StyledCardContent direction="column" alignItems="center" className="darker-60">
						<Image src="/logos/ambassador-council.svg" width={70} height={80} />
						<H4>{t('elections.nomination.cards.ac')}</H4>
						{ambassadorCouncilInfo && (
							<>
								<StyledCardBanner color={ambassadorCouncilInfo.color}>
									{t(ambassadorCouncilInfo.cta)}
								</StyledCardBanner>
								{(ambassadorEpochIndex === 1 || ambassadorEpochIndex === 2) && (
									<RemainingTime color={ambassadorEpochIndex === 1 ? 'orange' : 'green'}>
										{!Array.isArray(ambassadorEpoch.data) &&
											ambassadorEpoch.data?.epochEndDate &&
											parseRemainingTime(ambassadorEpoch.data.epochEndDate)}
									</RemainingTime>
								)}
								{ambassadorEpochIndex === 1 && (
									<>
										{Array.isArray(ambassadorNominees.data) && ambassadorNominees.data.length} -
										nominees
										<Link href={`/elections/members?council=ambassador`}>
											{t('elections.nomination.cards.nominees')}
										</Link>
									</>
								)}
								{ambassadorEpochIndex === 0 && (
									<>{ambassadorMembers.data?.length && ambassadorMembers.data?.length} - Members</>
								)}
								<Button
									onClick={() => {
										if (ambassadorEpochIndex === 1) {
											setContent(<NominateModal />);
											setIsOpen(true);
										} else if (ambassadorEpochIndex === 2) {
											// TODO @MF figure out route
											push({ pathname: '/vote/nominees?council=spartan' });
										} else {
											// TODO @MF figure out route
											push({ pathname: '/elected/nominees?council=spartan' });
										}
									}}
									variant={ambassadorCouncilInfo.variant}
								>
									{t(ambassadorCouncilInfo.button)}
								</Button>
							</>
						)}
					</StyledCardContent>
				</StyledCard>
				<StyledCard color="purple">
					<StyledCardContent direction="column" alignItems="center" className="darker-60">
						<Image src="/logos/treasury-council.svg" width={70} height={80} />
						<H4>{t('elections.nomination.cards.tc')}</H4>
						{treasuryCouncilInfo && (
							<>
								<StyledCardBanner color={treasuryCouncilInfo.color}>
									{t(treasuryCouncilInfo.cta)}
								</StyledCardBanner>
								{(treasuryEpochIndex === 1 || treasuryEpochIndex === 2) && (
									<RemainingTime color={treasuryEpochIndex === 1 ? 'orange' : 'green'}>
										{!Array.isArray(treasuryEpoch.data) &&
											treasuryEpoch.data?.epochEndDate &&
											parseRemainingTime(treasuryEpoch.data.epochEndDate)}
									</RemainingTime>
								)}
								{treasuryEpochIndex === 1 && (
									<>
										{Array.isArray(treasuryNominees.data) && treasuryNominees.data.length} -
										nominees
										<Link href={`/elections/members?council=treasury`}>
											{t('elections.nomination.cards.nominees')}
										</Link>
									</>
								)}
								{treasuryEpochIndex === 0 && (
									<>{treasuryMembers.data?.length && treasuryMembers.data?.length} - Members</>
								)}
								<Button
									onClick={() => {
										if (treasuryEpochIndex === 1) {
											setContent(<NominateModal />);
											setIsOpen(true);
										} else if (treasuryEpochIndex === 2) {
											// TODO @MF figure out route
											push({ pathname: '/vote/nominees?council=spartan' });
										} else {
											// TODO @MF figure out route
											push({ pathname: '/elected/nominees?council=spartan' });
										}
									}}
									variant={treasuryCouncilInfo.variant}
								>
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
