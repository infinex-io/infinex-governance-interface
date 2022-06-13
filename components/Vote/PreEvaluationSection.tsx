import { ArrowLinkOffIcon, Tabs } from 'components/old-ui';
import { DeployedModules } from 'containers/Modules';
import { t } from 'i18next';
import Link from 'next/link';
import useEpochIndexQuery from 'queries/epochs/useEpochIndexQuery';
import { usePreEvaluationVotingPowerQuery } from 'queries/voting/usePreEvaluationVotingPowerQuery';
import { useState } from 'react';
import { truncateAddress } from 'utils/truncate-address';

export function PreEvaluationSection() {
	const [activeTab, setActiveTab] = useState<number>(0);
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

	const preEvalDic = [
		preEvalSpartanQuery.data,
		preEvalGrantsQuery.data,
		preEvalAmbassadorQuery.data,
		preEvalTreasuryQuery.data,
	];
	return (
		<div className="flex flex-col items-center pt-10">
			<h1 className="tg-title-h1 text-white">{t('vote.pre-eval.headline')}</h1>
			<Tabs
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
			<table className="bg-dark-blue w-[1000px] border-gray-700 border-[1px] rounded">
				<tr>
					<th className="text-left p-2 tg-caption text-gray-500">
						{t('vote.pre-eval.table.name')}
					</th>
					<th className="tg-caption text-gray-500 p-2">{t('vote.pre-eval.table.votes')}</th>
					<th className="text-right p-2 tg-caption text-gray-500">
						{t('vote.pre-eval.table.actions')}
					</th>
				</tr>
				<tr>
					{preEvalDic[activeTab]?.map((prevEval) => (
						<>
							<th className="text-left p-2">
								{prevEval.candidate.ens || truncateAddress(prevEval.candidate.address)}
							</th>
							<th className="p-2">{prevEval.voters.length}</th>
							<th className="p-2 flex justify-end">
								<Link
									href={`https://optimistic.etherscan.io/address/${prevEval.candidate.address}`}
									passHref
								>
									<a target="_blank" rel="noreferrer">
										<ArrowLinkOffIcon active />
									</a>
								</Link>
							</th>
						</>
					))}
				</tr>
			</table>
		</div>
	);
}
