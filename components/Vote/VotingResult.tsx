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
	const { data: voteResults, isLoading } = useVotingResult(moduleInstance, epochIndex.data);
	const { data: seats } = useNextEpochSeatCountQuery(moduleInstance);
	const { activePage, setActivePage, pageSize, paginate } = usePaginate(6, voteResults?.length);
	const isMobile = useIsMobile();

	const totalVotingPowers = (voteResults || []).reduce(
		(cur, prev) => cur.add(prev.totalVotePower),
		BigNumber.from(0)
	);

	if (!isMobile) {
		return (
			<div className="mt-6 mb-20 p-6 border-gray-700 border bg-slate-900 w-[1000px] rounded-xl max-w-full mx-auto">
				<VotingResultTable
					voteResults={voteResults || []}
					seats={seats || 0}
					isLoading={isLoading}
					moduleInstance={moduleInstance}
					totalVotingPowers={totalVotingPowers}
				/>
			</div>
		);
	}

	if (!voteResults) return null;

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
	isLoading: boolean;
}

export const VotingResultTable: React.FC<VotingResultTableProps> = ({
	moduleInstance,
	voteResults,
	seats,
	totalVotingPowers,
	isLoading,
}) => {
	const { t } = useTranslation();

	const isTreasury = moduleInstance === DeployedModules.TREASURY_COUNCIL;

	const columns = useMemo<Column<VoteResult>[]>(() => {
		const isActive = (walletAddress: string) =>
			(voteResults.findIndex((item) => compareAddress(item.walletAddress, walletAddress)) || 0) <
			(seats || 0);

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
					totalVotingPowers && row.totalVotePower
						? `${calcPercentage(row.totalVotePower, totalVotingPowers)}%`
						: '',
			},
			{
				Header: t<string>('vote.pre-eval.table.received', { units: isTreasury ? 'Ether' : 'Gwei' }),
				columnClass: 'text-sm text-right',
				accessor: 'totalVotePower',
				Cell: ({ row }) => (
					<>
						{currency(
							utils.formatUnits(
								row.values.totalVotePower,
								moduleInstance === DeployedModules.TREASURY_COUNCIL ? 'ether' : 'gwei'
							)
						)}
					</>
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
			<Table data={voteResults} isLoading={isLoading} columns={columns} />
		</div>
	);
};
