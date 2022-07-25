import { Pagination, Tabs } from '@synthetixio/ui';
import { DeployedModules } from 'containers/Modules';
import { BigNumber } from 'ethers';
import useIsMobile from 'hooks/useIsMobile';
import { t } from 'i18next';
import useEpochIndexQuery from 'queries/epochs/useEpochIndexQuery';
import useNextEpochSeatCountQuery from 'queries/epochs/useNextEpochSeatCountQuery';
import { useVotingResult, VoteResult } from 'queries/voting/useVotingResult';
import { useState } from 'react';
import { PreEvaluationSectionRow } from './PreEvaluationSectionRow';
import { PreEvaluationSectionRowMobile } from './PreEvaluationSectionRowMobile';

export function PreEvaluationSection() {
	const isMobile = useIsMobile();
	const spartanEpochIndex = useEpochIndexQuery(DeployedModules.SPARTAN_COUNCIL);
	const grantsEpochIndex = useEpochIndexQuery(DeployedModules.GRANTS_COUNCIL);
	const ambassadorEpochIndex = useEpochIndexQuery(DeployedModules.AMBASSADOR_COUNCIL);
	const treasuryEpochIndex = useEpochIndexQuery(DeployedModules.TREASURY_COUNCIL);

	const preEvalDic = [
		{
			seats: useNextEpochSeatCountQuery(DeployedModules.SPARTAN_COUNCIL).data,
			council: useVotingResult(
				DeployedModules.SPARTAN_COUNCIL,
				spartanEpochIndex.data?.toString() || '0'
			).data,
		},
		{
			seats: useNextEpochSeatCountQuery(DeployedModules.GRANTS_COUNCIL).data,
			council: useVotingResult(
				DeployedModules.GRANTS_COUNCIL,
				grantsEpochIndex.data?.toString() || '0'
			).data,
		},
		{
			seats: useNextEpochSeatCountQuery(DeployedModules.AMBASSADOR_COUNCIL).data,
			council: useVotingResult(
				DeployedModules.AMBASSADOR_COUNCIL,
				ambassadorEpochIndex.data?.toString() || '0'
			).data,
		},
		{
			seats: useNextEpochSeatCountQuery(DeployedModules.TREASURY_COUNCIL).data,
			council: useVotingResult(
				DeployedModules.TREASURY_COUNCIL,
				treasuryEpochIndex.data?.toString() || '0'
			).data,
		},
	];

	return (
		<div className="flex flex-col items-center pt-10">
			<h1 className="md:tg-title-h1 tg-title-h3 text-white">{t('vote.pre-eval.headline')}</h1>
			<span className="tg-body text-center p-4 text-gray-500">
				{t('vote.pre-eval.voting-results-live')}
			</span>
			<Tabs
				initial="spartan"
				className="overflow-x-auto no-scrollbar xs:w-auto w-full"
				items={[
					{
						id: 'spartan',
						label: t('vote.pre-eval.tabs.sc'),
						content: <PreEvalResults isMobile={isMobile} preEvalDic={preEvalDic[0]} />,
					},
					{
						id: 'grants',
						label: t('vote.pre-eval.tabs.gc'),
						content: <PreEvalResults isMobile={isMobile} preEvalDic={preEvalDic[1]} />,
					},
					{
						id: 'ambassador',
						label: t('vote.pre-eval.tabs.ac'),
						content: <PreEvalResults isMobile={isMobile} preEvalDic={preEvalDic[2]} />,
					},
					{
						id: 'treasury',
						label: t('vote.pre-eval.tabs.tc'),
						content: <PreEvalResults isMobile={isMobile} preEvalDic={preEvalDic[3]} isTreasury />,
					},
				]}
			/>
		</div>
	);
}

const PAGE_SIZE = 8;

const PreEvalResults = ({
	isMobile,
	preEvalDic,
	isTreasury,
}: {
	isTreasury?: boolean;
	isMobile: boolean;
	preEvalDic: {
		seats: number | undefined;
		council: VoteResult[] | undefined;
	};
}) => {
	const totalVotingPowers = preEvalDic.council?.reduce(
		(cur, prev) => cur.add(prev.totalVotePower),
		BigNumber.from(0)
	);

	const result = preEvalDic.council;
	const [activePage, setActivePage] = useState(0);
	const startIndex = activePage * PAGE_SIZE;
	const endIndex =
		result?.length && startIndex + PAGE_SIZE > result?.length
			? result?.length
			: startIndex + PAGE_SIZE;
	if (!isMobile) {
		return (
			<div className="mt-6 mb-20">
				<div className="border-gray-700 border rounded-xl overflow-hidden">
					<table className="bg-dark-blue w-[1000px] rounded-xl :table">
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
						{result?.slice(startIndex, endIndex).map((voteResult) => (
							<PreEvaluationSectionRow
								key={voteResult.walletAddress.concat(String(voteResult.voteCount))}
								isActive={
									result.findIndex((item) => item.walletAddress === voteResult.walletAddress) <
									(preEvalDic.seats || 0)
								}
								totalVotingPowers={totalVotingPowers}
								voteResult={voteResult}
								walletAddress={voteResult.walletAddress}
							/>
						))}
					</table>
				</div>
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
	}
	return (
		<div className="flex flex-col w-full md:hidden p-2 mb-20">
			{result?.slice(startIndex, endIndex).map((voteResult) => (
				<PreEvaluationSectionRowMobile
					key={voteResult.walletAddress.concat(String(voteResult.voteCount))}
					isActive={
						result.findIndex((item) => item.walletAddress === voteResult.walletAddress) <
						(preEvalDic.seats || 0)
					}
					totalVotingPowers={totalVotingPowers}
					voteResult={voteResult}
					walletAddress={voteResult.walletAddress}
				/>
			))}
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
