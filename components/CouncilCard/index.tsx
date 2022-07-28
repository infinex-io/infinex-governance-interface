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

interface CouncilCardProps {
	council: string;
	image: string;
	deployedModule: DeployedModules;
}

export const CouncilCard: React.FC<CouncilCardProps> = ({ council, deployedModule, image }) => {
	const { t } = useTranslation();
	const { push } = useRouter();
	const { setContent, setIsOpen } = useModalContext();
	const { councilMembers, currentPeriodData, nominationDates, nominees, votingDates } =
		useCouncilCardQueries(deployedModule);
	const voteCount = useVotingCount(deployedModule, null);
	const membersCount = councilMembers?.length;
	const nomineesCount = nominees?.length;
	const period = !Array.isArray(currentPeriodData) && currentPeriodData?.currentPeriod;

	const councilInfo = period ? parseCouncil(EpochPeriods[period]) : null;

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
				<h4 className="tg-title-h4 text-center mt-2" data-testid={`council-headline-${council}`}>
					{t(`landing-page.cards.${council}`)}
				</h4>
				<span
					className={`${color} p-2 rounded-full tg-caption-bold text-center my-2 w-fit self-center`}
					data-testid="cta-text"
				>
					{t(cta)}
				</span>
				{period === 'NOMINATION' && nominationDates?.nominationPeriodEndDate && (
					<Timer
						className="text-orange tg-body-bold mx-auto"
						expiryTimestamp={nominationDates?.nominationPeriodEndDate}
						data-testid="nomination-timer"
					/>
				)}
				{period === 'VOTING' && votingDates?.votingPeriodEndDate && (
					<Timer
						className="text-green tg-body-bold mx-auto"
						expiryTimestamp={votingDates.votingPeriodEndDate}
						data-testid="voting-timer"
					/>
				)}
				<span className="ui-gradient-purple h-[1px] w-full mb-1"></span>
				<div className="flex justify-between">
					<span className="tg-caption text-gray-500">{t(headlineLeft)}</span>
					<span className="tg-caption text-gray-500">{t(headlineRight)}</span>
				</div>
				<div className="flex justify-between">
					<h4 className="text-2xl council-card-numbers gt-america-condensed-bold-font">
						{period === 'NOMINATION' || period === 'VOTING' ? nomineesCount : membersCount}
					</h4>
					<h4 className="text-2xl council-card-numbers gt-america-condensed-bold-font">
						{voteCount}
					</h4>
				</div>
				{secondButton && (
					<span
						className="tg-caption cursor-pointer bg-clip-text text-transparent ui-gradient-primary"
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
						} else if (period === 'EVALUATION') {
							push('/councils/' + council);
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
