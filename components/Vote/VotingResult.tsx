import { Pagination, Table } from '@synthetixio/ui';
import { DeployedModules } from 'containers/Modules';
import { BigNumber, utils } from 'ethers';
import useIsMobile from 'hooks/useIsMobile';
import { usePaginate } from 'hooks/usePaginate';
import useEpochIndexQuery from 'queries/epochs/useEpochIndexQuery';
import useNextEpochSeatCountQuery from 'queries/epochs/useNextEpochSeatCountQuery';
import { useVotingResult, VoteResult } from 'queries/voting/useVotingResult';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Column } from 'react-table';
import { currency } from 'utils/currency';
import { calcPercentage, compareAddress } from 'utils/helpers';
import { PreEvaluationSectionRowMobile } from './PreEvaluationSectionRowMobile';
import { UserActions, UserDetails } from './UserDetails';

interface VotingResultProps {
	moduleInstance: DeployedModules;
}

export const VotingResult: React.FC<VotingResultProps> = ({ moduleInstance }) => {
	const epochIndex = useEpochIndexQuery(moduleInstance);
	const { data: voteResults } = useVotingResult(moduleInstance, epochIndex.data);
	const { data: seats } = useNextEpochSeatCountQuery(moduleInstance);
	const { activePage, setActivePage, pageSize, paginate } = usePaginate(6, voteResults?.length);
	const isMobile = useIsMobile();

	if (voteResults === undefined || seats === undefined) return null;

	const totalVotingPowers = voteResults.reduce(
		(cur, prev) => cur.add(prev.totalVotePower),
		BigNumber.from(0)
	);

	if (!isMobile) {
		return (
			<div className="mt-6 mb-20 p-6 border-gray-700 border bg-dark-blue w-[1000px] rounded-xl max-w-full mx-auto">
				<VotingResultTable
					voteResults={voteResults}
					seats={seats}
					moduleInstance={moduleInstance}
					totalVotingPowers={totalVotingPowers}
				/>
			</div>
		);
	}

	return (
		<div className="flex flex-col w-full md:hidden p-2 mb-20">
			<div className="flex flex-col w-full">
				{paginate(voteResults).map((voteResult) => (
					<PreEvaluationSectionRowMobile
						key={voteResult.walletAddress.concat(String(voteResult.voteCount))}
						isActive={
							voteResults.findIndex((item) => item.walletAddress === voteResult.walletAddress) <
							(seats || 0)
						}
						totalVotingPowers={totalVotingPowers}
						voteResult={voteResult}
						walletAddress={voteResult.walletAddress}
					/>
				))}
			</div>

			<div className="w-full">
				<Pagination
					className="mx-auto py-4"
					pageIndex={activePage}
					gotoPage={setActivePage}
					length={voteResults.length}
					pageSize={pageSize}
				/>
			</div>
		</div>
	);
};

interface VotingResultTableProps {
	moduleInstance: DeployedModules;
	voteResults: VoteResult[];
	seats: number;
	totalVotingPowers: BigNumber;
}

export const VotingResultTable: React.FC<VotingResultTableProps> = ({
	moduleInstance,
	voteResults,
	seats,
	totalVotingPowers,
}) => {
	const { t } = useTranslation();

	const isTreasury = moduleInstance === DeployedModules.TREASURY_COUNCIL;

	const columns = useMemo<Column<VoteResult>[]>(() => {
		const isActive = (walletAddress: string) =>
			(voteResults.findIndex((item) => item.walletAddress === walletAddress) || 0) < (seats || 0);

		return [
			{
				Header: t<string>('vote.pre-eval.table.name'),
				accessor: (row) => (
					<UserDetails
						moduleInstance={moduleInstance}
						isActive={isActive(row.walletAddress)}
						walletAddress={row.walletAddress}
					/>
				),
				columnClass: 'text-left',
				cellClass: 'text-left p-0',
			},
			{
				Header: t<string>('vote.pre-eval.table.votes'),
				accessor: (row) => row.voteCount,
			},
			{
				Header: t<string>('vote.pre-eval.table.power'),
				accessor: (row) =>
					totalVotingPowers ? `${calcPercentage(row.totalVotePower, totalVotingPowers)}%` : '',
			},
			{
				Header: t<string>('vote.pre-eval.table.received', { units: isTreasury ? 'Ether' : 'Wei' }),
				columnClass: 'text-sm text-right',
				accessor: (row) =>
					currency(
						utils.formatUnits(
							row.totalVotePower,
							moduleInstance === DeployedModules.TREASURY_COUNCIL ? 'ether' : 'wei'
						)
					),
				width: 200,
			},
			{
				Header: t<string>('vote.pre-eval.table.actions'),
				accessor: (row) => <UserActions walletAddress={row.walletAddress} />,
			},
		];
	}, [t, isTreasury, voteResults, seats, totalVotingPowers, moduleInstance]);

	return (
		<div className="w-full overflow-auto">
			<Table data={voteResults} columns={columns} />
		</div>
	);
};
