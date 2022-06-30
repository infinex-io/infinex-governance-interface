import { Button } from '@synthetixio/ui';
import NominateModal from 'components/Modals/Nominate';
import { useModalContext } from 'containers/Modal';
import { DeployedModules } from 'containers/Modules';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { EpochPeriods } from 'queries/epochs/useCurrentPeriodQuery';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { parseCouncil } from 'utils/parse';
import { Timer } from 'components/Timer';
import useCouncilCardQueries from 'hooks/useCouncilCardQueries';
import { useVotingCount } from 'queries/voting/useVotingCount';
import useEpochIndexQuery from 'queries/epochs/useEpochIndexQuery';

interface CouncilCardProps {
	council: string;
	image: string;
	deployedModule: DeployedModules;
}

export const CouncilCard: React.FC<CouncilCardProps> = ({ council, deployedModule, image }) => {
	const { t } = useTranslation();
	const { push } = useRouter();
	const { setContent, setIsOpen } = useModalContext();
	const epochIndex = useEpochIndexQuery(deployedModule);
	const { councilMembers, currentPeriodData, nominationDates, nominees, votingDates } =
		useCouncilCardQueries(deployedModule);

	const voteCount = useVotingCount(deployedModule, epochIndex.data?.toString() || null);
	const membersCount = councilMembers?.length;
	const nomineesCount = nominees?.length;
	const period = currentPeriodData?.currentPeriod;

	const councilInfo = currentPeriodData
		? parseCouncil(EpochPeriods[currentPeriodData.currentPeriod])
		: null;

	if (!councilInfo)
		return (
			<div className="min-w-[90vw] xs:min-w-fit p-0.5 bg-purple xs:w-[248px] w-full max-w-full h-[347px] rounded">
				<div className="h-full darker-60 animate-pulse"></div>
			</div>
		);

	const { cta, button, variant, color, headlineLeft, headlineRight, secondButton } = councilInfo;

	return (
		<div className="p-0.5 bg-purple rounded w-full xs:w-auto">
			<div className="h-full p-4 rounded gap-1 flex flex-col justify-around align-center darker-60">
				<Image alt={council} src={image} width={50} height={70} />
				<h4 className="tg-title-h4 text-center mt-2">{t(`landing-page.cards.${council}`)}</h4>
				<span
					className={`${color} p-2 rounded-full tg-caption-bold text-center my-2 w-fit self-center`}
				>
					{t(cta)}
				</span>
				{period === 'NOMINATION' && nominationDates?.nominationPeriodEndDate && (
					<Timer
						className="text-orange tg-body-bold mx-auto"
						expiryTimestamp={nominationDates?.nominationPeriodEndDate}
					/>
				)}
				{period === 'VOTING' && votingDates?.votingPeriodEndDate && (
					<Timer
						className="text-green tg-body-bold mx-auto"
						expiryTimestamp={votingDates.votingPeriodEndDate}
					/>
				)}
				<span className="ui-gradient-purple h-[1px] w-full mb-1"></span>
				<div className="flex justify-between">
					<span className="tg-caption text-gray-500">{t(headlineLeft)}</span>
					<span className="tg-caption text-gray-500">{t(headlineRight)}</span>
				</div>
				<div className="flex justify-between">
					<h4 className="font-['GT_America_Condensed_Bold'] text-[24px]">
						{period === 'NOMINATION' || period === 'VOTING' ? nomineesCount : membersCount}
					</h4>
					<h4 className="font-['GT_America_Condensed_Bold'] text-[24px]">{voteCount}</h4>
				</div>
				{secondButton && (
					<span
						className="tg-caption cursor-pointer bg-clip-text text-transparent bg-gradient-primary"
						onClick={() => push(`/councils/${council}`)}
					>
						{t(secondButton)}
					</span>
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
