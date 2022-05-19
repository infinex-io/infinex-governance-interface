import { Button } from '@synthetixio/ui';
import { H2 } from 'components/Headlines/H2';
import { H4 } from 'components/Headlines/H4';
import NominateModal from 'components/Modals/Nominate';
import { Colors } from 'components/old-ui';
import { Text } from 'components/Text/text';
import { TransparentText } from 'components/Text/transparent';
import { useModalContext } from 'containers/Modal';
import { DeployedModules } from 'containers/Modules';
import Image from 'next/image';
import { useRouter } from 'next/router';
import useCurrentEpochDatesQuery from 'queries/epochs/useCurrentEpochDatesQuery';
import useCurrentPeriod, { EpochPeriods } from 'queries/epochs/useCurrentPeriodQuery';
import useCouncilMembersQuery from 'queries/members/useCouncilMembersQuery';
import useNomineesQuery from 'queries/nomination/useNomineesQuery';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

interface CouncilCardProps {
	image: string;
	deployedModule: DeployedModules;
}

export const CouncilCard: React.FC<CouncilCardProps> = ({ deployedModule, image }) => {
	const { t } = useTranslation();
	const { push } = useRouter();
	const { setContent, setIsOpen } = useModalContext();

	const { data: spartanCurrentPeriod } = useCurrentPeriod(deployedModule);
	const [, spartanNominees, spartanMembers] = [
		useCurrentEpochDatesQuery(deployedModule),
		useNomineesQuery(deployedModule),
		useCouncilMembersQuery(deployedModule),
	];

	const membersCount = spartanMembers.data?.length;
	const nomineesCount = spartanNominees.data?.length;
	const period = spartanCurrentPeriod?.currentPeriod;

	const spartanCouncilInfo =
		spartanCurrentPeriod && parseIndex(EpochPeriods[spartanCurrentPeriod.currentPeriod]);

	if (!spartanCouncilInfo) return null;

	const { cta, button, variant, color, headlineLeft, headlineRight, secondButton } =
		spartanCouncilInfo;

	return (
		<div className="bg-purple p-1">
			<div className="h-full p-4 gap-1 flex flex-col justify-around align-center darker-60">
				<Image alt="spartan-council" src={image} width={50} height={72} />
				<H4>{t('landing-page.cards.sc')}</H4>
				<span className={`bg-${color} p-1`}>{t(cta)}</span>
				<StyledSpacer />
				<div className="flex justify-around">
					<Text>{t(headlineLeft)}</Text>
					<Text>{t(headlineRight)}</Text>
				</div>
				<div className="flex justify-around">
					<H2>{period === 'NOMINATION' || period === 'VOTING' ? nomineesCount : membersCount}</H2>
					{/* TODO @DEV implement votes received or live votes when available */}
					<H2>{period === 'NOMINATION' ? nomineesCount : membersCount}</H2>
				</div>
				{secondButton && (
					<TransparentText
						gradient="lightBlue"
						onClick={() => {
							push({
								pathname: '/councils',
								query: {
									council: 'spartan',
									nominees: true,
								},
							});
						}}
						clickable
					>
						{t(secondButton)}
					</TransparentText>
				)}
				<Button
					variant={variant}
					className="w-full"
					size="lg"
					onClick={() => {
						if (period === 'NOMINATION') {
							setContent(<NominateModal />);
							setIsOpen(true);
						} else if (period === 'VOTING') {
							push({
								pathname: '/vote',
								query: {
									council: 'spartan',
								},
							});
						} else {
							push({
								pathname: '/councils',
								query: {
									council: 'spartan',
								},
							});
						}
					}}
				>
					{t(button)}
				</Button>
			</div>
		</div>
	);
};

const parseIndex = (
	index: number
): {
	cta: string;
	button: string;
	variant: 'default' | 'outline';
	color: Colors;
	headlineLeft: string;
	headlineRight: string;
	secondButton?: string;
} => {
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
};

const StyledSpacer = styled.span`
	height: 1px;
	width: 203px;
	background: linear-gradient(73.6deg, #8e2de2 2.11%, #4b01e0 90.45%);
`;
