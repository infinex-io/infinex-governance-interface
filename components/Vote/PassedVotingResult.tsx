import { Accordion, Badge, Pagination } from '@synthetixio/ui';
import { DeployedModules } from 'containers/Modules';
import { BigNumber } from 'ethers';
import useEpochDatesQuery from 'queries/epochs/useEpochDatesQuery';
import useEpochIndexQuery from 'queries/epochs/useEpochIndexQuery';
import useGetElectionWinners from 'queries/epochs/useGetElectionWinners';
import { useVotingResult } from 'queries/voting/useVotingResult';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { compareAddress } from 'utils/helpers';
import { PreEvaluationSectionRow } from './PreEvaluationSectionRow';

interface PassedVotingResultsProps {
	moduleInstance: DeployedModules;
}
export const PassedVotingResults: React.FC<PassedVotingResultsProps> = ({ moduleInstance }) => {
	const [loading, setLoading] = useState(false);
	const { data: epochIndex, isLoading } = useEpochIndexQuery(moduleInstance);

	useEffect(() => {
		// Reset accordion state
		setLoading(true);
		setTimeout(() => setLoading(false), 0);
	}, [moduleInstance]);

	if (isLoading || !epochIndex || loading) return null;

	return (
		<div className="w-full mt-10">
			{[...Array(epochIndex)].map((_, i) => (
				<div key={i} className="w-full ui-gradient-gray-1 p-[1px] rounded shadow-card mb-2">
					<Accordion
						variant="dark-blue"
						title={<VotingResultTitle moduleInstance={moduleInstance} epoch={epochIndex - i - 1} />}
					>
						<VotingResult moduleInstance={moduleInstance} epoch={epochIndex - i - 1} />
					</Accordion>
				</div>
			))}
		</div>
	);
};

interface VotingResultProps {
	moduleInstance: DeployedModules;
	epoch: number;
}

const PAGE_SIZE = 8;

export const VotingResult: React.FC<VotingResultProps> = ({ moduleInstance, epoch }) => {
	const { data: winners } = useGetElectionWinners(moduleInstance, epoch);
	const { data: result } = useVotingResult(moduleInstance, epoch);
	const [activePage, setActivePage] = useState(0);
	const { t } = useTranslation();

	const totalVotingPowers = result?.reduce(
		(cur, prev) => cur.add(prev.totalVotePower),
		BigNumber.from(0)
	);
	const isTreasury = moduleInstance === DeployedModules.TREASURY_COUNCIL;

	const startIndex = activePage * PAGE_SIZE;
	const endIndex =
		result?.length && startIndex + PAGE_SIZE > result?.length
			? result?.length
			: startIndex + PAGE_SIZE;

	return (
		<div className="w-full overflow-auto">
			<table className="w-full :table">
				<tr className="border-b-2 last:border-b-0 border-b-gray-700 border-b-solid">
					<th className="text-left p-6 tg-caption text-gray-500">
						{t('vote.pre-eval.table.name')}
					</th>
					<th className="tg-caption text-gray-500 p-6">{t('vote.pre-eval.table.votes')}</th>
					<th className="tg-caption text-gray-500 p-6">{t('vote.pre-eval.table.power')}</th>
					<th className="tg-caption text-gray-500 p-6">
						{t('vote.pre-eval.table.received', { units: isTreasury ? 'Ether' : 'Wei' })}
					</th>
					<th className="text-right p-6 tg-caption text-gray-500">
						{t('vote.pre-eval.table.actions')}
					</th>
				</tr>
				{result
					?.sort((a, b) => {
						if (a.totalVotePower.gt(b.totalVotePower)) return -1;
						if (a.totalVotePower.lt(b.totalVotePower)) return 1;
						return 0;
					})
					.slice(startIndex, endIndex)
					.map((voteResult) => (
						<PreEvaluationSectionRow
							key={voteResult.walletAddress.concat(String(voteResult.voteCount))}
							isActive={
								!!winners?.find((winner: string) =>
									compareAddress(winner, voteResult.walletAddress)
								)
							}
							totalVotingPowers={totalVotingPowers}
							voteResult={voteResult}
							walletAddress={voteResult.walletAddress}
						/>
					))}
			</table>
			<div className="w-full">
				<Pagination
					className="mx-auto py-4"
					pageIndex={activePage}
					gotoPage={setActivePage}
					length={result?.length || 0}
					pageSize={PAGE_SIZE}
				/>
			</div>
		</div>
	);
};

export const VotingResultTitle: React.FC<VotingResultProps> = ({ moduleInstance, epoch }) => {
	const { data, isLoading } = useEpochDatesQuery(moduleInstance, epoch);
	if (isLoading) return <div className="h-6 rounded-full bg-gray-600 w-32 animate-pulse"></div>;
	if (isLoading || !data?.epochStartDate || !data?.epochEndDate) return null;
	return (
		<div className="flex items-center xs:flex-row flex-col">
			Passed Elections
			<span className="ml-2 bg-green py-0.5 px-2 text-black tg-caption-sm-bold font-semibold text-bold rounded-[130px]">
				Epoch - {new Date(data?.epochStartDate).toLocaleDateString()} -{' '}
				{new Date(data?.epochEndDate).toLocaleDateString()}
			</span>
		</div>
	);
};
