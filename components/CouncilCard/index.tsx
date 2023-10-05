import NominateModal from 'components/Modals/Nominate';
import { useModalContext } from 'containers/Modal';
import { DeployedModules } from 'containers/Modules';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { EpochPeriods } from 'queries/epochs/useCurrentPeriodQuery';
import { useTranslation } from 'react-i18next';
import { parseCouncil } from 'utils/parse';
import { Timer } from 'components/Timer';
import useCouncilCardQueries from 'hooks/useCouncilCardQueries';
import { useVotingCount } from 'queries/voting/useVotingCount';
import { Button } from 'components/button';

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
	const voteCount = useVotingCount(deployedModule, true);
	const membersCount = councilMembers?.length;
	const nomineesCount = nominees?.length;
	const period = currentPeriodData?.currentPeriod;

	const councilInfo = period ? parseCouncil(EpochPeriods[period]) : null;

	if (!councilInfo)
		return (
			<div
				className="min-w-[90vw] xs:min-w-fit p-0.5 bg-purple xs:w-[248px] w-full max-w-full h-[347px] rounded"
				data-testid="loading-state"
			>
				<div className="h-full darker-60 animate-pulse"></div>
			</div>
		);

	const { cta, button, color, headlineLeft, headlineRight, secondButton } = councilInfo;

	return (
		<div className="border border-slate-800 w-full xs:w-64 p-4 rounded gap-1 flex flex-col
		 justify-around align-center bg-[#12141F]">
			<Image alt={council} src={image} width={50} height={70} />
			<h4 className="tg-title-h4 text-center mt-2" data-testid={`council-headline-${council}`}>
				{t(`landing-page.cards.${council}`)}
			</h4>
			<span
				className={`${color} p-2 rounded font-medium text-xs text-center my-2 w-fit self-center`}
				data-testid="cta-text"
			>
				{t(cta)}
			</span>
			{period === 'NOMINATION' && nominationDates?.nominationPeriodEndDate && (
				<Timer
					className="text-slate-100 tg-body-bold mx-auto"
					expiryTimestamp={nominationDates?.nominationPeriodEndDate}
					data-testid="nomination-timer"
				/>
			)}
			{period === 'VOTING' && votingDates?.votingPeriodEndDate && (
				<Timer
					className="text-slate-100 tg-body-bold mx-auto"
					expiryTimestamp={votingDates.votingPeriodEndDate}
					data-testid="voting-timer"
				/>
			)}
			<span className="bg-slate-800 h-[1px] w-full mb-1"></span>
			<div className="flex justify-between">
				<span className="tg-caption text-slate-100" data-testid="headline-left">
					{t(headlineLeft)}
				</span>
				<span className="tg-caption text-slate-100" data-testid="headline-right">
					{t(headlineRight)}
				</span>
			</div>
			<div className="flex justify-between">
				<h4 className="text-2xl text-slate-0 gt-america-condensed-bold-font">
					{period === 'NOMINATION' || period === 'VOTING' ? nomineesCount : membersCount}
				</h4>
				<h4 className="text-2xl text-slate-0 gt-america-condensed-bold-font">
					{voteCount.data || ''}
				</h4>
			</div>
			{secondButton && (
				<Button
					variant='outline'
					className="tg-caption cursor-pointer bg-clip-text text-transparent w-full"
					onClick={() => push(`/councils/${council}`)}
					label={t(secondButton) as string}
				/>
			)}
			<Button
				className="w-full mt-4"
				onClick={() => {
					if (period === 'NOMINATION') {
						setContent(<NominateModal />);
						setIsOpen(true);
					} else if (period === 'VOTING') {
						push(`/vote/${council}`);
					} else if (period === 'EVALUATION') {
						push('/councils/' + council);
					} else {
						push({ pathname: '/councils' });
					}
				}}
				data-testid="card-button"
				label={t(button) as string}
			/>

			{period === 'VOTING' && (
				<Button
					variant="primary"
					className="w-full mt-2"
					onClick={() => {
						setContent(<NominateModal />);
						setIsOpen(true);
					}}
					data-testid="voting-button"
					label="Nominate"
				/>
			)}
		</div>
	);
};
