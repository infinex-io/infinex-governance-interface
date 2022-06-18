import { wei } from '@synthetixio/wei';
import { ArrowLinkOffIcon, Tabs } from 'components/old-ui';
import { DeployedModules } from 'containers/Modules';
import { BigNumber, utils } from 'ethers';
import useIsMobile from 'hooks/useIsMobile';
import { t } from 'i18next';
import Link from 'next/link';
import useEpochIndexQuery from 'queries/epochs/useEpochIndexQuery';
import { usePreEvaluationVotingPowerQuery } from 'queries/voting/usePreEvaluationVotingPowerQuery';
import { useState } from 'react';
import { truncateAddress } from 'utils/truncate-address';

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

	const preEvalDic = [
		preEvalSpartanQuery.data,
		preEvalGrantsQuery.data,
		preEvalAmbassadorQuery.data,
		preEvalTreasuryQuery.data,
	];

	const totalVotingPowers = preEvalDic[activeTab]?.reduce(
		(cur, prev) => cur.add(prev.totalVotingPower),
		BigNumber.from(0)
	);

	const calcPercentage = (a: BigNumber, b: BigNumber) => {
		return ((wei(a).toNumber() / wei(b).toNumber()) * 100).toFixed(2);
	};
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
						<th className="text-right p-6 tg-caption text-gray-500">
							{t('vote.pre-eval.table.actions')}
						</th>
					</tr>
					{preEvalDic[activeTab]
						?.sort((a, b) => {
							if (a.totalVotingPower.gt(b.totalVotingPower)) return -1;
							if (a.totalVotingPower.lt(b.totalVotingPower)) return 1;
							return 0;
						})
						.map((prevEval) => (
							<tr key={prevEval.candidate.address.concat(String(prevEval.voters.length))}>
								<th className="text-left p-6">
									{prevEval.candidate.username || truncateAddress(prevEval.candidate.address)}
								</th>
								<th className="p-6">{prevEval.voters.length}</th>
								<th className="p-6">
									{totalVotingPowers &&
										calcPercentage(prevEval.totalVotingPower, totalVotingPowers)}
									%
								</th>
								<th className="p-6 flex justify-end">
									<Link
										href={`https://optimistic.etherscan.io/address/${prevEval.candidate.address}`}
										passHref
									>
										<a target="_blank" rel="noreferrer">
											<ArrowLinkOffIcon active />
										</a>
									</Link>
								</th>
							</tr>
						))}
				</table>
			) : (
				<div className="flex flex-col w-full md:hidden p-2 mb-20">
					{preEvalDic[activeTab]
						?.sort((a, b) => {
							if (a.totalVotingPower.gt(b.totalVotingPower)) return -1;
							if (a.totalVotingPower.lt(b.totalVotingPower)) return 1;
							return 0;
						})
						.map((prevEval) => (
							<div
								className="bg-dark-blue border-gray-700 border-[1px] rounded w-full flex relative p-4"
								key={prevEval.candidate.address.concat(String(prevEval.voters.length))}
							>
								<div className="flex flex-col gap-2 mr-2">
									<h6 className="tg-title-h6 text-gray-500">{t('vote.pre-eval.list.name')}</h6>
									<h6 className="tg-title-h6 text-gray-500">{t('vote.pre-eval.list.vote')}</h6>
									<h6 className="tg-title-h6 text-gray-500">{t('vote.pre-eval.list.power')}</h6>
								</div>
								<div className="flex flex-col gap-1">
									<h5 className="tg-title-h5">
										{prevEval.candidate.username || truncateAddress(prevEval.candidate.address)}
									</h5>
									<h5 className="tg-title-h5">{prevEval.voters.length}</h5>
									<h5 className="tg-title-h5">
										{totalVotingPowers &&
											calcPercentage(prevEval.totalVotingPower, totalVotingPowers)}
										%
									</h5>
								</div>
								<div className="absolute right-3 top-3">
									<Link
										href={`https://optimistic.etherscan.io/address/${prevEval.candidate.address}`}
										passHref
									>
										<a target="_blank" rel="noreferrer">
											<ArrowLinkOffIcon active />
										</a>
									</Link>
								</div>
							</div>
						))}
				</div>
			)}
		</div>
	);
}
