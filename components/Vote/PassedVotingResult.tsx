import { Accordion, Badge, Table } from '@synthetixio/ui';
import { CouncilBadge } from 'components/CouncilBadge';
import { DeployedModules } from 'containers/Modules';
import { BigNumber, utils } from 'ethers';
import useEpochDatesQuery from 'queries/epochs/useEpochDatesQuery';
import useEpochIndexQuery from 'queries/epochs/useEpochIndexQuery';
import useGetElectionWinners from 'queries/epochs/useGetElectionWinners';
import { useVotingResult, VoteResult } from 'queries/voting/useVotingResult';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Column } from 'react-table';
import { currency } from 'utils/currency';
import { calcPercentage, compareAddress } from 'utils/helpers';
import { UserDetails } from './UserDetails';

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

	const columns = useMemo<Column<VoteResult>[]>(
		() => [
			{
				Header: t<string>('vote.pre-eval.table.name'),
				accessor: (row) => <UserDetails walletAddress={row.walletAddress} />,
				columnClass: 'text-left',
				cellClass: 'text-left',
			},
			{
				Header: t<string>('vote.pre-eval.table.outcome'),
				accessor: (row) =>
					!!winners?.find((winner: string) => compareAddress(winner, row.walletAddress)) ? (
						<CouncilBadge council={moduleInstance} />
					) : (
						<Badge variant="gray">{t('vote.pre-eval.table.nominee')}</Badge>
					),
				columnClass: 'text-left',
				cellClass: 'text-left',
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
				accessor: (row) =>
					currency(
						utils.formatUnits(
							row.totalVotePower,
							moduleInstance === DeployedModules.TREASURY_COUNCIL ? 'ether' : 'wei'
						)
					),
			},
		],
		[isTreasury, moduleInstance, t, totalVotingPowers, winners]
	);

	if (!result) return null;

	return (
		<div className="w-full overflow-auto">
			<Table data={result} columns={columns} />
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
