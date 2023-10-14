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
import useIsNominated from 'queries/nomination/useIsNominatedQuery';
import { useConnectorContext } from 'containers/Connector';
import { useEffect, useState } from 'react';
import useIsCC from 'queries/nomination/useIsCCQuery';
import TextLoader from 'components/TextLoader/TextLoader';
import TimerMock from 'components/TimerMock';

interface CouncilCardProps {
	council: 'trade' | 'ecosystem' | 'core-contributor' | 'treasury';
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
	const { walletAddress, isWalletConnected } = useConnectorContext();
	const [isNominated, setIsNominated] = useState<boolean | undefined>(false);
	const membersCount = councilMembers?.length;
	const nomineesCount = nominees?.length;
	const period = currentPeriodData?.currentPeriod;
	const councilInfo = period ? parseCouncil(EpochPeriods[period]) : null;

	const isAlreadyNominatedForTrade = useIsNominated(
		DeployedModules.TRADE_COUNCIL,
		walletAddress || ''
	);
	const isAlreadyNominatedForEcosystem = useIsNominated(
		DeployedModules.ECOSYSTEM_COUNCIL,
		walletAddress || ''
	);
	const isAlreadyNominatedForCoreContributor = useIsNominated(
		DeployedModules.CORE_CONTRIBUTOR_COUNCIL,
		walletAddress || ''
	);
	const isAlreadyNominatedForTreasury = useIsNominated(
		DeployedModules.TREASURY_COUNCIL,
		walletAddress || ''
	);

	const isCC = useIsCC(walletAddress || '');
	const hasNominated =
		isWalletConnected &&
		(isAlreadyNominatedForTrade.data ||
			isAlreadyNominatedForEcosystem.data ||
			isAlreadyNominatedForCoreContributor.data ||
			isAlreadyNominatedForTreasury.data);

	useEffect(() => {
		switch (council) {
			case 'trade':
				setIsNominated(isAlreadyNominatedForTrade.data);
				break;
			case 'core-contributor':
				setIsNominated(isAlreadyNominatedForCoreContributor.data);
				break;
			case 'ecosystem':
				setIsNominated(isAlreadyNominatedForEcosystem.data);
				break;
			case 'treasury':
				setIsNominated(isAlreadyNominatedForTreasury.data);
		}
	}, [
		isAlreadyNominatedForTrade.data,
		isAlreadyNominatedForCoreContributor.data,
		isAlreadyNominatedForEcosystem.data,
		isAlreadyNominatedForTreasury.data,
	]);

	if (!councilInfo)
		return (
			<div
				className="min-w-[90vw] xs:min-w-fit p-0.5 bg-slate-700 xs:w-[248px] w-full max-w-full h-[347px] rounded"
				data-testid="loading-state"
			>
				<div className="h-full darker-60 animate-pulse"></div>
			</div>
		);

	const { cta, button, color, headlineLeft, headlineRight, secondButton } = councilInfo;
	return (
		<div
			className="border border-slate-800 w-full xs:w-64 p-4 rounded gap-1 flex flex-col
		 justify-center align-center bg-[#12141F]"
		>
			<div className="flex items-center justify-center my-3">
				<Image alt={council} src={image} width={35} height={70} />
			</div>
			<h4 className="tg-title-h4 text-center m-2" data-testid={`council-headline-${council}`}>
				<div className="mb-1">{t(`landing-page.cards.${council}`)}</div>
				<div>{council === 'ecosystem' ? 'Seats' : 'Seat'}</div>
			</h4>
			<span
				className={`${color} p-2 rounded font-medium text-xs text-center my-2 w-fit self-center`}
				data-testid="cta-text"
			>
				{t(cta)}
			</span>
			{period === 'NOMINATION' && (
				(nominationDates?.nominationPeriodEndDate === undefined) ?
					<TimerMock />
					:
					<Timer
						className="text-slate-100 tg-body-bold mx-auto"
						expiryTimestamp={nominationDates?.nominationPeriodEndDate}
						data-testid="nomination-timer"
					/>
			)}
			{period === 'VOTING' && (
				// LOADING STATE
				(votingDates?.votingPeriodEndDate === undefined) ?
					<TimerMock />
					:
					<Timer
						className="text-slate-100 tg-body-bold mx-auto"
						expiryTimestamp={votingDates?.votingPeriodEndDate}
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
				<h4 className="text-xl text-slate-0 font-bold">
					{period === 'NOMINATION' || period === 'VOTING' ? (
						nomineesCount !== undefined ? (
							nomineesCount
						) : (
							<TextLoader text="1000" />
						)
					) : membersCount !== undefined ? (
						membersCount
					) : (
						<TextLoader text="1000" />
					)}
				</h4>
				<h4 className="text-xl text-slate-0 font-bold">
					{voteCount.data || (
						<TextLoader text="1000" />
					)}
				</h4>
			</div>
			{secondButton && (
				<Button
					variant="outline"
					className="cursor-pointer bg-clip-text w-full mt-2"
					onClick={() => push(`/councils/${council}`)}
					label={t(secondButton) as string}
				/>
			)}
			<Button
				className={`w-full mt-2 
				// if period is NOMINATION AND (either already nominated or is a CC)
				${period === 'NOMINATION' && (isNominated || (council == 'core-contributor' && !isCC.data))
						? 'hidden'
						: ''
					}
				// if period is NOMINATION AND alreadyNominated 
				${period === 'NOMINATION' && hasNominated ? 'cursor-default' : ''}`}
				onClick={() => {
					if (period === 'NOMINATION') {
						if (hasNominated) return;
						setContent(<NominateModal council={council} />);
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
				variant={period === 'NOMINATION' && hasNominated ? 'tertiary' : 'primary'}
				label={
					period === 'NOMINATION' && hasNominated
						? (t('landing-page.cards.button.already-nominated') as string)
						: (t(button) as string)
				}
			/>
			{/* already nominated for specific council button */}
			{period === 'NOMINATION' && isNominated && (
				<Button
					variant="success"
					className="w-full mt-2"
					label={t('landing-page.cards.button.nominated') as string}
					onClick={() => push(`/councils/${council}`)}
				/>
			)}
			{/* CC button */}
			{period === 'NOMINATION' && council === 'core-contributor' && !isCC.data && (
				<Button
					variant="destructive"
					className="w-full mt-2 cursor-default"
					label={t('landing-page.cards.button.not-cc') as string}
				/>
			)}
		</div>
	);
};
