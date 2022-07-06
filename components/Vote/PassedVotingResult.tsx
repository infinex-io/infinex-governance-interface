import { Accordion } from '@synthetixio/ui';
import { DeployedModules } from 'containers/Modules';
import useCurrentPeriod from 'queries/epochs/useCurrentPeriodQuery';
import useEpochDatesQuery from 'queries/epochs/useEpochDatesQuery';
import useEpochIndexQuery from 'queries/epochs/useEpochIndexQuery';
import useGetElectionWinners from 'queries/epochs/useGetElectionWinners';
import React from 'react';

interface PassedVotingResultsProps {
	moduleInstance: DeployedModules;
}
export const PassedVotingResults: React.FC<PassedVotingResultsProps> = ({ moduleInstance }) => {
	const { data: epochIndex, isLoading } = useEpochIndexQuery(moduleInstance);

	if (isLoading || !epochIndex) return null;

	return (
		<>
			{[...Array(epochIndex)].map((_, i) => (
				<Accordion key={i} variant="dark-blue" title={'Past Election - Epoch:' + (epochIndex - i)}>
					<VotingResult moduleInstance={moduleInstance} epoch={epochIndex - i - 1} />
				</Accordion>
			))}
		</>
	);
};

interface VotingResultProps {
	moduleInstance: DeployedModules;
	epoch: number;
}
export const VotingResult: React.FC<VotingResultProps> = ({ moduleInstance, epoch }) => {
	useGetElectionWinners(moduleInstance, epoch);
	return (
		<div>
			VotingResult:{epoch},<br />
		</div>
	);
};
