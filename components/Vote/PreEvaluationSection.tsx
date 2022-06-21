import { Tabs } from 'components/old-ui';
import { DeployedModules } from 'containers/Modules';
import { BigNumber, utils } from 'ethers';
import useIsMobile from 'hooks/useIsMobile';
import { t } from 'i18next';
import useEpochIndexQuery from 'queries/epochs/useEpochIndexQuery';
import useNextEpochSeatCountQuery from 'queries/epochs/useNextEpochSeatCountQuery';
import { usePreEvaluationVotingPowerQuery } from 'queries/voting/usePreEvaluationVotingPowerQuery';
import { useState } from 'react';
import { PreEvaluationSectionRow } from './PreEvaluationSectionRow';
import { PreEvaluationSectionRowMobile } from './PreEvaluationSectionRowMobile';

export function PreEvaluationSection() {
	const [activeTab, setActiveTab] = useState<number>(0);
	const isMobile = useIsMobile();
	const spartanEpochIndex = useEpochIndexQuery(DeployedModules.SPARTAN_COUNCIL);
	const grantsEpochIndex = useEpochIndexQuery(DeployedModules.GRANTS_COUNCIL);
	const ambassadorEpochIndex = useEpochIndexQuery(DeployedModules.AMBASSADOR_COUNCIL);
	const treasuryEpochIndex = useEpochIndexQuery(DeployedModules.TREASURY_COUNCIL);
	const preEvalSpartanQuery = usePreEvaluationVotingPowerQuery(
		DeployedModules.SPARTAN_COUNCIL,
		spartanEpochIndex.data?.toString() || '0'
	);
	const preEvalGrantsQuery = usePreEvaluationVotingPowerQuery(
		DeployedModules.GRANTS_COUNCIL,
		grantsEpochIndex.data?.toString() || '0'
	);
	const preEvalAmbassadorQuery = usePreEvaluationVotingPowerQuery(
		DeployedModules.AMBASSADOR_COUNCIL,
		ambassadorEpochIndex.data?.toString() || '0'
	);
	const preEvalTreasuryQuery = usePreEvaluationVotingPowerQuery(
		DeployedModules.TREASURY_COUNCIL,
		treasuryEpochIndex.data?.toString() || '0'
	);

	const spartanSeatsQuery = useNextEpochSeatCountQuery(DeployedModules.SPARTAN_COUNCIL);
	const grantsSeatsQuery = useNextEpochSeatCountQuery(DeployedModules.GRANTS_COUNCIL);
	const ambassadorSeatsQuery = useNextEpochSeatCountQuery(DeployedModules.AMBASSADOR_COUNCIL);
	const treasurySeatsQuery = useNextEpochSeatCountQuery(DeployedModules.TREASURY_COUNCIL);

	const preEvalDic = [
		{
			seats: spartanSeatsQuery.data,
			council: preEvalSpartanQuery.data,
		},
		{
			seats: grantsSeatsQuery.data,
			council: preEvalGrantsQuery.data,
		},
		{
			seats: ambassadorSeatsQuery.data,
			council: preEvalAmbassadorQuery.data,
		},
		{
			seats: treasurySeatsQuery.data,
			council: preEvalTreasuryQuery.data,
		},
	];

	const totalVotingPowers = preEvalDic[activeTab].council?.reduce(
		(cur, prev) => cur.add(prev.totalVotingPower),
		BigNumber.from(0)
	);

	return (
		<div className="flex flex-col items-center pt-10">
			<h1 className="md:tg-title-h1 tg-title-h3 text-white">{t('vote.pre-eval.headline')}</h1>
			<span className="tg-body text-center p-4 text-gray-500">
				{t('vote.pre-eval.voting-results-live')}
			</span>
			<Tabs
				className="overflow-x-auto no-scrollbar"
				justifyContent="center"
				titles={[
					t('vote.pre-eval.tabs.sc'),
					t('vote.pre-eval.tabs.gc'),
					t('vote.pre-eval.tabs.ac'),
					t('vote.pre-eval.tabs.tc'),
				]}
				clicked={(id) => typeof id === 'number' && setActiveTab(id)}
				activeIndex={activeTab}
			/>
			{!isMobile ? (
				<table className="bg-dark-blue w-[1000px] border-gray-700 border-[1px] rounded-xl :table mt-6 mb-20">
					<tr className="border-b-2 border-b-gray-700 border-b-solid">
						<th className="text-left p-6 tg-caption text-gray-500">
							{t('vote.pre-eval.table.name')}
						</th>
						<th className="tg-caption text-gray-500 p-6">{t('vote.pre-eval.table.votes')}</th>
						<th className="tg-caption text-gray-500 p-6">{t('vote.pre-eval.table.power')}</th>
						<th className="tg-caption text-gray-500 p-6">{t('vote.pre-eval.table.received')}</th>
						<th className="text-right p-6 tg-caption text-gray-500">
							{t('vote.pre-eval.table.actions')}
						</th>
					</tr>
					{preEvalDic[activeTab].council
						?.sort((a, b) => {
							if (a.totalVotingPower.gt(b.totalVotingPower)) return -1;
							if (a.totalVotingPower.lt(b.totalVotingPower)) return 1;
							return 0;
						})
						.map((prevEval, index) => (
							<PreEvaluationSectionRow
								key={prevEval.walletAddress.concat(String(prevEval.voters.length))}
								isActive={index < (preEvalDic[activeTab].seats || 0)}
								totalVotingPowers={totalVotingPowers}
								prevEval={prevEval}
								walletAddress={prevEval.walletAddress}
							/>
						))}
				</table>
			) : (
				<div className="flex flex-col w-full md:hidden p-2 mb-20">
					{preEvalDic[activeTab].council
						?.sort((a, b) => {
							if (a.totalVotingPower.gt(b.totalVotingPower)) return -1;
							if (a.totalVotingPower.lt(b.totalVotingPower)) return 1;
							return 0;
						})
						.map((prevEval, index) => (
							<PreEvaluationSectionRowMobile
								key={prevEval.walletAddress.concat(String(prevEval.voters.length))}
								isActive={index < (preEvalDic[activeTab].seats || 0)}
								totalVotingPowers={totalVotingPowers}
								prevEval={prevEval}
								walletAddress={prevEval.walletAddress}
							/>
						))}
				</div>
			)}
		</div>
	);
}
