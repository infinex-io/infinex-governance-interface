import { Button } from '@synthetixio/ui';
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
import { parseCouncil } from 'utils/parse';

interface CouncilCardProps {
	council: string;
	image: string;
	deployedModule: DeployedModules;
}

export const CouncilCard: React.FC<CouncilCardProps> = ({ council, deployedModule, image }) => {
	const { t } = useTranslation();
	const { push } = useRouter();
	const { setContent, setIsOpen } = useModalContext();

	const { data: currentPeriodData } = useCurrentPeriod(deployedModule);
	const [, nominees, members] = [
		useCurrentEpochDatesQuery(deployedModule),
		useNomineesQuery(deployedModule),
		useCouncilMembersQuery(deployedModule),
	];

	const membersCount = members.data?.length;
	const nomineesCount = nominees.data?.length;
	const period = currentPeriodData?.currentPeriod;

	const spartanCouncilInfo =
		currentPeriodData && parseCouncil(EpochPeriods[currentPeriodData.currentPeriod]);

	if (!spartanCouncilInfo) return null;

	const { cta, button, variant, color, headlineLeft, headlineRight, secondButton } =
		spartanCouncilInfo;

	return (
		<div className="bg-purple p-1">
			<div className="h-full p-4 gap-1 flex flex-col justify-around align-center darker-60">
				<Image alt="spartan-council" src={image} width={50} height={72} />
				<h4 className="tg-title-h4 text-center">{t(`landing-page.cards.${council}`)}</h4>
				<span className={`bg-${color} p-1 rounded-md text-center m-4`}>{t(cta)}</span>
				<StyledSpacer />
				<div className="flex justify-around">
					<Text>{t(headlineLeft)}</Text>
					<Text>{t(headlineRight)}</Text>
				</div>
				<div className="flex justify-around">
					<h2 className="tg-title-h2">
						{period === 'NOMINATION' || period === 'VOTING' ? nomineesCount : membersCount}
					</h2>
					{/* TODO @DEV implement votes received or live votes when available */}
					<h2 className="tg-title-h2">{period === 'NOMINATION' ? nomineesCount : membersCount}</h2>
				</div>
				{secondButton && (
					<TransparentText
						gradient="lightBlue"
						onClick={() => {
							push({
								pathname: '/councils/'.concat(council),
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
								pathname: '/vote/'.concat(council),
							});
						} else {
							push({
								pathname: '/councils',
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

const StyledSpacer = styled.span`
	height: 1px;
	width: 203px;
	background: linear-gradient(73.6deg, #8e2de2 2.11%, #4b01e0 90.45%);
`;
