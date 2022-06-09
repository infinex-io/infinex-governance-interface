import { Button } from '@synthetixio/ui';
import NominateModal from 'components/Modals/Nominate';
import { Text } from 'components/Text/text';
import { TransparentText } from 'components/Text/transparent';
import { useModalContext } from 'containers/Modal';
import { DeployedModules } from 'containers/Modules';
import Image from 'next/image';
import { useRouter } from 'next/router';
import useCurrentPeriod, { EpochPeriods } from 'queries/epochs/useCurrentPeriodQuery';
import useCouncilMembersQuery from 'queries/members/useCouncilMembersQuery';
import useNomineesQuery from 'queries/nomination/useNomineesQuery';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { parseCouncil } from 'utils/parse';
import { Timer } from 'components/Timer';
import clsx from 'clsx';
import useNominationPeriodDatesQuery from 'queries/epochs/useNominationPeriodDatesQuery';

interface CouncilCardProps {
	council: string;
	image: string;
	deployedModule: DeployedModules;
}

export const CouncilCard: React.FC<CouncilCardProps> = ({ council, deployedModule, image }) => {
	const { t } = useTranslation();
	const { push } = useRouter();
	const { setContent, setIsOpen } = useModalContext();
	const [councilInfo, setCouncilInfo] = useState<null | ReturnType<typeof parseCouncil>>(null);

	const { data: currentPeriodData } = useCurrentPeriod(deployedModule);

	// TODO @MF check when voting period starts, should be different
	const [dates, nominees, members] = [
		useNominationPeriodDatesQuery(deployedModule),
		useNomineesQuery(deployedModule),
		useCouncilMembersQuery(deployedModule),
	];

	const membersCount = members.data?.length;
	const nomineesCount = nominees.data?.length;
	const period = currentPeriodData?.currentPeriod;

	useEffect(() => {
		if (currentPeriodData?.currentPeriod)
			setCouncilInfo(parseCouncil(EpochPeriods[currentPeriodData.currentPeriod]));
	}, [currentPeriodData?.currentPeriod]);

	if (!councilInfo)
		return (
			<div className="p-1 bg-purple w-[295px] h-[347px] rounded">
				<div className="h-full darker-60 animate-pulse"></div>
			</div>
		);

	const { cta, button, variant, color, headlineLeft, headlineRight, secondButton } = councilInfo;

	return (
		<div className="bg-purple p-1 rounded">
			<div className="h-full p-8 rounded gap-1 flex flex-col justify-around align-center darker-60">
				<Image alt={council} src={image} width={50} height={72} />
				<h4 className="tg-title-h4 text-center">{t(`landing-page.cards.${council}`)}</h4>
				<span
					className={`${color} p-2 rounded-full tg-content-bold text-center my-2 w-fit self-center`}
				>
					{t(cta)}
				</span>
				{period &&
					dates.data?.nominationPeriodEndDate &&
					['NOMINATION', 'VOTING'].includes(period) && (
						<Timer
							className={clsx('text-orange tg-body-bold mx-auto', {
								'text-orange': period === 'NOMINATION',
								'text-green': period === 'VOTING',
							})}
							expiryTimestamp={dates.data?.nominationPeriodEndDate}
						/>
					)}
				<StyledSpacer className="mb-1" />
				<div className="flex justify-between">
					<Text>{t(headlineLeft)}</Text>
					<Text>{t(headlineRight)}</Text>
				</div>
				<div className="flex justify-between">
					<h2 className="tg-title-h2">
						{period === 'NOMINATION' || period === 'VOTING' ? nomineesCount : membersCount}
					</h2>
					<h2 className="tg-title-h2">{period === 'NOMINATION' ? nomineesCount : membersCount}</h2>
				</div>
				{secondButton && (
					<TransparentText
						gradient="lightBlue"
						onClick={() => push({ pathname: `/councils/${council}` })}
						clickable
					>
						{t(secondButton)}
					</TransparentText>
				)}
				<Button
					variant={variant}
					className="w-full mt-4"
					size="lg"
					onClick={() => {
						if (period === 'NOMINATION') {
							setContent(<NominateModal />);
							setIsOpen(true);
						} else if (period === 'VOTING') {
							push({ pathname: `/vote/${council}` });
						} else {
							push({ pathname: '/councils' });
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
	width: 100%;
	background: linear-gradient(73.6deg, #8e2de2 2.11%, #4b01e0 90.45%);
`;
