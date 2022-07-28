import { Tabs } from '@synthetixio/ui';
import { DeployedModules } from 'containers/Modules';
import { t } from 'i18next';
import { VotingResult } from './VotingResult';

export function PreEvaluationSection() {
	return (
		<div className="flex flex-col items-center pt-10 container">
			<h1 className="md:tg-title-h1 tg-title-h3 text-white">{t('vote.pre-eval.headline')}</h1>
			<span className="tg-body text-center p-4 text-gray-500">
				{t('vote.pre-eval.voting-results-live')}
			</span>
			<Tabs
				initial="spartan"
				className="overflow-x-auto no-scrollbar xs:w-auto w-full"
				contentClassName="container"
				items={[
					{
						id: 'spartan',
						label: t('vote.pre-eval.tabs.sc'),
						content: <VotingResult moduleInstance={DeployedModules.SPARTAN_COUNCIL} />,
					},
					{
						id: 'grants',
						label: t('vote.pre-eval.tabs.gc'),
						content: <VotingResult moduleInstance={DeployedModules.GRANTS_COUNCIL} />,
					},
					{
						id: 'ambassador',
						label: t('vote.pre-eval.tabs.ac'),
						content: <VotingResult moduleInstance={DeployedModules.AMBASSADOR_COUNCIL} />,
					},
					{
						id: 'treasury',
						label: t('vote.pre-eval.tabs.tc'),
						content: <VotingResult moduleInstance={DeployedModules.TREASURY_COUNCIL} />,
					},
				]}
			/>
		</div>
	);
}
